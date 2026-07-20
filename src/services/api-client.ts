import axios from 'axios'
import { env } from '@/config/env'
import { storage } from '@/services/storage'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = storage.getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const PUBLIC_AUTH_PATHS = [
  '/api/auth/login',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
] as const

function isPublicAuthRequest(url = '') {
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path))
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url ?? '')

      if (!isPublicAuthRequest(requestUrl)) {
        const hadSession = Boolean(storage.getToken())
        storage.clearSession()
        window.dispatchEvent(new Event('auth-changed'))

        if (hadSession && !window.location.pathname.startsWith('/login')) {
          window.location.assign('/login')
        }
      }
    }

    return Promise.reject(error)
  },
)
