import { PlusCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components'
import { useTenants } from '../hooks/useTenants'
import { useTenantFilters } from '../hooks/useTenantFilters'
import { TenantSearch } from './TenantSearch'
import { TenantFilters } from './TenantFilters'
import { TenantListItem } from './TenantListItem'
import { Pagination } from './Pagination'

interface TenantListViewProps {
  isOpen: boolean
  onNewTenant: () => void
}

export function TenantListView({ isOpen, onNewTenant }: TenantListViewProps) {
  const { t } = useTranslation()
  const { tenants, isLoading, error } = useTenants(isOpen)
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
  } = useTenantFilters(tenants)

  return (
    <>
      <div className="pr-12">
        <h2 className="font-sans text-2xl font-semibold text-pulse-navy">
          {t('tenants.title')}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <TenantSearch value={search} onChange={setSearch} />
        </div>
        <Button
          variant="brand"
          size="md"
          className="shrink-0 gap-2 !rounded-[12px]"
          onClick={onNewTenant}
        >
          <PlusCircle size={20} weight="bold" aria-hidden="true" />
          {t('tenants.newTenant')}
        </Button>
      </div>
      <TenantFilters sortAsc={sortAsc} onToggleSort={toggleSort} total={total} />

      <div className="flex flex-1 flex-col overflow-hidden rounded-[12px] border border-slate-200">
        {isLoading ? (
          <p className="flex-1 py-8 text-center font-sans text-sm text-pulse-muted">
            {t('tenants.loading')}
          </p>
        ) : error ? (
          <p className="flex-1 py-8 text-center font-sans text-sm text-pulse-error-border">
            {error}
          </p>
        ) : total === 0 ? (
          <p className="flex-1 py-8 text-center font-sans text-sm text-pulse-muted">
            {t('tenants.empty')}
          </p>
        ) : (
          <>
            <div className="flex-1 divide-y divide-slate-200 overflow-y-auto">
              {pageItems.map((tenant) => (
                <TenantListItem key={tenant.id} tenant={tenant} />
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
    </>
  )
}
