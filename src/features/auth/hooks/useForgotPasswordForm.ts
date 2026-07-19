import { useCallback, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { forgotPasswordRequest } from '../api/forgot-password'
import { useApiMessage } from '@/hooks/useApiMessage'
import { isNotEmpty, isValidEmail } from '@/utils/validators'

interface ForgotPasswordFormErrors {
  email?: string
}

export function useForgotPasswordForm() {
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()

  const [email, setEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validate = useCallback((): boolean => {
    const errors: ForgotPasswordFormErrors = {}

    if (!isNotEmpty(email)) {
      errors.email = t('auth.requiredField')
    } else if (!isValidEmail(email)) {
      errors.email = t('auth.invalidEmail')
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [email, t])

  const handleChange = useCallback((value: string) => {
    setEmail(value)
    setFieldErrors((current) => ({ ...current, email: undefined }))
    setFormError(null)
  }, [])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!validate()) return

      setIsLoading(true)
      setFormError(null)

      try {
        await forgotPasswordRequest({ email: email.trim() })
        setIsSuccess(true)
      } catch (error) {
        setFormError(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    },
    [email, getErrorMessage, validate],
  )

  const canSubmit = isNotEmpty(email)

  return {
    email,
    fieldErrors,
    formError,
    isSuccess,
    isLoading,
    canSubmit,
    handleChange,
    handleSubmit,
  }
}
