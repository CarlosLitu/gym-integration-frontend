import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CaretLeft } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

interface UserFormPageLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function UserFormPageLayout({ title, subtitle, children }: UserFormPageLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <Link
          to="/users"
          className="mb-3 inline-flex w-fit items-center gap-1 font-sans text-sm text-pulse-muted transition-colors hover:text-pulse-navy"
        >
          <CaretLeft size={16} weight="bold" aria-hidden="true" />
          {t('users.backToList')}
        </Link>
        <h1 className="font-heading text-2xl font-semibold text-pulse-navy">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-pulse-muted">{subtitle}</p>
      </header>

      {children}
    </div>
  )
}
