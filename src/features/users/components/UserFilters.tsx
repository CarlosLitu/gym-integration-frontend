import { useTranslation } from 'react-i18next'

interface UserFiltersProps {
  newestFirst: boolean
  onToggleSort: () => void
  total: number
}

export function UserFilters({ newestFirst, onToggleSort, total }: UserFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onToggleSort}
        className="inline-flex items-center gap-1.5 rounded-pill border border-pulse-border px-4 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
      >
        <span aria-hidden="true">{newestFirst ? '↓' : '↑'}</span>
        {newestFirst ? t('users.sortNewest') : t('users.sortOldest')}
      </button>

      <span className="ml-auto font-sans text-sm text-pulse-muted">
        {t('users.count', { total })}
      </span>
    </div>
  )
}
