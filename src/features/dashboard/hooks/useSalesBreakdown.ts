import { useEffect, useMemo, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listSalesRequest } from '../api/list-sales'
import type { RawSale, SalesGranularity } from '../api/dashboard.types'
import { dateToBucket } from '../utils/format-bucket'
import type { DateRange } from './useDateRange'

export interface BreakdownSlice {
  name: string
  value: number
  count: number
}

export interface NewVsRenewalPoint {
  key: string
  label: string
  novos: number
  renovacoes: number
}

export interface SalesBreakdown {
  paymentMethods: BreakdownSlice[]
  plans: BreakdownSlice[]
  sellers: BreakdownSlice[]
  newVsRenewal: NewVsRenewalPoint[]
}

const EMPTY_BREAKDOWN: SalesBreakdown = {
  paymentMethods: [],
  plans: [],
  sellers: [],
  newVsRenewal: [],
}

function toNumber(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function topNWithOthers(slices: BreakdownSlice[], limit: number): BreakdownSlice[] {
  const sorted = [...slices].sort((a, b) => b.value - a.value)

  if (sorted.length <= limit) {
    return sorted
  }

  const head = sorted.slice(0, limit)
  const tail = sorted.slice(limit)
  const others = tail.reduce(
    (acc, slice) => {
      acc.value += slice.value
      acc.count += slice.count
      return acc
    },
    { name: 'Outros', value: 0, count: 0 },
  )

  return [...head, others]
}

function accumulate(map: Map<string, BreakdownSlice>, name: string, value: number, count: number) {
  const current = map.get(name) ?? { name, value: 0, count: 0 }
  current.value += value
  current.count += count
  map.set(name, current)
}

function buildBreakdown(sales: RawSale[], granularity: SalesGranularity): SalesBreakdown {
  const paymentMethods = new Map<string, BreakdownSlice>()
  const plans = new Map<string, BreakdownSlice>()
  const sellers = new Map<string, BreakdownSlice>()
  const newVsRenewal = new Map<string, NewVsRenewalPoint & { sort: number }>()

  for (const sale of sales) {
    const payload = sale.payload ?? {}

    const sellerName = payload.nameEmployeeSale?.trim() || 'Sem vendedor'
    accumulate(sellers, sellerName, toNumber(sale.saleValueTotal), 1)

    for (const item of payload.saleItens ?? []) {
      const planName = item.item?.trim() || item.description?.trim() || 'Outros'
      accumulate(plans, planName, toNumber(item.saleValue), toNumber(item.quantity) || 1)
    }

    for (const receivable of payload.receivables ?? []) {
      const methodName = receivable.paymentType?.name?.trim() || 'Outros'
      const value = toNumber(receivable.ammountPaid) || toNumber(receivable.ammount)
      accumulate(paymentMethods, methodName, value, 1)
    }

    if (sale.saleDate) {
      const date = new Date(sale.saleDate)

      if (!Number.isNaN(date.getTime())) {
        const bucket = dateToBucket(date, granularity)
        const point =
          newVsRenewal.get(bucket.key) ??
          { key: bucket.key, label: bucket.label, novos: 0, renovacoes: 0, sort: bucket.sort }
        const isRenewal = payload.registrationKind?.toLowerCase() === 'renewal'

        if (isRenewal) {
          point.renovacoes += 1
        } else {
          point.novos += 1
        }

        newVsRenewal.set(bucket.key, point)
      }
    }
  }

  return {
    paymentMethods: topNWithOthers([...paymentMethods.values()], 6),
    plans: topNWithOthers([...plans.values()], 6),
    sellers: topNWithOthers([...sellers.values()], 6),
    newVsRenewal: [...newVsRenewal.values()]
      .sort((a, b) => a.sort - b.sort)
      .map(({ sort: _sort, ...point }) => point),
  }
}

export function useSalesBreakdown(
  tenantId: string | null,
  granularity: SalesGranularity,
  range: DateRange,
) {
  const { getErrorMessage } = useApiMessage()
  const [sales, setSales] = useState<RawSale[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tenantId) {
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    listSalesRequest({
      tenantId,
      startDate: range.startDate,
      endDate: range.endDate,
    })
      .then((response) => {
        if (isMounted) {
          setSales(response.data)
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
  }, [tenantId, range.startDate, range.endDate, getErrorMessage])

  const breakdown = useMemo(
    () => (sales.length > 0 ? buildBreakdown(sales, granularity) : EMPTY_BREAKDOWN),
    [sales, granularity],
  )

  return { breakdown, isLoading, error }
}
