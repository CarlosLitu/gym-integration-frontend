import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { resetPasswordRequest } from '../api/reset-password'
import { areAllPasswordRequirementsMet } from '@/features/users/utils/password-requirements'
import { useApiMessage } from '@/hooks/useApiMessage'

interface ResetPasswordFields {
  password: string
  confirmPassword: string
}

interface ResetPasswordFormErrors {
  confirmPassword?: string
}

export function useResetPasswordForm(token: string | null) {
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()

  const [fields, setFields] = useState<ResetPasswordFields>({
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = useCallback(
    (field: keyof ResetPasswordFields, value: string) => {
      setFields((current) => {
        const next = { ...current, [field]: value }

        if (field === 'password' || field === 'confirmPassword') {
          const password = field === 'password' ? value : next.password
          const confirmPassword = field === 'confirmPassword' ? value : next.confirmPassword

          if (confirmPassword.length > 0 && password !== confirmPassword) {
            setFieldErrors({ confirmPassword: t('users.form.errors.passwordMismatch') })
          } else {
            setFieldErrors({})
          }
        }

        return next
      })
      setFormError(null)
    },
    [t],
  )

  const canSubmit = useMemo(() => {
    return (
      Boolean(token) &&
      areAllPasswordRequirementsMet(fields.password) &&
      fields.confirmPassword.length > 0 &&
      fields.password === fields.confirmPassword
    )
  }, [fields.confirmPassword, fields.password, token])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!token || !canSubmit) return

      setIsLoading(true)
      setFormError(null)

      try {
        await resetPasswordRequest({ token, password: fields.password })
        setIsSuccess(true)
      } catch (error) {
        setFormError(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    },
    [canSubmit, fields.password, getErrorMessage, token],
  )

  return {
    fields,
    fieldErrors,
    formError,
    isSuccess,
    isLoading,
    canSubmit,
    handleChange,
    handleSubmit,
  }
}
