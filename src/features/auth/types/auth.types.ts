import type { TenantStatus } from '../../tenants/types/tenant.types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends LoginCredentials {
  name: string
}

export type UserRole = 'ADMIN' | 'CONSULTANT' | string

export interface ApiTenant {
  _id: string
  name: string
  gateway?: string
  isActive?: boolean
  status?: TenantStatus
  lastEventReceived?: string
  updatedAt?: string
}

export interface ApiUser {
  id: string
  tenantId: ApiTenant
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface UserSession {
  id: string
  name: string
  email: string
  role: UserRole
  tenant: {
    id: string
    name: string
    status: TenantStatus
    lastEventReceived: string | null
    updatedAt: string | null
  }
}

export interface AuthResponse {
  message: string
  token: string
  user: ApiUser
}
