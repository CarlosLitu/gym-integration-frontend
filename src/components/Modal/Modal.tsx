import { useEffect, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, className, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pulse-navy/40 p-4 sm:p-8"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={twMerge(
          clsx(
            'mt-8 flex w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-card',
            className,
          ),
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
