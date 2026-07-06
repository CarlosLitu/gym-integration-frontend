import { apiClient } from '@/services/api-client'
import type { ApiUser, UserListItem } from '../types/user.types'
import { resolveTenantId } from '../types/user.types'

function mapUser(user: ApiUser): UserListItem {
  return {
    id: user.id,
    tenantId: resolveTenantId(user.tenantId),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

export async function listUsersRequest(): Promise<UserListItem[]> {
  const { data } = await apiClient.get<{ data: ApiUser[] }>('/api/users')
  return data.data.map(mapUser)
}
