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

const router = Router();

// Tweet routes
router.get("/", asyncHandler(getTweets));
router.get("/timeline/:userId", asyncHandler(getTimeline));
router.get("/user/:userId", asyncHandler(getUserTweets));
router.post("/", asyncHandler(createTweet));

// Follow routes
router.post("/follow", asyncHandler(followUser));
router.post("/unfollow", asyncHandler(unfollowUser));

export default router;
