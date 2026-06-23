import { Button, Input } from '@/components'
import { AUTH_MESSAGES } from '../constants/auth-messages'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginForm() {
  const { credentials, fieldErrors, formError, isLoading, handleChange, handleSubmit } =
    useLoginForm()

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <Input
        label={AUTH_MESSAGES.emailLabel}
        type="email"
        name="email"
        autoComplete="email"
        value={credentials.email}
        error={fieldErrors.email}
        onChange={(event) => handleChange('email', event.target.value)}
      />

      <Input
        label={AUTH_MESSAGES.passwordLabel}
        type="password"
        name="password"
        autoComplete="current-password"
        value={credentials.password}
        error={fieldErrors.password}
        onChange={(event) => handleChange('password', event.target.value)}
      />

      {formError ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Entrando...' : AUTH_MESSAGES.submitLabel}
      </Button>
    </form>
  )
}
