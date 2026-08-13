import type { TenantStatus } from '../types/tenant.types'
import { TENANT_STATUS_CONFIG } from '../utils/tenant-status'

interface TenantStatusHexagonProps {
  status: TenantStatus
  className?: string
}

export function TenantStatusHexagon({
  status,
  className = 'h-8 w-8',
}: TenantStatusHexagonProps) {
  const { dotClass } = TENANT_STATUS_CONFIG[status]

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${className} ${dotClass}`}
    >
      <path
        d="M32.8389 9.43262V26.5664L18 35.1338L3.16113 26.5664V9.43262L18 0.865234L32.8389 9.43262Z"
        stroke="#14213D"
        strokeWidth="1.5"
      />
      <circle cx="18" cy="18" r="6.48" fill="currentColor" />
    </svg>
  )
}
