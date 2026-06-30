import type { ReactNode } from 'react'
import { Info } from '@phosphor-icons/react'
import { clsx } from 'clsx'

interface ChartCardProps {
  title: string
  subtitle?: string
  info?: string
  isLoading?: boolean
  error?: string | null
  isEmpty?: boolean
  emptyLabel?: string
  className?: string
  children: ReactNode
}

function ChartState({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-pulse-muted">
      {message}
    </div>
  )
}

export function ChartCard({
  title,
  subtitle,
  info,
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyLabel = 'Sem dados no período',
  className,
  children,
}: ChartCardProps) {
  return (
    <section
      className={clsx(
        'flex flex-col rounded-[12px] border border-pulse-border bg-white p-5 shadow-sm',
        className,
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="font-heading text-sm font-semibold text-pulse-navy">{title}</h2>
            {info ? (
              <span className="group relative inline-flex">
                <Info
                  className="h-4 w-4 cursor-help text-pulse-muted"
                  weight="fill"
                  aria-hidden="true"
                />
                <span className="pointer-events-none absolute left-1/2 top-6 z-10 hidden w-52 -translate-x-1/2 rounded-[8px] border border-pulse-border bg-pulse-navy px-3 py-2 text-xs font-medium text-white shadow-card group-hover:block">
                  {info}
                </span>
              </span>
            ) : null}
          </div>
          {subtitle ? <p className="mt-0.5 text-xs text-pulse-muted">{subtitle}</p> : null}
        </div>
      </header>

      {isLoading ? (
        <ChartState message="Carregando..." />
      ) : error ? (
        <ChartState message={error} />
      ) : isEmpty ? (
        <ChartState message={emptyLabel} />
      ) : (
        children
      )}
    </section>
  )
}
