import logger from "../config/logger.js";
import winston from "winston";
import { ILogger } from "../config/logger.js";
import { Request, Response, NextFunction } from "express";

export class HttpLogger implements ILogger {
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

  private prefix() {
    return `[${this.method} ${this.path}]`;
  }

  startTimer() {
    this.startTime = Date.now();
  }

  duration() {
    return Date.now() - this.startTime;
  }

  info(message: string, meta?: Record<string, unknown>) {
    const duration = this.duration();
    this.logger.info(`${this.prefix()} ${message}`, { duration, ...meta });
  }

  error(error: Error): void;
  error(message: string, meta?: Record<string, unknown>): void;
  error(info: string | Error, meta?: Record<string, unknown>) {
    const duration = this.duration();
    if (info instanceof Error) {
      this.logger.error(info);
    }
    this.logger.error(`${this.prefix()} ${info}`, { duration, ...meta });
  }

  warn(message: string, meta?: Record<string, unknown>) {
    const duration = this.duration();
    this.logger.warn(`${this.prefix()} ${message}`, { duration, ...meta });
  }

  debug(message: string, meta?: Record<string, unknown>) {
    const duration = this.duration();
    this.logger.debug(`${this.prefix()} ${message}`, { duration, ...meta });
  }

  trace(message: string, meta?: Record<string, unknown>) {
    const duration = this.duration();
    this.logger.debug(`${this.prefix()} ${message}`, { duration, ...meta });
  }
}

export const httpLogging = (
  req: Request,
  res: Response,
  next: NextFunction,
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
