import { useCallback, useSyncExternalStore } from 'react'
import { storage } from '@/services/storage'
import type { UserSession } from '../types/auth.types'

const AUTH_CHANGED_EVENT = 'auth-changed'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(AUTH_CHANGED_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(AUTH_CHANGED_EVENT, callback)
  }
}

function getSnapshot() {
  return storage.getToken()
}

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot, () => null)
  const user = storage.getUser<UserSession>()

  const isAuthenticated = Boolean(token)

  const logout = useCallback(() => {
    storage.clearSession()
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
  }, [])

  return {
    user,
    token,
    isAuthenticated,
    logout,
  }
}
