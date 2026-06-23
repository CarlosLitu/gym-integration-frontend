import { apiClient } from '@/services/api-client'

export interface DashboardMetrics {
  activeMembers: number
  monthlyRevenue: number
  checkInsToday: number
}

export async function getMetricsRequest(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get<DashboardMetrics>('/dashboard/metrics')
  return data
}
