import { apiClient } from '@/services/api-client'
import type { SyncValidateResponse } from '../types/tenant.types'

export async function testConnectionRequest(
  apiKey: string,
  apiSecret: string,
): Promise<SyncValidateResponse> {
  const { data } = await apiClient.post<SyncValidateResponse>('/api/sync/validate', {
    gateway: 'EVO',
    credentials: [apiKey, apiSecret],
  })

  return data
}
