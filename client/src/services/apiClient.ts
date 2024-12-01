import axios, { AxiosInstance } from 'axios'
import { auth } from '../config/firebase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

class ApiClient {
  private axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to add auth token
    this.axios.interceptors.request.use(async (config) => {
      const user = auth.currentUser
      if (user) {
        const token = await user.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  async get<T, D = unknown>(endpoint: string, config?: axios.AxiosRequestConfig<D>) {
    const response = await this.axios.get<T>(endpoint, config)
    return response.data
  }

  async post<T, D = unknown>(endpoint: string, data: D, config?: axios.AxiosRequestConfig<D>) {
    const response = await this.axios.post<T>(endpoint, data, config)
    return response.data
  }

  async put<T, D = unknown>(endpoint: string, data: D, config?: axios.AxiosRequestConfig<D>) {
    const response = await this.axios.put<T>(endpoint, data, config)
    return response.data
  }

  async delete<T, D = unknown>(endpoint: string, config?: axios.AxiosRequestConfig<D>) {
    await this.axios.delete<T>(endpoint, config)
  }
}

export const apiClient = new ApiClient()
