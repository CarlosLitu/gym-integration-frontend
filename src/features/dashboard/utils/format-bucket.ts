import type { SalesBucketId, SalesGranularity } from '../api/dashboard.types'

const MONTHS_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function bucketIdToKey(id: SalesBucketId): string {
  if (typeof id === 'string') {
    return id
  }

  return `${id.year}-W${pad(id.week)}`
}

export function formatBucketLabel(id: SalesBucketId, granularity: SalesGranularity): string {
  if (typeof id !== 'string') {
    return `Sem ${id.week}`
  }

  if (granularity === 'month') {
    const [year, month] = id.split('-')
    const monthIndex = Number(month) - 1
    return `${MONTHS_SHORT[monthIndex] ?? month}/${year.slice(2)}`
  }

  const [, month, day] = id.split('-')
  return `${day}/${month}`
}

export interface DateBucket {
  key: string
  label: string
  sort: number
}

export function dateToBucket(date: Date, granularity: SalesGranularity): DateBucket {
  const year = date.getUTCFullYear()
  const monthIndex = date.getUTCMonth()
  const day = date.getUTCDate()

  if (granularity === 'month') {
    const id = `${year}-${pad(monthIndex + 1)}`
    return {
      key: id,
      label: formatBucketLabel(id, 'month'),
      sort: Date.UTC(year, monthIndex, 1),
    }
  }

  if (granularity === 'week') {
    const reference = new Date(Date.UTC(year, monthIndex, day))
    const dayNumber = reference.getUTCDay() || 7
    reference.setUTCDate(reference.getUTCDate() + 4 - dayNumber)
    const yearStart = new Date(Date.UTC(reference.getUTCFullYear(), 0, 1))
    const week = Math.ceil(((reference.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)

    return {
      key: `${reference.getUTCFullYear()}-W${pad(week)}`,
      label: `Sem ${week}`,
      sort: reference.getTime(),
    }
  }

  const id = `${year}-${pad(monthIndex + 1)}-${pad(day)}`
  return {
    key: id,
    label: formatBucketLabel(id, 'day'),
    sort: Date.UTC(year, monthIndex, day),
  }
}
