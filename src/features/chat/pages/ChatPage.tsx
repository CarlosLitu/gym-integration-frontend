import { useEffect, useMemo, useState } from 'react'
import { ArrowsClockwise } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Input } from '@/components'
import { useSelectedTenant } from '@/features/tenants'
import type { ChatConversation } from '../types/chat.types'
import { useChatConversations } from '../hooks/useChatConversations'
import { useChatMessages } from '../hooks/useChatMessages'
import { ConversationList } from '../components/ConversationList'
import { MessageThread } from '../components/MessageThread'

export function ChatPage() {
  const { t } = useTranslation()
  const { selectedTenant, selectedTenantId } = useSelectedTenant()
  const [reloadToken, setReloadToken] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const {
    conversations,
    isLoading,
    isLoadingMore: isLoadingMoreConversations,
    error,
    hasMore: hasMoreConversations,
    total: totalConversations,
    loadMore: loadMoreConversations,
  } = useChatConversations(selectedTenantId, reloadToken)
  const {
    messages,
    isLoading: isLoadingMessages,
    isLoadingMore: isLoadingMoreMessages,
    error: messagesError,
    hasMore: hasMoreMessages,
    total: totalMessages,
    loadMore: loadMoreMessages,
  } = useChatMessages(
    selectedTenantId,
    selectedConversation?.remoteJid || null,
  )

  const tenantLabel = selectedTenant?.name ?? '—'

  useEffect(() => {
    if (!selectedConversation) {
      setSelectedConversation(conversations[0] ?? null)
      return
    }

    const updatedSelection =
      conversations.find((conversation) => conversation.remoteJid === selectedConversation.remoteJid) ?? null

    setSelectedConversation(updatedSelection ?? conversations[0] ?? null)
  }, [conversations, selectedConversation])

  const selectedSummary = useMemo(() => {
    if (!selectedConversation) {
      return ''
    }

    return selectedConversation.phoneNumber || selectedConversation.remoteJid
  }, [selectedConversation])

  function handleReload() {
    setReloadToken((current) => current + 1)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-pulse-navy">{t('chat.title')}</h1>
          <p className="mt-1 text-sm text-pulse-muted">{t('chat.subtitle', { tenant: tenantLabel })}</p>
        </div>
        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('chat.searchPlaceholder')}
            className="lg:min-w-[20rem]"
          />
          <Button
            variant="outline"
            onClick={handleReload}
            disabled={!selectedTenantId || isLoading}
            className="gap-2"
          >
            <ArrowsClockwise className={isLoading ? 'animate-spin' : ''} />
            {t('chat.refresh')}
          </Button>
        </div>
      </header>

      {!selectedTenantId ? (
        <Alert>{t('chat.noTenantSelected')}</Alert>
      ) : null}

      {selectedConversation ? (
        <div className="rounded-[12px] border border-pulse-border bg-white px-4 py-3 text-sm text-pulse-muted">
          {t('chat.activeConversation', { contact: selectedSummary })}
        </div>
      ) : null}

      {error && selectedTenantId ? <Alert>{error}</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-pulse-muted">
              {t('chat.conversationsCount', {
                shown: conversations.length,
                total: totalConversations,
              })}
            </p>
            {hasMoreConversations ? (
              <button
                type="button"
                onClick={() => void loadMoreConversations()}
                disabled={isLoadingMoreConversations}
                className="rounded-full border border-pulse-border bg-white px-4 py-2 text-sm font-semibold text-pulse-navy shadow-sm transition hover:border-pulse-blue hover:bg-pulse-blue/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMoreConversations ? t('chat.loadingMore') : t('chat.showMore')}
              </button>
            ) : null}
          </div>
          <ConversationList
            conversations={conversations}
            selectedRemoteJid={selectedConversation?.remoteJid ?? null}
            search={search}
            onSelect={setSelectedConversation}
            emptyLabel={
              selectedTenantId ? t('chat.emptyConversations') : t('chat.noTenantSelected')
            }
          />
        </div>

        <MessageThread
          conversation={selectedConversation}
          messages={messages}
          isLoading={isLoadingMessages}
          isLoadingMore={isLoadingMoreMessages}
          error={messagesError}
          loadingLabel={t('chat.loadingMessages')}
          emptyConversationLabel={t('chat.emptyConversationSelection')}
          emptyMessagesLabel={t('chat.emptyMessages')}
          headerActions={
            selectedConversation && hasMoreMessages ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-pulse-muted">
                  {t('chat.messagesCount', {
                    shown: messages.length,
                    total: totalMessages,
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => void loadMoreMessages()}
                  disabled={isLoadingMoreMessages}
                  className="rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingMoreMessages ? t('chat.loadingMore') : t('chat.showMore')}
                </button>
              </div>
            ) : selectedConversation ? (
              <span className="text-xs text-pulse-muted">
                {t('chat.messagesCount', {
                  shown: messages.length,
                  total: totalMessages,
                })}
              </span>
            ) : null
          }
        />
      </div>
    </div>
  )
}
