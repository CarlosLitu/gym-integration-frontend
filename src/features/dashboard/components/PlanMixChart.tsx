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
import { formatCompactCurrency, formatCurrency, formatNumber } from '@/utils/formatters'
import type { BreakdownSlice } from '../hooks/useSalesBreakdown'
import { CHART_COLORS } from '../utils/chart-colors'
import { ChartTooltipBox } from './ChartTooltip'

interface PlanMixChartProps {
  data: BreakdownSlice[]
}

interface SliceTooltipProps {
  active?: boolean
  payload?: Array<{ payload: BreakdownSlice }>
}

function PlanMixTooltip({ active, payload }: SliceTooltipProps) {
  const { t } = useTranslation()

  if (!active || !payload?.length) {
    return null
  }

  const slice = payload[0].payload

  return (
    <ChartTooltipBox
      title={slice.name}
      entries={[
        {
          label: t('dashboard.series.revenue'),
          value: formatCurrency(slice.value),
          color: CHART_COLORS.revenue,
        },
        { label: t('dashboard.series.quantity'), value: formatNumber(slice.count) },
      ]}
    />
  )
}

export function PlanMixChart({ data }: PlanMixChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CHART_COLORS.grid} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART_COLORS.axis }}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART_COLORS.axis }}
          width={120}
        />
        <Tooltip content={<PlanMixTooltip />} cursor={{ fill: CHART_COLORS.grid, opacity: 0.4 }} />
        <Bar dataKey="value" fill={CHART_COLORS.revenue} radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}
