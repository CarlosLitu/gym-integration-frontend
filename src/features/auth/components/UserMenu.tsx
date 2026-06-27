import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useLogout } from '../hooks/useLogout'

interface UserMenuProps {
  initial: string
  className?: string
}

export function UserMenu({ initial, className }: UserMenuProps) {
  const { t } = useTranslation()
  const { startLogout } = useLogout()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div ref={containerRef} className={twMerge(clsx('relative', className))}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="grid h-9 w-9 place-items-center rounded-full bg-pulse-surface font-sans font-semibold text-pulse-navy transition-colors hover:bg-pulse-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-blue focus-visible:ring-offset-2"
      >
        {initial}
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-lg border border-slate-200 bg-white p-1 shadow-card"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false)
              startLogout()
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-sans text-sm text-pulse-navy transition-colors hover:bg-pulse-surface"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            {t('auth.logout')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
