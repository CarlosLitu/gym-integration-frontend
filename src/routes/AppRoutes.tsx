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

const ForgotPasswordPage = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.ForgotPasswordPage })),
)

const ResetPasswordPage = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.ResetPasswordPage })),
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

const CreateUserPage = lazy(() =>
  import('@/features/users').then((module) => ({ default: module.CreateUserPage })),
)

const EditUserPage = lazy(() =>
  import('@/features/users').then((module) => ({ default: module.EditUserPage })),
)

const PaymentPlansPage = lazy(() =>
  import('@/features/payments').then((module) => ({ default: module.PaymentPlansPage })),
)

const PaymentPlanCreatePage = lazy(() =>
  import('@/features/payments').then((module) => ({ default: module.PaymentPlanCreatePage })),
)

const PaymentPlanEditPage = lazy(() =>
  import('@/features/payments').then((module) => ({ default: module.PaymentPlanEditPage })),
)

const PaymentTransactionsPage = lazy(() =>
  import('@/features/payments').then((module) => ({ default: module.PaymentTransactionsPage })),
)

const UserPaymentPlansPage = lazy(() =>
  import('@/features/payments').then((module) => ({ default: module.UserPaymentPlansPage })),
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
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/plans" element={<UserPaymentPlansPage />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/users/new" element={<CreateUserPage />} />
                    <Route path="/users/:userId/edit" element={<EditUserPage />} />
                    <Route path="/payments/plans" element={<PaymentPlansPage />} />
                    <Route path="/payments/plans/new" element={<PaymentPlanCreatePage />} />
                    <Route path="/payments/plans/:id" element={<PaymentPlanEditPage />} />
                    <Route path="/payments/transactions" element={<PaymentTransactionsPage />} />
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
