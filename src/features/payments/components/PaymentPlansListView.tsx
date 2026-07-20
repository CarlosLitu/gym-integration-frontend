import { useMemo, useState } from 'react'
import { PencilSimple, PlusCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Button, SearchInput, Select, StatusBadge } from '@/components'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { PaymentPlan } from '../types/payment.types'
import { PaymentPlanStatusModal } from './PaymentPlanStatusModal'
import { PAYMENT_PLANS_TABLE_GRID } from './payment-plans-table-grid'
import { formatPaymentPlanDuration } from '../utils/format-plan-duration'

type ActiveFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

interface PaymentPlansListViewProps {
  plans: PaymentPlan[]
  isLoading: boolean
  error: string | null
  onNewPlan: () => void
  onOpenPlan: (planId: string) => void
  onPlanUpdated: (plan: PaymentPlan) => void
}

export function PaymentPlansListView({
  plans,
  isLoading,
  error,
  onNewPlan,
  onOpenPlan,
  onPlanUpdated,
}: PaymentPlansListViewProps) {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('ALL')
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null)
  const getPlanTypeLabel = (type: PaymentPlan['type']) => t(`payments.plans.form.types.${type}`)
  const activeFilterOptions = useMemo<readonly { value: ActiveFilter; label: string }[]>(
    () => [
      { value: 'ALL', label: t('payments.plans.filters.all') },
      { value: 'ACTIVE', label: t('payments.plans.filters.active') },
      { value: 'INACTIVE', label: t('payments.plans.filters.inactive') },
    ],
    [t],
  )

  const filteredPlans = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return plans.filter((plan) => {
      const planName = plan.name ?? ''

      if (activeFilter === 'ACTIVE' && !plan.isActive) return false
      if (activeFilter === 'INACTIVE' && plan.isActive) return false

      if (!normalizedSearch) return true

      return (
        planName.toLowerCase().includes(normalizedSearch) ||
        plan.id.toLowerCase().includes(normalizedSearch) ||
        plan.currency.toLowerCase().includes(normalizedSearch) ||
        plan.type.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [activeFilter, plans, search])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            name="payment-plan-search"
            placeholder={t('payments.plans.searchPlaceholder')}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select<ActiveFilter>
            value={activeFilter}
            options={activeFilterOptions}
            onChange={setActiveFilter}
            placeholder={t('payments.plans.filterPlaceholder')}
            className="sm:w-[180px]"
          />
          <Button variant="brand" size="md" className="shrink-0 gap-2 !rounded-[12px]" onClick={onNewPlan}>
            <PlusCircle size={20} weight="bold" aria-hidden="true" />
            {t('payments.plans.newPlan')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white">
        <div className={`${PAYMENT_PLANS_TABLE_GRID} hidden border-b border-slate-200 bg-pulse-surface/40 py-3 md:grid`}>
          <span className="font-sans text-xs font-medium text-pulse-muted">{t('payments.plans.columns.name')}</span>
          <span className="font-sans text-xs font-medium text-pulse-muted">{t('payments.plans.columns.type')}</span>
          <span className="font-sans text-xs font-medium text-pulse-muted">{t('payments.plans.columns.value')}</span>
          <span className="font-sans text-xs font-medium text-pulse-muted">{t('payments.plans.columns.duration')}</span>
          <span className="font-sans text-xs font-medium text-pulse-muted">{t('payments.plans.columns.status')}</span>
          <span className="font-sans text-xs font-medium text-pulse-muted">{t('common.actions')}</span>
        </div>

        {isLoading ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-muted">{t('payments.plans.loading')}</p>
        ) : error ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-error-border">{error}</p>
        ) : filteredPlans.length === 0 ? (
          <p className="py-8 text-center font-sans text-sm text-pulse-muted">{t('payments.plans.empty')}</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="px-4 py-4 md:px-0 md:py-0">
                <div className={`${PAYMENT_PLANS_TABLE_GRID} hidden items-center py-4 md:grid`}>
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-semibold text-pulse-navy">{plan.name ?? '—'}</span>
                    <span className="mt-1 font-sans text-xs text-pulse-muted">{plan.id}</span>
                    <span className="mt-1 font-sans text-xs text-pulse-muted">
                      {t('payments.plans.createdAt', {
                        date: formatDate(plan.createdAt, i18n.language),
                      })}
                    </span>
                  </div>
                  <span className="font-sans text-sm text-pulse-navy">{getPlanTypeLabel(plan.type)}</span>
                  <span className="font-sans text-sm text-pulse-navy">
                    {formatCurrency(plan.value, i18n.language, plan.currency)}
                  </span>
                  <span className="font-sans text-sm text-pulse-navy">
                    {formatPaymentPlanDuration(plan, t)}
                  </span>
                  <StatusBadge
                    status={plan.isActive ? 'connected' : 'invalid'}
                    className="w-fit gap-1 px-2 py-1 text-[11px] leading-none"
                    icon={<span className="h-1 w-1 rounded-full bg-current" />}
                  >
                    {plan.isActive ? t('payments.plans.active') : t('payments.plans.inactive')}
                  </StatusBadge>
                  <div className="flex items-center justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenPlan(plan.id)}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
                    >
                      <PencilSimple size={14} aria-hidden="true" />
                      {t('payments.plans.edit.action')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={
                        plan.isActive
                          ? 'inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-medium text-[#C51A31] transition-colors hover:bg-[#FDF2F3]'
                          : 'inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface'
                      }
                    >
                      {plan.isActive
                        ? t('payments.plans.status.deactivateAction')
                        : t('payments.plans.status.activateAction')}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-pulse-navy">{plan.name ?? '—'}</span>
                      <span className="mt-1 font-sans text-xs text-pulse-muted">
                        {getPlanTypeLabel(plan.type)} • {formatCurrency(plan.value, i18n.language, plan.currency)} •{' '}
                        {formatPaymentPlanDuration(plan, t)}
                      </span>
                      <span className="mt-1 font-sans text-xs text-pulse-muted">{plan.id}</span>
                    </div>
                    <StatusBadge
                      status={plan.isActive ? 'connected' : 'invalid'}
                      className="w-fit gap-1 px-2 py-1 text-[11px] leading-none"
                      icon={<span className="h-1 w-1 rounded-full bg-current" />}
                    >
                      {plan.isActive ? t('payments.plans.active') : t('payments.plans.inactive')}
                    </StatusBadge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenPlan(plan.id)}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
                    >
                      <PencilSimple size={14} aria-hidden="true" />
                      {t('payments.plans.edit.action')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={
                        plan.isActive
                          ? 'inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-medium text-[#C51A31] transition-colors hover:bg-[#FDF2F3]'
                          : 'inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface'
                      }
                    >
                      {plan.isActive
                        ? t('payments.plans.status.deactivateAction')
                        : t('payments.plans.status.activateAction')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PaymentPlanStatusModal
        isOpen={Boolean(selectedPlan)}
        plan={selectedPlan}
        nextIsActive={Boolean(selectedPlan && !selectedPlan.isActive)}
        onClose={() => setSelectedPlan(null)}
        onSuccess={onPlanUpdated}
      />
    </div>
  )
}
