import { useTranslation } from 'react-i18next'
import hexConnected from '@/assets/images/hex-connected.svg'
import { StatusBadge } from '@/components'
import { formatTimeAgo } from '@/utils/formatters'
import type { TenantListItem as TenantListItemType } from '../types/tenant.types'

interface TenantListItemProps {
  tenant: TenantListItemType
}

export function TenantListItem({ tenant }: TenantListItemProps) {
  const { t, i18n } = useTranslation()

  const subtitle = tenant.updatedAt
    ? t('tenant.lastEvent', { time: formatTimeAgo(tenant.updatedAt, i18n.language) })
    : null

  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <img src={hexConnected} alt="" className="h-8 w-8 shrink-0" />
      <div className="flex min-w-0 flex-col">
        <p className="truncate font-sans text-sm font-semibold text-pulse-navy">
          {tenant.name}
        </p>
        {subtitle ? (
          <p className="truncate font-sans text-xs text-pulse-muted">{subtitle}</p>
        ) : null}
      </div>
      <StatusBadge status="unknown" className="ml-auto shrink-0">
        {t('status.unknown')}
      </StatusBadge>
    </div>
  )
}
