import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@/components'
import { useApiMessage } from '@/hooks/useApiMessage'
import { PaymentPlanForm } from '../components/PaymentPlanForm'
import { usePaymentPlanForm } from '../hooks/usePaymentPlanForm'
import { getPaymentPlanRequest } from '../services/payment-service'
import type { PaymentPlan } from '../types/payment.types'

export function PaymentPlanEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getErrorMessage } = useApiMessage()
  const [plan, setPlan] = useState<PaymentPlan | null>(null)
  const [isLoadingPlan, setIsLoadingPlan] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const form = usePaymentPlanForm({
    mode: 'edit',
    initialPlan: plan,
  })

  useEffect(() => {
    if (!id) {
      setLoadError(t('payments.plans.edit.notFound'))
      setIsLoadingPlan(false)
      return
    }

    let isMounted = true
    setIsLoadingPlan(true)
    setLoadError(null)

    getPaymentPlanRequest(id)
      .then((data) => {
        if (isMounted) {
          setPlan(data)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setLoadError(getErrorMessage(requestError))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingPlan(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [getErrorMessage, id, t])

  function handleBack() {
    navigate('/payments/plans')
  }

  async function handleSubmit() {
    try {
      await form.submit()
      navigate(-1)
    } catch {
      return
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex w-fit items-center gap-1 font-sans text-sm text-pulse-navy transition-colors hover:text-pulse-blue"
        >
          <CaretLeft size={16} weight="bold" aria-hidden="true" />
          {t('payments.plans.edit.back')}
        </button>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-pulse-navy">
            {t('payments.plans.edit.title')}
          </h1>
          <p className="mt-1 text-sm text-pulse-muted">{t('payments.plans.edit.subtitle')}</p>
        </div>
      </header>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-card">
        {isLoadingPlan ? (
          <p className="text-sm text-pulse-muted">{t('payments.plans.edit.loading')}</p>
        ) : loadError ? (
          <Alert>{loadError}</Alert>
        ) : plan ? (
          <div className="space-y-6">
            <PaymentPlanForm
              title={t('payments.plans.form.editTitle')}
              values={form.values}
              fieldErrors={form.fieldErrors}
              isValid={form.isValid}
              isLoading={form.isLoading}
              error={form.error}
              onCancel={handleBack}
              onChange={form.setField}
              onSubmit={handleSubmit}
              submitLabel={t('common.save')}
              lockValueField={form.hasPayPalProvisioning}
              lockDurationField={form.hasPayPalProvisioning}
              lockMaxBillingCyclesField={form.hasPayPalProvisioning}
              disableTypeField
              technicalDetails={{
                paypalProductId: plan.paymentProductIds?.paypal ?? null,
                paypalPlanId: plan.paymentPlanIds?.paypal ?? null,
              }}
            />
          </div>
        ) : (
          <Alert>{t('payments.plans.edit.notFound')}</Alert>
        )}
      </section>
    </div>
  )
}
