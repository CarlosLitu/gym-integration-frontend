import type { ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, className, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-pulse-navy/40 p-4 sm:p-8"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={twMerge(
          clsx(
            'relative flex w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-card',
            className,
          ),
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-5 top-5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pulse-surface text-pulse-navy transition-colors hover:bg-pulse-border"
        >
          <X size={14} weight="bold" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  )
}
