import { useTranslation } from 'react-i18next'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCompactCurrency, formatCurrency, formatNumber } from '@/utils/formatters'
import type { SeriesPoint } from '../hooks/useSalesSeries'
import { CHART_COLORS } from '../utils/chart-colors'
import { ChartTooltipBox } from './ChartTooltip'

interface RevenueAreaChartProps {
  data: SeriesPoint[]
}

interface SeriesTooltipProps {
  active?: boolean
  payload?: Array<{ payload: SeriesPoint }>
}

function RevenueTooltip({ active, payload }: SeriesTooltipProps) {
  const { t } = useTranslation()

  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0].payload

  return (
    <ChartTooltipBox
      title={point.label}
      entries={[
        {
          label: t('dashboard.series.revenue'),
          value: formatCurrency(point.totalValue),
          color: CHART_COLORS.revenue,
        },
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
        { label: t('dashboard.series.sales'), value: formatNumber(point.salesCount) },
        {
          label: t('dashboard.series.averageTicket'),
          value: formatCurrency(point.averageTicket),
        },
      ]}
    />
  )
}

export function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.revenue} stopOpacity={0.28} />
            <stop offset="100%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Tooltip content={<RevenueTooltip />} cursor={{ stroke: CHART_COLORS.grid }} />
        <Area
          type="monotone"
          dataKey="totalValue"
          stroke={CHART_COLORS.revenue}
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
        <Line
          type="monotone"
          dataKey="totalPaid"
          stroke={CHART_COLORS.paid}
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
