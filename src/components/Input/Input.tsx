import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useState } from 'react'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import type { InputHTMLAttributes } from 'react'

const inputVariants = cva(
  'h-auto w-full rounded-input border px-[14px] py-3 font-sans text-sm text-pulse-navy outline-none transition-colors placeholder:text-pulse-muted',
  {
    variants: {
      state: {
        default:
          'border-pulse-border bg-pulse-surface focus:border-pulse-blue focus:ring-2 focus:ring-pulse-blue/20',
        error:
          'border-pulse-error-border bg-pulse-error-bg focus:border-pulse-error-border focus:ring-2 focus:ring-pulse-error-border/20',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
)

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  revealToggle?: boolean
  revealLabel?: string
  hideLabel?: string
}

export function Input({
  className,
  label,
  error,
  id,
  type,
  revealToggle,
  revealLabel,
  hideLabel,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const [isRevealed, setIsRevealed] = useState(false)

  const showToggle = Boolean(revealToggle) && type === 'password'
  const resolvedType = showToggle && isRevealed ? 'text' : type

  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <label htmlFor={inputId} className="font-sans text-sm font-semibold text-pulse-navy">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          className={twMerge(
            clsx(
              inputVariants({ state: error ? 'error' : 'default' }),
              showToggle && 'pr-11',
              className,
            ),
          )}
          {...props}
        />
        {showToggle ? (
          <button
            type="button"
            onClick={() => setIsRevealed((value) => !value)}
            aria-label={isRevealed ? hideLabel : revealLabel}
            className="absolute right-[14px] top-1/2 -translate-y-1/2 text-pulse-muted transition-colors hover:text-pulse-navy"
          >
            {isRevealed ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>
      {error ? (
        <span className="font-sans text-xs text-pulse-error-border">{error}</span>
      ) : null}
    </div>
  )
}
