import { useTranslation } from 'react-i18next'
import overlayBackground from '@/assets/images/overlay-opacity.svg'
import { PulseHexagonMark } from '@/components'
import type { PulseMarkVariant } from '@/constants/pulse-mark-colors'
import { useSessionTransition } from '../hooks/useSessionTransition'

function resolveMarkVariant(messageKey: string): PulseMarkVariant {
  if (messageKey === 'auth.loggingIn') {
    return 'login'
  }

  if (messageKey === 'auth.loggingOut') {
    return 'logout'
  }

  return 'default'
}

function resolveMessageKey(messageKey: string): string {
  if (
    messageKey === 'auth.loggingIn' ||
    messageKey === 'auth.loggingOut' ||
    messageKey === 'auth.loading'
  ) {
    return messageKey
  }

  return 'auth.loading'
}

export function SessionTransitionOverlay() {
  const { t } = useTranslation()
  const { phase, messageKey } = useSessionTransition()

  if (phase === null) return null

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center ${
        phase === 'out' ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${overlayBackground})` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-[15px]">
        <PulseHexagonMark variant={resolveMarkVariant(messageKey)} />
        <p className="font-sans text-[18px] font-medium leading-none tracking-normal text-[#505458]">
          {t(resolveMessageKey(messageKey))}
        </p>
      </div>
    </div>
  )
}
