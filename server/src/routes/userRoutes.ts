import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// Get all users
router.get("/", asyncHandler(getUsers));

// Get single user
router.get("/:id", asyncHandler(getUser));

// Create user
router.post("/", asyncHandler(createUser));

// Update user
router.put("/:id", asyncHandler(updateUser));

// Delete user
router.delete("/:id", asyncHandler(deleteUser));

export default router;
