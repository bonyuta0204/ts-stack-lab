import { apiClient } from './apiClient'

export interface User {
  id: number
  name: string
  password: string
  email: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

type CreateUserParams = Omit<User, 'id'>

export const getUsers = async (params: PaginationParams): Promise<PaginatedResponse<User>> => {
  return await apiClient.get<PaginatedResponse<User>>('/users', {
    params: {
      page: params.page,
      pageSize: params.pageSize,
    },
  })
}

export const createUser = async (user: CreateUserParams): Promise<User> => {
  return await apiClient.post<User>('/users', user)
}
