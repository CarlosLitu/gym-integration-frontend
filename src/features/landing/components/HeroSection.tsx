import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { clsx } from 'clsx'
import { useAuth } from '@/features/auth'
import heroBackground from '@/assets/images/Header - HERO.svg'
import dashboardPreview from '@/assets/images/Hero-Dash.svg'
import { scrollToDemo } from '../utils/scroll-to-demo'
import { landingMedia } from '../utils/media-scale'
import { LandingContainer } from './LandingContainer'
import { HeroSocialProofPill } from './HeroSocialProofPill'

const heroPrimaryButtonClass =
  'inline-flex h-12 flex-1 items-center justify-center rounded-[10px] bg-pulse-blue px-4 py-3 font-sans text-[14.5px] font-semibold leading-none text-pulse-surface transition-colors hover:bg-pulse-blue/90 md:flex-none md:px-6 lg:min-w-[203px]'

const heroSecondaryButtonClass =
  'inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-[rgba(247,249,252,0.12)] px-4 py-3 font-sans text-[14.5px] font-semibold leading-none text-pulse-surface backdrop-blur-[2px] transition-colors hover:bg-[rgba(247,249,252,0.18)] md:flex-none md:px-6'

export function HeroSection() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative h-[600px] min-h-0 overflow-x-clip overflow-y-visible bg-pulse-navy md:h-[760px] lg:h-auto lg:min-h-[900px]">
      <img
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      />

      {/*
        Mobile: top 439 / hero 600 (já validado).
        Tablet: cluster compacto (~78%), ancorado no bottom com overlap moderado.
        Desktop: overlap 40% (já validado).
      */}
      <img
        src={dashboardPreview}
        alt={t('landing.hero.dashboardAlt')}
        className={clsx(
          'pointer-events-none absolute left-1/2 z-[1] max-w-none -translate-x-1/2',
          landingMedia.heroDashboardWidth,
          'top-[439px]',
          'md:top-auto md:bottom-0 md:translate-y-[38%]',
          'lg:bottom-0 lg:left-0 lg:right-0 lg:top-auto lg:mx-auto lg:translate-x-0 lg:translate-y-[40%]',
        )}
      />

      <LandingContainer className="relative z-20 flex flex-col items-center pt-[122px] md:pt-32 lg:pt-[clamp(6.5rem,13vh,8.75rem)]">
        <HeroSocialProofPill className="mb-6 hidden lg:inline-flex" />

        <div className="flex w-full max-w-[1279px] flex-col items-center gap-8">
          <div className="flex w-full flex-col items-center gap-3">
            <h1 className="w-full text-center font-heading text-[32px] font-bold leading-[35px] tracking-[-0.0175em] text-pulse-surface md:text-[40px] md:leading-[1.1] lg:max-w-[920px] lg:text-[48px] lg:leading-[52px] lg:tracking-[-0.01em]">
              <Trans
                i18nKey="landing.hero.title"
                components={{
                  highlight: <span className="text-pulse-teal" />,
                  br: <br />,
                }}
              />
            </h1>

            <p className="max-w-[300px] text-center font-sans text-[14px] leading-5 text-pulse-surface/90 md:max-w-[560px] md:text-[15px] md:leading-relaxed lg:max-w-[820px] lg:text-[15px] lg:leading-6">
              {t('landing.hero.subtitle')}
            </p>
          </div>

          <div className="flex w-full items-center gap-3.5 md:w-auto md:justify-center">
            <button type="button" className={heroPrimaryButtonClass} onClick={scrollToDemo}>
              {t('landing.hero.ctaDemo')}
            </button>

            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className={heroSecondaryButtonClass}
            >
              {t('landing.hero.ctaLogin')}
            </Link>
          </div>
        </div>
      </LandingContainer>
    </section>
  )
}
