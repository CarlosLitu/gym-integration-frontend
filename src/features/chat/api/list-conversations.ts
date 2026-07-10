import { apiClient } from '@/services/api-client'
import type { ChatConversationListData } from '../types/chat.types'

export async function listChatConversationsRequest(
  tenantId: string,
): Promise<ChatConversationListData> {
  const { data } = await apiClient.get<{ data: ChatConversationListData }>(
    '/api/whatsapp/conversations',
    {
      params: {
        tenantId,
      },
    },
  )

  return data.data
}
