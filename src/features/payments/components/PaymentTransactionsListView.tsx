import { useMemo, useState } from 'react'
import { Funnel, MagnifyingGlass } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, StatusBadge } from '@/components'
import { Pagination } from '@/features/tenants/components/Pagination'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { PaymentTransaction, PaymentTransactionListData } from '../types/payment.types'
import { PaymentTransactionsFiltersModal } from './PaymentTransactionsFiltersModal'
import { PAYMENT_TRANSACTIONS_TABLE_GRID } from './payment-transactions-table-grid'
import { formatPaymentPlanDuration } from '../utils/format-plan-duration'

export interface PaymentTransactionFiltersForm {
  provider: string
  status: string
  userQuery: string
  paymentPlanId: string
  startDate: string
  endDate: string
  limit: string
}

interface PaymentTransactionsListViewProps {
  data: PaymentTransactionListData | null
  isLoading: boolean
  error: string | null
  filters: PaymentTransactionFiltersForm
  onChange: <K extends keyof PaymentTransactionFiltersForm>(
    field: K,
    value: PaymentTransactionFiltersForm[K],
  ) => void
  onApply: () => void
  onClear: () => void
  onPageChange: (page: number) => void
}

function mapTransactionStatus(status: string) {
  const normalized = status.toUpperCase()

  if (normalized === 'COMPLETED') return 'connected'
  if (normalized === 'PENDING') return 'pending'
  if (normalized === 'CANCELLED' || normalized === 'REFUNDED') return 'invalid'
  return 'unknown'
}

function getTransactionUserDetails(transaction: PaymentTransaction) {
  if (transaction.user) {
    return {
      primary: transaction.user.name,
      secondary: transaction.user.email,
      tertiary: transaction.user.phone ?? transaction.userId ?? '—',
    }
  }

  return {
    primary: transaction.userId ?? '—',
    secondary: '—',
    tertiary: '—',
  }
}

export function PaymentTransactionsListView({
  data,
  isLoading,
  error,
  filters,
  onChange,
  onApply,
  onClear,
  onPageChange,
}: PaymentTransactionsListViewProps) {
  const { t, i18n } = useTranslation()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null)

  const items = data?.items ?? []
  const pagination = data?.pagination ?? { page: 1, totalPages: 0, total: 0, limit: 20 }
  const activeFiltersCount = useMemo(() => {
    return [
      filters.provider,
      filters.status,
      filters.userQuery.trim(),
      filters.paymentPlanId.trim(),
      filters.startDate,
      filters.endDate,
      filters.limit !== '20' ? filters.limit : '',
    ].filter(Boolean).length
  }, [filters])

  function renderStatusBadge(status: string) {
    return (
      <StatusBadge
        status={mapTransactionStatus(status)}
        className="w-fit gap-1 px-2 py-1 text-[11px] leading-none"
        icon={<span className="h-1 w-1 rounded-full bg-current" />}
      >
        {status}
      </StatusBadge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="gap-2 rounded-[12px] border-slate-200 bg-white hover:bg-pulse-surface"
          onClick={() => setIsFiltersOpen(true)}
          disabled={isLoading}
        >
          <Funnel size={18} weight="bold" aria-hidden="true" />
          {activeFiltersCount > 0
            ? t('payments.transactions.openFiltersWithCount', { count: activeFiltersCount })
            : t('payments.transactions.openFilters')}
        </Button>
      </div>

      <div className="flex flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white">
        <div
          className={`${PAYMENT_TRANSACTIONS_TABLE_GRID} hidden border-b border-slate-200 bg-pulse-surface/40 py-3 md:grid`}
        >
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('payments.transactions.columns.purchasedAt')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('payments.transactions.columns.provider')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('payments.transactions.columns.amount')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('payments.transactions.columns.userId')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('payments.transactions.columns.plan')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('payments.transactions.columns.access')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">
            {t('payments.transactions.columns.status')}
          </span>
          <span className="font-sans text-xs font-medium text-pulse-muted">{t('common.actions')}</span>
        </div>

        {isLoading ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-muted">{t('payments.transactions.loading')}</p>
        ) : error ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-error-border">{error}</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-muted">{t('payments.transactions.empty')}</p>
        ) : (
          <>
            <div className="divide-y divide-slate-200">
              {items.map((transaction) => {
                const userDetails = getTransactionUserDetails(transaction)

                return (
                  <div key={transaction.id} className="px-4 py-4 md:px-0 md:py-0">
                    <div className={`${PAYMENT_TRANSACTIONS_TABLE_GRID} hidden items-center py-4 md:grid`}>
                      <div className="flex flex-col">
                        <span className="font-sans text-sm font-semibold text-pulse-navy">
                          {formatDate(transaction.purchasedAt, i18n.language)}
                        </span>
                        <span className="mt-1 font-sans text-xs text-pulse-muted">{transaction.providerOrderId}</span>
                      </div>
                      <span className="font-sans text-sm text-pulse-navy">{transaction.provider}</span>
                      <span className="font-sans text-sm text-pulse-navy">
                        {formatCurrency(transaction.amount, i18n.language, transaction.currency)}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-sans text-xs font-medium text-pulse-navy">
                          {userDetails.primary}
                        </span>
                        <span className="truncate font-sans text-xs text-pulse-muted">
                          {userDetails.secondary}
                        </span>
                        <span className="truncate font-sans text-xs text-pulse-muted">
                          {userDetails.tertiary}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-xs text-pulse-navy">
                          {transaction.paymentPlan?.name ?? '—'}
                        </span>
                        <span className="break-all font-sans text-xs text-pulse-navy">
                          {transaction.paymentPlanId ?? '—'}
                        </span>
                        {transaction.paymentPlan ? (
                          <span className="mt-1 font-sans text-xs text-pulse-muted">
                            {transaction.paymentPlan.type} •{' '}
                            {formatPaymentPlanDuration(transaction.paymentPlan, t)}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-xs text-pulse-navy">
                          {transaction.accessStartsAt ? formatDate(transaction.accessStartsAt, i18n.language) : '—'}
                        </span>
                        <span className="mt-1 font-sans text-xs text-pulse-muted">
                          {transaction.accessExpiresAt ? formatDate(transaction.accessExpiresAt, i18n.language) : '—'}
                        </span>
                      </div>
                      {renderStatusBadge(String(transaction.status))}
                      <div className="flex items-center justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
                        >
                          <MagnifyingGlass size={14} aria-hidden="true" />
                          {t('payments.transactions.details')}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="font-sans text-sm font-semibold text-pulse-navy">
                            {formatCurrency(transaction.amount, i18n.language, transaction.currency)}
                          </span>
                          <span className="mt-1 font-sans text-xs text-pulse-muted">
                            {formatDate(transaction.purchasedAt, i18n.language)} • {transaction.provider}
                          </span>
                        </div>
                        {renderStatusBadge(String(transaction.status))}
                      </div>
                      <span className="break-all font-sans text-xs text-pulse-muted">
                        {t('payments.transactions.mobile.order')}: {transaction.providerOrderId}
                      </span>
                      <div className="flex flex-col gap-1 font-sans text-xs text-pulse-muted">
                        <span>{t('payments.transactions.mobile.user')}: {userDetails.primary}</span>
                        <span className="break-all">{userDetails.secondary}</span>
                        <span className="break-all">{userDetails.tertiary}</span>
                      </div>
                      <span className="break-all font-sans text-xs text-pulse-muted">
                        {t('payments.transactions.mobile.plan')}:{' '}
                        {transaction.paymentPlan?.name
                          ? `${transaction.paymentPlan.name} (${transaction.paymentPlanId ?? '—'})`
                          : transaction.paymentPlanId ?? '—'}
                      </span>
                      <span className="font-sans text-xs text-pulse-muted">
                        {t('payments.transactions.mobile.access')}:{' '}
                        {transaction.accessStartsAt ? formatDate(transaction.accessStartsAt, i18n.language) : '—'} →{' '}
                        {transaction.accessExpiresAt ? formatDate(transaction.accessExpiresAt, i18n.language) : '—'}
                      </span>
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
                        >
                          <MagnifyingGlass size={14} aria-hidden="true" />
                          {t('payments.transactions.details')}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-200 px-4 py-3">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                shown={items.length}
                total={pagination.total}
                onPageChange={onPageChange}
              />
            </div>
          </>
        )}
      </div>

      <PaymentTransactionsFiltersModal
        isOpen={isFiltersOpen}
        isLoading={isLoading}
        filters={filters}
        onClose={() => setIsFiltersOpen(false)}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />

      <Modal
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
        className="max-w-3xl rounded-[24px]"
        dimOverlay
      >
        {selectedTransaction ? (
          <div className="space-y-6 p-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-pulse-navy">
                {t('payments.transactions.detailsTitle')}
              </h2>
              <p className="mt-1 text-sm text-pulse-muted">{selectedTransaction.providerOrderId}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <span className="text-xs font-medium text-pulse-muted">{t('payments.transactions.columns.provider')}</span>
                <p className="text-sm text-pulse-navy">{selectedTransaction.provider}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-pulse-muted">{t('payments.transactions.columns.status')}</span>
                <div>{renderStatusBadge(String(selectedTransaction.status))}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-pulse-muted">{t('payments.transactions.columns.amount')}</span>
                <p className="text-sm text-pulse-navy">
                  {formatCurrency(selectedTransaction.amount, i18n.language, selectedTransaction.currency)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-pulse-muted">
                  {t('payments.transactions.columns.purchasedAt')}
                </span>
                <p className="text-sm text-pulse-navy">
                  {formatDate(selectedTransaction.purchasedAt, i18n.language)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-pulse-muted">{t('payments.transactions.columns.userId')}</span>
                <p className="text-sm text-pulse-navy">{getTransactionUserDetails(selectedTransaction).primary}</p>
                <p className="text-xs text-pulse-muted">{getTransactionUserDetails(selectedTransaction).secondary}</p>
                <p className="text-xs text-pulse-muted">{getTransactionUserDetails(selectedTransaction).tertiary}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-pulse-muted">{t('payments.transactions.columns.plan')}</span>
                <p className="text-sm text-pulse-navy">{selectedTransaction.paymentPlan?.name ?? '—'}</p>
                <p className="text-xs text-pulse-muted break-all">{selectedTransaction.paymentPlanId ?? '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-pulse-muted">{t('payments.transactions.detailsAccessStart')}</span>
                <p className="text-sm text-pulse-navy">
                  {selectedTransaction.accessStartsAt
                    ? formatDate(selectedTransaction.accessStartsAt, i18n.language)
                    : '—'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-pulse-muted">{t('payments.transactions.detailsAccessEnd')}</span>
                <p className="text-sm text-pulse-navy">
                  {selectedTransaction.accessExpiresAt
                    ? formatDate(selectedTransaction.accessExpiresAt, i18n.language)
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
