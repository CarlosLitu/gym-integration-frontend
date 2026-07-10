import { apiClient } from '@/services/api-client'
import type { ChatMessageListData } from '../types/chat.types'

export async function listChatMessagesRequest(
  tenantId: string,
  remoteJid: string,
): Promise<ChatMessageListData> {
  const { data } = await apiClient.get<{ data: ChatMessageListData }>('/api/whatsapp/messages', {
    params: {
      tenantId,
      remoteJid,
    },
  })

  return data.data
}
