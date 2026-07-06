import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import overlayBackground from '@/assets/images/overlay.svg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  hideOverlay?: boolean
  dimOverlay?: boolean
  children: ReactNode
}

export function Modal({
  isOpen,
  onClose,
  className,
  hideOverlay = false,
  dimOverlay = false,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  const overlayStyle: CSSProperties | undefined =
    hideOverlay || dimOverlay ? undefined : { backgroundImage: `url(${overlayBackground})` }

  return createPortal(
    <div className="fixed inset-0 z-50" role="presentation">
      {!hideOverlay ? (
        <div
          className={clsx(
            'fixed inset-0 animate-fade-in',
            dimOverlay
              ? 'bg-black/40'
              : 'bg-pulse-surface bg-cover bg-center bg-no-repeat',
          )}
          style={overlayStyle}
          aria-hidden="true"
        />
      ) : null}

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-8">
          <div
            role="dialog"
            aria-modal="true"
            className={twMerge(
              clsx(
                'relative flex w-full max-w-2xl animate-scale-in flex-col overflow-hidden rounded-lg bg-white shadow-card',
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
      </div>
    </div>,
    document.body,
  )
}
