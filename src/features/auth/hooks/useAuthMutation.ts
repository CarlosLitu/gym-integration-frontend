import { useCallback, useState } from 'react'
import { loginRequest } from '../api/login'
import { useApiMessage } from '@/hooks/useApiMessage'
import { storage } from '@/services/storage'
import type { ApiUser, LoginCredentials, UserSession } from '../types/auth.types'

function toUserSession(user: ApiUser): UserSession {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenant: {
      id: user.tenantId._id,
      name: user.tenantId.name,
      updatedAt: user.tenantId.updatedAt ?? null,
    },
  }
}

export function useAuthMutation() {
  const { getErrorMessage } = useApiMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginRequest(credentials)
      storage.setToken(response.token)
      storage.setUser(toUserSession(response.user))
      window.dispatchEvent(new Event('auth-changed'))
      return response
    } catch (loginError) {
      setError(getErrorMessage(loginError))
      throw new Error('login_failed')
    } finally {
      setIsLoading(false)
    }
  }, [getErrorMessage])

  const logout = useCallback(() => {
    storage.clearSession()
    window.dispatchEvent(new Event('auth-changed'))
  }, [])

  return { login, logout, isLoading, error }
}
