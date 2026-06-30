import { apiClient } from '@/services/api-client'
import type { SalesListResponse } from './dashboard.types'
import type { SalesQuery } from './get-sales-summary'

export async function listSalesRequest(query: SalesQuery): Promise<SalesListResponse> {
  const { data } = await apiClient.get<SalesListResponse>('/api/sales', { params: query })

  return data
}
