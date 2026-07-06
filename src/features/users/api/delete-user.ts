import { apiClient } from '@/services/api-client'

export async function deleteUserRequest(id: string): Promise<void> {
  await apiClient.delete(`/api/users/${id}`)
}
