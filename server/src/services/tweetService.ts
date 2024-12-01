import { PrismaClient, Tweet, Follow } from "@prisma/client";
import { ILogger } from "../config/logger.js";

const prisma = new PrismaClient();

export type TweetResponse = Tweet;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateTweetData {
  content: string;
  authorId: number;
}

class TweetService {
  async getTweets(
    page: number = 1,
    pageSize: number = 50,
    logger: ILogger = console
  ): Promise<PaginatedResponse<TweetResponse>> {
    logger.info("Getting tweets list", { page, pageSize });

    const skip = (page - 1) * pageSize;
    const [total, tweets] = await Promise.all([
      prisma.tweet.count(),
      prisma.tweet.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: tweets,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getTimeline(
    userId: number,
    page: number = 1,
    pageSize: number = 50,
    logger: ILogger = console
  ): Promise<PaginatedResponse<TweetResponse>> {
    logger.info("Getting user timeline", { userId, page, pageSize });

    const skip = (page - 1) * pageSize;

    // Get tweets from users that the current user follows
    const [total, tweets] = await Promise.all([
      prisma.tweet.count({
        where: {
          author: {
            followers: {
              some: {
                followerId: userId,
              },
            },
          },
        },
      }),
      prisma.tweet.findMany({
        where: {
          author: {
            followers: {
              some: {
                followerId: userId,
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: tweets,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getUserTweets(
    userId: number,
    page: number = 1,
    pageSize: number = 50,
    logger: ILogger = console
  ): Promise<PaginatedResponse<TweetResponse>> {
    logger.info("Getting user tweets", { userId, page, pageSize });

    const skip = (page - 1) * pageSize;
    const [total, tweets] = await Promise.all([
      prisma.tweet.count({
        where: { authorId: userId },
      }),
      prisma.tweet.findMany({
        where: { authorId: userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: tweets,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async createTweet(
    data: CreateTweetData,
    logger: ILogger = console
  ): Promise<TweetResponse> {
    logger.info("Creating tweet", { data });

    const tweet = await prisma.tweet.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return tweet;
  }

  async followUser(
    followerId: number,
    followingId: number,
    logger: ILogger = console
  ): Promise<Follow> {
    logger.info("Following user", { followerId, followingId });

    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    return follow;
  }

  async unfollowUser(
    followerId: number,
    followingId: number,
    logger: ILogger = console
  ): Promise<void> {
    logger.info("Unfollowing user", { followerId, followingId });

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }
}

export const tweetService = new TweetService();
