import { useEffect, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listUserPaymentPlansRequest } from '../services/payment-service'
import type { PaymentPlan } from '../types/payment.types'

export function useUserPaymentPlans(enabled = true) {
  const { getErrorMessage } = useApiMessage()
  const [plans, setPlans] = useState<PaymentPlan[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let isMounted = true
    setIsLoading(true)
    setError(null)

    listUserPaymentPlansRequest()
      .then((data) => {
        if (!isMounted) return
        setPlans(data)
      })
      .catch((loadError) => {
        if (!isMounted) return
        setError(getErrorMessage(loadError))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [enabled, getErrorMessage])

  return { plans, isLoading, error }
}
