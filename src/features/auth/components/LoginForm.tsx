import { Alert, Button, Input } from '@/components'
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

      {formError ? <Alert>{formError}</Alert> : null}

      <a
        href="#"
        className="w-fit font-sans text-[13px] font-medium text-pulse-blue hover:underline"
        onClick={(event) => event.preventDefault()}
      >
        {AUTH_MESSAGES.forgotPassword}
      </a>

      <Button
        type="submit"
        variant={canSubmit ? 'active' : 'idle'}
        size="lg"
        className="w-full"
        disabled={isLoading || !canSubmit}
      >
        {isLoading ? 'Entrando...' : AUTH_MESSAGES.submitLabel}
      </Button>
    </form>
  )
}
