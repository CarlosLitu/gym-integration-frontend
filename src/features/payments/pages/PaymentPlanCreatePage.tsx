import { useNavigate } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { PaymentPlanForm } from '../components/PaymentPlanForm'
import { usePaymentPlanForm } from '../hooks/usePaymentPlanForm'

export function PaymentPlanCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const form = usePaymentPlanForm()

  function handleBack() {
    navigate('/payments/plans')
  }

  async function handleSubmit() {
    try {
      await form.submit()
      navigate('/payments/plans')
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
          {t('payments.plans.create.back')}
        </button>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-pulse-navy">
            {t('payments.plans.create.title')}
          </h1>
          <p className="mt-1 text-sm text-pulse-muted">{t('payments.plans.create.subtitle')}</p>
        </div>
      </header>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-card">
        <PaymentPlanForm
          title={t('payments.plans.form.createTitle')}
          values={form.values}
          fieldErrors={form.fieldErrors}
          isValid={form.isValid}
          isLoading={form.isLoading}
          error={form.error}
          onCancel={handleBack}
          onChange={form.setField}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  )
}
