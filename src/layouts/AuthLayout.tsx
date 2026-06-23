import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[500px] flex-col justify-center gap-4 px-12 py-12">
      {children}
    </main>
  )
}
