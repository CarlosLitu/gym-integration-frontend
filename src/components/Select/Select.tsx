import { useEffect, useId, useRef, useState } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { clsx } from 'clsx'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface SelectProps<T extends string = string> {
  id?: string
  label?: string
  value: T | ''
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  /** Visually marks the field as non-editable (bg/label/text locked colors). */
  locked?: boolean
  className?: string
}

export function Select<T extends string = string>({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  error,
  disabled = false,
  locked = false,
  className,
}: SelectProps<T>) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDisabled = disabled || locked

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div className={clsx('flex w-full flex-col gap-2', className)}>
      {label ? (
        <label
          htmlFor={selectId}
          className={clsx(
            'font-sans text-sm font-semibold',
            locked ? 'text-[#9B9F9C]' : 'text-pulse-navy',
          )}
        >
          {label}
        </label>
      ) : null}

      <div ref={containerRef} className="relative">
        <button
          id={selectId}
          type="button"
          disabled={isDisabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={Boolean(error)}
          onClick={() => setIsOpen((open) => !open)}
          className={clsx(
            'flex h-10 w-full items-center justify-between rounded-[12px] border px-3 font-sans text-sm outline-none transition-colors',
            locked
              ? 'cursor-not-allowed border-slate-200 bg-[#F6F6F6] text-[#9B9F9C]'
              : isDisabled
                ? 'cursor-not-allowed border-slate-200 bg-white opacity-60'
                : isOpen
                  ? 'border-pulse-blue bg-white ring-2 ring-pulse-blue/30'
                  : error
                    ? 'border-pulse-error-border bg-white'
                    : 'border-slate-200 bg-white hover:border-pulse-blue/60',
            !locked && !isDisabled && (selectedOption ? 'text-pulse-navy' : 'text-[#AFB8C0]'),
            !locked && isDisabled && (selectedOption ? 'text-pulse-navy' : 'text-[#AFB8C0]'),
          )}
        >
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
          <CaretDown
            size={16}
            weight="bold"
            aria-hidden="true"
            className={clsx(
              'shrink-0 transition-transform duration-200',
              locked ? 'text-[#9B9F9C]' : 'text-stone-400',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        {isOpen ? (
          <ul
            role="listbox"
            aria-labelledby={selectId}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[12px] border border-slate-200 bg-white py-1 shadow-card"
          >
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={clsx(
                      'flex w-full items-center justify-between px-3 py-2.5 text-left font-sans text-sm transition-colors',
                      isSelected
                        ? 'bg-pulse-blue/10 font-medium text-pulse-blue'
                        : 'text-pulse-navy hover:bg-pulse-surface',
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected ? <Check size={16} weight="bold" aria-hidden="true" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>

      {error ? <span className="font-sans text-xs text-pulse-error-border">{error}</span> : null}
    </div>
  )
}
