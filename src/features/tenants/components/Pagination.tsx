import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

interface PaginationProps {
  page: number
  totalPages: number
  shown: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, shown, total, onPageChange }: PaginationProps) {
  const { t } = useTranslation()

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="font-sans text-xs text-pulse-muted">
        {t('tenants.showing', { shown, total })}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="grid h-8 w-8 place-items-center rounded-md font-sans text-sm text-pulse-navy transition-colors hover:bg-pulse-surface disabled:opacity-40"
          aria-label={t('tenants.previousPage')}
        >
          ‹
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={clsx(
              'grid h-8 min-w-8 place-items-center rounded-md px-2 font-sans text-sm transition-colors',
              pageNumber === page
                ? 'bg-pulse-blue text-white'
                : 'text-pulse-navy hover:bg-pulse-surface',
            )}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="grid h-8 w-8 place-items-center rounded-md font-sans text-sm text-pulse-navy transition-colors hover:bg-pulse-surface disabled:opacity-40"
          aria-label={t('tenants.nextPage')}
        >
          ›
        </button>
      </div>
    </div>
  )
}
