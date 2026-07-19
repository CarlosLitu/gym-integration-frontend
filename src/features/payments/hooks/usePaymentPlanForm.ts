import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApiMessage } from '@/hooks/useApiMessage'
import { createPaymentPlanRequest, updatePaymentPlanRequest } from '../services/payment-service'
import type {
  PaymentPlan,
  PaymentPlanCreatePayload,
  PaymentPlanType,
  PaymentPlanUpdatePayload,
} from '../types/payment.types'

export interface PaymentPlanFormValues {
  name: string
  value: string
  currency: string
  durationDays: string
  maxBillingCycles: string
  type: PaymentPlanType | ''
  permissions: string
  allowMultiplePurchases: boolean
}

export interface PaymentPlanFormFieldErrors {
  name?: string
  value?: string
  currency?: string
  durationDays?: string
  maxBillingCycles?: string
  type?: string
}

const EMPTY_VALUES: PaymentPlanFormValues = {
  name: '',
  value: '',
  currency: 'BRL',
  durationDays: '30',
  maxBillingCycles: '',
  type: '',
  permissions: '',
  allowMultiplePurchases: true,
}

export type PaymentPlanFormMode = 'create' | 'edit'

interface UsePaymentPlanFormOptions {
  mode?: PaymentPlanFormMode
  initialPlan?: PaymentPlan | null
}

export function usePaymentPlanForm(options: UsePaymentPlanFormOptions = {}) {
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()
  const mode = options.mode ?? 'create'
  const initialPlan = options.initialPlan ?? null
  const [values, setValues] = useState<PaymentPlanFormValues>(EMPTY_VALUES)
  const [fieldErrors, setFieldErrors] = useState<PaymentPlanFormFieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const hasPayPalProvisioning = useMemo(
    () => Boolean(initialPlan?.paymentPlanIds?.paypal || initialPlan?.paymentProductIds?.paypal),
    [initialPlan],
  )
  const allowLegacyMissingMaxBillingCycles = useMemo(
    () =>
      mode === 'edit' &&
      hasPayPalProvisioning &&
      initialPlan?.type === 'SUBSCRIPTION' &&
      (initialPlan.maxBillingCycles === null || initialPlan.maxBillingCycles === undefined),
    [hasPayPalProvisioning, initialPlan, mode],
  )

  useEffect(() => {
    if (!initialPlan) {
      setValues(EMPTY_VALUES)
      return
    }

    setValues({
      name: initialPlan.name ?? '',
      value: String(initialPlan.value),
      currency: initialPlan.currency,
      durationDays: String(initialPlan.durationDays),
      maxBillingCycles:
        initialPlan.maxBillingCycles === null || initialPlan.maxBillingCycles === undefined
          ? ''
          : String(initialPlan.maxBillingCycles),
      type: initialPlan.type,
      permissions: Array.isArray(initialPlan.permissions) ? initialPlan.permissions.join(', ') : '',
      allowMultiplePurchases: initialPlan.allowMultiplePurchases,
    })
  }, [initialPlan])

  const setField = useCallback(
    <K extends keyof PaymentPlanFormValues>(field: K, value: PaymentPlanFormValues[K]) => {
      setValues((current) => {
        const next = { ...current, [field]: value }

        if (field === 'type' && value === 'SUBSCRIPTION') {
          next.durationDays = '30'
          next.maxBillingCycles = current.maxBillingCycles
          next.allowMultiplePurchases = true
        }

        if (field === 'type' && value === 'ONE_TIME') {
          next.maxBillingCycles = ''
        }

        return next
      })
      setError(null)
      setFieldErrors((current) => ({ ...current, [field]: undefined }))
    },
    [],
  )

  const validate = useCallback(() => {
    const nextErrors: PaymentPlanFormFieldErrors = {}

    if (values.name.trim().length === 0) {
      nextErrors.name = t('payments.plans.form.errors.name')
    }

    const valueNumber = Number(values.value)
    if (!Number.isFinite(valueNumber) || valueNumber <= 0) {
      nextErrors.value = t('payments.plans.form.errors.value')
    }

    if (values.currency.trim().length === 0) {
      nextErrors.currency = t('payments.plans.form.errors.currency')
    }

    const durationNumber = Number(values.durationDays)
    if (values.type === 'ONE_TIME' && (!Number.isInteger(durationNumber) || durationNumber < 1)) {
      nextErrors.durationDays = t('payments.plans.form.errors.durationDays')
    }

    const maxBillingCyclesNumber = Number(values.maxBillingCycles)
    if (
      values.type === 'SUBSCRIPTION' &&
      !allowLegacyMissingMaxBillingCycles &&
      (!Number.isInteger(maxBillingCyclesNumber) || maxBillingCyclesNumber < 1)
    ) {
      nextErrors.maxBillingCycles = t('payments.plans.form.errors.maxBillingCycles')
    }

    if (!values.type) {
      nextErrors.type = t('payments.plans.form.errors.type')
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [
    allowLegacyMissingMaxBillingCycles,
    t,
    values.currency,
    values.durationDays,
    values.maxBillingCycles,
    values.name,
    values.type,
    values.value,
  ])

  const isValid = useMemo(() => {
    const valueNumber = Number(values.value)
    const durationNumber = Number(values.durationDays)
    const maxBillingCyclesNumber = Number(values.maxBillingCycles)

    return (
      values.name.trim().length > 0 &&
      Number.isFinite(valueNumber) &&
      valueNumber > 0 &&
      values.currency.trim().length > 0 &&
      (values.type !== 'ONE_TIME' || (Number.isInteger(durationNumber) && durationNumber >= 1)) &&
      (values.type !== 'SUBSCRIPTION' ||
        allowLegacyMissingMaxBillingCycles ||
        (Number.isInteger(maxBillingCyclesNumber) && maxBillingCyclesNumber >= 1)) &&
      Boolean(values.type)
    )
  }, [
    allowLegacyMissingMaxBillingCycles,
    values.currency,
    values.durationDays,
    values.maxBillingCycles,
    values.name,
    values.type,
    values.value,
  ])

  const reset = useCallback(() => {
    setValues(
      initialPlan
        ? {
            name: initialPlan.name ?? '',
            value: String(initialPlan.value),
            currency: initialPlan.currency,
            durationDays: String(initialPlan.durationDays),
            maxBillingCycles:
              initialPlan.maxBillingCycles === null || initialPlan.maxBillingCycles === undefined
                ? ''
                : String(initialPlan.maxBillingCycles),
            type: initialPlan.type,
            permissions: Array.isArray(initialPlan.permissions) ? initialPlan.permissions.join(', ') : '',
            allowMultiplePurchases: initialPlan.allowMultiplePurchases,
          }
        : EMPTY_VALUES,
    )
    setFieldErrors({})
    setError(null)
    setIsLoading(false)
  }, [initialPlan])

  const submit = useCallback(async (): Promise<PaymentPlan> => {
    if (!validate()) {
      throw new Error('invalid_form')
    }

    setIsLoading(true)
    setError(null)

    const permissions = values.permissions
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
    const basePayload = {
      name: values.name.trim(),
      value: Number(values.value),
      currency: values.currency.trim().toUpperCase(),
      type: values.type as PaymentPlanType,
      durationDays: values.type === 'ONE_TIME' ? Number(values.durationDays) : 30,
      maxBillingCycles:
        values.type === 'SUBSCRIPTION' && values.maxBillingCycles.trim() !== ''
          ? Number(values.maxBillingCycles)
          : null,
      permissions: permissions.length > 0 ? permissions : null,
      allowMultiplePurchases:
        values.type === 'ONE_TIME' ? values.allowMultiplePurchases : true,
    }

    try {
      if (mode === 'edit') {
        if (!initialPlan) {
          throw new Error('missing_initial_plan')
        }

        const payload: PaymentPlanUpdatePayload = {
          ...basePayload,
        }

        if (values.type === 'SUBSCRIPTION' && values.maxBillingCycles.trim() === '') {
          delete payload.maxBillingCycles
        }

        return await updatePaymentPlanRequest(initialPlan.id, payload)
      }

      const payload: PaymentPlanCreatePayload = basePayload
      return await createPaymentPlanRequest(payload)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      throw new Error('submit_failed')
    } finally {
      setIsLoading(false)
    }
  }, [getErrorMessage, initialPlan, mode, validate, values])

  return {
    mode,
    values,
    fieldErrors,
    isValid,
    isLoading,
    error,
    hasPayPalProvisioning,
    setField,
    reset,
    submit,
  }
}
