export type UserRole = 'ADMIN' | 'USER'

export interface ApiUserTenant {
  _id: string
  name?: string
}

export interface ApiUser {
  id: string
  tenantId: string | ApiUserTenant
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface UserListItem {
  id: string
  tenantId: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface CreateUserPayload {
  tenantId: string
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  role?: UserRole
  password?: string
}

export interface UserFormValues {
  name: string
  email: string
  password: string
  role: UserRole
}

export function resolveTenantId(tenantId: string | ApiUserTenant): string {
  return typeof tenantId === 'string' ? tenantId : tenantId._id
}
