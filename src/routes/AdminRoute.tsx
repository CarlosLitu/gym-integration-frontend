import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { useIsAdmin } from '@/features/auth/hooks/useIsAdmin'

export function AdminRoute() {
  const { isAuthenticated } = useAuth()
  const isAdmin = useIsAdmin()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
