export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface ApiError {
  detail?: string
  [key: string]: string | string[] | undefined
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_superuser: boolean
  is_staff: boolean
  date_joined: string
  groups: string[]
  permissions: string[]
}

export interface Group {
  id: number
  name: string
  permissions: number[]
}

export interface Permission {
  id: number
  codename: string
  name: string
  content_type: string
}

export interface UserCreate {
  username: string
  email?: string
  password: string
  first_name?: string
  last_name?: string
  is_active?: boolean
  groups?: number[]
}

export interface UserUpdate {
  username?: string
  email?: string
  password?: string
  first_name?: string
  last_name?: string
  is_active?: boolean
  groups?: number[]
}

export interface GroupCreate {
  name: string
  permissions?: number[]
}

export interface GroupUpdate {
  name?: string
  permissions?: number[]
}
