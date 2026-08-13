import { useTranslation } from 'react-i18next'
import { PencilSimple, Prohibit } from '@phosphor-icons/react'
import { formatDate } from '@/utils/formatters'
import type { UserListItem } from '../types/user.types'
import { UserRoleBadge } from './UserRoleBadge'
import { USER_TABLE_GRID } from './user-table-grid'

interface UserListItemProps {
  user: UserListItem
  onEdit: (user: UserListItem) => void
  onDeactivate: (user: UserListItem) => void
}

export function UserListItem({ user, onEdit, onDeactivate }: UserListItemProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className={`${USER_TABLE_GRID} py-4`}>
      <div className="min-w-0">
        <p title={user.name} className="truncate font-sans text-sm font-semibold text-pulse-navy">
          {user.name}
        </p>
      </div>
      <div className="min-w-0">
        <p title={user.email} className="truncate font-sans text-sm text-pulse-muted">
          {user.email}
        </p>
      </div>
      <div>
        <UserRoleBadge role={user.role} />
      </div>
      <div>
        <p className="font-sans text-xs text-pulse-muted">
          {formatDate(user.createdAt, i18n.language)}
        </p>
      </div>
      <div className="flex items-center justify-start gap-2">
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
        >
          <PencilSimple size={14} aria-hidden="true" />
          {t('users.edit')}
        </button>
        <button
          type="button"
          onClick={() => onDeactivate(user)}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-medium text-[#C51A31] transition-colors hover:bg-[#FDF2F3]"
        >
          <Prohibit size={14} aria-hidden="true" />
          {t('users.deactivate.action')}
        </button>
      </div>
    </div>
  )
}
