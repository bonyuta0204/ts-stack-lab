import { Router } from "express";
import {
  getTweets,
  getTimeline,
  getUserTweets,
  createTweet,
  followUser,
  unfollowUser,
} from "../controllers/tweetController.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateUser } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", asyncHandler(getTweets));
router.get("/user/:userId", asyncHandler(getUserTweets));

// Protected routes
router.get("/timeline/:userId", authenticateUser, asyncHandler(getTimeline));
router.post("/", authenticateUser, asyncHandler(createTweet));
router.post("/follow", authenticateUser, asyncHandler(followUser));
router.post("/unfollow", authenticateUser, asyncHandler(unfollowUser));

export default router;
