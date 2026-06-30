import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
import logger from "../utils/logger.js";

const useRedisStore = process.env.NODE_ENV !== "development";
let redis_client = null;

if (useRedisStore) {
    redis_client = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
        password: process.env.REDIS_PASSWORD || "",
    });

    redis_client.connect()
        .then(() => logger.info("Redis connected successfully!"))
        .catch((err) => logger.error("Redis failed to connect", err));
}

function redisStore(prefix) {
    if (!useRedisStore || !redis_client) {
        return undefined;
    }
    return new RedisStore({
        sendCommand: (...args) => redis_client.sendCommand(args),
        prefix
    });
}

export async function ban_check(req, res, next) {
    if (process.env.NODE_ENV === "development") {
        return next();
    }
    try {
        const ip = req.ip;
        const is_banned = await redis_client.get(`banned:${ip}`);
        if (is_banned) {
            const err = new Error("You have been banned.");
            err.statusCode = 403;
            return next(err);
        }
    } catch (err) {
        logger.error("Error checking IP ban status in Redis", err);
        return next(err);
    }
    next();
}

export const Search_rate_limit = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 4,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStore('rl:'),
    handler: async (req, res, next) => {
        try {
            if (process.env.NODE_ENV !== "development") {
                await redis_client.setEx(`banned:${req.ip}`, 24 * 60 * 60, "true");
            }
            const err = new Error("Too many requests, you are banned for 24 hrs");
            err.statusCode = 429;
            return next(err);
        } catch (err) {
            logger.error("Error in search rate limit handler:", err);
            return next(err);
        }
    },
});

export const OAuth_rate_limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 25,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStore('rl-oauth:'),
    handler: async (req, res, next) => {
        try {
            if (process.env.NODE_ENV !== "development") {
                await redis_client.setEx(`banned:${req.ip}`, 3 * 24 * 60 * 60, "true");
            }
            const err = new Error("Too many requests; you are banned for 72 hours.");
            err.statusCode = 429;
            return next(err);
        } catch (err) {
            logger.error("Error in oauth rate limit handler:", err);
            return next(err);
        }
    },
});

export const ai_rate_limit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStore('rl-ai:'),
    handler: async (req, res, next) => {
        try {
            if (process.env.NODE_ENV !== "development") {
                await redis_client.setEx(`banned:${req.ip}`, 2 * 24 * 60 * 60, "true");
            }
            const err = new Error("Too many requests, you are banned for 48 hrs");
            err.statusCode = 429;
            return next(err);
        } catch (err) {
            logger.error("Error in ai rate limit handler:", err);
            return next(err);
        }
    },
});
