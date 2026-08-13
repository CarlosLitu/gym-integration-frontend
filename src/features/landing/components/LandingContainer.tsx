import type { ReactNode } from 'react'
import { clsx } from 'clsx'

type LandingContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'header' | 'footer'
}

/** Shell horizontal compartilhado: max 1440 + padding fluido */
export function LandingContainer({
  children,
  className,
  as: Tag = 'div',
}: LandingContainerProps) {
  return (
    <Tag
      className={clsx(
        'mx-auto w-full max-w-[1440px] px-5 sm:px-10 lg:px-20',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
