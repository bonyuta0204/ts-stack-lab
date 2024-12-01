import { Request, Response } from "express";
import {
  tweetService,
  TweetResponse,
  PaginatedResponse,
  CreateTweetData,
} from "../services/tweetService";
import { Follow } from "@prisma/client";

type ErrorResponse = {
  error: string;
};

// Get all tweets
export async function getTweets(
  req: Request,
  res: Response<PaginatedResponse<TweetResponse> | ErrorResponse>
) {
  req.logger.info("Getting tweets list", { query: req.query });
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 50;
    const tweets = await tweetService.getTweets(page, pageSize, req.logger);
    res.json(tweets);
  } catch (error) {
    req.logger.error("Error getting tweets", { error });
    res.status(500).json({ error: "Failed to get tweets" });
  }
}

// Get tweets for user's timeline
export async function getTimeline(
  req: Request<{ userId: string }>,
  res: Response<PaginatedResponse<TweetResponse> | ErrorResponse>
) {
  req.logger.info("Getting timeline", { params: req.params });
  try {
    const userId = Number(req.params.userId);
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 50;
    
    const timeline = await tweetService.getTimeline(userId, page, pageSize, req.logger);
    res.json(timeline);
  } catch (error) {
    req.logger.error("Error getting timeline", { error });
    res.status(500).json({ error: "Failed to get timeline" });
  }
}

// Get tweets by a specific user
export async function getUserTweets(
  req: Request<{ userId: string }>,
  res: Response<PaginatedResponse<TweetResponse> | ErrorResponse>
) {
  req.logger.info("Getting user tweets", { params: req.params });
  try {
    const userId = Number(req.params.userId);
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 50;
    
    const tweets = await tweetService.getUserTweets(userId, page, pageSize, req.logger);
    res.json(tweets);
  } catch (error) {
    req.logger.error("Error getting user tweets", { error });
    res.status(500).json({ error: "Failed to get user tweets" });
  }
}

// Create a new tweet
export async function createTweet(
  req: Request<object, TweetResponse, CreateTweetData>,
  res: Response<TweetResponse | ErrorResponse>
) {
  req.logger.info("Creating tweet", { body: req.body });
  try {
    const tweet = await tweetService.createTweet(req.body, req.logger);
    res.status(201).json(tweet);
  } catch (error) {
    req.logger.error("Error creating tweet", { error });
    res.status(500).json({ error: "Failed to create tweet" });
  }
}

// Follow a user
export async function followUser(
  req: Request<object, Follow, { followerId: number; followingId: number }>,
  res: Response<Follow | ErrorResponse>
) {
  req.logger.info("Following user", { body: req.body });
  try {
    const { followerId, followingId } = req.body;
    const follow = await tweetService.followUser(followerId, followingId, req.logger);
    res.status(201).json(follow);
  } catch (error) {
    req.logger.error("Error following user", { error });
    res.status(500).json({ error: "Failed to follow user" });
  }
}

// Unfollow a user
export async function unfollowUser(
  req: Request<object, void, { followerId: number; followingId: number }>,
  res: Response<void | ErrorResponse>
) {
  req.logger.info("Unfollowing user", { body: req.body });
  try {
    const { followerId, followingId } = req.body;
    await tweetService.unfollowUser(followerId, followingId, req.logger);
    res.status(200).send();
  } catch (error) {
    req.logger.error("Error unfollowing user", { error });
    res.status(500).json({ error: "Failed to unfollow user" });
  }
}
