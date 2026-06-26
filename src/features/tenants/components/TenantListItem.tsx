import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components'
import { formatTimeAgo } from '@/utils/formatters'
import type { TenantListItem as TenantListItemType } from '../types/tenant.types'
import { TENANT_STATUS_CONFIG, TENANT_SYNC_DOT_CLASS } from '../utils/tenant-status'

interface TenantListItemProps {
  tenant: TenantListItemType
}

export function TenantListItem({ tenant }: TenantListItemProps) {
  const { t, i18n } = useTranslation()

  const subtitle = tenant.updatedAt
    ? t('tenant.lastEvent', { time: formatTimeAgo(tenant.updatedAt, i18n.language) })
    : null

  const statusConfig = TENANT_STATUS_CONFIG[tenant.status]
  const StatusIcon = statusConfig.icon

  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={`h-8 w-8 shrink-0 ${statusConfig.dotClass}`}
      >
        <path
          d="M32.8389 9.43262V26.5664L18 35.1338L3.16113 26.5664V9.43262L18 0.865234L32.8389 9.43262Z"
          stroke="#14213D"
          strokeWidth="1.5"
        />
        <circle cx="18" cy="18" r="6.48" fill="currentColor" />
      </svg>
      <div className="flex w-48 shrink-0 flex-col">
        <p
          title={tenant.name}
          className="truncate font-sans text-sm font-semibold text-pulse-navy"
        >
          {tenant.name}
        </p>
        {subtitle ? (
          <p className="truncate font-sans text-xs text-pulse-muted">{subtitle}</p>
        ) : null}
      </div>
      <div className="w-24 shrink-0">
        <span className="inline-flex items-center gap-1.5 rounded-[999px] border border-slate-200 bg-white px-3 py-1 font-sans text-xs font-medium text-[#505458]">
          <span
            className={`h-1.5 w-1.5 rounded-full ${TENANT_SYNC_DOT_CLASS[tenant.sync]}`}
          />
          {t('tenants.sync')}
        </span>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-3">
        <StatusBadge
          status={statusConfig.badgeVariant}
          className="rounded-[999px]"
          icon={<StatusIcon size={14} weight={statusConfig.iconWeight} />}
        >
          {t(statusConfig.labelKey)}
        </StatusBadge>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          {t('tenants.edit')}
        </button>
      </div>
    </div>
  )
}
