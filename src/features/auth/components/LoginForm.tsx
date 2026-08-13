import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Input } from '@/components'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginForm() {
  const { t } = useTranslation()
  const {
    credentials,
    fieldErrors,
    formError,
    isLoading,
    canSubmit,
    handleChange,
    handleSubmit,
  } = useLoginForm()

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <Input
        label={t('auth.emailLabel')}
        type="email"
        name="email"
        autoComplete="email"
        placeholder={t('auth.emailPlaceholder')}
        value={credentials.email}
        error={fieldErrors.email}
        onChange={(event) => handleChange('email', event.target.value)}
      />

      <Input
        label={t('auth.passwordLabel')}
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder={t('auth.passwordPlaceholder')}
        value={credentials.password}
        error={fieldErrors.password}
        onChange={(event) => handleChange('password', event.target.value)}
      />

      {formError ? <Alert>{formError}</Alert> : null}

      <Link
        to="/forgot-password"
        className="w-fit font-sans text-[13px] font-medium text-pulse-blue hover:underline"
      >
        {t('auth.forgotPassword')}
      </Link>

      <div className="relative z-20">
        <span
          className="pointer-events-none absolute inset-0 rounded-pill bg-pulse-surface"
          aria-hidden="true"
        />
        <Button
          type="submit"
          variant={canSubmit ? 'active' : 'idle'}
          size="lg"
          className="relative w-full"
          disabled={isLoading || !canSubmit}
        >
          {isLoading ? t('auth.submittingLabel') : t('auth.submitLabel')}
        </Button>
      </div>
    </form>
  )
}
