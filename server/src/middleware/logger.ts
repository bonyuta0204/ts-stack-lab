import express from "express";
import logger from "../config/logger";
import winston from "winston";

export class HttpLogger {
  private logger: winston.Logger;
  private startTime: number;
  private method: string;
  private path: string;

  constructor(method: string, path: string) {
    this.logger = logger;
    this.method = method;
    this.path = path;
    this.startTime = 0; // Initialize startTime to avoid undefined issues
  }

  prefix() {
    return `[${this.method} ${this.path}]`;
  }

  startTimer() {
    this.startTime = Date.now();
  }

  duration() {
    return Date.now() - this.startTime;
  }

  info(message: string, meta?: Record<string, unknown>) {
    const duration = Date.now() - this.startTime;
    this.logger.info(`${this.prefix()} ${message}`, { duration, ...meta });
  }
}

export const httpLogging = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { method, url } = req;

  const httpLogger = new HttpLogger(method, url);
  httpLogger.startTimer();
  req.logger = httpLogger;

  res.on("finish", () => {
    const duration = httpLogger.duration();
    httpLogger.info(`HTTP Request Completed in ${duration}ms`, {
      method,
      url,
      statusCode: res.statusCode,
      duration,
    });
  });

  next(); // Proceed to the next middleware or route handler
};
