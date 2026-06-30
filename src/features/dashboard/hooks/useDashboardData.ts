import { useSelectedTenant } from '@/features/tenants/hooks/useSelectedTenant'
import { useDateRange } from './useDateRange'
import { useSalesKpis } from './useSalesKpis'
import { useSalesSeries } from './useSalesSeries'
import { useSalesBreakdown } from './useSalesBreakdown'

export function useDashboardData() {
  const { selectedTenantId } = useSelectedTenant()
  const tenantId = selectedTenantId

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
