import { useEffect, useRef, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listChatMessagesRequest } from '../api/list-messages'
import type { ChatMessage } from '../types/chat.types'

export function useChatMessages(tenantId: string | null, remoteJid: string | null) {
  const { getErrorMessage } = useApiMessage()
  const getErrorMessageRef = useRef(getErrorMessage)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getErrorMessageRef.current = getErrorMessage
  }, [getErrorMessage])

  useEffect(() => {
    if (!tenantId || !remoteJid) {
      setMessages([])
      setError(null)
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    listChatMessagesRequest(tenantId, remoteJid)
      .then((data) => {
        if (isMounted) {
          setMessages(data.messages)
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

  return { messages, isLoading, error }
}
