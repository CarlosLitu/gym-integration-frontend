import { useEffect, useRef, useState } from 'react'
import { Funnel } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select, type SelectOption } from '@/components/Select'

export type FiltersPopoverSelectOption = SelectOption<string>

interface FiltersPopoverFieldBase {
  id: string
  label: string
  disabled?: boolean
  /** Value considered "inactive" for the filters badge count. Defaults to `''`. */
  emptyValue?: string
}

export type FiltersPopoverField =
  | (FiltersPopoverFieldBase & {
      type: 'select'
      value: string
      options: readonly FiltersPopoverSelectOption[]
      placeholder?: string
      error?: string
    })
  | (FiltersPopoverFieldBase & {
      type: 'text'
      value: string
      placeholder?: string
    })
  | (FiltersPopoverFieldBase & {
      type: 'date'
      value: string
    })
  | {
      type: 'date-range'
      id: string
      start: { id: string; label: string; value: string }
      end: { id: string; label: string; value: string }
      disabled?: boolean
    }

export interface FiltersPopoverProps {
  fields: readonly FiltersPopoverField[]
  onChange: (id: string, value: string) => void
  onApply: () => void
  onClear: () => void
  isLoading?: boolean
  title?: string
  openLabel?: string
  openLabelWithCount?: string
}

function isFieldActive(field: FiltersPopoverField): boolean {
  if (field.type === 'date-range') {
    return Boolean(field.start.value || field.end.value)
  }

  const emptyValue = field.emptyValue ?? ''
  return field.value !== emptyValue
}

export function FiltersPopover({
  fields,
  onChange,
  onApply,
  onClear,
  isLoading = false,
  title,
  openLabel,
  openLabelWithCount,
}: FiltersPopoverProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeFiltersCount = fields.filter(isFieldActive).length
  const resolvedTitle = title ?? t('common.filtersTitle')
  const resolvedOpenLabel = openLabel ?? t('common.filters')
  const resolvedOpenLabelWithCount =
    openLabelWithCount ?? t('common.filtersWithCount', { count: activeFiltersCount })

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function handleApply() {
    onApply()
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <Button
        type="button"
        variant="outline"
        size="md"
        className="gap-2 rounded-[12px] border-slate-200 bg-white hover:bg-pulse-surface"
        onClick={() => setIsOpen((current) => !current)}
        disabled={isLoading}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Funnel size={18} weight="bold" aria-hidden="true" />
        {activeFiltersCount > 0 ? resolvedOpenLabelWithCount : resolvedOpenLabel}
      </Button>

      {isOpen ? (
        <div
          role="dialog"
          aria-label={resolvedTitle}
          className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-[16px] border border-slate-200 bg-white shadow-card"
        >
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-sans text-sm font-semibold text-pulse-navy">{resolvedTitle}</h2>
          </div>

          <div className="flex flex-col gap-3 px-4 py-4">
            {fields.map((field) => {
              if (field.type === 'select') {
                return (
                  <Select
                    key={field.id}
                    label={field.label}
                    value={field.value}
                    options={field.options}
                    placeholder={field.placeholder}
                    onChange={(value) => onChange(field.id, value)}
                    disabled={isLoading || field.disabled}
                    error={field.error}
                  />
                )
              }

              if (field.type === 'text') {
                return (
                  <Input
                    key={field.id}
                    label={field.label}
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(event) => onChange(field.id, event.target.value)}
                    disabled={isLoading || field.disabled}
                  />
                )
              }

              if (field.type === 'date') {
                return (
                  <Input
                    key={field.id}
                    label={field.label}
                    type="date"
                    value={field.value}
                    onChange={(event) => onChange(field.id, event.target.value)}
                    disabled={isLoading || field.disabled}
                  />
                )
              }

              return (
                <div key={field.id} className="grid grid-cols-2 gap-3">
                  <Input
                    label={field.start.label}
                    type="date"
                    value={field.start.value}
                    onChange={(event) => onChange(field.start.id, event.target.value)}
                    disabled={isLoading || field.disabled}
                  />
                  <Input
                    label={field.end.label}
                    type="date"
                    value={field.end.value}
                    onChange={(event) => onChange(field.end.id, event.target.value)}
                    disabled={isLoading || field.disabled}
                  />
                </div>
              )
            })}
          </div>

          <div className="flex gap-2 border-t border-slate-200 px-4 py-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="flex-1 rounded-[12px] border-slate-200 bg-white hover:bg-pulse-surface"
              onClick={onClear}
              disabled={isLoading}
            >
              {t('common.clearAll')}
            </Button>
            <Button
              type="button"
              variant="brand"
              size="md"
              className="flex-1 !rounded-[12px]"
              onClick={handleApply}
              disabled={isLoading}
            >
              {t('common.apply')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
