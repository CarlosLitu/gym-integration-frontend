import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useApiMessage } from '@/hooks/useApiMessage'
import { isNotEmpty, isValidEmail } from '@/utils/validators'
import { requestDemoRequest } from '../api/request-demo'
import type { DemoFormFieldErrors, DemoFormValues } from '../types/demo.types'

const INITIAL_VALUES: DemoFormValues = {
  name: '',
  gymName: '',
  email: '',
  whatsapp: '',
  studentsRange: '',
  acceptedTerms: false,
}

type DemoTextField = Exclude<keyof DemoFormValues, 'acceptedTerms'>

function isValidWhatsapp(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export function useDemoForm() {
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()
  const [values, setValues] = useState<DemoFormValues>(INITIAL_VALUES)
  const [fieldErrors, setFieldErrors] = useState<DemoFormFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = useCallback((): boolean => {
    const errors: DemoFormFieldErrors = {}

    if (!isNotEmpty(values.name)) {
      errors.name = t('landing.demo.errors.required')
    }

    if (!isNotEmpty(values.gymName)) {
      errors.gymName = t('landing.demo.errors.required')
    }

    if (!isNotEmpty(values.email)) {
      errors.email = t('landing.demo.errors.required')
    } else if (!isValidEmail(values.email)) {
      errors.email = t('landing.demo.errors.invalidEmail')
    }

    if (!isNotEmpty(values.whatsapp)) {
      errors.whatsapp = t('landing.demo.errors.required')
    } else if (!isValidWhatsapp(values.whatsapp)) {
      errors.whatsapp = t('landing.demo.errors.invalidWhatsapp')
    }

    if (!isNotEmpty(values.studentsRange)) {
      errors.studentsRange = t('landing.demo.errors.required')
    }

    if (!values.acceptedTerms) {
      errors.acceptedTerms = t('landing.demo.errors.termsRequired')
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [t, values])

  const handleChange = useCallback((field: DemoTextField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    setFormError(null)
    setIsSuccess(false)
  }, [])

  const handleAcceptedTermsChange = useCallback((checked: boolean) => {
    setValues((current) => ({ ...current, acceptedTerms: checked }))
    setFieldErrors((current) => ({ ...current, acceptedTerms: undefined }))
    setFormError(null)
    setIsSuccess(false)
  }, [])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!validate()) return

      setIsLoading(true)
      setFormError(null)

      try {
        await requestDemoRequest(values)
        setIsSuccess(true)
        setValues(INITIAL_VALUES)
      } catch (error) {
        setFormError(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    },
    [getErrorMessage, validate, values],
  )

  const canSubmit = useMemo(
    () =>
      isNotEmpty(values.name) &&
      isNotEmpty(values.gymName) &&
      isNotEmpty(values.email) &&
      isNotEmpty(values.whatsapp) &&
      isNotEmpty(values.studentsRange) &&
      values.acceptedTerms,
    [values],
  )

  return {
    values,
    fieldErrors,
    formError,
    isLoading,
    isSuccess,
    canSubmit,
    handleChange,
    handleAcceptedTermsChange,
    handleSubmit,
  }
}
