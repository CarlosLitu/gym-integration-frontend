import { useCallback, useEffect, useRef, useState } from 'react'
import { getWhatsappQrCodeRequest, resetWhatsappSessionRequest } from '../api/get-whatsapp-qr-code'
import type { WhatsappQrCodeData } from '../types/whatsapp.types'
import { useApiMessage } from '@/hooks/useApiMessage'

interface UseWhatsappQrCodeResult {
  data: WhatsappQrCodeData | null
  isLoading: boolean
  isRefreshing: boolean
  isResetting: boolean
  error: string | null
  refresh: () => Promise<void>
  resetSession: () => Promise<void>
}

export function useWhatsappQrCode(tenantId: string | null): UseWhatsappQrCodeResult {
  const { getErrorMessage } = useApiMessage()
  const getErrorMessageRef = useRef(getErrorMessage)
  const [data, setData] = useState<WhatsappQrCodeData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getErrorMessageRef.current = getErrorMessage
  }, [getErrorMessage])

  const load = useCallback(
    async (refresh = false) => {
      if (!tenantId) {
        setData(null)
        setError(null)
        setIsLoading(false)
        setIsRefreshing(false)
        setIsResetting(false)
        return
      }

      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setError(null)

      try {
        const response = await getWhatsappQrCodeRequest(tenantId)
        setData(response)
      } catch (requestError) {
        setError(getErrorMessageRef.current(requestError))
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [tenantId],
  )

  useEffect(() => {
    void load(false)
  }, [load])

  const refresh = useCallback(async () => {
    await load(true)
  }, [load])

  const resetSession = useCallback(async () => {
    if (!tenantId) {
      return
    }

    setIsResetting(true)
    setError(null)

    try {
      const response = await resetWhatsappSessionRequest(tenantId)
      setData(response)
    } catch (requestError) {
      setError(getErrorMessageRef.current(requestError))
    } finally {
      setIsResetting(false)
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [tenantId])

  return {
    data,
    isLoading,
    isRefreshing,
    isResetting,
    error,
    refresh,
    resetSession,
  }
}
