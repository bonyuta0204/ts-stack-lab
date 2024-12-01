import { Request, Response } from "express";
import {
  tweetService,
  TweetResponse,
  PaginatedResponse,
  CreateTweetData,
} from "../services/tweetService";
import { Follow } from "@prisma/client";

// Get all tweets
export const getTweets = async (
  req: Request,
  res: Response<PaginatedResponse<TweetResponse>>,
) => {
  req.logger.info("Getting tweets list", { query: req.query });
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 50;
  const tweets = await tweetService.getTweets(page, pageSize, req.logger);
  res.json(tweets);
};

// Get tweets for user's timeline
export const getTimeline = async (
  req: Request<{ userId: string }>,
  res: Response<PaginatedResponse<TweetResponse>>,
) => {
  req.logger.info("Getting timeline", { params: req.params });
  const userId = Number(req.params.userId);
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 50;

  const timeline = await tweetService.getTimeline(
    userId,
    page,
    pageSize,
    req.logger,
  );
  res.json(timeline);
};

// Get tweets by a specific user
export const getUserTweets = async (
  req: Request<{ userId: string }>,
  res: Response<PaginatedResponse<TweetResponse>>,
) => {
  req.logger.info("Getting user tweets", { params: req.params });
  const userId = Number(req.params.userId);
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 50;

  const tweets = await tweetService.getUserTweets(
    userId,
    page,
    pageSize,
    req.logger,
  );
  res.json(tweets);
};

// Create a new tweet
export const createTweet = async (
  req: Request<object, TweetResponse, CreateTweetData>,
  res: Response<TweetResponse>,
) => {
  const tweetData = req.body;
  req.logger.info("Creating tweet", { userId: tweetData.authorId });

  const tweet = await tweetService.createTweet(tweetData, req.logger);
  res.status(201).json(tweet);
};

// Follow a user
export const followUser = async (
  req: Request<object, Follow, { followerId: number; followingId: number }>,
  res: Response<Follow>,
) => {
  req.logger.info("Following user", { body: req.body });
  const { followerId, followingId } = req.body;
  const follow = await tweetService.followUser(
    followerId,
    followingId,
    req.logger,
  );
  res.status(201).json(follow);
};

// Unfollow a user
export const unfollowUser = async (
  req: Request<object, void, { followerId: number; followingId: number }>,
  res: Response<void>,
) => {
  req.logger.info("Unfollowing user", { body: req.body });
  const { followerId, followingId } = req.body;
  await tweetService.unfollowUser(followerId, followingId, req.logger);
  res.status(200).send();
};
