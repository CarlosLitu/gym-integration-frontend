import { apiClient } from '@/services/api-client'
import type { AuthResponse, LoginCredentials } from '../types/auth.types'

export async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
  return data
}
