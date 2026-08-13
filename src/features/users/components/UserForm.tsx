import { useTranslation } from 'react-i18next'
import { CircleNotch, LockKey, ShieldCheck, IdentificationCard } from '@phosphor-icons/react'
import { Alert, Button, Input } from '@/components'
import type { UserFormMode } from '../hooks/useUserForm'
import type { UserFormFieldErrors, UserFormValues } from '../types/user.types'
import { PasswordRequirementsList } from './PasswordRequirementsList'
import { UserRoleSelect } from './UserRoleSelect'

export interface UserFormProps {
  mode: UserFormMode
  values: UserFormValues
  fieldErrors: UserFormFieldErrors
  isValid: boolean
  isLoading: boolean
  error: string | null
  onCancel: () => void
  onChange: (field: keyof UserFormValues, value: string) => void
  onSubmit: () => Promise<void>
}

function Tile({
  icon: Icon,
  title,
  hint,
  children,
  className = '',
}: {
  icon: typeof IdentificationCard
  title: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-[12px] border border-pulse-border bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      <header className="mb-4 flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-pulse-navy text-white"
          aria-hidden="true"
        >
          <Icon size={18} weight="fill" />
        </div>
        <div className="min-w-0 pt-0.5">
          <h2 className="font-heading text-sm font-semibold text-pulse-navy">{title}</h2>
          {hint ? <p className="mt-0.5 font-sans text-xs text-pulse-muted">{hint}</p> : null}
        </div>
      </header>
      {children}
    </section>
  )
}

export function UserForm({
  mode,
  values,
  fieldErrors,
  isValid,
  isLoading,
  error,
  onCancel,
  onChange,
  onSubmit,
}: UserFormProps) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}

      <div className="grid gap-4 lg:grid-cols-5">
        <Tile
          icon={IdentificationCard}
          title={t('users.form.sections.identity')}
          hint={t('users.form.sections.identityHint')}
          className="lg:col-span-3"
        >
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
        </Tile>

        <Tile
          icon={ShieldCheck}
          title={t('users.form.sections.permission')}
          hint={t('users.form.sections.permissionHint')}
          className="lg:col-span-2"
        >
          <label htmlFor="user-role" className="mb-1.5 block font-sans text-sm font-semibold text-pulse-navy">
            {t('users.form.role')}
          </label>
          <UserRoleSelect
            value={values.role}
            onChange={(role) => onChange('role', role)}
            disabled={isLoading}
          />
        </Tile>

        {mode === 'create' ? (
          <Tile
            icon={LockKey}
            title={t('users.form.sections.security')}
            hint={t('users.form.sections.securityHint')}
            className="lg:col-span-5"
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={t('users.form.password')}
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('users.form.placeholders.password')}
                  value={values.password}
                  onChange={(event) => onChange('password', event.target.value)}
                  revealToggle
                  revealLabel={t('users.form.reveal')}
                  hideLabel={t('users.form.hide')}
                  required
                />
                <Input
                  label={t('users.form.confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('users.form.placeholders.confirmPassword')}
                  value={values.confirmPassword}
                  onChange={(event) => onChange('confirmPassword', event.target.value)}
                  onPaste={(event) => event.preventDefault()}
                  onDrop={(event) => event.preventDefault()}
                  error={fieldErrors.confirmPassword}
                  revealToggle
                  revealLabel={t('users.form.reveal')}
                  hideLabel={t('users.form.hide')}
                  required
                />
              </div>
              <div className="rounded-[12px] border border-dashed border-pulse-border bg-pulse-surface/80 p-4">
                <PasswordRequirementsList password={values.password} />
              </div>
            </div>
          </Tile>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-[12px] border border-pulse-border bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs text-pulse-muted">{t('users.form.requiredHint')}</p>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="!rounded-[12px] border-slate-200 bg-white hover:bg-pulse-surface"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t('users.form.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="md"
            className="gap-2 !rounded-[12px]"
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
      </div>
    </form>
  )
}
