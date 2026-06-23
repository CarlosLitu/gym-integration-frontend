import { MetricsGrid } from '../components/MetricsGrid'
import { PerformanceChart } from '../components/PerformanceChart'
import { useDashboardData } from '../hooks/useDashboardData'

export function DashboardPage() {
  const { metrics, isLoading, error } = useDashboardData()

  if (isLoading) {
    return <p className="text-sm text-slate-500">Carregando dashboard...</p>
  }

  if (error || !metrics) {
    return <p className="text-sm text-red-500">{error ?? 'Dados indisponíveis.'}</p>
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Visão geral da integração</p>
      </header>

      <MetricsGrid metrics={metrics} />
      <PerformanceChart />
    </div>
  )
}
