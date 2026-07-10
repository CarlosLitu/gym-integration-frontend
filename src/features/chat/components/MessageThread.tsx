import { clsx } from 'clsx'
import type { ChatConversation, ChatMessage } from '../types/chat.types'

interface MessageThreadProps {
  conversation: ChatConversation | null
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  loadingLabel: string
  emptyConversationLabel: string
  emptyMessagesLabel: string
}

export function MessageThread({
  conversation,
  messages,
  isLoading,
  error,
  loadingLabel,
  emptyConversationLabel,
  emptyMessagesLabel,
}: MessageThreadProps) {
  if (!conversation) {
    return (
      <div className="rounded-[12px] border border-dashed border-pulse-border bg-white p-6 text-sm text-pulse-muted">
        {emptyConversationLabel}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-pulse-border bg-white">
      <header className="border-b border-pulse-border px-4 py-3">
        <h2 className="font-semibold text-pulse-navy">
          {conversation.name || conversation.phoneNumber || conversation.remoteJid}
        </h2>
        <p className="mt-1 text-sm text-pulse-muted">{conversation.remoteJid}</p>
      </header>

      {isLoading ? (
        <div className="p-6 text-sm text-pulse-muted">{loadingLabel}</div>
      ) : error ? (
        <div className="p-6 text-sm text-pulse-error-border">{error}</div>
      ) : messages.length === 0 ? (
        <div className="p-6 text-sm text-pulse-muted">{emptyMessagesLabel}</div>
      ) : (
        <div className="flex max-h-[42rem] flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'max-w-[80%] rounded-[12px] px-4 py-3 text-sm shadow-sm',
                message.fromMe
                  ? 'self-end bg-pulse-blue text-white'
                  : 'self-start bg-white text-pulse-navy',
              )}
            >
              {message.quotedMessageConversation ? (
                <p
                  className={clsx(
                    'mb-2 rounded-[8px] border-l-2 px-3 py-2 text-xs',
                    message.fromMe
                      ? 'border-white/60 bg-white/15 text-white/90'
                      : 'border-pulse-blue bg-pulse-blue/5 text-pulse-muted',
                  )}
                >
                  {message.quotedMessageConversation}
                </p>
              ) : null}

              <p>{message.messageConversation || '-'}</p>
              <div
                className={clsx(
                  'mt-2 flex items-center justify-between gap-3 text-xs',
                  message.fromMe ? 'text-white/80' : 'text-pulse-muted',
                )}
              >
                <span>{message.source || '-'}</span>
                <span>
                  {message.messageDate
                    ? new Date(message.messageDate).toLocaleString()
                    : message.createdAt
                      ? new Date(message.createdAt).toLocaleString()
                      : '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
