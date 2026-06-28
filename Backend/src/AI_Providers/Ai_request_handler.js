import multer from "multer";
import { Ai_queue, get_position, enable_queue, processAiJobData } from "./ai_queue.js";
import * as db_query from "../Models/db_queries.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fieldSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (allowed_types.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only jpeg/jpg/png/webp images are allowed!"), false);
        }
    }
});

export async function handleAiRequest(req, res, next) {
    try {
        const imageFile = req.file;
        const query = req.body.query;
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "No image file uploaded." });
        }

        try {
            const now = new Date();
            const activity_record_text = `AI query request on ${now.toLocaleDateString()}`;
            await db_query.createUserActivity(req.user.id, "ai_query", activity_record_text);
        } catch (activityErr) {
            console.error("Failed to log user activity (ai_query)", activityErr);
        }

        const base64Image = imageFile.buffer.toString("base64");
        const jobData = {
            base64Image,
            mimetype: imageFile.mimetype,
            query: query || "",
        };

        if (!enable_queue) {
            const result = await processAiJobData(jobData);
            return res.status(200).json({
                success: true,
                queued: false,
                response: result.response
            });
        }

        // clientId for SSE tracking
        const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        // new job to bullmq
        const job = await Ai_queue.add("ai-job", {
            ...jobData,
            clientId   // stored in job_data so queuevents can send SSE
        });

        const position = await get_position(clientId) || 1;

        return res.status(200).json({
            success: true,
            queued: true,
            requestId: clientId,
            jobId: job.id,
            position
        });

    } catch (error) {
        const err = new Error("Failed to enqueue AI request", error.response?.data || error.message);
        err.status = 400;
        next(err);
    }
}

export default upload;