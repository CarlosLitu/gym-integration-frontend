import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components'
import { Shield, User } from '@phosphor-icons/react'
import type { UserRole } from '../types/user.types'

const ROLE_CONFIG: Record<
  UserRole,
  { badgeVariant: 'connected' | 'pending'; icon: typeof User; labelKey: string }
> = {
  ADMIN: {
    badgeVariant: 'pending',
    icon: Shield,
    labelKey: 'users.roles.ADMIN',
  },
  USER: {
    badgeVariant: 'connected',
    icon: User,
    labelKey: 'users.roles.USER',
  },
}

interface UserRoleBadgeProps {
  role: UserRole
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const { t } = useTranslation()
  const config = ROLE_CONFIG[role]
  const Icon = config.icon

  return (
    <StatusBadge
      status={config.badgeVariant}
      className="rounded-[999px]"
      icon={<Icon size={14} weight="fill" />}
    >
      {t(config.labelKey)}
    </StatusBadge>
  )
}
