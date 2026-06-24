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

      <a
        href="#"
        className="w-fit font-sans text-[13px] font-medium text-pulse-blue hover:underline"
        onClick={(event) => event.preventDefault()}
      >
        {t('auth.forgotPassword')}
      </a>

      <Button
        type="submit"
        variant={canSubmit ? 'active' : 'idle'}
        size="lg"
        className="w-full"
        disabled={isLoading || !canSubmit}
      >
        {isLoading ? t('auth.submittingLabel') : t('auth.submitLabel')}
      </Button>
    </form>
  )
}
