import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-pulse-navy text-white hover:bg-pulse-navy/90',
        secondary: 'bg-pulse-surface text-pulse-navy hover:bg-pulse-border',
        outline: 'border border-pulse-border bg-transparent text-pulse-navy hover:bg-pulse-surface',
        idle: 'bg-pulse-border text-pulse-muted hover:bg-pulse-border/80',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-[46px] rounded-pill px-6 text-base',
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
