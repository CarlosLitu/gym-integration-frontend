import { Link } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import logo from '@/assets/images/logo.svg'

interface AuthPageHeaderProps {
  subtitle: string
  backTo: string
  backLabel: string
}

export function AuthPageHeader({ subtitle, backTo, backLabel }: AuthPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <Link
        to={backTo}
        className="inline-flex w-fit items-center gap-1 font-sans text-sm text-pulse-navy transition-colors hover:text-pulse-blue"
      >
        <CaretLeft size={16} weight="bold" aria-hidden="true" />
        {backLabel}
      </Link>

      <img src={logo} alt="Pulse" className="h-[52px] w-[182px]" />

      <p className="max-w-[404px] font-sans text-[15px] leading-normal text-pulse-muted">
        {subtitle}
      </p>
    </header>
  )
}
