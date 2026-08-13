import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PaymentTransactionsListView, type PaymentTransactionFiltersForm } from '../components/PaymentTransactionsListView'
import { usePaymentTransactions } from '../hooks/usePaymentTransactions'

const DEFAULT_FILTERS: PaymentTransactionFiltersForm = {
  provider: '',
  status: '',
  userQuery: '',
  paymentPlanId: '',
  startDate: '',
  endDate: '',
}

const PAGE_SIZE = 10

export function PaymentTransactionsPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<PaymentTransactionFiltersForm>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const requestParams = useMemo(() => {
    return {
      provider: appliedFilters.provider || undefined,
      status: appliedFilters.status || undefined,
      userQuery: appliedFilters.userQuery.trim() || undefined,
      paymentPlanId: appliedFilters.paymentPlanId.trim() || undefined,
      startDate: appliedFilters.startDate || undefined,
      endDate: appliedFilters.endDate || undefined,
      page,
      limit: PAGE_SIZE,
    }
  }, [appliedFilters, page])

  const { data, isLoading, error } = usePaymentTransactions(requestParams)

  const handleChange = useCallback(
    <K extends keyof PaymentTransactionFiltersForm>(field: K, value: PaymentTransactionFiltersForm[K]) => {
      setFilters((current) => ({ ...current, [field]: value }))
    },
    [],
  )

  const handleApply = useCallback(() => {
    setAppliedFilters(filters)
    setPage(1)
  }, [filters])

  const handleSearchChange = useCallback((value: string) => {
    setFilters((current) => ({ ...current, userQuery: value }))
    setAppliedFilters((current) => ({ ...current, userQuery: value }))
    setPage(1)
  }, [])

  const handleClear = useCallback(() => {
    setFilters((current) => ({
      ...DEFAULT_FILTERS,
      userQuery: current.userQuery,
    }))
  }, [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-pulse-navy">{t('payments.transactions.title')}</h1>
        <p className="mt-1 text-sm text-pulse-muted">{t('payments.transactions.subtitle')}</p>
      </header>

      <PaymentTransactionsListView
        data={data}
        isLoading={isLoading}
        error={error}
        filters={filters}
        onChange={handleChange}
        onSearchChange={handleSearchChange}
        onApply={handleApply}
        onClear={handleClear}
        onPageChange={setPage}
      />
    </div>
  )
}
