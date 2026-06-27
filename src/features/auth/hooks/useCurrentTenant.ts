import { useEffect, useState } from 'react'
import { getTenantRequest } from '../../tenants/api/get-tenant'
import type { TenantStatus } from '../../tenants/types/tenant.types'
import { useAuth } from './useAuth'

export type { TenantStatus }

export interface CurrentTenant {
  name: string | null
  status: TenantStatus
  lastEvent: string | null
}

export function useCurrentTenant(): CurrentTenant {
  const { user } = useAuth()
  const tenantId = user?.tenant?.id ?? null

  const [status, setStatus] = useState<TenantStatus>(
    user?.tenant?.status ?? 'INTEGRATION_PENDING',
  )

  useEffect(() => {
    if (!tenantId) return

    let isMounted = true

    getTenantRequest(tenantId)
      .then((tenant) => {
        if (isMounted) setStatus(tenant.status ?? 'INTEGRATION_PENDING')
      })
      .catch(() => {
        // Best-effort: mantem o status da sessao se a busca falhar.
      })

    return () => {
      isMounted = false
    }
  }, [tenantId])

  return {
    name: user?.tenant?.name ?? null,
    status,
    lastEvent: user?.tenant?.lastEventReceived ?? null,
  }
}
