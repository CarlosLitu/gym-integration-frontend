import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApiMessage } from '@/hooks/useApiMessage'
import { createTenantRequest } from '../api/create-tenant'
import { testConnectionRequest } from '../api/test-connection'
import type { CreateTenantPayload, TenantFormValues } from '../types/tenant.types'

const DEFAULT_GATEWAY = 'EVO'

export type TestConnectionStatus = 'idle' | 'success' | 'error'

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
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()
  const [values, setValues] = useState<TenantFormValues>(EMPTY_VALUES)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [testStatus, setTestStatus] = useState<TestConnectionStatus>('idle')
  const [testMessage, setTestMessage] = useState<string | null>(null)

  const resetTestState = useCallback(() => {
    setTestStatus('idle')
    setTestMessage(null)
  }, [])

  const setField = useCallback(
    (field: keyof TenantFormValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }))
      setError(null)
      resetTestState()
    },
    [resetTestState],
  )

  const reset = useCallback(() => {
    setValues(EMPTY_VALUES)
    setError(null)
    setIsLoading(false)
    setIsTesting(false)
    resetTestState()
  }, [resetTestState])

  const isValid = useMemo(
    () =>
      values.name.trim().length > 0 &&
      values.apiKey.trim().length > 0 &&
      values.apiSecret.trim().length > 0,
    [values.name, values.apiKey, values.apiSecret],
  )

  const canTest = useMemo(
    () => values.apiKey.trim().length > 0 && values.apiSecret.trim().length > 0,
    [values.apiKey, values.apiSecret],
  )

  const testConnection = useCallback(async () => {
    if (!canTest) {
      return
    }

    setIsTesting(true)
    setTestMessage(null)

    try {
      const result = await testConnectionRequest(values.apiKey.trim(), values.apiSecret.trim())

      if (result.status === true) {
        setTestStatus('success')
        setTestMessage(t('tenants.create.testSuccess'))
      } else {
        setTestStatus('error')
        setTestMessage(t('tenants.create.testError'))
      }
    } catch (testError) {
      setTestStatus('error')
      setTestMessage(getErrorMessage(testError))
    } finally {
      setIsTesting(false)
    }
  }, [canTest, values.apiKey, values.apiSecret, getErrorMessage, t])

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

  return {
    values,
    setField,
    reset,
    isValid,
    isLoading,
    error,
    submit,
    canTest,
    isTesting,
    testStatus,
    testMessage,
    testConnection,
  }
}
