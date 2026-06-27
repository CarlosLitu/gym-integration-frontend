import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '@/services/storage'
import { logoutRequest } from '../api/logout'

export type TransitionPhase = 'in' | 'out' | null

interface SessionTransitionContextValue {
  phase: TransitionPhase
  messageKey: string
  startLogout: () => void
  startLogin: (run: () => Promise<void>) => void
}

const SessionTransitionContext = createContext<SessionTransitionContextValue | null>(null)

const MIN_VISIBLE_MS = 800
const FADE_OUT_MS = 250

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function SessionTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<TransitionPhase>(null)
  const [messageKey, setMessageKey] = useState('auth.loggingOut')
  const isBusy = useRef(false)

  const runTransition = useCallback(
    async (key: string, run: () => Promise<void>) => {
      if (isBusy.current) return
      isBusy.current = true

      setMessageKey(key)
      setPhase('in')

      try {
        await Promise.all([run(), delay(MIN_VISIBLE_MS)])
        setPhase('out')
        setTimeout(() => setPhase(null), FADE_OUT_MS)
      } catch {
        // Falha (ex.: credenciais invalidas): esconde o overlay e mantem a tela atual.
        setPhase(null)
      } finally {
        isBusy.current = false
      }
    },
    [],
  )

  const startLogout = useCallback(() => {
    void runTransition('auth.loggingOut', async () => {
      await logoutRequest().catch(() => {})
      storage.clearSession()
      window.dispatchEvent(new Event('auth-changed'))
      navigate('/login', { replace: true })
    })
  }, [navigate, runTransition])

  const startLogin = useCallback(
    (run: () => Promise<void>) => {
      void runTransition('auth.loggingIn', run)
    },
    [runTransition],
  )

  return (
    <SessionTransitionContext.Provider value={{ phase, messageKey, startLogout, startLogin }}>
      {children}
    </SessionTransitionContext.Provider>
  )
}

export function useSessionTransition(): SessionTransitionContextValue {
  const context = useContext(SessionTransitionContext)

  if (!context) {
    throw new Error('useSessionTransition must be used within a SessionTransitionProvider')
  }

  return context
}
