import { apiClient } from '@/services/api-client'

export async function logoutRequest(): Promise<void> {
  await apiClient.post('/api/auth/logout')
}
