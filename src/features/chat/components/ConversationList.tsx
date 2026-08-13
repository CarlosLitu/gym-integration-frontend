import { clsx } from 'clsx'
import type { ChatConversation } from '../types/chat.types'

interface ConversationListProps {
  conversations: ChatConversation[]
  selectedRemoteJid: string | null
  search: string
  onSelect: (conversation: ChatConversation) => void
  emptyLabel: string
}

function normalizeValue(value: string) {
  return value.toLowerCase().trim()
}

export function ConversationList({
  conversations,
  selectedRemoteJid,
  search,
  onSelect,
  emptyLabel,
}: ConversationListProps) {
  const normalizedSearch = normalizeValue(search)
  const filteredConversations = conversations.filter((conversation) => {
    if (!normalizedSearch) {
      return true
    }

    const haystack = [
      conversation.name,
      conversation.phoneNumber,
      conversation.remoteJid,
      conversation.lastMessageText,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedSearch)
  })

  if (filteredConversations.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-pulse-border bg-white p-6 text-sm text-pulse-muted">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-pulse-border bg-white">
      <ul className="divide-y divide-pulse-border">
        {filteredConversations.map((conversation) => {
          const isActive = selectedRemoteJid === conversation.remoteJid

          return (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => onSelect(conversation)}
                className={clsx(
                  'flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors',
                  isActive ? 'bg-pulse-blue/10' : 'hover:bg-pulse-surface',
                )}
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="font-semibold text-pulse-navy">
                    {conversation.name || conversation.phoneNumber || conversation.remoteJid}
                  </span>
                  <span className="shrink-0 text-xs text-pulse-muted">
                    {conversation.lastMessageDate
                      ? new Date(conversation.lastMessageDate).toLocaleString()
                      : '-'}
                  </span>
                </div>
                <p className="text-xs text-pulse-muted">
                  {conversation.phoneNumber || conversation.remoteJid}
                </p>
                <p className="line-clamp-1 text-sm text-pulse-muted">
                  {conversation.lastMessageText || '-'}
                </p>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
