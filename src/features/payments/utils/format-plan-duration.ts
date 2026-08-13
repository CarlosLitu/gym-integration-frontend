import type { TFunction } from 'i18next'
import type { PaymentPlan } from '../types/payment.types'

export function formatPaymentPlanDuration(plan: Pick<PaymentPlan, 'type' | 'durationDays' | 'maxBillingCycles' | 'totalDurationMonths'>, t: TFunction) {
  if (plan.type === 'SUBSCRIPTION') {
    const totalDurationMonths = plan.totalDurationMonths ?? plan.maxBillingCycles

    if (typeof totalDurationMonths === 'number' && totalDurationMonths > 0) {
      return totalDurationMonths === 1
        ? t('payments.plans.durationMonthsSingular', { months: totalDurationMonths })
        : t('payments.plans.durationMonthsPlural', { months: totalDurationMonths })
    }
  }

  return t('payments.plans.durationDays', { days: plan.durationDays })
}
