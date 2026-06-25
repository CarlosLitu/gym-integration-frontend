import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import hexConnected from '@/assets/images/hex-connected.svg'
import { StatusBadge } from '@/components'
import { useCurrentTenant } from '@/features/auth'
import { formatTimeAgo } from '@/utils/formatters'

export function MainLayout() {
  const { t, i18n } = useTranslation()
  const { name, status, lastEvent } = useCurrentTenant()

  const tenantName = name ?? '—'
  const tenantInitial = name?.charAt(0).toUpperCase() ?? '?'
  const lastEventLabel = lastEvent
    ? t('tenant.lastEvent', { time: formatTimeAgo(lastEvent, i18n.language) })
    : null

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 border-r border-slate-200 bg-white p-4 md:block">
        <p className="text-sm font-semibold text-slate-900">Gym Integration</p>
        <p className="mt-1 text-xs text-slate-500">Sidebar</p>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
          <img src={hexConnected} alt="" className="h-8 w-8" />
          <div className="flex flex-col">
            <p className="font-sans text-sm font-semibold text-pulse-navy">{tenantName}</p>
            {lastEventLabel ? (
              <p className="font-sans text-xs text-pulse-muted">{lastEventLabel}</p>
            ) : null}
          </div>
          <StatusBadge status={status}>{t(`status.${status}`)}</StatusBadge>
          <span className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-pulse-surface font-sans font-semibold text-pulse-navy">
            {tenantInitial}
          </span>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
