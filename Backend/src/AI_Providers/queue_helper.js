import { get_position, register_SSE_client, Ai_queue } from "./ai_queue.js";
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

export async function queue_helper(req, res,next) {
    const { requestId, jobId } = req.query;
    if (!requestId) {
        const err= new Error("Missing requestId");
        err.statusCode=400;
        return next(err);
    }

    // Set SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': frontendURL,
        'Access-Control-Allow-Credentials': 'true',
    });

    // connected msg to client
    res.write(`event: connected\ndata: ${JSON.stringify({ message: "Connected to queue" })}\n\n`);

    // register client
    register_SSE_client(requestId, res);

    // Send updates to client 
    let handled = false;
    if (jobId && Ai_queue) {
        try {
            const job = await Ai_queue.getJob(jobId);
            if (job) {
                const state = await job.getState();
                if (state === "completed") {
                    const data = typeof job.returnvalue === "string" ? JSON.parse(job.returnvalue) : job.returnvalue;
                    res.write(`event: completed\ndata: ${JSON.stringify(data)}\n\n`);
                    handled = true;
                } else if (state === "failed") {
                    res.write(`event: failed\ndata: ${JSON.stringify({ message: job.failedReason || "Processing failed" })}\n\n`);
                    handled = true;
                } else if (state === "active") {
                    res.write(`event: processing\ndata: {}\n\n`);
                    handled = true;
                }
            }
        } catch (error) {
            console.error("Error fetching job state:", error);
        }
    }

    if (!handled) {
        const pos = await get_position(requestId);
        if (pos !== null) {
            res.write(`event: queueUpdate\ndata: ${JSON.stringify({ position: pos, eta: `~${pos * 30}s` })}\n\n`);
        }
    }

    // to prevent from inactivity close
    const keepAlive = setInterval(() => {
        res.write(`: keep-alive\n\n`);
    }, 25000);

    req.on('close', () => clearInterval(keepAlive));
}