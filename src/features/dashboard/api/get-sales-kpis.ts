import { apiClient } from '@/services/api-client'
import type { SalesSummaryResponse } from './dashboard.types'

export async function getCurrentMonthSalesRequest(
  tenantId: string,
): Promise<SalesSummaryResponse> {
  const { data } = await apiClient.get<SalesSummaryResponse>('/api/dashboard/sales/current', {
    params: { tenantId },
  })

  return data
}

export async function getLastMonthSalesRequest(
  tenantId: string,
): Promise<SalesSummaryResponse> {
  const { data } = await apiClient.get<SalesSummaryResponse>('/api/dashboard/sales/last_month', {
    params: { tenantId },
  })

  return data
}
