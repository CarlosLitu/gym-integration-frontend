import { useTranslation } from 'react-i18next'
import logo from '@/assets/images/logo.svg'

export function LoginHeader() {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col gap-4">
      <img src={logo} alt="Pulse" className="h-[52px] w-[182px]" />

      <p className="max-w-[404px] font-sans text-[15px] leading-normal text-pulse-muted">
        {t('auth.loginSubtitle')}
      </p>
    </header>
  )
}
