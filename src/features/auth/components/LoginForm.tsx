import { Button, Input } from '@/components'
import { AUTH_MESSAGES } from '../constants/auth-messages'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginForm() {
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
        label={AUTH_MESSAGES.emailLabel}
        type="email"
        name="email"
        autoComplete="email"
        placeholder={AUTH_MESSAGES.emailPlaceholder}
        value={credentials.email}
        error={fieldErrors.email}
        onChange={(event) => handleChange('email', event.target.value)}
      />

      <Input
        label={AUTH_MESSAGES.passwordLabel}
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder={AUTH_MESSAGES.passwordPlaceholder}
        value={credentials.password}
        error={fieldErrors.password}
        onChange={(event) => handleChange('password', event.target.value)}
      />

      <a
        href="#"
        className="w-fit font-sans text-[13px] font-medium text-pulse-blue hover:underline"
        onClick={(event) => event.preventDefault()}
      >
        {AUTH_MESSAGES.forgotPassword}
      </a>

      {formError ? (
        <p className="rounded-input bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        variant={canSubmit ? 'primary' : 'idle'}
        size="lg"
        className="w-full rounded-pill"
        disabled={isLoading || !canSubmit}
      >
        {isLoading ? 'Entrando...' : AUTH_MESSAGES.submitLabel}
      </Button>
    </form>
  )
}
