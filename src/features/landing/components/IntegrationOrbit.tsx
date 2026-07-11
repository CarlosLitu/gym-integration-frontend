import { clsx } from 'clsx'
import evoLogo from '@/assets/images/circle-motion/EVo.svg'
import gymLogo from '@/assets/images/circle-motion/Gym.svg'
import nLogo from '@/assets/images/circle-motion/N.svg'
import whatsappLogo from '@/assets/images/circle-motion/Whatsapp.svg'
import { landingMedia } from '../utils/media-scale'

const ORBIT_LOGOS = [
  { src: evoLogo, alt: 'EVO' },
  { src: gymLogo, alt: 'Gym' },
  { src: nLogo, alt: 'Next Fit' },
  { src: whatsappLogo, alt: 'WhatsApp' },
] as const

/** Espaçamento angular entre logos (~30° no Figma) */
const ORBIT_ANGLE_STEP_DEG = -30

/** Começa na esquerda do círculo (270° a partir do topo), arco em direção à base */
const ORBIT_START_DEG = 270

export function IntegrationOrbit() {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute left-1/2 z-0 aspect-square -translate-x-1/2',
        'top-[clamp(1rem,3vw,6rem)]',
        landingMedia.orbitWidth,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-orbit-spin rounded-full border border-[rgba(20,33,57,0.08)] bg-[rgba(20,33,57,0.04)] backdrop-blur-[2px] lg:border-[rgba(247,249,252,0.12)]">
        {ORBIT_LOGOS.map((logo, index) => {
          const angle = ORBIT_START_DEG + ORBIT_ANGLE_STEP_DEG * index

          return (
            <div
              key={logo.alt}
              className="absolute inset-0"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <div style={{ transform: `rotate(${-angle}deg)` }}>
                  <img
                    src={logo.src}
                    alt=""
                    className={clsx('animate-orbit-spin-reverse', landingMedia.orbitLogoSize)}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
