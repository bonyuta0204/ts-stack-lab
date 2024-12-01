import express from "express";
import { handleFirebaseAuth } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Firebase authentication endpoint
router.post("/firebase", handleFirebaseAuth);

// Test endpoint to verify authentication
router.get("/me", authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

export default router;
