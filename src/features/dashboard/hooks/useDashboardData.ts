import { useState } from 'react'
import type { DashboardMetrics } from '../api/get-metrics'

// A rota /dashboard/metrics esta desativada no front por enquanto.
// Para reativar, voltar a chamar getMetricsRequest() em um useEffect.
export function useDashboardData() {
  const [metrics] = useState<DashboardMetrics | null>(null)
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)

  return { metrics, isLoading, error }
}
