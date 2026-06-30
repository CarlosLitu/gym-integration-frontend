import type { Icon } from '@phosphor-icons/react'
import { CaretDown, CaretUp, Info, Minus } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { formatPercent } from '@/utils/formatters'

interface KpiCardProps {
  label: string
  value: string
  icon: Icon
  delta?: number | null
  invertDelta?: boolean
  info?: string
}

function DeltaBadge({ delta, invertDelta }: { delta: number | null; invertDelta: boolean }) {
  if (delta === null || delta === undefined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-pill bg-pulse-surface px-2 py-0.5 text-xs font-medium text-pulse-muted">
        <Minus className="h-3 w-3" aria-hidden="true" />
        —
      </span>
    )
  }

  const isPositive = delta > 0
  const isNeutral = delta === 0
  const isGood = invertDelta ? delta < 0 : delta > 0

  const toneClass = isNeutral
    ? 'bg-pulse-surface text-pulse-muted'
    : isGood
      ? 'bg-[#00C2A8]/10 text-[#00897B]'
      : 'bg-[#D85A30]/10 text-[#D85A30]'

  const CaretIcon = isPositive ? CaretUp : CaretDown

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-semibold',
        toneClass,
      )}
    >
      {!isNeutral ? <CaretIcon className="h-3 w-3" weight="bold" aria-hidden="true" /> : null}
      {formatPercent(Math.abs(delta))}
    </span>
  )
}

export function KpiCard({
  label,
  value,
  icon: IconComponent,
  delta,
  invertDelta = false,
  info,
}: KpiCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-[12px] border border-pulse-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-pulse-blue/10 text-pulse-blue">
          <IconComponent className="h-5 w-5" weight="bold" aria-hidden="true" />
        </span>
        <DeltaBadge delta={delta ?? null} invertDelta={invertDelta} />
      </div>

      <div>
        <p className="flex items-center gap-1 text-xs text-pulse-muted">
          {label}
          {info ? (
            <span className="group relative inline-flex">
              <Info className="h-3.5 w-3.5 cursor-help text-pulse-muted" aria-hidden="true" />
              <span className="pointer-events-none absolute left-1/2 top-5 z-10 hidden w-48 -translate-x-1/2 rounded-[8px] border border-pulse-border bg-pulse-navy px-3 py-2 text-xs font-medium text-white shadow-card group-hover:block">
                {info}
              </span>
            </span>
          ) : null}
        </p>
        <p className="mt-1 font-heading text-2xl font-semibold text-pulse-navy">{value}</p>
      </div>
    </article>
  )
}
