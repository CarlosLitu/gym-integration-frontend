import { PlusCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Button, SearchInput } from '@/components'
import { Pagination } from '@/features/tenants/components/Pagination'
import { useUserFilters } from '../hooks/useUserFilters'
import type { UserListItem as UserListItemType } from '../types/user.types'
import { UserFilters } from './UserFilters'
import { UserListItem } from './UserListItem'
import { USER_TABLE_GRID } from './user-table-grid'

interface UserListViewProps {
  users: UserListItemType[]
  selectedTenantId: string | null
  isLoading: boolean
  error: string | null
  onNewUser: () => void
  onEditUser: (user: UserListItemType) => void
  onDeactivateUser: (user: UserListItemType) => void
}

export function UserListView({
  users,
  selectedTenantId,
  isLoading,
  error,
  onNewUser,
  onEditUser,
  onDeactivateUser,
}: UserListViewProps) {
  const { t } = useTranslation()
  const {
    search,
    setSearch,
    sortAsc,
    toggleSort,
    page,
    setPage,
    pageItems,
    total,
    totalPages,
  } = useUserFilters(users, selectedTenantId)

  if (!selectedTenantId) {
    return (
      <p className="py-8 text-center font-sans text-sm text-pulse-muted">
        {t('users.noTenantSelected')}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            name="user-search"
            placeholder={t('users.searchPlaceholder')}
          />
        </div>
        <Button
          variant="brand"
          size="md"
          className="shrink-0 gap-2 !rounded-[12px]"
          onClick={onNewUser}
        >
          <PlusCircle size={20} weight="bold" aria-hidden="true" />
          {t('users.newUser')}
        </Button>
      </div>

      <UserFilters sortAsc={sortAsc} onToggleSort={toggleSort} total={total} />

      <div className="flex flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white">
        <div
          className={`${USER_TABLE_GRID} hidden border-b border-slate-200 bg-pulse-surface/40 py-3 md:grid`}
        >
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('users.columns.name')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('users.columns.email')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('users.columns.role')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('users.columns.createdAt')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('users.columns.actions')}
          </span>
        </div>

        {isLoading ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-muted">
            {t('users.loading')}
          </p>
        ) : error ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-error-border">{error}</p>
        ) : total === 0 ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-muted">{t('users.empty')}</p>
        ) : (
          <>
            <div className="divide-y divide-slate-200">
              {pageItems.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  onEdit={onEditUser}
                  onDeactivate={onDeactivateUser}
                />
              ))}
            </div>
            <div className="border-t border-slate-200 px-4 py-3">
              <Pagination
                page={page}
                totalPages={totalPages}
                shown={pageItems.length}
                total={total}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
