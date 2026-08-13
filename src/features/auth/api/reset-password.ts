import { apiClient } from '@/services/api-client'
import type { AuthMessageResponse, ResetPasswordPayload } from '../types/auth.types'

export async function resetPasswordRequest(
  payload: ResetPasswordPayload,
): Promise<AuthMessageResponse> {
  const { data } = await apiClient.post<AuthMessageResponse>(
    '/api/auth/reset-password',
    payload,
  )
  return data
}
