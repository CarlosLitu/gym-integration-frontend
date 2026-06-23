import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_MESSAGES } from '../constants/auth-messages'
import { useAuthMutation } from './useAuthMutation'
import { isValidEmail, isNotEmpty } from '@/utils/validators'
import type { LoginCredentials } from '../types/auth.types'

interface LoginFormErrors {
  email?: string
  password?: string
}

export function useLoginForm() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthMutation()

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })

  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({})

  const validate = useCallback((): boolean => {
    const errors: LoginFormErrors = {}

    if (!isNotEmpty(credentials.email)) {
      errors.email = AUTH_MESSAGES.requiredField
    } else if (!isValidEmail(credentials.email)) {
      errors.email = AUTH_MESSAGES.invalidEmail
    }

    if (!isNotEmpty(credentials.password)) {
      errors.password = AUTH_MESSAGES.requiredField
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [credentials])

  const handleChange = useCallback((field: keyof LoginCredentials, value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }, [])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!validate()) return

      try {
        await login(credentials)
        navigate('/dashboard')
      } catch {
      }
    },
    [credentials, login, navigate, validate],
  )

  const formError = useMemo(() => error, [error])

  const canSubmit =
    isNotEmpty(credentials.email) &&
    isValidEmail(credentials.email) &&
    isNotEmpty(credentials.password)

  return {
    credentials,
    fieldErrors,
    formError,
    isLoading,
    canSubmit,
    handleChange,
    handleSubmit,
  }
}
