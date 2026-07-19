import { useEffect, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listPaymentPlansRequest } from '../services/payment-service'
import type { PaymentPlan } from '../types/payment.types'

export function usePaymentPlans(enabled: boolean, reloadToken = 0) {
  const { getErrorMessage } = useApiMessage()
  const [plans, setPlans] = useState<PaymentPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let isMounted = true
    setIsLoading(true)
    setError(null)

    listPaymentPlansRequest()
      .then((data) => {
        if (isMounted) setPlans(data)
      })
      .catch((requestError) => {
        if (isMounted) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [enabled, reloadToken, getErrorMessage])

  return { plans, isLoading, error }
}
