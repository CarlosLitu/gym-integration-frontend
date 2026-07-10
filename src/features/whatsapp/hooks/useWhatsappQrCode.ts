import { useCallback, useEffect, useState } from 'react'
import { getWhatsappQrCodeRequest } from '../api/get-whatsapp-qr-code'
import type { WhatsappQrCodeData } from '../types/whatsapp.types'
import { useApiMessage } from '@/hooks/useApiMessage'

interface UseWhatsappQrCodeResult {
  data: WhatsappQrCodeData | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useWhatsappQrCode(tenantId: string | null): UseWhatsappQrCodeResult {
  const { getErrorMessage } = useApiMessage()
  const [data, setData] = useState<WhatsappQrCodeData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (refresh = false) => {
      if (!tenantId) {
        setData(null)
        setError(null)
        setIsLoading(false)
        setIsRefreshing(false)
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
        setError(getErrorMessage(requestError))
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [getErrorMessage, tenantId],
  )

  useEffect(() => {
    void load(false)
  }, [load])

  const refresh = useCallback(async () => {
    await load(true)
  }, [load])

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refresh,
  }
}
