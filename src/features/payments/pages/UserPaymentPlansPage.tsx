import { useState } from 'react'
import { CircleNotch, Sparkle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal } from '@/components'
import type { UserSession } from '@/features/auth/types/auth.types'
import { useCurrentTenant } from '@/features/auth/hooks/useCurrentTenant'
import { useApiMessage } from '@/hooks/useApiMessage'
import { storage } from '@/services/storage'
import { formatCurrency } from '@/utils/formatters'
import {
  cancelCurrentPaymentSubscriptionRequest,
} from '../services/payment-service'
import { formatPaymentPlanDuration } from '../utils/format-plan-duration'
import { useNavigate } from 'react-router-dom';

export function UserPaymentPlansPage() {
  const { t, i18n } = useTranslation()
  const { getErrorMessage } = useApiMessage()
  const { payment: currentPayment } = useCurrentTenant()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false)
  const navigate = useNavigate()
  const canCancelCurrentSubscription = Boolean(
    currentPayment?.currentPlan?.type === 'SUBSCRIPTION' &&
      currentPayment?.providerSubscriptionId &&
      currentPayment?.currentPlan?.totalDurationMonths == null &&
      !currentPayment?.cancelAtPeriodEnd,
  )
  const hasFixedSubscriptionTerm = Boolean(
    currentPayment?.currentPlan?.type === 'SUBSCRIPTION' &&
      typeof currentPayment?.currentPlan?.totalDurationMonths === 'number' &&
      currentPayment.currentPlan.totalDurationMonths > 0,
  )

  function syncCurrentTenantPaymentInSession(payment: UserSession['tenant']['payment']) {
    const user = storage.getUser<UserSession>()

    if (!user) return

    storage.setUser<UserSession>({
      ...user,
      tenant: {
        ...user.tenant,
        payment,
      },
    })
    window.dispatchEvent(new Event('auth-changed'))
  }

  async function handleCancelSubscription() {
    setIsCancellingSubscription(true)
    setSubmitError(null)

    try {
      const payment = await cancelCurrentPaymentSubscriptionRequest()
      syncCurrentTenantPaymentInSession(payment)
      setIsCancelModalOpen(false)
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError))
    } finally {
      setIsCancellingSubscription(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-pulse-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-pulse-blue">
          <Sparkle size={14} aria-hidden="true" />
          {t('payments.userPlans.eyebrow')}
        </div>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-pulse-navy">
          {t('payments.userPlans.title')}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-pulse-muted">
          {t('payments.userPlans.subtitle')}
        </p>
      </header>

      {currentPayment?.currentPlan ? (
        <section className="rounded-[24px] border border-pulse-blue/20 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-pulse-blue">
            {t('payments.userPlans.currentPlanEyebrow')}
          </p>
          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-pulse-navy">
                {currentPayment.currentPlan.name || t('payments.userPlans.fallbackName')}
              </h2>
              <p className="mt-1 text-sm text-pulse-muted">
                {t('payments.userPlans.currentPlanValidity', {
                  date: currentPayment.expiresAt
                    ? new Date(currentPayment.expiresAt).toLocaleDateString(i18n.language)
                    : '—',
                })}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="font-heading text-2xl font-semibold text-pulse-navy">
                {formatCurrency(
                  currentPayment.currentPlan.value ?? 0,
                  i18n.language,
                  currentPayment.currentPlan.currency ?? 'BRL',
                )}
              </p>
              <p className="text-sm text-pulse-muted">
                {formatPaymentPlanDuration(
                  {
                    type: currentPayment.currentPlan.type ?? 'ONE_TIME',
                    durationDays: currentPayment.currentPlan.durationDays ?? 0,
                    maxBillingCycles: currentPayment.currentPlan.totalDurationMonths ?? null,
                    totalDurationMonths: currentPayment.currentPlan.totalDurationMonths ?? null,
                  },
                  t,
                )}
              </p>
            </div>
          </div>
          {currentPayment.cancelAtPeriodEnd ? (
            <div className="mt-4">
              <Alert>{t('payments.userPlans.cancellationScheduled')}</Alert>
            </div>
          ) : null}
          {hasFixedSubscriptionTerm ? (
            <div className="mt-4">
              <Alert>{t('payments.userPlans.fixedSubscriptionInfo')}</Alert>
            </div>
          ) : null}
          {canCancelCurrentSubscription ? (
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="outline" size="md" onClick={() => setIsCancelModalOpen(true)}>
                {t('payments.userPlans.cancelSubscriptionAction')}
              </Button>
            </div>
          ) : null}
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" size="md" onClick={() => navigate('/plans/upgrade')}>
              {t('payments.userPlans.upgradeSubscriptionAction')}
            </Button>
          </div>
        </section>
      ) : null}

      {submitError ? <Alert>{submitError}</Alert> : null}

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => {
          if (isCancellingSubscription) return
          setIsCancelModalOpen(false)
        }}
        dimOverlay
        className="max-w-md rounded-[24px] p-6"
      >
        <div className="flex flex-col gap-4">
          <h2 className="pr-10 font-sans text-2xl font-semibold text-pulse-navy">
            {t('payments.userPlans.cancelSubscriptionTitle')}
          </h2>
          <p className="font-sans text-sm text-pulse-muted">
            {t('payments.userPlans.cancelSubscriptionConfirm')}
          </p>
          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="rounded-pill border-slate-200 bg-white hover:bg-pulse-surface"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={isCancellingSubscription}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              variant="brand"
              size="md"
              className="gap-2 !bg-[#C51A31] hover:!bg-[#a81629]"
              onClick={handleCancelSubscription}
              disabled={isCancellingSubscription}
            >
              {isCancellingSubscription ? (
                <>
                  <CircleNotch className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
                  {t('payments.userPlans.cancellingSubscription')}
                </>
              ) : (
                t('payments.userPlans.cancelSubscriptionAction')
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
