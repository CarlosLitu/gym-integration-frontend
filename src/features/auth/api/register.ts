import { apiClient } from '@/services/api-client'
import type { AuthResponse, RegisterPayload } from '../types/auth.types'

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
  return data
}
