import { useAuth } from '@/features/auth/hooks/useAuth'
import { useDateRange } from './useDateRange'
import { useSalesKpis } from './useSalesKpis'
import { useSalesSeries } from './useSalesSeries'
import { useSalesBreakdown } from './useSalesBreakdown'

export function useDashboardData() {
  const { user } = useAuth()
  const tenantId = user?.tenant?.id ?? null

  const dateRange = useDateRange('currentMonth')
  const kpis = useSalesKpis(tenantId)
  const series = useSalesSeries(tenantId, dateRange.granularity, dateRange.range)
  const breakdown = useSalesBreakdown(tenantId, dateRange.granularity, dateRange.range)

  return {
    tenantId,
    dateRange,
    kpis,
    series,
    breakdown,
  }
}
