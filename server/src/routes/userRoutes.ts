import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateUser } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/", asyncHandler(createUser)); // Keep user creation public for non-Firebase registration

// Protected routes
router.get("/", authenticateUser, asyncHandler(getUsers));
router.get("/:id", authenticateUser, asyncHandler(getUser));
router.put("/:id", authenticateUser, asyncHandler(updateUser));
router.delete("/:id", authenticateUser, asyncHandler(deleteUser));

export default router;
