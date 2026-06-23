import type { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
}

export function Alert({ children }: AlertProps) {
  return (
    <p
      className="rounded-input bg-pulse-error-bg px-3 py-2 font-sans text-sm text-pulse-error-border"
      role="alert"
    >
      {children}
    </p>
  )
}
