import { useTranslation } from 'react-i18next'
import { CircleNotch } from '@phosphor-icons/react'
import { Alert, Button, Input, Select } from '@/components'
import type { PaymentPlanType } from '../types/payment.types'
import type { PaymentPlanFormFieldErrors, PaymentPlanFormValues } from '../hooks/usePaymentPlanForm'

interface PaymentPlanFormProps {
  title: string
  values: PaymentPlanFormValues
  fieldErrors: PaymentPlanFormFieldErrors
  isValid: boolean
  isLoading: boolean
  error: string | null
  onCancel: () => void
  onChange: <K extends keyof PaymentPlanFormValues>(field: K, value: PaymentPlanFormValues[K]) => void
  onSubmit: () => Promise<void>
  submitLabel?: string
  lockValueField?: boolean
  lockDurationField?: boolean
  lockMaxBillingCyclesField?: boolean
  disableTypeField?: boolean
  technicalDetails?: {
    paypalProductId?: string | null
    paypalPlanId?: string | null
  } | null
}

function BooleanToggle({
  label,
  value,
  disabled,
  onChange,
  trueLabel,
  falseLabel,
}: {
  label: string
  value: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
  trueLabel: string
  falseLabel: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-sm font-semibold text-pulse-navy">{label}</span>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={value ? 'active' : 'outline'}
          className="rounded-[10px] px-4"
          onClick={() => onChange(true)}
          disabled={disabled}
        >
          {trueLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={!value ? 'active' : 'outline'}
          className="rounded-[10px] px-4"
          onClick={() => onChange(false)}
          disabled={disabled}
        >
          {falseLabel}
        </Button>
      </div>
    </div>
  )
}

export function PaymentPlanForm({
  title,
  values,
  fieldErrors,
  isValid,
  isLoading,
  error,
  onCancel,
  onChange,
  onSubmit,
  submitLabel,
  lockValueField = false,
  lockDurationField = false,
  lockMaxBillingCyclesField = false,
  disableTypeField = false,
  technicalDetails = null,
}: PaymentPlanFormProps) {
  const { t } = useTranslation()
  const planTypeOptions = [
    { value: 'ONE_TIME', label: t('payments.plans.form.types.ONE_TIME') },
    { value: 'SUBSCRIPTION', label: t('payments.plans.form.types.SUBSCRIPTION') },
  ] as const

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="pr-10 font-sans text-2xl font-semibold text-pulse-navy">{title}</h2>

      {error ? <Alert>{error}</Alert> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label={t('payments.plans.form.name')}
          placeholder={t('payments.plans.form.namePlaceholder')}
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={fieldErrors.name}
          required
        />
        <Select<PaymentPlanType>
          label={t('payments.plans.form.type')}
          value={values.type as PaymentPlanType | ''}
          options={planTypeOptions}
          placeholder={t('payments.plans.form.typePlaceholder')}
          onChange={(value) => onChange('type', value)}
          error={fieldErrors.type}
          disabled={isLoading}
          locked={disableTypeField}
        />
        <Input
          label={t('payments.plans.form.value')}
          type="number"
          inputMode="decimal"
          step="0.01"
          value={values.value}
          onChange={(event) => onChange('value', event.target.value)}
          error={fieldErrors.value}
          disabled={isLoading}
          locked={lockValueField}
          required
        />
        <Input
          label={t('payments.plans.form.currency')}
          value={values.currency}
          onChange={(event) => onChange('currency', event.target.value)}
          error={fieldErrors.currency}
          required
        />
        {values.type === 'SUBSCRIPTION' ? (
          <Input
            label={t('payments.plans.form.maxBillingCycles')}
            type="number"
            inputMode="numeric"
            value={values.maxBillingCycles}
            onChange={(event) => onChange('maxBillingCycles', event.target.value)}
            error={fieldErrors.maxBillingCycles}
            disabled={isLoading}
            locked={lockMaxBillingCyclesField}
            required
          />
        ) : (
          <Input
            label={t('payments.plans.form.durationDays')}
            type="number"
            inputMode="numeric"
            value={values.durationDays}
            onChange={(event) => onChange('durationDays', event.target.value)}
            error={fieldErrors.durationDays}
            disabled={isLoading}
            locked={lockDurationField}
            required
          />
        )}
        <Input
          label={t('payments.plans.form.permissions')}
          placeholder={t('payments.plans.form.permissionsPlaceholder')}
          value={values.permissions}
          onChange={(event) => onChange('permissions', event.target.value)}
        />
      </div>

      {values.type === 'SUBSCRIPTION' ? (
        <p className="text-xs text-pulse-muted">{t('payments.plans.form.subscriptionBillingHint')}</p>
      ) : null}

      {values.type === 'ONE_TIME' ? (
        <BooleanToggle
          label={t('payments.plans.form.allowMultiplePurchases')}
          value={values.allowMultiplePurchases}
          disabled={isLoading}
          onChange={(value) => onChange('allowMultiplePurchases', value)}
          trueLabel={t('common.yes')}
          falseLabel={t('common.no')}
        />
      ) : null}

      {technicalDetails ? (
        <div className="space-y-4 rounded-[20px] border border-slate-200 bg-pulse-surface/30 p-4">
          <div>
            <h3 className="font-sans text-sm font-semibold text-pulse-navy">
              {t('payments.plans.technical.title')}
            </h3>
            <p className="mt-1 text-xs text-pulse-muted">{t('payments.plans.technical.subtitle')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={t('payments.plans.technical.paypalProductId')}
              value={technicalDetails.paypalProductId ?? ''}
              readOnly
              locked
            />
            <Input
              label={t('payments.plans.technical.paypalPlanId')}
              value={technicalDetails.paypalPlanId ?? ''}
              readOnly
              locked
            />
          </div>
        </div>
      ) : null}

      {lockValueField || lockDurationField || lockMaxBillingCyclesField ? (
        <p className="text-xs text-pulse-muted">{t('payments.plans.edit.lockedFieldsHint')}</p>
      ) : null}

      <div className="mt-2 flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="rounded-pill border-slate-200 bg-white hover:bg-pulse-surface"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="brand" size="md" className="gap-2" disabled={!isValid || isLoading}>
          {isLoading ? (
            <>
              <CircleNotch className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
              {t('common.saving')}
            </>
          ) : (
            submitLabel ?? t('common.create')
          )}
        </Button>
      </div>
    </form>
  )
}
