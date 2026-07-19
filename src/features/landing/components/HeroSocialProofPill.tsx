import { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { motion } from 'motion/react'
import { clsx } from 'clsx'
import pulseSymbol from '@/assets/images/pulse-simbol.svg'

const LINE_HEIGHT_PX = 30
const STEP_DURATION_S = 0.45
const HOLD_MS = 2500

const PILL_MESSAGE_KEYS = [
  'impacto',
  'ironWorks',
  'vibeGym',
  'arenaBase',
  'ctInvictus',
] as const

type HeroSocialProofPillProps = {
  className?: string
}

export function HeroSocialProofPill({ className }: HeroSocialProofPillProps) {
  const [index, setIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const slideCount = PILL_MESSAGE_KEYS.length
  const keysToRender = [...PILL_MESSAGE_KEYS, PILL_MESSAGE_KEYS[0]]

  useEffect(() => {
    if (index === slideCount) return

    const timer = window.setTimeout(() => {
      setInstant(false)
      setIndex((current) => current + 1)
    }, HOLD_MS)

    return () => window.clearTimeout(timer)
  }, [index, slideCount])

  return (
    <div
      className={clsx(
        'inline-flex max-w-full items-center justify-center gap-4 rounded-pill bg-[rgba(247,249,252,0.04)] p-3 backdrop-blur-[2px]',
        className,
      )}
      aria-live="polite"
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-[#00C2A8]/45"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.3, 1.3], opacity: [0.55, 0.55, 0] }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            times: [0, 0.75, 1],
            repeat: Infinity,
            repeatDelay: 2.2,
          }}
        />
        <motion.img
          src={pulseSymbol}
          alt=""
          aria-hidden="true"
          className="relative z-10 h-8 w-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: 'linear' }}
        />
      </span>

      <div className="h-[30px] w-[min(424px,70vw)] overflow-hidden">
        <motion.div
          animate={{ y: -LINE_HEIGHT_PX * index }}
          transition={
            instant
              ? { duration: 0 }
              : { duration: STEP_DURATION_S, ease: 'easeInOut' }
          }
          onAnimationComplete={() => {
            if (index !== slideCount) return
            setInstant(true)
            setIndex(0)
          }}
        >
          {keysToRender.map((key, i) => (
            <p
              key={`${key}-${i}`}
              className="h-[30px] truncate font-sans text-[18px] leading-[30px] text-[rgba(247,249,252,0.8)]"
            >
              <Trans
                i18nKey={`landing.hero.pillMessages.${key}`}
                components={{
                  bold: <span className="font-semibold text-[#F7F9FC]" />,
                }}
              />
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
