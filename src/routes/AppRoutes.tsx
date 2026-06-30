import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  RouteLoadingFallback,
  RouteLoadingListener,
  SessionTransitionOverlay,
  SessionTransitionProvider,
} from '@/features/auth'
import { MainLayout } from '@/layouts'
import { ProtectedRoute } from './ProtectedRoute'

const LoginPage = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.LoginPage })),
)

const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((module) => ({ default: module.DashboardPage })),
)

export function AppRoutes() {
  return (
    <BrowserRouter>
      <SessionTransitionProvider>
        <RouteLoadingListener />
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
        <SessionTransitionOverlay />
      </SessionTransitionProvider>
    </BrowserRouter>
  )
}
