import logger from "../utils/logger.js";
export function Error_handler(err, req, res, next) {
    const Status_code = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    logger.error("API Error occurred", err);
    res.status(Status_code).json({
        success: false,
        Status_Code: Status_code,
        message: message,
        ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    });
}