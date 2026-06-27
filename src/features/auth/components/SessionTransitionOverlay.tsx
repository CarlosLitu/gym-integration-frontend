import { CircleNotch } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/images/logo.svg'
import { useSessionTransition } from '../hooks/useSessionTransition'

export function SessionTransitionOverlay() {
  const { t } = useTranslation()
  const { phase, messageKey } = useSessionTransition()

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
        <p className="font-sans text-sm text-pulse-muted">{t(messageKey)}</p>
      </div>
    </div>
  )
}
