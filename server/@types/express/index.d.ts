export {};

import { HttpLogger } from "../../src/middleware/logger";

declare global {
  const hoge: string;
  namespace Express {
    interface Request {
      logger: HttpLogger;
    }
  }
}
