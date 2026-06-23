import { AuthLayout } from '@/layouts'
import { LoginDecorations } from '../components/LoginDecorations'
import { LoginForm } from '../components/LoginForm'
import { LoginHeader } from '../components/LoginHeader'

export function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-pulse-surface">
      <LoginDecorations />
      <AuthLayout>
        <LoginHeader />
        <LoginForm />
      </AuthLayout>
    </div>
  )
}
