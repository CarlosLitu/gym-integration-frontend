import { useCallback, useMemo, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { createTenantRequest } from '../api/create-tenant'
import type { CreateTenantPayload, TenantFormValues } from '../types/tenant.types'

const DEFAULT_GATEWAY = 'EVO'

const EMPTY_VALUES: TenantFormValues = {
  name: '',
  cnpj: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  token: '',
  apiKey: '',
  apiSecret: '',
}

export function useCreateTenant() {
  const { getErrorMessage } = useApiMessage()
  const [values, setValues] = useState<TenantFormValues>(EMPTY_VALUES)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setField = useCallback((field: keyof TenantFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setValues(EMPTY_VALUES)
    setError(null)
    setIsLoading(false)
  }, [])

  const isValid = useMemo(
    () =>
      values.name.trim().length > 0 &&
      values.apiKey.trim().length > 0 &&
      values.apiSecret.trim().length > 0,
    [values.name, values.apiKey, values.apiSecret],
  )

  const submit = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const payload: CreateTenantPayload = {
      name: values.name.trim(),
      apiKey: values.apiKey.trim(),
      apiSecret: values.apiSecret.trim(),
      gateway: DEFAULT_GATEWAY,
    }

    try {
      return await createTenantRequest(payload)
    } catch (createError) {
      setError(getErrorMessage(createError))
      throw new Error('create_tenant_failed')
    } finally {
      setIsLoading(false)
    }
  }, [values.name, values.apiKey, values.apiSecret, getErrorMessage])

  return { values, setField, reset, isValid, isLoading, error, submit }
}
