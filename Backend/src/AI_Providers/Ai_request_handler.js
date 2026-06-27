import multer from "multer";
import logger from "../utils/logger.js";
import { Ai_queue, get_position } from "./ai_queue.js";

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

        const base64Image = imageFile.buffer.toString("base64");

        // Generate a clientId for SSE tracking
        const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        // Add job to BullMQ queue instead of processing inline
        const job = await Ai_queue.add("ai-job", {
            base64Image,
            mimetype: imageFile.mimetype,
            query: query || "",
            clientId   // stored in job.data so QueueEvents can send SSE to the right client
        });

        // Get this job's position in the queue
        const position = await get_position(clientId) || 1;

        // Return immediately — client will connect via SSE to track progress
        return res.status(200).json({
            success: true,
            queued: true,
            requestId: clientId,
            jobId: job.id,
            position
        });

    } catch (error) {
        logger.error("Failed to enqueue AI request", error.response?.data || error.message);
        next(error);
    }
}

export default upload;