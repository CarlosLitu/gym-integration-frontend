import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Input } from '@/components'
import { PasswordRequirementsList } from '@/features/users/components/PasswordRequirementsList'
import { useResetPasswordForm } from '../hooks/useResetPasswordForm'

interface ResetPasswordFormProps {
  token: string | null
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useTranslation()
  const {
    fields,
    fieldErrors,
    formError,
    isSuccess,
    isLoading,
    canSubmit,
    handleChange,
    handleSubmit,
  } = useResetPasswordForm(token)

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <Alert>{t('auth.resetMissingToken')}</Alert>

        <Link
          to="/forgot-password"
          className="relative z-10 inline-flex w-full items-center justify-center rounded-pill bg-[#007AFF] px-6 py-[13px] font-sans text-base font-semibold text-white transition-colors hover:bg-[#007AFF]/90"
        >
          {t('auth.requestNewLink')}
        </Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <p
          className="rounded-input bg-[#F1FAF4] px-3 py-2 font-sans text-sm text-[#24893E]"
          role="status"
        >
          {t('auth.resetSuccess')}
        </p>

        <Link
          to="/login"
          className="relative z-10 inline-flex w-full items-center justify-center rounded-pill bg-[#007AFF] px-6 py-[13px] font-sans text-base font-semibold text-white transition-colors hover:bg-[#007AFF]/90"
        >
          {t('auth.goToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <form className="relative z-10 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <Input
        label={t('users.form.password')}
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder={t('users.form.placeholders.password')}
        value={fields.password}
        onChange={(event) => handleChange('password', event.target.value)}
        revealToggle
        revealLabel={t('users.form.reveal')}
        hideLabel={t('users.form.hide')}
        required
      />

      <Input
        label={t('users.form.confirmPassword')}
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder={t('users.form.placeholders.confirmPassword')}
        value={fields.confirmPassword}
        error={fieldErrors.confirmPassword}
        onChange={(event) => handleChange('confirmPassword', event.target.value)}
        revealToggle
        revealLabel={t('users.form.reveal')}
        hideLabel={t('users.form.hide')}
        required
      />

      <PasswordRequirementsList password={fields.password} />

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
          {isLoading ? t('auth.resetSubmittingLabel') : t('auth.resetSubmitLabel')}
        </Button>
      </div>
    </form>
  )
}
