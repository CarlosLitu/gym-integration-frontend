import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePaymentPlans } from '../hooks/usePaymentPlans'
import { PaymentPlansListView } from '../components/PaymentPlansListView'
import type { PaymentPlan } from '../types/payment.types'

export function PaymentPlansPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { plans, isLoading, error } = usePaymentPlans(true)
  const [planItems, setPlanItems] = useState<PaymentPlan[]>([])

  useEffect(() => {
    setPlanItems(plans)
  }, [plans])

  function handleOpenCreate() {
    navigate('/payments/plans/new')
  }

  function handleOpenPlan(planId: string) {
    navigate(`/payments/plans/${planId}`)
  }

  function handlePlanUpdated(updatedPlan: PaymentPlan) {
    setPlanItems((currentPlans) =>
      currentPlans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan)),
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-pulse-navy">{t('payments.plans.title')}</h1>
        <p className="mt-1 text-sm text-pulse-muted">{t('payments.plans.subtitle')}</p>
      </header>

      <PaymentPlansListView
        plans={planItems}
        isLoading={isLoading}
        error={error}
        onNewPlan={handleOpenCreate}
        onOpenPlan={handleOpenPlan}
        onPlanUpdated={handlePlanUpdated}
      />
    </div>
  )
}
