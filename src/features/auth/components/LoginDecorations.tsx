import patternNodes from '@/assets/images/pulse-pattern-nodes 1.svg'
import illustration from '@/assets/images/illustration.svg'

const FIGMA_FRAME = {
  width: 1440,
  height: 900,
} as const

const ILLUSTRATION = {
  x: 720,
  y: 0,
  width: 720,
  height: 900,
} as const

function toPercent(value: number, base: number) {
  return `${(value / base) * 100}%`
}

export function LoginDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <img
        src={patternNodes}
        alt=""
        width={504}
        height={441}
        className="absolute left-0 top-0 max-w-none select-none"
      />

      <img
        src={illustration}
        alt=""
        className="fixed bottom-0 max-w-none select-none"
        style={{
          left: toPercent(ILLUSTRATION.x, FIGMA_FRAME.width),
          width: toPercent(ILLUSTRATION.width, FIGMA_FRAME.width),
          height: toPercent(ILLUSTRATION.height, FIGMA_FRAME.height),
        }}
      />
    </div>
  )
}
