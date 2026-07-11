import { apiClient } from '@/services/api-client'
import type { AuthMessageResponse, ForgotPasswordPayload } from '../types/auth.types'

export async function forgotPasswordRequest(
  payload: ForgotPasswordPayload,
): Promise<AuthMessageResponse> {
  const { data } = await apiClient.post<AuthMessageResponse>(
    '/api/auth/forgot-password',
    payload,
  )
  return data
}
