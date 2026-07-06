import { useCallback, useMemo, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { createUserRequest } from '../api/create-user'
import { updateUserRequest } from '../api/update-user'
import type { UserFormValues, UserListItem } from '../types/user.types'

const EMPTY_VALUES: UserFormValues = {
  name: '',
  email: '',
  password: '',
  role: 'USER',
}

export type UserFormMode = 'create' | 'edit'

export function useUserForm(tenantId: string | null) {
  const { getErrorMessage } = useApiMessage()
  const [values, setValues] = useState<UserFormValues>(EMPTY_VALUES)
  const [mode, setMode] = useState<UserFormMode>('create')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setField = useCallback((field: keyof UserFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setValues(EMPTY_VALUES)
    setMode('create')
    setEditingUserId(null)
    setError(null)
    setIsLoading(false)
  }, [])

  const openCreate = useCallback(() => {
    setValues(EMPTY_VALUES)
    setMode('create')
    setEditingUserId(null)
    setError(null)
  }, [])

  const openEdit = useCallback((user: UserListItem) => {
    setValues({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    })
    setMode('edit')
    setEditingUserId(user.id)
    setError(null)
  }, [])

  const isValid = useMemo(() => {
    const hasBaseFields =
      values.name.trim().length > 0 && values.email.trim().length > 0

    if (mode === 'create') {
      return hasBaseFields && values.password.trim().length > 0
    }

    return hasBaseFields
  }, [mode, values.name, values.email, values.password])

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
    openCreate,
    openEdit,
    submit,
    reset,
  }
}
