import { useTranslation } from 'react-i18next'
import { Button, Modal } from '@/components'
import { useTenants } from '../hooks/useTenants'
import { useTenantFilters } from '../hooks/useTenantFilters'
import { TenantSearch } from './TenantSearch'
import { TenantFilters } from './TenantFilters'
import { TenantListItem } from './TenantListItem'
import { Pagination } from './Pagination'

interface TenantSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TenantSwitcherModal({ isOpen, onClose }: TenantSwitcherModalProps) {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="h-[786px] max-h-[90vh] w-[868px] max-w-[95vw] gap-4 rounded-[24px] p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-sans text-2xl font-semibold text-pulse-navy">
          {t('tenants.title')}
        </h2>
        <Button variant="brand" size="md">
          {t('tenants.newTenant')}
        </Button>
      </div>

      <TenantSearch value={search} onChange={setSearch} />
      <TenantFilters sortAsc={sortAsc} onToggleSort={toggleSort} total={total} />

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
        <div className="-mx-6 flex-1 divide-y divide-slate-200 overflow-y-auto border-y border-slate-200">
          {pageItems.map((tenant) => (
            <TenantListItem key={tenant.id} tenant={tenant} />
          ))}
        </div>
      )}

      {!isLoading && !error && total > 0 ? (
        <Pagination
          page={page}
          totalPages={totalPages}
          shown={pageItems.length}
          total={total}
          onPageChange={setPage}
        />
      ) : null}
    </Modal>
  )
}
