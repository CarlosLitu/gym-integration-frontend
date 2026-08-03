import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Input } from '@/components'
import { useApiMessage } from '@/hooks/useApiMessage'
import { PaymentPlanForm } from '../components/PaymentPlanForm'
import { usePaymentPlanForm } from '../hooks/usePaymentPlanForm'
import {
  deletePaymentPlanOfferRequest,
  getPaymentPlanRequest,
  upsertPaymentPlanOfferRequest,
} from '../services/payment-service'
import type { PaymentPlan } from '../types/payment.types'

interface OfferFormValues {
  value: string
  compareAtValue: string
  startsAt: string
  endsAt: string
  isActive: boolean
}

const EMPTY_OFFER_VALUES: OfferFormValues = {
  value: '',
  compareAtValue: '',
  startsAt: '',
  endsAt: '',
  isActive: true,
}

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
  const [offerValues, setOfferValues] = useState<OfferFormValues>(EMPTY_OFFER_VALUES)
  const [offerError, setOfferError] = useState<string | null>(null)
  const [isSavingOffer, setIsSavingOffer] = useState(false)
  const [isDeletingOffer, setIsDeletingOffer] = useState(false)
  const hasOfferProvisioning = useMemo(
    () => Boolean(plan?.offer?.paymentPlanIds?.paypal || plan?.offer?.paymentProductIds?.paypal),
    [plan],
  )

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

  useEffect(() => {
    if (!plan?.offer) {
      setOfferValues(EMPTY_OFFER_VALUES)
      return
    }

    setOfferValues({
      value: String(plan.offer.value),
      compareAtValue:
        plan.offer.compareAtValue === null || plan.offer.compareAtValue === undefined
          ? ''
          : String(plan.offer.compareAtValue),
      startsAt: toDateTimeLocalValue(plan.offer.startsAt),
      endsAt: toDateTimeLocalValue(plan.offer.endsAt),
      isActive: plan.offer.isActive,
    })
  }, [plan])

  function handleBack() {
    navigate('/payments/plans')
  }

  function setOfferField<K extends keyof OfferFormValues>(field: K, value: OfferFormValues[K]) {
    setOfferValues((current) => ({
      ...current,
      [field]: value,
    }))
    setOfferError(null)
  }

  async function handleSubmit() {
    try {
      await form.submit()
      navigate(-1)
    } catch {
      return
    }
  }

  async function handleSaveOffer() {
    if (!id) return

    setIsSavingOffer(true)
    setOfferError(null)

    try {
      const updatedOffer = await upsertPaymentPlanOfferRequest(id, {
        value: Number(offerValues.value),
        compareAtValue: offerValues.compareAtValue.trim() === '' ? null : Number(offerValues.compareAtValue),
        startsAt: offerValues.startsAt.trim() === '' ? null : new Date(offerValues.startsAt).toISOString(),
        endsAt: offerValues.endsAt.trim() === '' ? null : new Date(offerValues.endsAt).toISOString(),
        isActive: offerValues.isActive,
      })

      setPlan((current) =>
        current
          ? {
              ...current,
              offer: updatedOffer,
              effectiveValue: updatedOffer.isCurrentlyActive ? updatedOffer.value : current.value,
            }
          : current,
      )
    } catch (requestError) {
      setOfferError(getErrorMessage(requestError))
    } finally {
      setIsSavingOffer(false)
    }
  }

  async function handleDeleteOffer() {
    if (!id || !plan?.offer) return

    setIsDeletingOffer(true)
    setOfferError(null)

    try {
      await deletePaymentPlanOfferRequest(id)
      setPlan((current) =>
        current
          ? {
              ...current,
              offer: null,
              effectiveValue: current.value,
            }
          : current,
      )
      setOfferValues(EMPTY_OFFER_VALUES)
    } catch (requestError) {
      setOfferError(getErrorMessage(requestError))
    } finally {
      setIsDeletingOffer(false)
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
            <section className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
              <div className="space-y-1">
                <h2 className="font-sans text-lg font-semibold text-pulse-navy">
                  {t('payments.plans.offer.title')}
                </h2>
                <p className="text-sm text-pulse-muted">{t('payments.plans.offer.subtitle')}</p>
              </div>

              {offerError ? <div className="mt-4"><Alert>{offerError}</Alert></div> : null}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label={t('payments.plans.offer.value')}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={offerValues.value}
                  onChange={(event) => setOfferField('value', event.target.value)}
                  disabled={isSavingOffer || isDeletingOffer || hasOfferProvisioning}
                />
                <Input
                  label={t('payments.plans.offer.compareAtValue')}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={offerValues.compareAtValue}
                  onChange={(event) => setOfferField('compareAtValue', event.target.value)}
                  disabled={isSavingOffer || isDeletingOffer}
                />
                <Input
                  label={t('payments.plans.offer.startsAt')}
                  type="datetime-local"
                  value={offerValues.startsAt}
                  onChange={(event) => setOfferField('startsAt', event.target.value)}
                  disabled={isSavingOffer || isDeletingOffer}
                />
                <Input
                  label={t('payments.plans.offer.endsAt')}
                  type="datetime-local"
                  value={offerValues.endsAt}
                  onChange={(event) => setOfferField('endsAt', event.target.value)}
                  disabled={isSavingOffer || isDeletingOffer}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant={offerValues.isActive ? 'active' : 'outline'}
                  onClick={() => setOfferField('isActive', true)}
                  disabled={isSavingOffer || isDeletingOffer}
                >
                  {t('common.yes')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={!offerValues.isActive ? 'active' : 'outline'}
                  onClick={() => setOfferField('isActive', false)}
                  disabled={isSavingOffer || isDeletingOffer}
                >
                  {t('common.no')}
                </Button>
                <span className="text-sm text-pulse-muted">{t('payments.plans.offer.activeLabel')}</span>
              </div>

              {hasOfferProvisioning ? (
                <p className="mt-4 text-xs text-pulse-muted">{t('payments.plans.offer.lockedValueHint')}</p>
              ) : null}

              <div className="mt-5 flex flex-wrap justify-end gap-3">
                {plan.offer ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleDeleteOffer}
                    disabled={isSavingOffer || isDeletingOffer}
                  >
                    {t('payments.plans.offer.delete')}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="brand"
                  size="md"
                  onClick={handleSaveOffer}
                  disabled={isSavingOffer || isDeletingOffer || offerValues.value.trim() === ''}
                >
                  {plan.offer ? t('payments.plans.offer.save') : t('payments.plans.offer.create')}
                </Button>
              </div>
            </section>
          </div>
        ) : (
          <Alert>{t('payments.plans.edit.notFound')}</Alert>
        )}
      </section>
    </div>
  )
}

function toDateTimeLocalValue(value: string | null) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''

  const timezoneOffsetMs = parsed.getTimezoneOffset() * 60 * 1000
  return new Date(parsed.getTime() - timezoneOffsetMs).toISOString().slice(0, 16)
}
