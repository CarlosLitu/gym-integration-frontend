import { useMemo, useState } from 'react'
import type { SalesGranularity } from '../api/dashboard.types'

export type DateRangePreset =
  | 'currentMonth'
  | 'lastMonth'
  | 'last7Days'
  | 'last30Days'
  | 'last12Months'

export interface DateRange {
  startDate: string
  endDate: string
}

export const DATE_RANGE_PRESETS: DateRangePreset[] = [
  'currentMonth',
  'lastMonth',
  'last7Days',
  'last30Days',
  'last12Months',
]

const PRESET_GRANULARITY: Record<DateRangePreset, SalesGranularity> = {
  currentMonth: 'day',
  lastMonth: 'day',
  last7Days: 'day',
  last30Days: 'day',
  last12Months: 'month',
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function buildPresetRange(preset: DateRangePreset): DateRange {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const day = now.getUTCDate()

  switch (preset) {
    case 'lastMonth':
      return {
        startDate: toIsoDate(new Date(Date.UTC(year, month - 1, 1))),
        endDate: toIsoDate(new Date(Date.UTC(year, month, 0))),
      }
    case 'last7Days':
      return {
        startDate: toIsoDate(new Date(Date.UTC(year, month, day - 6))),
        endDate: toIsoDate(new Date(Date.UTC(year, month, day))),
      }
    case 'last30Days':
      return {
        startDate: toIsoDate(new Date(Date.UTC(year, month, day - 29))),
        endDate: toIsoDate(new Date(Date.UTC(year, month, day))),
      }
    case 'last12Months':
      return {
        startDate: toIsoDate(new Date(Date.UTC(year, month - 11, 1))),
        endDate: toIsoDate(new Date(Date.UTC(year, month + 1, 0))),
      }
    case 'currentMonth':
    default:
      return {
        startDate: toIsoDate(new Date(Date.UTC(year, month, 1))),
        endDate: toIsoDate(new Date(Date.UTC(year, month + 1, 0))),
      }
  }
}

export function useDateRange(initialPreset: DateRangePreset = 'currentMonth') {
  const [preset, setPresetState] = useState<DateRangePreset>(initialPreset)
  const [granularity, setGranularity] = useState<SalesGranularity>(
    PRESET_GRANULARITY[initialPreset],
  )

  const range = useMemo(() => buildPresetRange(preset), [preset])

  const setPreset = (next: DateRangePreset) => {
    setPresetState(next)
    setGranularity(PRESET_GRANULARITY[next])
  }

  return { preset, setPreset, granularity, setGranularity, range }
}
