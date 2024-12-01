import winston, { createLogger } from "winston";

const logger = createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: "log/error.log", level: "error" }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: "log/combined.log" }),
  ],
});

export type ILogger = {
  error(message: string, ...args: unknown[]): unknown;
  warn(message: string, ...args: unknown[]): unknown;
  info(message: string, ...args: unknown[]): unknown;
  debug(message: string, ...args: unknown[]): unknown;
  trace(message: string, ...args: unknown[]): unknown;
};

export default logger;
