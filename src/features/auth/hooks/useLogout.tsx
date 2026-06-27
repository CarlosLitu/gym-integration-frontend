import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '@/services/storage'
import { logoutRequest } from '../api/logout'

export type LogoutPhase = 'in' | 'out' | null

interface LogoutContextValue {
  phase: LogoutPhase
  startLogout: () => void
}

const LogoutContext = createContext<LogoutContextValue | null>(null)

const MIN_VISIBLE_MS = 800
const FADE_OUT_MS = 250

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function LogoutProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<LogoutPhase>(null)
  const isLoggingOut = useRef(false)

  const startLogout = useCallback(async () => {
    if (isLoggingOut.current) return
    isLoggingOut.current = true

    setPhase('in')

    await Promise.all([logoutRequest().catch(() => {}), delay(MIN_VISIBLE_MS)])

    storage.clearSession()
    window.dispatchEvent(new Event('auth-changed'))
    navigate('/login', { replace: true })

    setPhase('out')
    setTimeout(() => {
      setPhase(null)
      isLoggingOut.current = false
    }, FADE_OUT_MS)
  }, [navigate])

  return (
    <LogoutContext.Provider value={{ phase, startLogout }}>
      {children}
    </LogoutContext.Provider>
  )
}

export function useLogout(): LogoutContextValue {
  const context = useContext(LogoutContext)

  if (!context) {
    throw new Error('useLogout must be used within a LogoutProvider')
  }

  return context
}
