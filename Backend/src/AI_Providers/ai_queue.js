import { Queue, Worker, QueueEvents } from "bullmq";
import axios from "axios";
import logger from "../utils/logger.js";

export const enable_queue = process.env.NODE_ENV !== "development";

const redis_Connection= {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password:process.env.REDIS_PASSWORD||"",
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    tls: process.env.REDIS_HOST && process.env.REDIS_HOST !== "localhost" ? {} : undefined,
};

export const Ai_queue = enable_queue ? new Queue("Ai_query", { connection: redis_Connection }) : null;
const SSE_client=new Map();

export function register_SSE_client(clientId,res){
    SSE_client.set(clientId,res);
    logger.info(`Registered SSE client ${clientId}`);
    res.on("close",()=>{
        SSE_client.delete(clientId);
        logger.info(`Deregistered SSE client ${clientId}`);
    });
}

function send_SSE(clientId,event,data){
    const res=SSE_client.get(clientId);
    if(res){
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
    else{
        logger.error(`No SSE client found for ${clientId}`);
        return;
    }
}

export async function get_position(clientId) {
    if (!Ai_queue) {
        return null;
    }
    try {
        const jobs= await Ai_queue.getJobs(["wait"],0,100);
        const index=jobs.findIndex((job)=>job.data.clientId===clientId);
        return index >= 0 ? index + 1 : null;
    }
    catch (error) {
        logger.error(`Error getting position for client ${clientId}`, error);
        return null;
    }
}

async function broadcast() {
    for(const [clientId,res] of SSE_client.entries()){
        try{
            const pos=await get_position(clientId);
            if (pos !== null) {
                send_SSE(clientId,"queueUpdate",{position:pos,eta:`~${pos*30}s`});
            }
        }
        catch(err){
            logger.error(`Error broadcasting to client ${clientId}: ${err}`);
        }
    }
}

export async function processAiJobData({ base64Image, mimetype, query }) {
    const final_prompt = `
            Analyse the attached prescription image.
            User Query: ${query}

            Guidelines:
            1. List the extracted medicine names and explain their common, standard uses.
            2. Do NOT diagnose any condition.
            3. Do NOT suggest dosages or recommend changing a treatment plan.
            4. add a disclaimer so the user can consult the doctor
            5. add a legal line in the begining in bold letters 
            saying that this AI is not a substitute for professional medical advice and it just for edu purpose only
        `;

        const requestPayload = {
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: final_prompt
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimetype};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ]
        };

        const headers = {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "FaairScan"
        };

        const models = [
            "nvidia/nemotron-nano-12b-v2-vl:free"
        ];

        let response_txt = "";
        let lastError = null;

        for (const model of models) {
            try {
                const response = await axios.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        model,
                        ...requestPayload
                    },
                    { headers }
                );
                response_txt = response.data?.choices?.[0]?.message?.content;
                if (response_txt) {
                    break;
                }
                else {
                    logger.error("Empty response content from model: ", model);
                }
            } catch (err) {
                lastError = err;
                logger.error("Model failed: ", model, "Error: ", err.message);
            }
        }

        if (response_txt.length === 0) {
            logger.error("All AI models failed to respond. Last error: ", lastError?.message);
            throw new Error(`All AI models failed to respond. `);
        }

        return { response: response_txt };
}

if (enable_queue) {
    const worker = new Worker("Ai_query", async (job) => {
        logger.info(`job ${job.id} is active`);
        return processAiJobData(job.data);
    }, {
        connection: redis_Connection,
        removeOnComplete: 100,
        removeOnFail: 100,
        concurrency: 1,
        limiter: {
            max: 2,
            duration: 60000
        }
    });

    const events = new QueueEvents("Ai_query", { connection: redis_Connection });

    events.on("active", async ({ jobId }) => {
        logger.info(`job ${jobId} is active`);
        const job = await Ai_queue.getJob(jobId);
        if (job) send_SSE(job.data.clientId, "processing", {});
        await broadcast();
    });

    events.on("completed", async ({ jobId, returnvalue }) => {
        logger.info(`job ${jobId} is completed`);
        const job = await Ai_queue.getJob(jobId);
        const data = typeof returnvalue === "string" ? JSON.parse(returnvalue) : returnvalue;
        if (job) {
            send_SSE(job.data.clientId, "completed", data);
            SSE_client.delete(job.data.clientId);
        }
    });

    events.on("failed", async ({ jobId, failedReason }) => {
        logger.error(`job ${jobId} failed: ${failedReason}`);
        const job = await Ai_queue.getJob(jobId);
        if (job) {
            send_SSE(job.data.clientId, "failed", { message: "AI processing failed. Please try again." });
            SSE_client.delete(job.data.clientId);
        }
    });

    worker.on("error", (err) => {
        logger.error("Worker error: ", err.message);
    });

    logger.info("AI prescription queue initialized(bullmq)");
} else {
    logger.info("skipped in development; AI requests will run directly (bullmq)");
}
