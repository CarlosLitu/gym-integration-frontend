export interface TooltipEntry {
  label: string
  value: string
  color?: string
}

interface ChartTooltipBoxProps {
  title?: string
  entries: TooltipEntry[]
}

export function ChartTooltipBox({ title, entries }: ChartTooltipBoxProps) {
  return (
    <div className="min-w-[160px] rounded-[10px] border border-pulse-border bg-white p-3 shadow-card">
      {title ? (
        <p className="mb-2 font-heading text-xs font-semibold text-pulse-navy">{title}</p>
      ) : null}
      <ul className="flex flex-col gap-1.5">
        {entries.map((entry) => (
          <li key={entry.label} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-2 text-pulse-muted">
              {entry.color ? (
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
              ) : null}
              {entry.label}
            </span>
            <span className="font-sans font-semibold text-pulse-navy">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
