import axios from 'axios'
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

const API_URL = 'http://localhost:3000/api'

export const tweetService = {
  async getTweets(page = 1, pageSize = 10): Promise<PaginatedResponse<Tweet>> {
    const response = await axios.get(`${API_URL}/tweets`, {
      params: { page, pageSize },
    })
    return response.data
  },

  async getTimeline(userId: number, page = 1, pageSize = 10): Promise<PaginatedResponse<Tweet>> {
    const response = await axios.get(`${API_URL}/tweets/timeline/${userId}`, {
      params: { page, pageSize },
    })
    return response.data
  },

  async getUserTweets(userId: number, page = 1, pageSize = 10): Promise<PaginatedResponse<Tweet>> {
    const response = await axios.get(`${API_URL}/tweets/user/${userId}`, {
      params: { page, pageSize },
    })
    return response.data
  },

  async createTweet(data: CreateTweetData): Promise<Tweet> {
    const response = await axios.post(`${API_URL}/tweets`, data)
    return response.data
  },

  async followUser(followerId: number, followingId: number): Promise<void> {
    await axios.post(`${API_URL}/tweets/follow`, { followerId, followingId })
  },

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await axios.post(`${API_URL}/tweets/unfollow`, { followerId, followingId })
  },
}
