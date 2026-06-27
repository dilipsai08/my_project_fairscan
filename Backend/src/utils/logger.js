import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import Path from "path";
import { fileURLToPath } from "url";

const file_location = fileURLToPath(import.meta.url);
const dir_name = Path.dirname(file_location);

const log_format = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({stack: true}),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level}]: ${stack || message}`;
    })
);
const err_files = new DailyRotateFile({
    filename : Path.join(dir_name , "../../../logs/error-%DATE%.log"),
    level: "error",
    format: log_format,
    maxSize : "20m",
    maxFiles : "30d"
})

const combined_files = new DailyRotateFile({
    filename : Path.join(dir_name , "../../../logs/combined-%DATE%.log"),
    level: "info",
    format: log_format,
    maxSize : "20m",
    maxFiles : "14d"
})
const logger = winston.createLogger({
    level: "info",
    format: log_format,
    transports: [
        err_files,
        combined_files
    ],
    exceptionHandlers:[
        new winston.transports.File({
            filename : Path.join(dir_name , "../../../logs/exceptions.log"),
            format : log_format
        })
    ],
    rejectionHandlers:[
        new winston.transports.File({
            filename : Path.join(dir_name , "../../../logs/rejections.log"),
            format : log_format
        })
    ]
})

if(process.env.NODE_ENV !== "production"){
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.errors({stack:true}),
            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss"
            }),
            winston.format.printf(({ level, message, timestamp, stack }) => {
                return `${timestamp} [${level}]: ${stack || message}`;
            })
        )
    }))
}
export default logger;