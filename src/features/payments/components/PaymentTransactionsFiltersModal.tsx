import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Modal, Select } from '@/components'
import type { PaymentTransactionFiltersForm } from './PaymentTransactionsListView'
import { usePaymentPlans } from '../hooks/usePaymentPlans'

interface PaymentTransactionsFiltersModalProps {
  isOpen: boolean
  isLoading: boolean
  filters: PaymentTransactionFiltersForm
  onClose: () => void
  onChange: <K extends keyof PaymentTransactionFiltersForm>(
    field: K,
    value: PaymentTransactionFiltersForm[K],
  ) => void
  onApply: () => void
  onClear: () => void
}

export function PaymentTransactionsFiltersModal({
  isOpen,
  isLoading,
  filters,
  onClose,
  onChange,
  onApply,
  onClear,
}: PaymentTransactionsFiltersModalProps) {
  const { t } = useTranslation()
  const { plans, isLoading: isPlansLoading, error: plansError } = usePaymentPlans(isOpen)
  const providerOptions = useMemo(
    () => [
      { value: '', label: t('common.all') },
      { value: 'mock', label: 'mock' },
      { value: 'paypal', label: 'paypal' },
    ],
    [t],
  )
  const statusOptions = useMemo(
    () => [
      { value: '', label: t('common.all') },
      { value: 'PENDING', label: 'PENDING' },
      { value: 'COMPLETED', label: 'COMPLETED' },
      { value: 'CANCELLED', label: 'CANCELLED' },
      { value: 'REFUNDED', label: 'REFUNDED' },
    ],
    [t],
  )
  const planOptions = useMemo(
    () => [
      { value: '', label: t('common.all') },
      ...plans.map((plan) => ({
        value: plan.id,
        label: plan.name ?? plan.id,
      })),
    ],
    [plans, t],
  )
  const limitOptions = useMemo(
    () => [
      { value: '10', label: '10' },
      { value: '20', label: '20' },
      { value: '50', label: '50' },
    ],
    [],
  )

  function handleApply() {
    onApply()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} dimOverlay className="max-w-md rounded-[24px] p-0">
      <div className="flex items-center border-b border-slate-200 px-6 py-5">
        <h2 className="pr-10 font-sans text-2xl font-semibold text-pulse-navy">
          {t('payments.transactions.filters.modalTitle')}
        </h2>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5">
        <Select
          label={t('payments.transactions.filters.provider')}
          value={filters.provider}
          options={providerOptions}
          placeholder={t('payments.transactions.filters.providerPlaceholder')}
          onChange={(value) => onChange('provider', value)}
          disabled={isLoading}
        />
        <Select
          label={t('payments.transactions.filters.status')}
          value={filters.status}
          options={statusOptions}
          placeholder={t('payments.transactions.filters.statusPlaceholder')}
          onChange={(value) => onChange('status', value)}
          disabled={isLoading}
        />
        <Select
          label={t('payments.transactions.filters.limit')}
          value={filters.limit}
          options={limitOptions}
          placeholder="20"
          onChange={(value) => onChange('limit', value)}
          disabled={isLoading}
        />
        <Input
          label={t('payments.transactions.filters.userQuery')}
          value={filters.userQuery}
          onChange={(event) => onChange('userQuery', event.target.value)}
          placeholder={t('payments.transactions.filters.userQueryPlaceholder')}
          disabled={isLoading}
        />
        <Select
          label={t('payments.transactions.filters.paymentPlanId')}
          value={filters.paymentPlanId}
          options={planOptions}
          placeholder={t('payments.transactions.filters.paymentPlanIdPlaceholder')}
          onChange={(value) => onChange('paymentPlanId', value)}
          disabled={isLoading || isPlansLoading}
          error={plansError ?? undefined}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('payments.transactions.filters.startDate')}
            type="date"
            value={filters.startDate}
            onChange={(event) => onChange('startDate', event.target.value)}
          />
          <Input
            label={t('payments.transactions.filters.endDate')}
            type="date"
            value={filters.endDate}
            onChange={(event) => onChange('endDate', event.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-slate-200 px-6 py-5">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="flex-1 rounded-[14px] border-slate-200 bg-white hover:bg-pulse-surface"
          onClick={onClear}
          disabled={isLoading}
        >
          {t('common.clearAll')}
        </Button>
        <Button
          type="button"
          variant="brand"
          size="md"
          className="flex-1 rounded-[14px]"
          onClick={handleApply}
          disabled={isLoading}
        >
          {t('common.apply')}
        </Button>
      </div>
    </Modal>
  )
}
