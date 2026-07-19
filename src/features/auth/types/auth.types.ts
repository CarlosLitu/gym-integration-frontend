import type { TenantPaymentSummary, TenantStatus } from '../../tenants/types/tenant.types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface AuthMessageResponse {
  message: string
}

export interface RegisterPayload extends LoginCredentials {
  name: string
}

export type UserRole = 'ADMIN' | 'USER'

export interface ApiTenant {
  _id: string
  name: string
  gateway?: string
  isActive?: boolean
  status?: TenantStatus
  lastEventReceived?: string
  updatedAt?: string
  payment?: TenantPaymentSummary | null
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
    payment: TenantPaymentSummary | null
  }
}

export interface AuthResponse {
  message: string
  token: string
  user: ApiUser
}
