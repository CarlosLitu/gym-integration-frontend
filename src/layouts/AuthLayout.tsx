import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {(title || subtitle) && (
          <header className="mb-6 text-center">
            {title ? <h1 className="text-2xl font-semibold text-slate-900">{title}</h1> : null}
            {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
          </header>
        )}
        {children}
      </div>
    </div>
  )
}
