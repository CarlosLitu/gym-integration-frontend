import { useMemo, useState } from 'react'
import { CheckCircle, PencilSimple, PlusCircle, Prohibit, XCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Button, FiltersPopover, SearchInput, StatusBadge, type FiltersPopoverField } from '@/components'
import { Pagination } from '@/features/tenants/components/Pagination'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { PaymentPlan, PaymentPlanType } from '../types/payment.types'
import { PaymentPlanStatusModal } from './PaymentPlanStatusModal'
import { PAYMENT_PLANS_TABLE_GRID } from './payment-plans-table-grid'
import { formatPaymentPlanDuration } from '../utils/format-plan-duration'

const PAGE_SIZE = 10

type ActiveFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

interface PlanFiltersForm {
  status: ActiveFilter
  type: '' | PaymentPlanType
  value: string
  duration: string
}

const DEFAULT_FILTERS: PlanFiltersForm = {
  status: 'ALL',
  type: '',
  value: '',
  duration: '',
}

function getPlanDurationKey(plan: PaymentPlan) {
  if (plan.type === 'SUBSCRIPTION') {
    const totalDurationMonths = plan.totalDurationMonths ?? plan.maxBillingCycles
    if (typeof totalDurationMonths === 'number' && totalDurationMonths > 0) {
      return `months:${totalDurationMonths}`
    }
  }

  return `days:${plan.durationDays}`
}

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
  const [filters, setFilters] = useState<PlanFiltersForm>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<PlanFiltersForm>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null)
  const getPlanTypeLabel = (type: PaymentPlan['type']) => t(`payments.plans.form.types.${type}`)

  const valueOptions = useMemo(() => {
    const uniqueValues = Array.from(new Set(plans.map((plan) => plan.value))).sort((a, b) => a - b)

    return uniqueValues.map((value) => {
      const currency = plans.find((plan) => plan.value === value)?.currency ?? 'BRL'
      return {
        value: String(value),
        label: formatCurrency(value, i18n.language, currency),
      }
    })
  }, [i18n.language, plans])

  const durationOptions = useMemo(() => {
    const optionsByKey = new Map<string, string>()

    for (const plan of plans) {
      const key = getPlanDurationKey(plan)
      if (!optionsByKey.has(key)) {
        optionsByKey.set(key, formatPaymentPlanDuration(plan, t))
      }
    }

    return Array.from(optionsByKey.entries()).map(([value, label]) => ({ value, label }))
  }, [plans, t])

  const filterFields = useMemo<FiltersPopoverField[]>(
    () => [
      {
        type: 'select',
        id: 'status',
        label: t('payments.plans.columns.status'),
        value: filters.status,
        emptyValue: 'ALL',
        placeholder: t('payments.plans.filterPlaceholder'),
        options: [
          { value: 'ALL', label: t('payments.plans.filters.all') },
          { value: 'ACTIVE', label: t('payments.plans.filters.active') },
          { value: 'INACTIVE', label: t('payments.plans.filters.inactive') },
        ],
      },
      {
        type: 'select',
        id: 'type',
        label: t('payments.plans.columns.type'),
        value: filters.type,
        placeholder: t('common.all'),
        options: [
          { value: '', label: t('common.all') },
          { value: 'ONE_TIME', label: t('payments.plans.form.types.ONE_TIME') },
          { value: 'SUBSCRIPTION', label: t('payments.plans.form.types.SUBSCRIPTION') },
        ],
      },
      {
        type: 'select',
        id: 'value',
        label: t('payments.plans.columns.value'),
        value: filters.value,
        placeholder: t('common.all'),
        options: [{ value: '', label: t('common.all') }, ...valueOptions],
      },
      {
        type: 'select',
        id: 'duration',
        label: t('payments.plans.columns.duration'),
        value: filters.duration,
        placeholder: t('common.all'),
        options: [{ value: '', label: t('common.all') }, ...durationOptions],
      },
    ],
    [durationOptions, filters, t, valueOptions],
  )

  const filteredPlans = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return plans.filter((plan) => {
      const planName = plan.name ?? ''

      if (appliedFilters.status === 'ACTIVE' && !plan.isActive) return false
      if (appliedFilters.status === 'INACTIVE' && plan.isActive) return false
      if (appliedFilters.type && plan.type !== appliedFilters.type) return false
      if (appliedFilters.value && String(plan.value) !== appliedFilters.value) return false
      if (appliedFilters.duration && getPlanDurationKey(plan) !== appliedFilters.duration) return false

      if (!normalizedSearch) return true

      return planName.toLowerCase().includes(normalizedSearch)
    })
  }, [appliedFilters, plans, search])

  const total = filteredPlans.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredPlans.slice(start, start + PAGE_SIZE)
  }, [filteredPlans, currentPage])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleFilterChange(id: string, value: string) {
    setFilters((current) => ({
      ...current,
      [id]: value,
    }))
  }

  function handleApplyFilters() {
    setAppliedFilters(filters)
    setPage(1)
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  function renderStatusBadge(isActive: boolean) {
    const Icon = isActive ? CheckCircle : XCircle

    return (
      <StatusBadge
        status={isActive ? 'connected' : 'invalid'}
        className="w-fit rounded-[999px]"
        icon={<Icon size={14} weight="fill" />}
      >
        {isActive ? t('payments.plans.active') : t('payments.plans.inactive')}
      </StatusBadge>
    )
  }

  function renderStatusActionButton(plan: PaymentPlan) {
    if (plan.isActive) {
      return (
        <button
          type="button"
          onClick={() => setSelectedPlan(plan)}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-medium text-[#C51A31] transition-colors hover:bg-[#FDF2F3]"
        >
          <Prohibit size={14} aria-hidden="true" />
          {t('payments.plans.status.deactivateAction')}
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={() => setSelectedPlan(plan)}
        className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
      >
        <CheckCircle size={14} aria-hidden="true" />
        {t('payments.plans.status.activateAction')}
      </button>
    )
  }


  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={handleSearch}
            name="payment-plan-search"
            placeholder={t('payments.plans.searchPlaceholder')}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <FiltersPopover
            fields={filterFields}
            onChange={handleFilterChange}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            isLoading={isLoading}
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
          <>
            <div className="divide-y divide-slate-200">
              {pageItems.map((plan) => (
                <div key={plan.id} className="px-4 py-4 md:px-0 md:py-0">
                  <div className={`${PAYMENT_PLANS_TABLE_GRID} hidden items-center py-4 md:grid`}>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-sans text-sm font-medium text-pulse-navy">
                        {plan.name ?? '—'}
                      </span>
                      <span className="mt-1 font-sans text-xs text-pulse-muted">
                        {t('payments.plans.createdAt', {
                          date: formatDate(plan.createdAt, i18n.language),
                        })}
                      </span>
                    </div>
                    <span className="font-sans text-sm text-pulse-muted">{getPlanTypeLabel(plan.type)}</span>
                    <span className="font-sans text-sm text-pulse-muted">
                      {formatCurrency(plan.value, i18n.language, plan.currency)}
                    </span>
                    <span className="font-sans text-sm text-pulse-muted">
                      {formatPaymentPlanDuration(plan, t)}
                    </span>
                    {renderStatusBadge(plan.isActive)}
                    <div className="flex items-center justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenPlan(plan.id)}
                        className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-[#F8F9FA] px-3 py-1.5 font-sans text-xs font-medium text-pulse-navy transition-colors hover:bg-pulse-surface"
                      >
                        <PencilSimple size={14} aria-hidden="true" />
                        {t('payments.plans.edit.action')}
                      </button>
                      {renderStatusActionButton(plan)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="font-sans text-sm font-medium text-pulse-navy">{plan.name ?? '—'}</span>
                        <span className="mt-1 font-sans text-xs text-pulse-muted">
                          {getPlanTypeLabel(plan.type)} • {formatCurrency(plan.value, i18n.language, plan.currency)} •{' '}
                          {formatPaymentPlanDuration(plan, t)}
                        </span>
                      </div>
                      {renderStatusBadge(plan.isActive)}
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
                      {renderStatusActionButton(plan)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 px-4 py-3">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                shown={pageItems.length}
                total={total}
                onPageChange={setPage}
              />
            </div>
          </>
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
