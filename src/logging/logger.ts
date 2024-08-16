import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    colorize(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
