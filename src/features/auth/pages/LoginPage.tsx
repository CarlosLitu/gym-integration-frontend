import { AuthLayout } from '@/layouts'
import { AUTH_MESSAGES } from '../constants/auth-messages'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <AuthLayout title={AUTH_MESSAGES.loginTitle} subtitle={AUTH_MESSAGES.loginSubtitle}>
      <LoginForm />
    </AuthLayout>
  )
}
