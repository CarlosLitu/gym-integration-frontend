import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Input } from '@/components'
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm'

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const {
    email,
    fieldErrors,
    formError,
    isSuccess,
    isLoading,
    canSubmit,
    handleChange,
    handleSubmit,
  } = useForgotPasswordForm()

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <p
          className="rounded-input bg-[#F1FAF4] px-3 py-2 font-sans text-sm text-[#24893E]"
          role="status"
        >
          {t('auth.forgotSuccess')}
        </p>

        <Link
          to="/login"
          className="inline-flex w-full items-center justify-center rounded-pill bg-[#007AFF] px-6 py-[13px] font-sans text-base font-semibold text-white transition-colors hover:bg-[#007AFF]/90"
        >
          {t('auth.goToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <Input
        label={t('auth.emailLabel')}
        type="email"
        name="email"
        autoComplete="email"
        placeholder={t('auth.emailPlaceholder')}
        value={email}
        error={fieldErrors.email}
        onChange={(event) => handleChange(event.target.value)}
      />

      {formError ? <Alert>{formError}</Alert> : null}

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
          {isLoading ? t('auth.forgotSubmittingLabel') : t('auth.forgotSubmitLabel')}
        </Button>
      </div>
    </form>
  )
}
