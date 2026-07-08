import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApiMessage } from '@/hooks/useApiMessage'
import { createUserRequest } from '../api/create-user'
import { updateUserRequest } from '../api/update-user'
import type { UserFormFieldErrors, UserFormValues, UserListItem } from '../types/user.types'
import { areAllPasswordRequirementsMet } from '../utils/password-requirements'

const EMPTY_VALUES: UserFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'USER',
}

export type UserFormMode = 'create' | 'edit'

export function useUserForm(tenantId: string | null) {
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()
  const [values, setValues] = useState<UserFormValues>(EMPTY_VALUES)
  const [mode, setMode] = useState<UserFormMode>('create')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<UserFormFieldErrors>({})

  const setField = useCallback(
    (field: keyof UserFormValues, value: string) => {
      setValues((current) => {
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
      setError(null)
    },
    [t],
  )

  const reset = useCallback(() => {
    setValues(EMPTY_VALUES)
    setMode('create')
    setEditingUserId(null)
    setError(null)
    setFieldErrors({})
    setIsLoading(false)
  }, [])

  const openCreate = useCallback(() => {
    setValues(EMPTY_VALUES)
    setMode('create')
    setEditingUserId(null)
    setError(null)
    setFieldErrors({})
  }, [])

  const openEdit = useCallback((user: UserListItem) => {
    setValues({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
    })
    setMode('edit')
    setEditingUserId(user.id)
    setError(null)
    setFieldErrors({})
  }, [])

  const isValid = useMemo(() => {
    const hasBaseFields =
      values.name.trim().length > 0 && values.email.trim().length > 0

    if (mode === 'create') {
      return (
        hasBaseFields &&
        areAllPasswordRequirementsMet(values.password) &&
        values.confirmPassword.length > 0 &&
        values.password === values.confirmPassword
      )
    }

    return hasBaseFields
  }, [mode, values.name, values.email, values.password, values.confirmPassword])

  const submit = useCallback(async () => {
    if (!tenantId || !isValid) return

    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'create') {
        await createUserRequest({
          tenantId,
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          role: values.role,
        })
      } else if (editingUserId) {
        await updateUserRequest(editingUserId, {
          name: values.name.trim(),
          email: values.email.trim(),
          role: values.role,
        })
      }

      reset()
    } catch (submitError) {
      setError(getErrorMessage(submitError))
      throw submitError
    } finally {
      setIsLoading(false)
    }
  }, [
    tenantId,
    isValid,
    mode,
    editingUserId,
    values,
    reset,
    getErrorMessage,
  ])

  return {
    values,
    setField,
    mode,
    isValid,
    isLoading,
    error,
    fieldErrors,
    openCreate,
    openEdit,
    submit,
    reset,
  }
}
