import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelectedTenant } from '@/features/tenants'
import { useUserForm } from '../hooks/useUserForm'
import { useUsers } from '../hooks/useUsers'
import type { UserListItem } from '../types/user.types'
import { UserDeactivateModal } from '../components/UserDeactivateModal'
import { UserFormModal } from '../components/UserFormModal'
import { UserListView } from '../components/UserListView'

export function UsersPage() {
  const { t } = useTranslation()
  const { selectedTenant, selectedTenantId } = useSelectedTenant()
  const [reloadToken, setReloadToken] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deactivatingUser, setDeactivatingUser] = useState<UserListItem | null>(null)

  const { users, isLoading, error } = useUsers(Boolean(selectedTenantId), reloadToken)
  const userForm = useUserForm(selectedTenantId)

  const tenantLabel = selectedTenant?.name ?? '—'

  function handleReload() {
    setReloadToken((current) => current + 1)
  }

  function handleOpenCreate() {
    userForm.openCreate()
    setIsFormOpen(true)
  }

  function handleOpenEdit(user: UserListItem) {
    userForm.openEdit(user)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    userForm.reset()
    setIsFormOpen(false)
  }

  async function handleSubmitForm() {
    try {
      await userForm.submit()
      setIsFormOpen(false)
      handleReload()
    } catch {
      // Erro exibido no modal.
    }
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
        onNewUser={handleOpenCreate}
        onEditUser={handleOpenEdit}
        onDeactivateUser={setDeactivatingUser}
      />

      <UserFormModal
        isOpen={isFormOpen}
        mode={userForm.mode}
        values={userForm.values}
        isValid={userForm.isValid}
        isLoading={userForm.isLoading}
        error={userForm.error}
        onClose={handleCloseForm}
        onChange={userForm.setField}
        onSubmit={handleSubmitForm}
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
