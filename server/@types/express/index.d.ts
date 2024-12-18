export {};

import { HttpLogger } from "../../src/middleware/logger.js";

declare global {
  const hoge: string;
  namespace Express {
    interface Request {
      logger: HttpLogger;
      user?: {
        id: number;
        email: string;
        firebaseUid: string;
      };
    }
  }
}
