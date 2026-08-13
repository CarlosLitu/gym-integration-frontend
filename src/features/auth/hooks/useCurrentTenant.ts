import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { storage } from '@/services/storage'
import { getTenantRequest } from '../../tenants/api/get-tenant'
import { useSelectedTenant } from '../../tenants/hooks/useSelectedTenant'
import type { UserSession } from '../types/auth.types'
import type { ApiTenant, TenantPaymentSummary, TenantStatus } from '../../tenants/types/tenant.types'

export type { TenantStatus }

const AUTH_CHANGED_EVENT = 'auth-changed'

function subscribeSession(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(AUTH_CHANGED_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(AUTH_CHANGED_EVENT, callback)
  }
}

function getSessionSnapshot() {
  return storage.getUserRaw()
}

export interface CurrentTenant {
  name: string | null
  status: TenantStatus
  lastEvent: string | null
  payment: TenantPaymentSummary | null
}

function getSessionTenant(selectedTenantId: string | null) {
  const sessionUser = storage.getUser<UserSession>()
  const sessionTenant = sessionUser?.tenant ?? null

  if (!sessionTenant) {
    return null
  }

  if (selectedTenantId && sessionTenant.id !== selectedTenantId) {
    return null
  }

  return sessionTenant
}

function pickCurrentPayment(
  remotePayment: TenantPaymentSummary | null | undefined,
  sessionPayment: TenantPaymentSummary | null | undefined,
) {
  if (!remotePayment) {
    return sessionPayment ?? null
  }

  if (!sessionPayment) {
    return remotePayment
  }

  const remoteUpdatedAt = remotePayment.updatedAt ? new Date(remotePayment.updatedAt).getTime() : Number.NaN
  const sessionUpdatedAt = sessionPayment.updatedAt ? new Date(sessionPayment.updatedAt).getTime() : Number.NaN

  if (!Number.isNaN(sessionUpdatedAt) && (Number.isNaN(remoteUpdatedAt) || sessionUpdatedAt >= remoteUpdatedAt)) {
    return sessionPayment
  }

  return remotePayment
}

export function useCurrentTenant(): CurrentTenant {
  const { selectedTenant, selectedTenantId } = useSelectedTenant()
  const [remoteTenant, setRemoteTenant] = useState<ApiTenant | null>(null)
  const sessionUserRaw = useSyncExternalStore(subscribeSession, getSessionSnapshot, () => null)
  const sessionTenant = useMemo(() => getSessionTenant(selectedTenantId), [selectedTenantId, sessionUserRaw])
  const activeRemoteTenant =
    remoteTenant && (!selectedTenantId || remoteTenant._id === selectedTenantId) ? remoteTenant : null
  const status = activeRemoteTenant?.status ?? selectedTenant?.status ?? sessionTenant?.status ?? 'INTEGRATION_PENDING'
  const payment = pickCurrentPayment(activeRemoteTenant?.payment, sessionTenant?.payment)
  const name = activeRemoteTenant?.name ?? selectedTenant?.name ?? sessionTenant?.name ?? null
  const lastEvent =
    activeRemoteTenant?.lastEventReceived ??
    selectedTenant?.lastEventReceived ??
    sessionTenant?.lastEventReceived ??
    null

  useEffect(() => {
    if (!selectedTenantId) return

    let isMounted = true

    getTenantRequest(selectedTenantId)
      .then((tenant) => {
        if (isMounted) {
          setRemoteTenant(tenant)
        }
      })
      .catch(() => {
        // Best-effort: mantem o status do tenant selecionado se a busca falhar.
      })

    return () => {
      isMounted = false
    }
  }, [selectedTenantId])

  return {
    name,
    status,
    lastEvent,
    payment,
  }
}
