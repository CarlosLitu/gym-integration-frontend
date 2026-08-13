import { useAuth } from './useAuth'

export function useIsAdmin(): boolean {
  const { user } = useAuth()
  return String(user?.role ?? '').toUpperCase() === 'ADMIN'
}
