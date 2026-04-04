import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import { asyncLocalStorage } from "./als.js";


const addTraceId = winston.format((info) => {
    const store = asyncLocalStorage.getStore();

    if (store?.traceId) {
        info.traceId = store.traceId;
    }

    if (store?.deliveryId) {
        info.deliveryId = store.deliveryId;
    }

    return info;
});


if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}
const logFormat = winston.format.combine(
    addTraceId(),
    winston.format.timestamp(),
    winston.format.json()
);

// debug logs
const transport = new DailyRotateFile({
    filename: "logs/log",
    datePattern: "YYYY-MM-DD",
    level: "debug"
});


const logger = winston.createLogger({
    format: logFormat,
    transports: [
        transport
    ]
});

export default logger;


