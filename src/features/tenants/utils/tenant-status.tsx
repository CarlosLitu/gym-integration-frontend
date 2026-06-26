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
    dotClass: 'text-amber-500',
  },
  INVALID_CREDENTIALS: {
    labelKey: 'tenants.statusLabels.INVALID_CREDENTIALS',
    badgeVariant: 'invalid',
    icon: XCircle,
    iconWeight: 'regular',
    dotClass: 'text-pulse-error-border',
  },
  INTEGRATION_PENDING: {
    labelKey: 'tenants.statusLabels.INTEGRATION_PENDING',
    badgeVariant: 'pending',
    icon: UserCircleDashed,
    iconWeight: 'regular',
    dotClass: 'text-slate-400',
  },
}

export const TENANT_SYNC_DOT_CLASS: Record<TenantSyncStatus, string> = {
  ON: 'bg-pulse-teal',
  OFF: 'bg-slate-300',
  ERROR: 'bg-pulse-error-border',
}
