import { motion } from 'motion/react'
import polygon from '@/assets/images/Polygon.svg'
import {
  PULSE_MARK_ELLIPSE_COLORS,
  type PulseMarkVariant,
} from '@/constants/pulse-mark-colors'

interface PulseHexagonMarkProps {
  variant?: PulseMarkVariant
  className?: string
}

export function PulseHexagonMark({
  variant = 'default',
  className = 'h-20 w-20',
}: PulseHexagonMarkProps) {
  const ellipseColor = PULSE_MARK_ELLIPSE_COLORS[variant]

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <motion.div
        className="h-full w-full"
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -360, -360] }}
        transition={{
          rotate: {
            duration: 2,
            times: [0, 0.7414, 1],
            ease: [[0.5, 0, 0.5, 1], 'linear'],
            repeat: Infinity,
          },
        }}
      >
        <img src={polygon} alt="" className="h-full w-full" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.span
          className="h-7 w-7 rounded-full"
          style={{ backgroundColor: ellipseColor }}
          initial={{ opacity: 0.08 }}
          animate={{ opacity: [0.08, 1, 0.08, 0.08] }}
          transition={{
            opacity: {
              duration: 2,
              times: [0, 0.3451, 0.6965, 1],
              ease: [[0.5, 0, 0.5, 1], [0.5, 0, 0.5, 1], 'linear'],
              repeat: Infinity,
            },
          }}
        />
      </div>
    </div>
  )
}
