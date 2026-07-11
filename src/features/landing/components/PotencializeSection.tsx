import { useTranslation } from 'react-i18next'
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
        <div className="flex w-full max-w-[737px] flex-col items-center gap-3 text-center">
          <p className="font-sans text-[12px] font-bold uppercase tracking-[0.0867em] text-[#2D6CDF]">
            {t('landing.potencialize.overline')}
          </p>

          <div className="flex w-full flex-col items-center gap-3">
            <h2 className="max-w-[549px] font-heading text-[clamp(2rem,3vw+0.75rem,2.5rem)] font-bold leading-[1.2] tracking-[-0.0119em] text-[#142139] lg:leading-[44.84px] lg:tracking-[-0.0095em]">
              {t('landing.potencialize.title')}
            </h2>
            <p className="font-sans text-[clamp(0.9375rem,0.4vw+0.85rem,1rem)] leading-relaxed text-[#5C667A] lg:leading-[26.4px]">
              {t('landing.potencialize.description')}
            </p>
          </div>
        </div>
      </LandingContainer>

      <div className="relative z-10 mt-[clamp(2rem,4vw,3rem)] w-full overflow-hidden bg-[#F7F9FC]">
        <IntegrationOrbit />

        <div
          className={clsx(
            'relative z-[1] mx-auto lg:mt-12',
            landingMedia.laptopWidth,
          )}
        >
          <img
            src={potencializeFrame}
            alt=""
            aria-hidden="true"
            className="relative z-[1] mx-auto block h-auto w-full select-none"
            draggable={false}
          />

          {/* Proporções Figma — escalam com o frame */}
          <div className="absolute left-[11.9%] top-[5.1%] z-[2] w-[76.7%]">
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
