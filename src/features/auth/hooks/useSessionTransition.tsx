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
  startLoading: (run: () => Promise<void>) => void
  beginRouteLoading: () => void
  endRouteLoading: () => void
}

const SessionTransitionContext = createContext<SessionTransitionContextValue | null>(null)

const FADE_OUT_MS = 250

function scheduleFadeOut(setPhase: (phase: TransitionPhase) => void) {
  setPhase('out')
  setTimeout(() => setPhase(null), FADE_OUT_MS)
}

export function SessionTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<TransitionPhase>(null)
  const [messageKey, setMessageKey] = useState('auth.loggingOut')
  const isBusy = useRef(false)
  const routeLoadingDepth = useRef(0)

  const beginRouteLoading = useCallback(() => {
    if (isBusy.current) {
      return
    }

    routeLoadingDepth.current += 1

    if (routeLoadingDepth.current === 1) {
      setMessageKey('auth.loading')
      setPhase('in')
    }
  }, [])

  const endRouteLoading = useCallback(() => {
    if (isBusy.current) {
      return
    }

    routeLoadingDepth.current = Math.max(0, routeLoadingDepth.current - 1)

    if (routeLoadingDepth.current === 0) {
      scheduleFadeOut(setPhase)
    }
  }, [])

  const runTransition = useCallback(
    async (key: string, run: () => Promise<void>) => {
      if (isBusy.current) return
      isBusy.current = true
      routeLoadingDepth.current = 0

      setMessageKey(key)
      setPhase('in')

      try {
        await run()
        scheduleFadeOut(setPhase)
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
      await import('@/features/auth')
      navigate('/login', { replace: true })
    })
  }, [navigate, runTransition])

  const startLogin = useCallback(
    (run: () => Promise<void>) => {
      void runTransition('auth.loggingIn', run)
    },
    [runTransition],
  )

  const startLoading = useCallback(
    (run: () => Promise<void>) => {
      void runTransition('auth.loading', run)
    },
    [runTransition],
  )

  return (
    <SessionTransitionContext.Provider
      value={{
        phase,
        messageKey,
        startLogout,
        startLogin,
        startLoading,
        beginRouteLoading,
        endRouteLoading,
      }}
    >
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
