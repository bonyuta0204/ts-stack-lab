import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export interface User {
  id: number
  name: string
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

export const getUsers = async (params: PaginationParams): Promise<PaginatedResponse<User>> => {
  const { data } = await api.get<PaginatedResponse<User>>('/users', {
    params: {
      page: params.page,
      pageSize: params.pageSize
    }
  })
  return data
}
