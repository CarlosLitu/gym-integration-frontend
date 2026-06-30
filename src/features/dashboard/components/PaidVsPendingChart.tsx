import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCompactCurrency, formatCurrency, formatPercent } from '@/utils/formatters'
import type { SeriesPoint } from '../hooks/useSalesSeries'
import { CHART_COLORS } from '../utils/chart-colors'
import { ChartTooltipBox } from './ChartTooltip'

interface PaidVsPendingChartProps {
  data: SeriesPoint[]
}

interface SeriesTooltipProps {
  active?: boolean
  payload?: Array<{ payload: SeriesPoint }>
}

function PaidVsPendingTooltip({ active, payload }: SeriesTooltipProps) {
  const { t } = useTranslation()

  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0].payload
  const total = point.totalPaid + point.totalPending
  const pendingRate = total > 0 ? point.totalPending / total : 0

  return (
    <ChartTooltipBox
      title={point.label}
      entries={[
        {
          label: t('dashboard.series.paid'),
          value: formatCurrency(point.totalPaid),
          color: CHART_COLORS.paid,
        },
        {
          label: t('dashboard.series.pending'),
          value: formatCurrency(point.totalPending),
          color: CHART_COLORS.pending,
        },
        { label: t('dashboard.series.defaultRate'), value: formatPercent(pendingRate) },
      ]}
    />
  )
}

export function PaidVsPendingChart({ data }: PaidVsPendingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART_COLORS.axis }}
          minTickGap={16}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART_COLORS.axis }}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
          width={64}
        />
        <Tooltip content={<PaidVsPendingTooltip />} cursor={{ fill: CHART_COLORS.grid, opacity: 0.4 }} />
        <Bar dataKey="totalPaid" stackId="financial" fill={CHART_COLORS.paid} radius={[0, 0, 0, 0]} />
        <Bar dataKey="totalPending" stackId="financial" fill={CHART_COLORS.pending} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
