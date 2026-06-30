import { useTranslation } from 'react-i18next'
import { ChartCard } from '../components/ChartCard'
import { DashboardFilters } from '../components/DashboardFilters'
import { KpiGrid } from '../components/KpiGrid'
import { NewVsRenewalChart } from '../components/NewVsRenewalChart'
import { PaidVsPendingChart } from '../components/PaidVsPendingChart'
import { PaymentMethodsChart } from '../components/PaymentMethodsChart'
import { PlanMixChart } from '../components/PlanMixChart'
import { RevenueAreaChart } from '../components/RevenueAreaChart'
import { SellersRankingChart } from '../components/SellersRankingChart'
import { useDashboardData } from '../hooks/useDashboardData'

export function DashboardPage() {
  const { t } = useTranslation()
  const { dateRange, kpis, series, breakdown } = useDashboardData()

  const hasRevenue = series.series.some((point) => point.totalValue > 0)
  const hasFinancial = series.series.some(
    (point) => point.totalPaid > 0 || point.totalPending > 0,
  )

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-pulse-navy">
            {t('dashboard.title')}
          </h1>
          <p className="mt-1 text-sm text-pulse-muted">{t('dashboard.subtitle')}</p>
        </div>
        <DashboardFilters
          preset={dateRange.preset}
          onPresetChange={dateRange.setPreset}
          granularity={dateRange.granularity}
          onGranularityChange={dateRange.setGranularity}
        />
      </header>

      <KpiGrid kpis={kpis.kpis} isLoading={kpis.isLoading} error={kpis.error} />

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          title={t('dashboard.charts.revenue.title')}
          subtitle={t('dashboard.charts.revenue.subtitle')}
          info={t('dashboard.charts.revenue.info')}
          className="xl:col-span-2"
          isLoading={series.isLoading}
          error={series.error}
          isEmpty={!hasRevenue}
        >
          <RevenueAreaChart data={series.series} />
        </ChartCard>

        <ChartCard
          title={t('dashboard.charts.paidVsPending.title')}
          subtitle={t('dashboard.charts.paidVsPending.subtitle')}
          info={t('dashboard.charts.paidVsPending.info')}
          isLoading={series.isLoading}
          error={series.error}
          isEmpty={!hasFinancial}
        >
          <PaidVsPendingChart data={series.series} />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title={t('dashboard.charts.paymentMethods.title')}
          subtitle={t('dashboard.charts.paymentMethods.subtitle')}
          info={t('dashboard.charts.paymentMethods.info')}
          isLoading={breakdown.isLoading}
          error={breakdown.error}
          isEmpty={breakdown.breakdown.paymentMethods.length === 0}
        >
          <PaymentMethodsChart data={breakdown.breakdown.paymentMethods} />
        </ChartCard>

        <ChartCard
          title={t('dashboard.charts.newVsRenewal.title')}
          subtitle={t('dashboard.charts.newVsRenewal.subtitle')}
          info={t('dashboard.charts.newVsRenewal.info')}
          isLoading={breakdown.isLoading}
          error={breakdown.error}
          isEmpty={breakdown.breakdown.newVsRenewal.length === 0}
        >
          <NewVsRenewalChart data={breakdown.breakdown.newVsRenewal} />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title={t('dashboard.charts.plans.title')}
          subtitle={t('dashboard.charts.plans.subtitle')}
          info={t('dashboard.charts.plans.info')}
          isLoading={breakdown.isLoading}
          error={breakdown.error}
          isEmpty={breakdown.breakdown.plans.length === 0}
        >
          <PlanMixChart data={breakdown.breakdown.plans} />
        </ChartCard>

        <ChartCard
          title={t('dashboard.charts.sellers.title')}
          subtitle={t('dashboard.charts.sellers.subtitle')}
          info={t('dashboard.charts.sellers.info')}
          isLoading={breakdown.isLoading}
          error={breakdown.error}
          isEmpty={breakdown.breakdown.sellers.length === 0}
        >
          <SellersRankingChart data={breakdown.breakdown.sellers} />
        </ChartCard>
      </div>
    </div>
  )
}
