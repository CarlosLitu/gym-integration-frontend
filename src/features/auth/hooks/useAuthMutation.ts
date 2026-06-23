import { useCallback, useState } from 'react'
import { loginRequest } from '../api/login'
import { storage } from '@/services/storage'
import type { LoginCredentials } from '../types/auth.types'

export function useAuthMutation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginRequest(credentials)
      storage.setToken(response.token)
      storage.setUser(response.user)
      window.dispatchEvent(new Event('auth-changed'))
      return response
    } catch {
      setError('Não foi possível realizar o login. Tente novamente.')
      throw new Error('login_failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    storage.clearSession()
    window.dispatchEvent(new Event('auth-changed'))
  }, [])

  return { login, logout, isLoading, error }
}
