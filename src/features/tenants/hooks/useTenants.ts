import { useEffect, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listTenantsRequest } from '../api/list-tenants'
import type { TenantListItem } from '../types/tenant.types'

export function useTenants(enabled: boolean, reloadToken = 0) {
  const { getErrorMessage } = useApiMessage()
  const [tenants, setTenants] = useState<TenantListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let isMounted = true
    setIsLoading(true)
    setError(null)

    listTenantsRequest()
      .then((data) => {
        if (isMounted) setTenants(data)
      })
      .catch((requestError) => {
        if (isMounted) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [enabled, reloadToken, getErrorMessage])

  return { tenants, isLoading, error }
}
