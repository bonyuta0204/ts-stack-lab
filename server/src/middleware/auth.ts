import {
  type Request,
  type Response,
  type NextFunction,
  RequestHandler,
} from "express";
import { getFirebaseAuth } from "../config/firebase.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        firebaseUid: string;
      };
    }
  }
}

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getFirebaseAuth().verifyIdToken(token);

    // Find or create user in our database
    const user = await prisma.user.findFirst({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      firebaseUid: user.firebaseUid!,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
