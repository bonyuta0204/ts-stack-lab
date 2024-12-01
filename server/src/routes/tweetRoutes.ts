import { Router } from "express";
import {
  getTweets,
  getTimeline,
  getUserTweets,
  createTweet,
  followUser,
  unfollowUser,
} from "../controllers/tweetController";

const router = Router();

// Tweet routes
router.get("/", getTweets);
router.get("/timeline/:userId", getTimeline);
router.get("/user/:userId", getUserTweets);
router.post("/", createTweet);

// Follow routes
router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);

export default router;
