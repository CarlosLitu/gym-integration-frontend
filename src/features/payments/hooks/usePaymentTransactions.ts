import { useEffect, useRef, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import type { PaymentTransactionListData } from '../types/payment.types'
import { listPaymentTransactionsRequest, type ListPaymentTransactionsParams } from '../services/payment-service'

export function usePaymentTransactions(
  params: ListPaymentTransactionsParams,
  reloadToken = 0,
) {
  const { getErrorMessage } = useApiMessage()
  const getErrorMessageRef = useRef(getErrorMessage)
  const [data, setData] = useState<PaymentTransactionListData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getErrorMessageRef.current = getErrorMessage
  }, [getErrorMessage])

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    listPaymentTransactionsRequest(params)
      .then((response) => {
        if (isMounted) setData(response)
      })
      .catch((requestError) => {
        if (isMounted) setError(getErrorMessageRef.current(requestError))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [params, reloadToken])

  return { data, isLoading, error }
}
