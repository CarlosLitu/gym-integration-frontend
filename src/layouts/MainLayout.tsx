import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { ChartBar, GearSix, Headset, List, SquaresFour } from '@phosphor-icons/react'
import logo from '@/assets/images/logo.svg'
import { Button } from '@/components'
import { useCurrentTenant, UserMenu } from '@/features/auth'
import { TenantStatusBadge, TenantStatusHexagon, TenantSwitcherModal } from '@/features/tenants'
import { formatTimeAgo } from '@/utils/formatters'

interface SidebarNavProps {
  onNavigate?: () => void
}

function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { t } = useTranslation()

  return (
    <nav className="mt-8 flex flex-col gap-4">
      <NavLink
        to="/dashboard"
        onClick={onNavigate}
        className={({ isActive }) =>
          clsx(
            'flex items-center gap-2.5 rounded-[8px] px-3 py-2 font-sans text-sm font-medium transition-colors',
            isActive
              ? 'bg-pulse-blue/10 text-pulse-blue'
              : 'text-pulse-navy hover:bg-pulse-surface',
          )
        }
      >
        <SquaresFour className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        {t('nav.dashboard')}
      </NavLink>
      <button
        type="button"
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 font-sans text-sm font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
      >
        <GearSix className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        {t('nav.settings')}
      </button>
      <button
        type="button"
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 font-sans text-sm font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
      >
        <ChartBar className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        {t('nav.reports')}
      </button>
      <button
        type="button"
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 font-sans text-sm font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
      >
        <Headset className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        {t('nav.support')}
      </button>
    </nav>
  )
}

export function MainLayout() {
  const { t, i18n } = useTranslation()
  const { name, status, lastEvent } = useCurrentTenant()
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const tenantName = name ?? '—'
  const tenantInitial = name?.charAt(0).toUpperCase() ?? '?'
  const lastEventLabel = lastEvent
    ? t('tenant.lastEvent', { time: formatTimeAgo(lastEvent, i18n.language) })
    : t('tenant.noEvent')

  useEffect(() => {
    if (!isSidebarOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSidebarOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-52 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <img src={logo} alt="Pulse" className="h-[36px] w-[126px] pl-3" />
        <SidebarNav />
      </aside>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-slate-200 bg-white p-4 shadow-card animate-slide-in-left">
            <img src={logo} alt="Pulse" className="h-[36px] w-[126px] pl-3" />
            <SidebarNav onNavigate={() => setIsSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label={t('nav.openMenu')}
            className="-ml-1 mr-1 rounded-[8px] p-2 text-pulse-navy hover:bg-pulse-surface md:hidden"
          >
            <List className="h-5 w-5" aria-hidden="true" />
          </button>
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
