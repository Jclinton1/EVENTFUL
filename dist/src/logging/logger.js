"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize } = winston_1.format;
// Custom format for log messages
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
// Create a Winston logger
const logger = (0, winston_1.createLogger)({
    level: 'info', // Default logging level
    format: combine(timestamp(), // Add timestamp to each log
    colorize(), // Colorize output
    myFormat // Apply custom format
    ),
    transports: [
        new winston_1.transports.Console(), // Log to console
        new winston_1.transports.File({ filename: 'logs/app.log' }) // Log to file
    ],
});
module.exports = logger;
