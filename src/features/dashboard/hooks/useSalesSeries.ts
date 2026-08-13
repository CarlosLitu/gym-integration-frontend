import { useEffect, useMemo, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { getSalesSummaryRequest } from '../api/get-sales-summary'
import type { SalesBucket, SalesGranularity } from '../api/dashboard.types'
import { bucketIdToKey, formatBucketLabel } from '../utils/format-bucket'
import type { DateRange } from './useDateRange'

export interface SeriesPoint {
  key: string
  label: string
  totalValue: number
  totalPaid: number
  totalPending: number
  salesCount: number
  averageTicket: number
}

function toSeries(buckets: SalesBucket[], granularity: SalesGranularity): SeriesPoint[] {
  return buckets.map((bucket) => ({
    key: bucketIdToKey(bucket._id),
    label: formatBucketLabel(bucket._id, granularity),
    totalValue: bucket.totalValue || 0,
    totalPaid: bucket.totalPaid || 0,
    totalPending: bucket.totalPending || 0,
    salesCount: bucket.salesCount || 0,
    averageTicket: bucket.salesCount > 0 ? bucket.totalValue / bucket.salesCount : 0,
  }))
}

export function useSalesSeries(
  tenantId: string | null,
  granularity: SalesGranularity,
  range: DateRange,
) {
  const { getErrorMessage } = useApiMessage()
  const [buckets, setBuckets] = useState<SalesBucket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tenantId) {
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    getSalesSummaryRequest(granularity, {
      tenantId,
      startDate: range.startDate,
      endDate: range.endDate,
    })
      .then((response) => {
        if (isMounted) {
          setBuckets(response.data)
        }
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
  }, [tenantId, granularity, range.startDate, range.endDate, getErrorMessage])

  const series = useMemo(() => toSeries(buckets, granularity), [buckets, granularity])

  return { series, isLoading, error }
}
