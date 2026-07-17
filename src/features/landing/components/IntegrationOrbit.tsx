import { clsx } from 'clsx'
import evoLogo from '@/assets/images/circle-motion/EVo.svg'
import facebookLogo from '@/assets/images/circle-motion/facebook.svg'
import gymLogo from '@/assets/images/circle-motion/Gym.svg'
import instagramLogo from '@/assets/images/circle-motion/instagram.svg'
import nLogo from '@/assets/images/circle-motion/N.svg'
import whatsappLogo from '@/assets/images/circle-motion/Whatsapp.svg'
import { landingMedia } from '../utils/media-scale'

/** Ordem do arco no Figma (esquerda → baixo) */
const ORBIT_LOGOS = [
  { src: evoLogo, alt: 'EVO' },
  { src: whatsappLogo, alt: 'WhatsApp' },
  { src: nLogo, alt: 'Next Fit' },
  { src: instagramLogo, alt: 'Instagram' },
  { src: gymLogo, alt: 'Gym' },
  { src: facebookLogo, alt: 'Facebook' },
] as const

/** Espaçamento angular entre logos (~30° no Figma) */
const ORBIT_ANGLE_STEP_DEG = -30

/** Começa na esquerda do círculo (270° a partir do topo), arco em direção à base */
const ORBIT_START_DEG = 270

type IntegrationOrbitProps = {
  className?: string
}

export function IntegrationOrbit({ className }: IntegrationOrbitProps) {
  return (
    <div
      className={clsx(
        /* Topo do círculo ~meio da tela do notebook (Figma) — fica atrás do frame */
        'pointer-events-none absolute left-1/2 top-[18%] z-0 aspect-square -translate-x-1/2',
        landingMedia.orbitWidth,
        className,
      )}
      aria-hidden="true"
    >
      {/* Círculo estático atrás do notebook */}
      <div className="absolute inset-0 rounded-full border border-[rgba(20,33,57,0.08)] bg-[rgba(20,33,57,0.04)] lg:border-[rgba(20,33,57,0.06)]" />

      {/* Logos orbitam sem levar o círculo junto */}
      <div className="absolute inset-0 animate-orbit-spin">
        {ORBIT_LOGOS.map((logo, index) => {
          const angle = ORBIT_START_DEG + ORBIT_ANGLE_STEP_DEG * index

          return (
            <div
              key={logo.alt}
              className="absolute inset-0"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <div className="animate-orbit-spin-reverse">
                  <div style={{ transform: `rotate(${-angle}deg)` }}>
                    <img
                      src={logo.src}
                      alt=""
                      className={landingMedia.orbitLogoSize}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
