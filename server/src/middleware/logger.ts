import express from "express";
import logger from "../config/logger";
import winston from "winston";

class HttpLogger {
  private logger: winston.Logger;
  private startTime: number;

  constructor() {
    this.logger = logger;
    this.startTime = 0; // Initialize startTime to avoid undefined issues
  }

  startTimer() {
    this.startTime = Date.now();
  }

  duration() {
    return Date.now() - this.startTime;
  }

  info(message: string, meta?: Record<string, unknown>) {
    const duration = Date.now() - this.startTime;
    this.logger.info(message, { duration, ...meta });
  }
}

export const httpLogging = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { method, url } = req;
  const logger = new HttpLogger();
  logger.startTimer();

  res.on("finish", () => {
    const duration = Date.now() - logger.duration();
    logger.info(`HTTP Request Completed in ${duration}ms`, {
      method,
      url,
      statusCode: res.statusCode,
      duration,
    });
  });

  next(); // Proceed to the next middleware or route handler
};
