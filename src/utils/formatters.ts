export function formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

export function formatDate(
  value: string | Date,
  locale = 'pt-BR',
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
): string {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat(locale, options).format(date)
}

const TIME_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
]

export function formatTimeAgo(value: string | Date, locale = 'pt-BR'): string {
  const date = value instanceof Date ? value : new Date(value)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  let duration = (date.getTime() - Date.now()) / 1000

  for (const division of TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return rtf.format(Math.round(duration), 'years')
}
