import { apiClient } from '@/services/api-client'
import type { WhatsappQrCodeData } from '../types/whatsapp.types'

export async function getWhatsappQrCodeRequest(tenantId: string): Promise<WhatsappQrCodeData> {
  const { data } = await apiClient.get<{ data: WhatsappQrCodeData }>('/api/whatsapp/qr-code', {
    params: {
      tenantId,
    },
  })

  return data.data
}

export async function resetWhatsappSessionRequest(tenantId: string): Promise<WhatsappQrCodeData> {
  const { data } = await apiClient.post<{ data: WhatsappQrCodeData }>('/api/whatsapp/reset-session', {
    tenantId,
  })

  return data.data
}
