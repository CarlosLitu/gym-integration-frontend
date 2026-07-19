import { CheckCircle, CircleNotch, Clock, CreditCard, Repeat } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components'
import { formatCurrency } from '@/utils/formatters'
import type { PaymentPlan } from '../types/payment.types'
import { formatPaymentPlanDuration } from '../utils/format-plan-duration'

interface UserPaymentPlanCardProps {
  plan: PaymentPlan
  isSubmitting: boolean
  onSelect: (plan: PaymentPlan) => void
}

export function UserPaymentPlanCard({
  plan,
  isSubmitting,
  onSelect,
}: UserPaymentPlanCardProps) {
  const { t, i18n } = useTranslation()
  const displayName = plan.name?.trim() || t('payments.userPlans.fallbackName')

  return (
    <article className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-card transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex w-fit rounded-full bg-pulse-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-pulse-blue">
            {plan.type === 'SUBSCRIPTION'
              ? t('payments.userPlans.types.subscription')
              : t('payments.userPlans.types.oneTime')}
          </span>
          <h2 className="font-heading text-2xl font-semibold text-pulse-navy">{displayName}</h2>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3F7FF] text-pulse-blue">
          <CreditCard size={22} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-6">
        <p className="font-heading text-4xl font-bold text-pulse-navy">
          {formatCurrency(plan.value, i18n.language, plan.currency)}
        </p>
        <p className="mt-1 text-sm text-pulse-muted">{t('payments.userPlans.priceSubtitle')}</p>
      </div>

      <div className="mt-6 space-y-3 rounded-[20px] bg-slate-50 p-4">
        <div className="flex items-center gap-3 text-sm text-pulse-navy">
          <Clock size={18} className="shrink-0 text-pulse-blue" aria-hidden="true" />
          <span>{formatPaymentPlanDuration(plan, t)}</span>
        </div>
        {plan.type === 'ONE_TIME' ? (
          <div className="flex items-center gap-3 text-sm text-pulse-navy">
            <Repeat size={18} className="shrink-0 text-pulse-blue" aria-hidden="true" />
            <span>
              {plan.allowMultiplePurchases
                ? t('payments.userPlans.multipleAllowed')
                : t('payments.userPlans.multipleBlocked')}
            </span>
          </div>
        ) : null}
      </div>

      {Array.isArray(plan.permissions) && plan.permissions.length > 0 ? (
        <div className="mt-6 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-pulse-muted">
            {t('payments.userPlans.permissionsTitle')}
          </p>
          <ul className="mt-3 space-y-2">
            {plan.permissions.map((permission) => (
              <li key={permission} className="flex items-start gap-2 text-sm text-pulse-navy">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-[#00B894]" aria-hidden="true" />
                <span className="break-words">{permission}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6 flex-1 rounded-[16px] border border-dashed border-slate-200 p-4 text-sm text-pulse-muted">
          {t('payments.userPlans.noPermissions')}
        </div>
      )}

      <Button
        type="button"
        variant="brand"
        size="lg"
        className="mt-6 w-full"
        onClick={() => onSelect(plan)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <CircleNotch className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            {t('payments.userPlans.selecting')}
          </>
        ) : (
          t('payments.userPlans.selectAction')
        )}
      </Button>
    </article>
  )
}
