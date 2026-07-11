import { useEffect, useRef, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listChatMessagesRequest } from '../api/list-messages'
import type { ChatMessage } from '../types/chat.types'

const DEFAULT_CHAT_LIMIT = 10

export function useChatMessages(tenantId: string | null, remoteJid: string | null) {
  const { getErrorMessage } = useApiMessage()
  const getErrorMessageRef = useRef(getErrorMessage)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getErrorMessageRef.current = getErrorMessage
  }, [getErrorMessage])

  useEffect(() => {
    if (!tenantId || !remoteJid) {
      setMessages([])
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

    listChatMessagesRequest(tenantId, remoteJid, 0, DEFAULT_CHAT_LIMIT)
      .then((data) => {
        if (isMounted) {
          setMessages(data.messages)
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
  }, [tenantId, remoteJid])

  async function loadMore() {
    if (!tenantId || !remoteJid || isLoading || isLoadingMore || !hasMore) {
      return
    }

    setIsLoadingMore(true)
    setError(null)

    try {
      const data = await listChatMessagesRequest(tenantId, remoteJid, messages.length, DEFAULT_CHAT_LIMIT)
      setMessages((current) => [...data.messages, ...current])
      setHasMore(data.hasMore)
      setTotal(data.total)
    } catch (requestError) {
      setError(getErrorMessageRef.current(requestError))
    } finally {
      setIsLoadingMore(false)
    }
  }

  return { messages, isLoading, isLoadingMore, error, hasMore, total, loadMore }
}
