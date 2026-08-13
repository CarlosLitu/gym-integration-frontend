import { apiClient } from '@/services/api-client'
import type { ChatConversationListData } from '../types/chat.types'

export async function listChatConversationsRequest(
  tenantId: string,
  skip = 0,
  limit = 10,
): Promise<ChatConversationListData> {
  const { data } = await apiClient.get<{ data: ChatConversationListData }>(
    '/api/whatsapp/conversations',
    {
      params: {
        tenantId,
        skip,
        limit,
      },
    },
  )

  return data.data
}
