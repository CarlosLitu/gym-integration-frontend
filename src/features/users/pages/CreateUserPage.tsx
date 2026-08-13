import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelectedTenant } from '@/features/tenants'
import { useUserForm } from '../hooks/useUserForm'
import { UserForm } from '../components/UserForm'
import { UserFormPageLayout } from '../components/UserFormPageLayout'

export function CreateUserPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedTenant, selectedTenantId } = useSelectedTenant()
  const userForm = useUserForm(selectedTenantId)
  const tenantLabel = selectedTenant?.name ?? '—'

  function handleCancel() {
    navigate('/users')
  }

  async function handleSubmit() {
    await userForm.submit()
    navigate('/users')
  }

  return (
    <UserFormPageLayout
      title={t('users.form.createTitle')}
      subtitle={t('users.createSubtitle', { tenant: tenantLabel })}
    >
      {!selectedTenantId ? (
        <div className="rounded-[12px] border border-pulse-border bg-white px-6 py-10 text-center shadow-sm">
          <p className="font-sans text-sm text-pulse-muted">{t('users.noTenantSelected')}</p>
        </div>
      ) : (
        <UserForm
          mode="create"
          values={userForm.values}
          fieldErrors={userForm.fieldErrors}
          isValid={userForm.isValid}
          isLoading={userForm.isLoading}
          error={userForm.error}
          onCancel={handleCancel}
          onChange={userForm.setField}
          onSubmit={handleSubmit}
        />
      )}
    </UserFormPageLayout>
  )
}
