import { useTranslation } from 'react-i18next'
import {
  CheckCircle,
  Clock,
  CurrencyDollar,
  Receipt,
  Ticket,
  TrendUp,
  type Icon,
} from '@phosphor-icons/react'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters'
import type { SalesKpis } from '../hooks/useSalesKpis'
import { KpiCard } from './KpiCard'

interface KpiGridProps {
  kpis: SalesKpis | null
  isLoading: boolean
  error: string | null
}

interface KpiDefinition {
  id: string
  label: string
  value: string
  icon: Icon
  delta: number | null
  invertDelta?: boolean
  info?: string
}

export function KpiGrid({ kpis, isLoading, error }: KpiGridProps) {
  const { t } = useTranslation()

  if (error) {
    return (
      <div className="rounded-[12px] border border-pulse-error-border bg-pulse-error-bg p-4 text-sm text-pulse-error-border">
        {error}
      </div>
    )
  }

  const current = kpis?.current
  const deltas = kpis?.deltas

  const items: KpiDefinition[] = [
    {
      id: 'revenue',
      label: t('dashboard.kpis.revenue'),
      value: current ? formatCurrency(current.totalValue) : '—',
      icon: CurrencyDollar,
      delta: deltas?.totalValue ?? null,
    },
    {
      id: 'paid',
      label: t('dashboard.kpis.paid'),
      value: current ? formatCurrency(current.totalPaid) : '—',
      icon: CheckCircle,
      delta: deltas?.totalPaid ?? null,
    },
    {
      id: 'pending',
      label: t('dashboard.kpis.pending'),
      value: current ? formatCurrency(current.totalPending) : '—',
      icon: Clock,
      delta: deltas?.totalPending ?? null,
      invertDelta: true,
      info: current
        ? t('dashboard.kpis.pendingInfo', { rate: formatPercent(current.pendingRate) })
        : undefined,
    },
    {
      id: 'salesCount',
      label: t('dashboard.kpis.salesCount'),
      value: current ? formatNumber(current.salesCount) : '—',
      icon: Receipt,
      delta: deltas?.salesCount ?? null,
    },
    {
      id: 'averageTicket',
      label: t('dashboard.kpis.averageTicket'),
      value: current ? formatCurrency(current.averageTicket) : '—',
      icon: Ticket,
      delta: deltas?.averageTicket ?? null,
      info: t('dashboard.kpis.averageTicketInfo'),
    },
    {
      id: 'collectionRate',
      label: t('dashboard.kpis.collectionRate'),
      value: current ? formatPercent(current.collectionRate) : '—',
      icon: TrendUp,
      delta: deltas?.collectionRate ?? null,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <KpiCard
          key={item.id}
          label={item.label}
          value={isLoading && !kpis ? '…' : item.value}
          icon={item.icon}
          delta={isLoading && !kpis ? null : item.delta}
          invertDelta={item.invertDelta}
          info={item.info}
        />
      ))}
    </div>
  )
}
