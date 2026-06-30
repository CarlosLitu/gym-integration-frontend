import { useTranslation } from 'react-i18next'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters'
import type { BreakdownSlice } from '../hooks/useSalesBreakdown'
import { paletteColor } from '../utils/chart-colors'
import { ChartTooltipBox } from './ChartTooltip'

interface PaymentMethodsChartProps {
  data: BreakdownSlice[]
}

interface SliceTooltipProps {
  active?: boolean
  payload?: Array<{ payload: BreakdownSlice; color?: string }>
}

function buildTooltip(total: number) {
  function PaymentMethodsTooltip({ active, payload }: SliceTooltipProps) {
    const { t } = useTranslation()

    if (!active || !payload?.length) {
      return null
    }

    const slice = payload[0].payload
    const share = total > 0 ? slice.value / total : 0

    return (
      <ChartTooltipBox
        title={slice.name}
        entries={[
          {
            label: t('dashboard.series.value'),
            value: formatCurrency(slice.value),
            color: payload[0].color,
          },
          { label: t('dashboard.series.share'), value: formatPercent(share) },
          { label: t('dashboard.series.transactions'), value: formatNumber(slice.count) },
        ]}
      />
    )
  }

  return PaymentMethodsTooltip
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  const total = data.reduce((acc, slice) => acc + slice.value, 0)
  const TooltipContent = buildTooltip(total)

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Tooltip content={<TooltipContent />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={64}
          outerRadius={104}
          paddingAngle={2}
          stroke="#FFFFFF"
          strokeWidth={2}
        >
          {data.map((slice, index) => (
            <Cell key={slice.name} fill={paletteColor(index)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
