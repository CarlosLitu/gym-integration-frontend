import { useTranslation } from 'react-i18next'

interface TenantFiltersProps {
  sortAsc: boolean
  onToggleSort: () => void
  total: number
}

const DISABLED_FILTERS = ['connected', 'waiting', 'error', 'pending'] as const

export function TenantFilters({ sortAsc, onToggleSort, total }: TenantFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-pill bg-pulse-blue px-4 py-1.5 font-sans text-xs font-medium text-white"
      >
        {t('tenants.filters.all')}
      </button>

      {DISABLED_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          disabled
          className="pointer-events-none rounded-pill border border-pulse-border px-4 py-1.5 font-sans text-xs font-medium text-pulse-navy opacity-60"
        >
          {t(`tenants.filters.${filter}`)}
        </button>
      ))}

      <button
        type="button"
        onClick={onToggleSort}
        className="inline-flex items-center gap-1.5 rounded-pill border border-pulse-border px-4 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
      >
        <span aria-hidden="true">{sortAsc ? '↑↓' : '↓↑'}</span>
        {t('tenants.sortAz')}
      </button>

      <span className="ml-auto font-sans text-sm text-pulse-muted">
        {t('tenants.count', { total })}
      </span>
    </div>
  )
}
