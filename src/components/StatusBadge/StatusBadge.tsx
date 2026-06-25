import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ReactNode } from 'react'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill px-3 py-[5px] font-sans text-xs font-medium',
  {
    variants: {
      status: {
        unknown: 'bg-pulse-border text-pulse-muted',
        connected: 'bg-pulse-teal/15 text-pulse-teal',
      },
    },
    defaultVariants: {
      status: 'unknown',
    },
  },
)

export interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span className={twMerge(clsx(badgeVariants({ status }), className))}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
