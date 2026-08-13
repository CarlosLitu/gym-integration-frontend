import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelectedTenant } from '@/features/tenants'
import { useUsers } from '../hooks/useUsers'
import type { UserListItem } from '../types/user.types'
import { UserDeactivateModal } from '../components/UserDeactivateModal'
import { UserListView } from '../components/UserListView'

export function UsersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedTenant, selectedTenantId } = useSelectedTenant()
  const [reloadToken, setReloadToken] = useState(0)
  const [deactivatingUser, setDeactivatingUser] = useState<UserListItem | null>(null)

  const { users, isLoading, error } = useUsers(Boolean(selectedTenantId), reloadToken)

  const tenantLabel = selectedTenant?.name ?? '—'

  function handleReload() {
    setReloadToken((current) => current + 1)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-pulse-navy">{t('users.title')}</h1>
        <p className="mt-1 text-sm text-pulse-muted">
          {t('users.subtitle', { tenant: tenantLabel })}
        </p>
      </header>

      <UserListView
        users={users}
        selectedTenantId={selectedTenantId}
        isLoading={isLoading}
        error={error}
        onNewUser={() => navigate('/users/new')}
        onEditUser={(user) => navigate(`/users/${user.id}/edit`)}
        onDeactivateUser={setDeactivatingUser}
      />

      <UserDeactivateModal
        isOpen={deactivatingUser !== null}
        user={deactivatingUser}
        onClose={() => setDeactivatingUser(null)}
        onSuccess={handleReload}
      />
    </div>
  )
}
