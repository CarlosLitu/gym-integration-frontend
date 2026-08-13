import { apiClient } from '@/services/api-client'

export interface RunSyncResponse {
  started: boolean
  alreadyRunning: boolean
  message: string
}

export async function runSyncRequest(tenantId: string): Promise<RunSyncResponse> {
  const { data } = await apiClient.post<RunSyncResponse>('/api/sync/webhook', {
    tenantId,
  })

  return data
}
