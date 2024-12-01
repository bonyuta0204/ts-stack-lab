import { apiClient } from './apiClient'
import type { PaginatedResponse } from './types'

export interface Tweet {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  authorId: number
  author: {
    id: number
    name: string
    email: string
  }
}

export interface CreateTweetData {
  content: string
  authorId: number
}

export const tweetService = {
  async getTweets(page = 1, pageSize = 10): Promise<PaginatedResponse<Tweet>> {
    return await apiClient.get<PaginatedResponse<Tweet>>('/tweets', {
      params: { page, pageSize },
    })
  },

  async getTimeline(userId: number, page = 1, pageSize = 10): Promise<PaginatedResponse<Tweet>> {
    return await apiClient.get<PaginatedResponse<Tweet>>(`/tweets/timeline/${userId}`, {
      params: { page, pageSize },
    })
  },

  async getUserTweets(userId: number, page = 1, pageSize = 10): Promise<PaginatedResponse<Tweet>> {
    return await apiClient.get<PaginatedResponse<Tweet>>(`/tweets/user/${userId}`, {
      params: { page, pageSize },
    })
  },

  async createTweet(data: CreateTweetData): Promise<Tweet> {
    return await apiClient.post<Tweet>('/tweets', data)
  },

  async followUser(followerId: number, followingId: number): Promise<void> {
    await apiClient.post(`/users/${followerId}/follow/${followingId}`, {})
  },

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await apiClient.delete(`/users/${followerId}/follow/${followingId}`)
  },
}
