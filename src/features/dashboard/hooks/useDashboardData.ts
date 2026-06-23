import { useEffect, useState } from 'react'
import { getMetricsRequest } from '../api/get-metrics'
import type { DashboardMetrics } from '../api/get-metrics'

export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getMetricsRequest()
      .then((data) => {
        if (isMounted) setMetrics(data)
      })
      .catch(() => {
        if (isMounted) setError('Não foi possível carregar os dados do dashboard.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { metrics, isLoading, error }
}
