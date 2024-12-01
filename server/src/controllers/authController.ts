import { RequestHandler, type Request, type Response } from "express";
import { userService } from "../services/userService.js";
import { getFirebaseAuth } from "../config/firebase.js";
import { User } from "@prisma/client";

export const handleFirebaseAuth: RequestHandler = async (
  req: Request<unknown, User, { idToken: string }>,
  res: Response,
) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: "ID token is required" });
      return;
    }

    // Verify the Firebase ID token
    const decodedToken = await getFirebaseAuth().verifyIdToken(idToken);

    // Find or create user in our database
    const user = await userService.findOrCreateFirebaseUser(
      decodedToken.uid,
      decodedToken.email || "",
      decodedToken.name as string,
    );

    res.status(200).json({ user });
    return;
  } catch (error) {
    console.error("Firebase authentication error:", error);
    res.status(401).json({ error: "Authentication failed" });
    return;
  }
};
