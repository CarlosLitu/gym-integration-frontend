import { useEffect } from 'react'
import { useSessionTransition } from '../hooks/useSessionTransition'

export function RouteLoadingFallback() {
  const { beginRouteLoading, endRouteLoading } = useSessionTransition()

  useEffect(() => {
    beginRouteLoading()
    return endRouteLoading
  }, [beginRouteLoading, endRouteLoading])

  return null
}
