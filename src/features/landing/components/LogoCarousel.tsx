import { useTranslation } from 'react-i18next'
import { LandingContainer } from './LandingContainer'

const PLACEHOLDER_LOGOS = ['Logoipsum', 'LGPSUM', 'LOGOIPSUM', 'Brandmark', 'Fitnet', 'GymPro']

const FADE_LEFT =
  'linear-gradient(-89deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 58%, rgba(255, 255, 255, 1) 100%)'
const FADE_RIGHT =
  'linear-gradient(89deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 58%, rgba(255, 255, 255, 1) 100%)'

export function LogoCarousel() {
  const { t } = useTranslation()
  const logos = [...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS]

  return (
    <section className="relative z-10 overflow-x-clip bg-white">
      <LandingContainer className="flex flex-col gap-10 py-10 lg:flex-row lg:items-center lg:gap-[72px] lg:py-14">
        <p className="w-full max-w-[363px] shrink-0 text-left font-sans text-[18px] font-semibold leading-normal text-[#5C667A] lg:text-[24px]">
          {t('landing.carousel.label')}
        </p>

        <div className="relative h-[41px] min-w-0 w-full flex-1 overflow-hidden">
          <div
            className="flex h-[41px] w-max animate-logo-scroll items-end gap-10"
            aria-label={t('landing.carousel.ariaLabel')}
          >
            {logos.map((logo, index) => (
              <span
                key={`${logo}-${index}`}
                className="whitespace-nowrap font-heading text-lg font-bold leading-none tracking-wide text-pulse-navy/40"
              >
                {logo}
              </span>
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[65px]"
            style={{ background: FADE_LEFT }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[65px]"
            style={{ background: FADE_RIGHT }}
            aria-hidden="true"
          />
        </div>
      </LandingContainer>
    </section>
  )
}
