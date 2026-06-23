import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <label htmlFor={inputId} className="font-sans text-sm font-semibold text-pulse-navy">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={twMerge(
          clsx(
            'h-auto w-full rounded-input border border-pulse-border bg-pulse-surface px-[14px] py-3 font-sans text-sm text-pulse-navy outline-none transition-colors placeholder:text-pulse-muted focus:border-pulse-blue focus:ring-2 focus:ring-pulse-blue/20',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          ),
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  )
}
