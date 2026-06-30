import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSessionTransition } from '../hooks/useSessionTransition'

export function RouteLoadingListener() {
  const location = useLocation()
  const { beginRouteLoading, endRouteLoading } = useSessionTransition()
  const isFirstRender = useRef(true)
  const previousPath = useRef(location.pathname)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      previousPath.current = location.pathname
      return
    }

    if (previousPath.current === location.pathname) {
      return
    }

    previousPath.current = location.pathname

    if (location.pathname === '/login') {
      return
    }

    beginRouteLoading()

    let cancelled = false

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) {
          endRouteLoading()
        }
      })
    })

    return () => {
      cancelled = true
    }
  }, [location.pathname, beginRouteLoading, endRouteLoading])

  return null
}
