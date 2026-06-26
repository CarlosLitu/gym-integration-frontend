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
    <div className="flex items-center gap-3 px-4 py-4">
      <img src={hexConnected} alt="" className="h-8 w-8 shrink-0" />
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
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          {t('tenants.sync')}
        </span>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-3">
        <StatusBadge status="unknown" className="rounded-[999px]">
          {t('status.unknown')}
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
