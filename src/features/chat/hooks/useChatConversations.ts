import { useEffect, useRef, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listChatConversationsRequest } from '../api/list-conversations'
import type { ChatConversation } from '../types/chat.types'

export function useChatConversations(tenantId: string | null, reloadToken = 0) {
  const { getErrorMessage } = useApiMessage()
  const getErrorMessageRef = useRef(getErrorMessage)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getErrorMessageRef.current = getErrorMessage
  }, [getErrorMessage])

  useEffect(() => {
    if (!tenantId) {
      setConversations([])
      setError(null)
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    listChatConversationsRequest(tenantId)
      .then((data) => {
        if (isMounted) {
          setConversations(data.conversations)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getErrorMessageRef.current(requestError))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [tenantId, reloadToken])

  return { conversations, isLoading, error }
}
