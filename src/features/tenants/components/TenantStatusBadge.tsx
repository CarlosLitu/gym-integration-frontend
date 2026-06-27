import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components'
import type { TenantStatus } from '../types/tenant.types'
import { TENANT_STATUS_CONFIG } from '../utils/tenant-status'

interface TenantStatusBadgeProps {
  status: TenantStatus
}

export function TenantStatusBadge({ status }: TenantStatusBadgeProps) {
  const { t } = useTranslation()
  const { badgeVariant, icon: Icon, iconWeight, labelKey } =
    TENANT_STATUS_CONFIG[status]

  return (
    <StatusBadge
      status={badgeVariant}
      className="rounded-[999px]"
      icon={<Icon size={14} weight={iconWeight} />}
    >
      {t(labelKey)}
    </StatusBadge>
  )
}
