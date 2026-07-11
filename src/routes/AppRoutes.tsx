import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  RouteLoadingFallback,
  RouteLoadingListener,
  SessionTransitionOverlay,
  SessionTransitionProvider,
} from '@/features/auth'
import { SelectedTenantProvider } from '@/features/tenants'
import { MainLayout } from '@/layouts'
import { AdminRoute } from './AdminRoute'
import { ProtectedRoute } from './ProtectedRoute'

const LoginPage = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.LoginPage })),
)

const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((module) => ({ default: module.DashboardPage })),
)

const ChatPage = lazy(() =>
  import('@/features/chat').then((module) => ({ default: module.ChatPage })),
)

const UsersPage = lazy(() =>
  import('@/features/users').then((module) => ({ default: module.UsersPage })),
)

const LandingPage = lazy(() =>
  import('@/features/landing').then((module) => ({ default: module.LandingPage })),
)

export function AppRoutes() {
  return (
    <BrowserRouter>
      <SessionTransitionProvider>
        <SelectedTenantProvider>
          <RouteLoadingListener />
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/users" element={<UsersPage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <SessionTransitionOverlay />
        </SelectedTenantProvider>
      </SessionTransitionProvider>
    </BrowserRouter>
  )
}
