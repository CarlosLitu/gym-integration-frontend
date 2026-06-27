import { CircleNotch } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/images/logo.svg'
import { useLogout } from '../hooks/useLogout'

export function LogoutOverlay() {
  const { t } = useTranslation()
  const { phase } = useLogout()

  if (phase === null) return null

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-white/85 backdrop-blur-sm ${
        phase === 'out' ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <img src={logo} alt="Pulse" className="h-9 w-[126px] animate-pulse" />
        <CircleNotch size={28} weight="bold" className="animate-spin text-pulse-blue" />
        <p className="font-sans text-sm text-pulse-muted">{t('auth.loggingOut')}</p>
      </div>
    </div>
  )
}
