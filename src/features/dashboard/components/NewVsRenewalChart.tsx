import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNumber } from '@/utils/formatters'
import type { NewVsRenewalPoint } from '../hooks/useSalesBreakdown'
import { CHART_COLORS } from '../utils/chart-colors'
import { ChartTooltipBox } from './ChartTooltip'

interface NewVsRenewalChartProps {
  data: NewVsRenewalPoint[]
}

interface NewVsRenewalTooltipProps {
  active?: boolean
  payload?: Array<{ payload: NewVsRenewalPoint }>
}

function NewVsRenewalTooltip({ active, payload }: NewVsRenewalTooltipProps) {
  const { t } = useTranslation()

  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0].payload
  const total = point.novos + point.renovacoes

  return (
    <ChartTooltipBox
      title={point.label}
      entries={[
        {
          label: t('dashboard.series.new'),
          value: formatNumber(point.novos),
          color: CHART_COLORS.novos,
        },
        {
          label: t('dashboard.series.renewal'),
          value: formatNumber(point.renovacoes),
          color: CHART_COLORS.renovacoes,
        },
        { label: t('dashboard.series.total'), value: formatNumber(total) },
      ]}
    />
  )
}

export function NewVsRenewalChart({ data }: NewVsRenewalChartProps) {
  const { t } = useTranslation()

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
          allowDecimals={false}
          width={40}
        />
        <Tooltip content={<NewVsRenewalTooltip />} cursor={{ fill: CHART_COLORS.grid, opacity: 0.4 }} />
        <Legend
          formatter={(value) =>
            value === 'novos' ? t('dashboard.series.new') : t('dashboard.series.renewal')
          }
          wrapperStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="novos" stackId="kind" fill={CHART_COLORS.novos} radius={[0, 0, 0, 0]} />
        <Bar dataKey="renovacoes" stackId="kind" fill={CHART_COLORS.renovacoes} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
