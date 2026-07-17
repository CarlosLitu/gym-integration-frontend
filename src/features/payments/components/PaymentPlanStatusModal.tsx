import { useState } from 'react'
import { CheckCircle, CircleNotch, Prohibit } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal } from '@/components'
import { useApiMessage } from '@/hooks/useApiMessage'
import { deletePaymentPlanRequest } from '../services/payment-service'
import type { PaymentPlan } from '../types/payment.types'

interface PaymentPlanStatusModalProps {
  isOpen: boolean
  plan: PaymentPlan | null
  nextIsActive: boolean
  onClose: () => void
  onSuccess: (plan: PaymentPlan) => void
}

export function PaymentPlanStatusModal({
  isOpen,
  plan,
  nextIsActive,
  onClose,
  onSuccess,
}: PaymentPlanStatusModalProps) {
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (!plan) return

    setIsLoading(true)
    setError(null)

    try {
      const updated = await deletePaymentPlanRequest(plan.id)
      onSuccess(updated)
      onClose()
    } catch (statusError) {
      setError(getErrorMessage(statusError))
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    if (isLoading) return
    setError(null)
    onClose()
  }

  const isActivating = nextIsActive

  return (
    <Modal isOpen={isOpen} onClose={handleClose} dimOverlay className="max-w-md rounded-[24px] p-6">
      <div className="flex flex-col gap-4">
        <h2 className="pr-10 font-sans text-2xl font-semibold text-pulse-navy">
          {isActivating ? t('payments.plans.status.activateTitle') : t('payments.plans.status.deactivateTitle')}
        </h2>

        {plan ? (
          <p className="font-sans text-sm text-pulse-muted">
            {isActivating
              ? t('payments.plans.status.activateConfirm', { name: plan.name ?? '—' })
              : t('payments.plans.status.deactivateConfirm', { name: plan.name ?? '—' })}
          </p>
        ) : null}

        {error ? <Alert>{error}</Alert> : null}

        <div className="mt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="rounded-pill border-slate-200 bg-white hover:bg-pulse-surface"
            onClick={handleClose}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="brand"
            size="md"
            onClick={handleConfirm}
            disabled={!plan || isLoading}
            className={`gap-2 ${isActivating ? '' : '!bg-[#C51A31] hover:!bg-[#a81629]'}`}
          >
            {isLoading ? (
              <>
                <CircleNotch className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
                {isActivating ? t('payments.plans.status.activating') : t('payments.plans.status.deactivating')}
              </>
            ) : (
              <>
                {isActivating ? <CheckCircle size={16} aria-hidden="true" /> : <Prohibit size={16} aria-hidden="true" />}
                {isActivating ? t('payments.plans.status.activateAction') : t('payments.plans.status.deactivateAction')}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
