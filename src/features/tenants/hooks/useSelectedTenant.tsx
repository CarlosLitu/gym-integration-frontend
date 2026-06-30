import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { storage } from '@/services/storage'
import type { UserSession } from '@/features/auth/types/auth.types'
import type { SelectedTenant, TenantListItem } from '../types/tenant.types'

const SELECTED_TENANT_CHANGED_EVENT = 'selected-tenant-changed'
const AUTH_CHANGED_EVENT = 'auth-changed'

function subscribe(callback: () => void) {
  window.addEventListener(SELECTED_TENANT_CHANGED_EVENT, callback)
  window.addEventListener(AUTH_CHANGED_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(SELECTED_TENANT_CHANGED_EVENT, callback)
    window.removeEventListener(AUTH_CHANGED_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

function getSnapshot(): string | null {
  return storage.getSelectedTenant<SelectedTenant>()?.id ?? null
}

function notifySelectedTenantChanged() {
  window.dispatchEvent(new Event(SELECTED_TENANT_CHANGED_EVENT))
}

export function tenantListItemToSelected(tenant: TenantListItem): SelectedTenant {
  return {
    id: tenant.id,
    name: tenant.name,
    status: tenant.status,
    lastEventReceived: tenant.lastEventReceived,
  }
}

export function userSessionTenantToSelected(user: UserSession): SelectedTenant {
  return {
    id: user.tenant.id,
    name: user.tenant.name,
    status: user.tenant.status,
    lastEventReceived: user.tenant.lastEventReceived,
  }
}

interface SelectedTenantContextValue {
  selectedTenant: SelectedTenant | null
  selectedTenantId: string | null
  selectTenant: (tenant: SelectedTenant) => void
}

const SelectedTenantContext = createContext<SelectedTenantContextValue | null>(null)

function readSelectedTenant(): SelectedTenant | null {
  return storage.getSelectedTenant<SelectedTenant>()
}

function syncSelectedTenantWithSession() {
  const user = storage.getUser<UserSession>()
  if (!user) {
    storage.clearSelectedTenant()
    return
  }

  const saved = readSelectedTenant()
  if (!saved) {
    storage.setSelectedTenant(userSessionTenantToSelected(user))
  }
}

export function SelectedTenantProvider({ children }: { children: ReactNode }) {
  const selectedTenantId = useSyncExternalStore(subscribe, getSnapshot, () => null)
  const selectedTenant = useMemo(() => readSelectedTenant(), [selectedTenantId])

  useEffect(() => {
    syncSelectedTenantWithSession()
    notifySelectedTenantChanged()
  }, [])

  const selectTenant = useCallback((tenant: SelectedTenant) => {
    storage.setSelectedTenant(tenant)
    notifySelectedTenantChanged()
  }, [])

  const value = useMemo(
    () => ({
      selectedTenant,
      selectedTenantId: selectedTenant?.id ?? null,
      selectTenant,
    }),
    [selectedTenant, selectTenant],
  )

  return (
    <SelectedTenantContext.Provider value={value}>{children}</SelectedTenantContext.Provider>
  )
}

export function useSelectedTenant(): SelectedTenantContextValue {
  const context = useContext(SelectedTenantContext)

  if (!context) {
    throw new Error('useSelectedTenant must be used within a SelectedTenantProvider')
  }

  return context
}

export function resetSelectedTenantFromSession(user: UserSession) {
  storage.setSelectedTenant(userSessionTenantToSelected(user))
  notifySelectedTenantChanged()
}
