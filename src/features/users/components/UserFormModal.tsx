import { useTranslation } from 'react-i18next'
import { CircleNotch } from '@phosphor-icons/react'
import { Alert, Button, Input, Modal } from '@/components'
import type { UserFormMode } from '../hooks/useUserForm'
import type { UserFormValues } from '../types/user.types'
import { UserRoleSelect } from './UserRoleSelect'

interface UserFormModalProps {
  isOpen: boolean
  mode: UserFormMode
  values: UserFormValues
  isValid: boolean
  isLoading: boolean
  error: string | null
  onClose: () => void
  onChange: (field: keyof UserFormValues, value: string) => void
  onSubmit: () => Promise<void>
}

export function UserFormModal({
  isOpen,
  mode,
  values,
  isValid,
  isLoading,
  error,
  onClose,
  onChange,
  onSubmit,
}: UserFormModalProps) {
  const { t } = useTranslation()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    try {
      await onSubmit()
    } catch {
      // Erro exibido pelo hook.
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg overflow-visible rounded-[24px] p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="pr-10 font-sans text-2xl font-semibold text-pulse-navy">
          {mode === 'create' ? t('users.form.createTitle') : t('users.form.editTitle')}
        </h2>

        {error ? <Alert>{error}</Alert> : null}

        <Input
          label={t('users.form.name')}
          placeholder={t('users.form.placeholders.name')}
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          required
        />

        <Input
          label={t('users.form.email')}
          type="email"
          placeholder={t('users.form.placeholders.email')}
          value={values.email}
          onChange={(event) => onChange('email', event.target.value)}
          required
        />

        {mode === 'create' ? (
          <Input
            label={t('users.form.password')}
            type="password"
            placeholder={t('users.form.placeholders.password')}
            value={values.password}
            onChange={(event) => onChange('password', event.target.value)}
            required
          />
        ) : null}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-role" className="font-sans text-sm font-medium text-pulse-navy">
            {t('users.form.role')}
          </label>
          <UserRoleSelect
            value={values.role}
            onChange={(role) => onChange('role', role)}
            disabled={isLoading}
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="rounded-pill border-slate-200 bg-white hover:bg-pulse-surface"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('users.form.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="md"
            className="gap-2"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <CircleNotch className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
                {t('users.form.saving')}
              </>
            ) : (
              t('users.form.save')
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
