import { useTranslation } from 'react-i18next'
import { Modal } from '@/components'
import type { PaymentPlanFormFieldErrors, PaymentPlanFormValues } from '../hooks/usePaymentPlanForm'
import { PaymentPlanForm } from './PaymentPlanForm'

interface PaymentPlanFormModalProps {
  isOpen: boolean
  values: PaymentPlanFormValues
  fieldErrors: PaymentPlanFormFieldErrors
  isValid: boolean
  isLoading: boolean
  error: string | null
  onClose: () => void
  onChange: <K extends keyof PaymentPlanFormValues>(field: K, value: PaymentPlanFormValues[K]) => void
  onSubmit: () => Promise<void>
}

export function PaymentPlanFormModal({
  isOpen,
  values,
  fieldErrors,
  isValid,
  isLoading,
  error,
  onClose,
  onChange,
  onSubmit,
}: PaymentPlanFormModalProps) {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl overflow-visible rounded-[24px] p-6">
      <PaymentPlanForm
        title={t('payments.plans.form.createTitle')}
        values={values}
        fieldErrors={fieldErrors}
        isValid={isValid}
        isLoading={isLoading}
        error={error}
        onCancel={onClose}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}
