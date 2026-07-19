import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '@/layouts'
import { AuthPageHeader } from '../components/AuthPageHeader'
import { LoginDecorations } from '../components/LoginDecorations'
import { ResetPasswordForm } from '../components/ResetPasswordForm'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className="relative min-h-screen overflow-hidden bg-pulse-surface">
      <LoginDecorations />
      <AuthLayout>
        <AuthPageHeader
          subtitle={t('auth.resetSubtitle')}
          backTo="/login"
          backLabel={t('auth.backToLogin')}
        />
        <ResetPasswordForm token={token} />
      </AuthLayout>
    </div>
  )
}
