import { useTranslation } from 'react-i18next'
import { Select } from '@/components'
import type { UserRole } from '../types/user.types'

const ROLE_OPTIONS: UserRole[] = ['ADMIN', 'USER']

interface UserRoleSelectProps {
  value: UserRole
  onChange: (role: UserRole) => void
  disabled?: boolean
}

export function UserRoleSelect({ value, onChange, disabled = false }: UserRoleSelectProps) {
  const { t } = useTranslation()

  return (
    <Select
      id="user-role"
      value={value}
      disabled={disabled}
      options={ROLE_OPTIONS.map((role) => ({
        value: role,
        label: t(`users.roles.${role}`),
      }))}
      onChange={onChange}
    />
  )
}
