import { useEffect, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import {
  getCurrentMonthSalesRequest,
  getLastMonthSalesRequest,
} from '../api/get-sales-kpis'
import type { SalesBucket } from '../api/dashboard.types'

export interface KpiTotals {
  totalValue: number
  totalPaid: number
  totalPending: number
  salesCount: number
  itemsCount: number
  averageTicket: number
  collectionRate: number
  pendingRate: number
}

export interface SalesKpis {
  current: KpiTotals
  previous: KpiTotals
  deltas: {
    totalValue: number | null
    totalPaid: number | null
    totalPending: number | null
    salesCount: number | null
    averageTicket: number | null
    collectionRate: number | null
  }
}

function aggregateBuckets(buckets: SalesBucket[]): KpiTotals {
  const totals = buckets.reduce(
    (acc, bucket) => {
      acc.totalValue += bucket.totalValue || 0
      acc.totalPaid += bucket.totalPaid || 0
      acc.totalPending += bucket.totalPending || 0
      acc.salesCount += bucket.salesCount || 0
      acc.itemsCount += bucket.itemsCount || 0
      return acc
    },
    { totalValue: 0, totalPaid: 0, totalPending: 0, salesCount: 0, itemsCount: 0 },
  )

  const averageTicket = totals.salesCount > 0 ? totals.totalValue / totals.salesCount : 0
  const collectionRate = totals.totalValue > 0 ? totals.totalPaid / totals.totalValue : 0
  const pendingRate = totals.totalValue > 0 ? totals.totalPending / totals.totalValue : 0

  return { ...totals, averageTicket, collectionRate, pendingRate }
}

function percentDelta(current: number, previous: number): number | null {
  if (!previous) {
    return null
  }

  return (current - previous) / previous
}

export function useSalesKpis(tenantId: string | null) {
  const { getErrorMessage } = useApiMessage()
  const [kpis, setKpis] = useState<SalesKpis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tenantId) {
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    Promise.all([
      getCurrentMonthSalesRequest(tenantId),
      getLastMonthSalesRequest(tenantId),
    ])
      .then(([currentResponse, previousResponse]) => {
        if (!isMounted) {
          return
        }

        const current = aggregateBuckets(currentResponse.data)
        const previous = aggregateBuckets(previousResponse.data)

        setKpis({
          current,
          previous,
          deltas: {
            totalValue: percentDelta(current.totalValue, previous.totalValue),
            totalPaid: percentDelta(current.totalPaid, previous.totalPaid),
            totalPending: percentDelta(current.totalPending, previous.totalPending),
            salesCount: percentDelta(current.salesCount, previous.salesCount),
            averageTicket: percentDelta(current.averageTicket, previous.averageTicket),
            collectionRate: percentDelta(current.collectionRate, previous.collectionRate),
          },
        })
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getErrorMessage(requestError))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [tenantId, getErrorMessage])

  return { kpis, isLoading, error }
}
