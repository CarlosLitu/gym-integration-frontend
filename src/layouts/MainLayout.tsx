import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/images/logo.svg'
import { Button } from '@/components'
import { useCurrentTenant, UserMenu } from '@/features/auth'
import { TenantStatusBadge, TenantStatusHexagon, TenantSwitcherModal } from '@/features/tenants'
import { formatTimeAgo } from '@/utils/formatters'

export function MainLayout() {
  const { t, i18n } = useTranslation()
  const { name, status, lastEvent } = useCurrentTenant()
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false)

  const tenantName = name ?? '—'
  const tenantInitial = name?.charAt(0).toUpperCase() ?? '?'
  const lastEventLabel = lastEvent
    ? t('tenant.lastEvent', { time: formatTimeAgo(lastEvent, i18n.language) })
    : t('tenant.noEvent')

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-52 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <img src={logo} alt="Pulse" className="mx-auto h-[36px] w-[126px]" />
        <nav className="mt-8 flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              clsx(
                'rounded-[8px] px-3 py-2 font-sans text-sm font-medium transition-colors',
                isActive
                  ? 'bg-pulse-blue/10 text-pulse-blue'
                  : 'text-pulse-navy hover:bg-pulse-surface',
              )
            }
          >
            {t('nav.dashboard')}
          </NavLink>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
          <TenantStatusHexagon status={status} />
          <div className="flex flex-col">
            <p className="font-sans text-sm font-semibold text-pulse-navy">{tenantName}</p>
            {lastEventLabel ? (
              <p className="font-sans text-xs text-pulse-muted">{lastEventLabel}</p>
            ) : null}
          </div>
          <TenantStatusBadge status={status} />
          <Button
            variant="outline"
            size="sm"
            className="rounded-[8px] border-slate-200 text-xs text-black"
            onClick={() => setIsTenantModalOpen(true)}
          >
            {t('tenant.changeTenant')}
          </Button>
          <UserMenu initial={tenantInitial} className="ml-auto" />
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <TenantSwitcherModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
      />
    </div>
  )
}
