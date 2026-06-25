import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-pulse-navy text-white hover:bg-pulse-navy/90 disabled:opacity-60',
        active:
          'bg-[#007AFF] text-white hover:bg-[#007AFF]/90 disabled:bg-[#007AFF] disabled:text-white',
        secondary: 'bg-pulse-surface text-pulse-navy hover:bg-pulse-border disabled:opacity-60',
        outline:
          'border border-pulse-border bg-transparent text-pulse-navy hover:bg-pulse-surface disabled:opacity-60',
        idle: 'bg-pulse-border text-pulse-muted disabled:opacity-60',
        brand:
          'rounded-pill bg-pulse-blue text-white hover:bg-pulse-blue/90 disabled:opacity-60',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'rounded-pill px-6 py-[13px] text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(buttonVariants({ variant, size }), className))}
      {...props}
    />
  )
}
