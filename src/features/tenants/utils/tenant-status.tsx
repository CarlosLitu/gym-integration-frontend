import {
  PlugsConnected,
  UserCircleDashed,
  Warning,
  XCircle,
  type Icon,
  type IconWeight,
} from '@phosphor-icons/react'
import type { StatusBadgeProps } from '@/components'
import type { TenantStatus, TenantSyncStatus } from '../types/tenant.types'

type StatusBadgeVariant = NonNullable<StatusBadgeProps['status']>

export interface TenantStatusConfig {
  labelKey: string
  badgeVariant: StatusBadgeVariant
  icon: Icon
  iconWeight: IconWeight
  dotClass: string
}

export const TENANT_STATUS_CONFIG: Record<TenantStatus, TenantStatusConfig> = {
  CONNECTED: {
    labelKey: 'tenants.statusLabels.CONNECTED',
    badgeVariant: 'connected',
    icon: PlugsConnected,
    iconWeight: 'fill',
    dotClass: 'text-pulse-teal',
  },
  WAITING_EVENTS: {
    labelKey: 'tenants.statusLabels.WAITING_EVENTS',
    badgeVariant: 'waiting',
    icon: Warning,
    iconWeight: 'fill',
    dotClass: 'text-amber-600',
  },
  INVALID_CREDENTIALS: {
    labelKey: 'tenants.statusLabels.INVALID_CREDENTIALS',
    badgeVariant: 'invalid',
    icon: XCircle,
    iconWeight: 'regular',
    dotClass: 'text-[#C51A31]',
  },
  INTEGRATION_PENDING: {
    labelKey: 'tenants.statusLabels.INTEGRATION_PENDING',
    badgeVariant: 'pending',
    icon: UserCircleDashed,
    iconWeight: 'regular',
    dotClass: 'text-[#505458]',
  },
}

export interface TenantSyncConfig {
  dotClass: string
  ringClass: string
}

export const TENANT_SYNC_CONFIG: Record<TenantSyncStatus, TenantSyncConfig> = {
  ON: { dotClass: 'bg-[#24893E]', ringClass: 'bg-[#CAF2D4]' },
  OFF: { dotClass: 'bg-slate-300', ringClass: 'bg-slate-200/60' },
  ERROR: { dotClass: 'bg-[#C51A31]', ringClass: 'bg-[#FDF2F3]' },
}
