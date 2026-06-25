import { useAuth } from './useAuth'

export type TenantStatus = 'unknown' | 'connected'

export interface CurrentTenant {
  name: string | null
  status: TenantStatus
  lastEvent: string | null
}

export function useCurrentTenant(): CurrentTenant {
  const { user } = useAuth()

  return {
    name: user?.tenant?.name ?? null,
    status: 'unknown',
    lastEvent: user?.tenant?.updatedAt ?? null,
  }
}
