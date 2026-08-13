import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import type { SalesGranularity } from '../api/dashboard.types'
import {
  DATE_RANGE_PRESETS,
  type DateRangePreset,
} from '../hooks/useDateRange'

interface DashboardFiltersProps {
  preset: DateRangePreset
  onPresetChange: (preset: DateRangePreset) => void
  granularity: SalesGranularity
  onGranularityChange: (granularity: SalesGranularity) => void
}

const GRANULARITIES: SalesGranularity[] = ['day', 'week', 'month']

function SegmentButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-[8px] px-3 py-1.5 font-sans text-xs font-medium transition-colors',
        isActive
          ? 'bg-white text-pulse-navy shadow-sm'
          : 'text-pulse-muted hover:text-pulse-navy',
      )}
    >
      {children}
    </button>
  )
}

export function DashboardFilters({
  preset,
  onPresetChange,
  granularity,
  onGranularityChange,
}: DashboardFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-1 rounded-[10px] border border-pulse-border bg-pulse-surface p-1">
        {DATE_RANGE_PRESETS.map((presetOption) => (
          <SegmentButton
            key={presetOption}
            isActive={preset === presetOption}
            onClick={() => onPresetChange(presetOption)}
          >
            {t(`dashboard.presets.${presetOption}`)}
          </SegmentButton>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-[10px] border border-pulse-border bg-pulse-surface p-1">
        {GRANULARITIES.map((granularityOption) => (
          <SegmentButton
            key={granularityOption}
            isActive={granularity === granularityOption}
            onClick={() => onGranularityChange(granularityOption)}
          >
            {t(`dashboard.granularity.${granularityOption}`)}
          </SegmentButton>
        ))}
      </div>
    </div>
  )
}
