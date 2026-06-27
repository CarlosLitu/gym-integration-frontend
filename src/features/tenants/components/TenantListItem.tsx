import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleNotch } from '@phosphor-icons/react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { formatTimeAgo } from '@/utils/formatters'
import { runSyncRequest } from '../api/run-sync'
import type { TenantListItem as TenantListItemType } from '../types/tenant.types'
import { TENANT_SYNC_CONFIG } from '../utils/tenant-status'
import { TenantStatusBadge } from './TenantStatusBadge'
import { TenantStatusHexagon } from './TenantStatusHexagon'

interface TenantListItemProps {
  tenant: TenantListItemType
}

type SyncState = 'idle' | 'loading' | 'success' | 'error'

const SUCCESS_DISMISS_MS = 4000

export function TenantListItem({ tenant }: TenantListItemProps) {
  const { t, i18n } = useTranslation()
  const { getErrorMessage } = useApiMessage()

  const [syncState, setSyncState] = useState<SyncState>('idle')
  const [feedback, setFeedback] = useState('')
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [])

  const subtitle = tenant.lastEventReceived
    ? t('tenant.lastEvent', { time: formatTimeAgo(tenant.lastEventReceived, i18n.language) })
    : t('tenant.noEvent')

  const syncConfig = TENANT_SYNC_CONFIG[tenant.sync]

  const handleSync = async () => {
    if (syncState === 'loading') return

    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    setSyncState('loading')
    setFeedback('')

    try {
      const result = await runSyncRequest(tenant.id)
      setFeedback(result.alreadyRunning ? t('tenants.syncFeedback.running') : t('tenants.syncFeedback.started'))
      setSyncState('success')
      dismissTimer.current = setTimeout(() => setSyncState('idle'), SUCCESS_DISMISS_MS)
    } catch (syncError) {
      setFeedback(getErrorMessage(syncError))
      setSyncState('error')
    }
  }

  return (
    <div className="grid grid-cols-[2rem_12rem_6rem_1fr] items-center gap-x-3 gap-y-2 px-4 py-4">
      <TenantStatusHexagon status={tenant.status} className="h-8 w-8 shrink-0" />
      <div className="flex min-w-0 flex-col">
        <p
          title={tenant.name}
          className="truncate font-sans text-sm font-semibold text-pulse-navy"
        >
          {tenant.name}
        </p>
        {subtitle ? (
          <p className="truncate font-sans text-xs text-pulse-muted">{subtitle}</p>
        ) : null}
      </div>
      <div>
        <button
          type="button"
          onClick={handleSync}
          disabled={syncState === 'loading'}
          className="inline-flex items-center gap-1.5 rounded-[999px] border border-slate-200 bg-white px-3 py-1 font-sans text-xs font-medium text-[#505458] transition-colors hover:bg-pulse-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-blue/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${syncConfig.ringClass}`}
          >
            <span className={`h-2 w-2 rounded-full ${syncConfig.dotClass}`} />
          </span>
          {t('tenants.sync')}
        </button>
      </div>
      <div className="flex items-center justify-end gap-3">
        <TenantStatusBadge status={tenant.status} />
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          {t('tenants.edit')}
        </button>
      </div>
      {syncState !== 'idle' ? (
        <div className="col-start-3 col-span-2">
          {syncState === 'loading' ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-pulse-surface px-2 py-1 font-sans text-[11px] font-medium leading-tight text-pulse-muted">
              <CircleNotch className="h-3 w-3 shrink-0 animate-spin" aria-hidden="true" />
              {t('tenants.syncFeedback.loading')}
            </span>
          ) : null}
          {syncState === 'success' ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F1FAF4] px-2 py-1 font-sans text-[11px] font-medium leading-tight text-[#24893E]">
              {feedback}
            </span>
          ) : null}
          {syncState === 'error' ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FDF2F3] px-2 py-1 font-sans text-[11px] font-medium leading-tight text-[#C51A31]">
              {feedback}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
