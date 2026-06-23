export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends LoginCredentials {
  name: string
}

export type UserRole = 'ADMIN' | 'CONSULTANT' | string

export interface UserSession {
  id: string
  tenantId: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface AuthResponse {
  message: string
  token: string
  user: UserSession
}
