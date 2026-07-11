import { useEffect, useRef, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listChatConversationsRequest } from '../api/list-conversations'
import type { ChatConversation } from '../types/chat.types'

const DEFAULT_CHAT_LIMIT = 10

export function useChatConversations(tenantId: string | null, reloadToken = 0) {
  const { getErrorMessage } = useApiMessage()
  const getErrorMessageRef = useRef(getErrorMessage)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getErrorMessageRef.current = getErrorMessage
  }, [getErrorMessage])

  useEffect(() => {
    if (!tenantId) {
      setConversations([])
      setError(null)
      setIsLoading(false)
      setIsLoadingMore(false)
      setHasMore(false)
      setTotal(0)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    listChatConversationsRequest(tenantId, 0, DEFAULT_CHAT_LIMIT)
      .then((data) => {
        if (isMounted) {
          setConversations(data.conversations)
          setHasMore(data.hasMore)
          setTotal(data.total)
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

  async function loadMore() {
    if (!tenantId || isLoading || isLoadingMore || !hasMore) {
      return
    }

    setIsLoadingMore(true)
    setError(null)

    try {
      const data = await listChatConversationsRequest(tenantId, conversations.length, DEFAULT_CHAT_LIMIT)
      setConversations((current) => [...current, ...data.conversations])
      setHasMore(data.hasMore)
      setTotal(data.total)
    } catch (requestError) {
      setError(getErrorMessageRef.current(requestError))
    } finally {
      setIsLoadingMore(false)
    }
  }

  return { conversations, isLoading, isLoadingMore, error, hasMore, total, loadMore }
}
