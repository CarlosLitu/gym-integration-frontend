import { useTranslation } from 'react-i18next'
import logoWhite from '@/assets/images/pulse-logo-white 1.svg'
import { LandingContainer } from './LandingContainer'

export function LandingFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="overflow-x-clip bg-[#0D1628] py-5 lg:bg-[#070B14] lg:py-8">
      <LandingContainer className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <img src={logoWhite} alt="Pulse" className="h-7 w-auto" />

        <p className="text-left font-sans text-[12.5px] text-[rgba(247,249,252,0.6)] lg:text-right lg:text-xs lg:text-white/50">
          {t('landing.footer.copyright', { year })}
        </p>
      </LandingContainer>
    </footer>
  )
}
