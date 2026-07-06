import { apiClient } from '@/services/api-client'
import type { ApiUser, UpdateUserPayload } from '../types/user.types'
import { resolveTenantId } from '../types/user.types'
import type { UserListItem } from '../types/user.types'

export async function updateUserRequest(id: string, payload: UpdateUserPayload): Promise<UserListItem> {
  const { data } = await apiClient.put<{ data: ApiUser }>(`/api/users/${id}`, payload)

  return {
    id: data.data.id,
    tenantId: resolveTenantId(data.data.tenantId),
    name: data.data.name,
    email: data.data.email,
    role: data.data.role,
    createdAt: data.data.createdAt,
  }
}
