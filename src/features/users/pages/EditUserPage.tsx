import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelectedTenant } from '@/features/tenants'
import { useUserForm } from '../hooks/useUserForm'
import { useUsers } from '../hooks/useUsers'
import { UserForm } from '../components/UserForm'
import { UserFormPageLayout } from '../components/UserFormPageLayout'

export function EditUserPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const { selectedTenant, selectedTenantId } = useSelectedTenant()
  const { users, isLoading: isLoadingUsers, error: usersError } = useUsers(
    Boolean(selectedTenantId),
  )
  const userForm = useUserForm(selectedTenantId)
  const tenantLabel = selectedTenant?.name ?? '—'
  const user = users.find((item) => item.id === userId)

  useEffect(() => {
    if (user) {
      userForm.openEdit(user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  function handleCancel() {
    navigate('/users')
  }

  async function handleSubmit() {
    await userForm.submit()
    navigate('/users')
  }

  let body: React.ReactNode

  if (!selectedTenantId) {
    body = (
      <div className="rounded-[12px] border border-pulse-border bg-white px-6 py-10 text-center shadow-sm">
        <p className="font-sans text-sm text-pulse-muted">{t('users.noTenantSelected')}</p>
      </div>
    )
  } else if (isLoadingUsers) {
    body = (
      <div className="rounded-[12px] border border-pulse-border bg-white px-6 py-10 text-center shadow-sm">
        <p className="font-sans text-sm text-pulse-muted">{t('users.loading')}</p>
      </div>
    )
  } else if (usersError) {
    body = (
      <div className="rounded-[12px] border border-pulse-border bg-white px-6 py-10 text-center shadow-sm">
        <p className="font-sans text-sm text-pulse-error-border">{usersError}</p>
      </div>
    )
  } else if (!user) {
    body = (
      <div className="rounded-[12px] border border-pulse-border bg-white px-6 py-10 text-center shadow-sm">
        <p className="font-sans text-sm text-pulse-muted">{t('users.notFound')}</p>
      </div>
    )
  } else {
    body = (
      <UserForm
        mode="edit"
        values={userForm.values}
        fieldErrors={userForm.fieldErrors}
        isValid={userForm.isValid}
        isLoading={userForm.isLoading}
        error={userForm.error}
        onCancel={handleCancel}
        onChange={userForm.setField}
        onSubmit={handleSubmit}
      />
    )
  }

  return (
    <UserFormPageLayout
      title={t('users.form.editTitle')}
      subtitle={t('users.editSubtitle', { tenant: tenantLabel })}
    >
      {body}
    </UserFormPageLayout>
  )
}
