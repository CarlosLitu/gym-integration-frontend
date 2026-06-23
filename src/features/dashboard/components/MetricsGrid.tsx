import type { DashboardMetrics } from '../api/get-metrics'

interface MetricsGridProps {
  metrics: DashboardMetrics
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const items = [
    { label: 'Membros ativos', value: metrics.activeMembers },
    { label: 'Receita mensal', value: metrics.monthlyRevenue },
    { label: 'Check-ins hoje', value: metrics.checkInsToday },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
        </article>
      ))}
    </div>
  )
}
