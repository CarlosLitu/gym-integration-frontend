import { useEffect, useState } from 'react'
import { getTenantRequest } from '../../tenants/api/get-tenant'
import { useSelectedTenant } from '../../tenants/hooks/useSelectedTenant'
import type { TenantStatus } from '../../tenants/types/tenant.types'

export type { TenantStatus }

export interface CurrentTenant {
  name: string | null
  status: TenantStatus
  lastEvent: string | null
}

export function useCurrentTenant(): CurrentTenant {
  const { selectedTenant, selectedTenantId } = useSelectedTenant()

  const [status, setStatus] = useState<TenantStatus>(
    selectedTenant?.status ?? 'INTEGRATION_PENDING',
  )

  useEffect(() => {
    if (selectedTenant) {
      setStatus(selectedTenant.status)
    }
  }, [selectedTenant])

  useEffect(() => {
    if (!selectedTenantId) return

    let isMounted = true

    getTenantRequest(selectedTenantId)
      .then((tenant) => {
        if (isMounted) setStatus(tenant.status ?? 'INTEGRATION_PENDING')
      })
      .catch(() => {
        // Best-effort: mantem o status do tenant selecionado se a busca falhar.
      })

    return () => {
      isMounted = false
    }
  }, [selectedTenantId])

  return {
    name: selectedTenant?.name ?? null,
    status,
    lastEvent: selectedTenant?.lastEventReceived ?? null,
  }
}
