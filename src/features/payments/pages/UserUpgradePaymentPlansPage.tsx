import { useState } from 'react'
import { CircleNotch, Sparkle, WarningCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal } from '@/components'
import type { UserSession } from '@/features/auth/types/auth.types'
import { useApiMessage } from '@/hooks/useApiMessage'
import { storage } from '@/services/storage'
import { UserPaymentPlanCard } from '../components/UserPaymentPlanCard'
import { useUserPaymentPlans } from '../hooks/useUserPaymentPlans'
import {
  cancelCurrentPaymentSubscriptionRequest,
  createPaymentOrderRequest,
} from '../services/payment-service'
import type { PaymentPlan } from '../types/payment.types'

export function UserUpgradePaymentPlansPage() {
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()
  const { plans, isLoading, error } = useUserPaymentPlans(true)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false)

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

  async function handleSelectPlan(plan: PaymentPlan) {
    setSelectedPlanId(plan.id)
    setSubmitError(null)

    try {
      const order = await createPaymentOrderRequest({
        planId: plan.id,
        offerId: plan.offer?.isCurrentlyActive ? plan.offer.id : undefined,
      })

      if (!order.approveUrl) {
        throw new Error('missing_approve_url')
      }

      window.location.assign(order.approveUrl)
    } catch (requestError) {
      if (requestError instanceof Error && requestError.message === 'missing_approve_url') {
        setSubmitError(t('payments.userPlans.redirectError'))
      } else {
        setSubmitError(getErrorMessage(requestError))
      }
    } finally {
      setSelectedPlanId(null)
    }
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

      {submitError ? <Alert>{submitError}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}

      {isLoading ? (
        <section className="rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-card">
          <p className="text-sm text-pulse-muted">{t('payments.userPlans.loading')}</p>
        </section>
      ) : null}

      {!isLoading && !error && plans.length === 0 ? (
        <section className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-pulse-muted">
            <WarningCircle size={22} aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-semibold text-pulse-navy">
            {t('payments.userPlans.emptyTitle')}
          </h2>
          <p className="mt-2 text-sm text-pulse-muted">{t('payments.userPlans.emptySubtitle')}</p>
        </section>
      ) : null}

      {!isLoading && !error && plans.length > 0 ? (
        <section className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
          {plans.map((plan) => (
            <UserPaymentPlanCard
              key={plan.id}
              plan={plan}
              isSubmitting={selectedPlanId === plan.id}
              onSelect={handleSelectPlan}
            />
          ))}
        </section>
      ) : null}

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
