import { useEffect, useRef, useState } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import type { UserRole } from '../types/user.types'

const ROLE_OPTIONS: UserRole[] = ['ADMIN', 'USER']

interface UserRoleSelectProps {
  value: UserRole
  onChange: (role: UserRole) => void
  disabled?: boolean
}

export function UserRoleSelect({ value, onChange, disabled = false }: UserRoleSelectProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        id="user-role"
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={clsx(
          'flex h-10 w-full items-center justify-between rounded-[12px] border bg-white px-3 font-sans text-sm text-pulse-navy outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          isOpen
            ? 'border-pulse-blue ring-2 ring-pulse-blue/30'
            : 'border-slate-200 hover:border-pulse-blue/60',
        )}
      >
        <span>{t(`users.roles.${value}`)}</span>
        <CaretDown
          size={16}
          weight="bold"
          aria-hidden="true"
          className={clsx(
            'shrink-0 text-pulse-muted transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen ? (
        <ul
          role="listbox"
          aria-labelledby="user-role"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[12px] border border-slate-200 bg-white py-1 shadow-card"
        >
          {ROLE_OPTIONS.map((role) => {
            const isSelected = role === value

            return (
              <li key={role} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(role)
                    setIsOpen(false)
                  }}
                  className={clsx(
                    'flex w-full items-center justify-between px-3 py-2.5 text-left font-sans text-sm transition-colors',
                    isSelected
                      ? 'bg-pulse-blue/10 font-medium text-pulse-blue'
                      : 'text-pulse-navy hover:bg-pulse-surface',
                  )}
                >
                  <span>{t(`users.roles.${role}`)}</span>
                  {isSelected ? <Check size={16} weight="bold" aria-hidden="true" /> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
