import logo from '@/assets/images/logo.svg'
import { AUTH_MESSAGES } from '../constants/auth-messages'

export function LoginHeader() {
  return (
    <header className="flex flex-col gap-4">
      <img src={logo} alt="Pulse" className="h-[52px] w-[182px]" />

      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-[44px] font-medium leading-none text-pulse-navy">
          {AUTH_MESSAGES.loginTitle}
        </h1>
        <p className="max-w-[404px] font-sans text-[15px] leading-normal text-pulse-muted">
          {AUTH_MESSAGES.loginSubtitle}
        </p>
      </div>
    </header>
  )
}
