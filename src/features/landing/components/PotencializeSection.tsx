import { useTranslation, Trans } from 'react-i18next'
import { clsx } from 'clsx'
import potencializeFrame from '@/assets/images/Potencialize.svg'
import potencializeInside from '@/assets/images/Potencialize - inside.svg'
import patternsImage from '@/assets/images/Patterns.svg'
import { landingMedia } from '../utils/media-scale'
import { IntegrationOrbit } from './IntegrationOrbit'
import { LandingContainer } from './LandingContainer'

export function PotencializeSection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-x-clip bg-[#F7F9FC]">
      <img
        src={patternsImage}
        alt=""
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute bottom-[clamp(2rem,8vw,4rem)] z-0 h-auto opacity-10',
          landingMedia.patternsWidth,
          landingMedia.patternsLeft,
          'lg:bottom-auto lg:top-[-441px]',
        )}
      />

      <LandingContainer className="relative z-10 flex flex-col items-center pt-[clamp(3rem,6vw,5rem)]">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <p className="font-sans text-[12px] font-bold uppercase tracking-[0.0867em] text-[#2D6CDF]">
            {t('landing.potencialize.overline')}
          </p>

          <h2 className="w-full max-w-[643px] font-heading text-[32px] font-bold leading-[40px] tracking-[-0.0119em] text-[#142139] lg:text-[40px] lg:leading-[44.84px] lg:tracking-[-0.0095em]">
            <Trans
              i18nKey="landing.potencialize.title"
              components={{ br: <br /> }}
            />
          </h2>

          <p className="w-full max-w-[571px] font-sans text-[16px] leading-6 text-[#5C667A] lg:leading-[26.4px]">
            {t('landing.potencialize.description')}
          </p>
        </div>
      </LandingContainer>

      <div className="relative z-10 mt-[clamp(2rem,4vw,3rem)] w-full overflow-hidden bg-[#F7F9FC]">
        <div
          className={clsx(
            'relative isolate mx-auto lg:mt-12',
            landingMedia.laptopWidth,
          )}
        >
          <IntegrationOrbit />

          <img
            src={potencializeFrame}
            alt=""
            aria-hidden="true"
            className="relative z-10 mx-auto block h-auto w-full select-none"
            draggable={false}
          />

          {/* Proporções Figma — escalam com o frame */}
          <div className="absolute left-[11.9%] top-[5.1%] z-20 w-[76.7%]">
            <img
              src={potencializeInside}
              alt={t('landing.potencialize.dashboardAlt')}
              className="block h-auto w-full select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
