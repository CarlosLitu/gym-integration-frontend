import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CaretLeft } from '@phosphor-icons/react'
import logo from '@/assets/images/logo.svg'

export function LoginHeader() {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col gap-4">
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-1 font-sans text-sm text-pulse-navy transition-colors hover:text-pulse-blue"
      >
        <CaretLeft size={16} weight="bold" aria-hidden="true" />
        {t('auth.backToHome')}
      </Link>

      <img src={logo} alt="Pulse" className="h-[52px] w-[182px]" />

      <p className="max-w-[404px] font-sans text-[15px] leading-normal text-pulse-muted">
        {t('auth.loginSubtitle')}
      </p>
    </header>
  )
}
