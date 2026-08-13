import { apiClient } from '@/services/api-client'
import type { SalesGranularity, SalesSummaryResponse } from './dashboard.types'

const GRANULARITY_PATH: Record<SalesGranularity, string> = {
  day: 'days',
  week: 'weeks',
  month: 'months',
}

export interface SalesQuery {
  tenantId: string
  startDate: string
  endDate: string
}

export async function getSalesSummaryRequest(
  granularity: SalesGranularity,
  query: SalesQuery,
): Promise<SalesSummaryResponse> {
  const { data } = await apiClient.get<SalesSummaryResponse>(
    `/api/sales/${GRANULARITY_PATH[granularity]}`,
    { params: query },
  )

  return data
}
