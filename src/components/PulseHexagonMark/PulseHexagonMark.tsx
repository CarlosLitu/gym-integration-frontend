import { motion } from 'motion/react'
import ellipse from '@/assets/images/Ellipse.svg'
import polygon from '@/assets/images/Polygon.svg'
import {
  PULSE_MARK_ELLIPSE_COLORS,
  PULSE_MARK_ELLIPSE_OPACITY,
  PULSE_MARK_POLYGON_OPACITY,
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
  const ellipseOpacityKeyframes = [...PULSE_MARK_ELLIPSE_OPACITY[variant]]
  const polygonOpacity = PULSE_MARK_POLYGON_OPACITY[variant]

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
        <img
          src={polygon}
          alt=""
          className="h-full w-full"
          style={{ opacity: polygonOpacity }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[35%] w-[35%]"
          style={{
            backgroundColor: ellipseColor,
            WebkitMaskImage: `url(${ellipse})`,
            maskImage: `url(${ellipse})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
          initial={{ opacity: ellipseOpacityKeyframes[0] }}
          animate={{ opacity: ellipseOpacityKeyframes }}
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
