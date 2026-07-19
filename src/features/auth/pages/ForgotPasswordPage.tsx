import { useTranslation } from 'react-i18next'
import { AuthLayout } from '@/layouts'
import { AuthPageHeader } from '../components/AuthPageHeader'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import { LoginDecorations } from '../components/LoginDecorations'

export function ForgotPasswordPage() {
  const { t } = useTranslation()

  return (
    <div className="relative min-h-screen overflow-hidden bg-pulse-surface">
      <LoginDecorations />
      <AuthLayout>
        <AuthPageHeader
          subtitle={t('auth.forgotSubtitle')}
          backTo="/login"
          backLabel={t('auth.backToLogin')}
        />
        <ForgotPasswordForm />
      </AuthLayout>
    </div>
  )
}
