import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import type { TenantWizardStep } from '../hooks/useTenantWizard'

interface TenantStepperProps {
  step: TenantWizardStep
}

export function TenantStepper({ step }: TenantStepperProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div
          className={clsx(
            'h-1.5 flex-1 rounded-pill',
            step === 1 ? 'bg-gradient-to-r from-pulse-blue to-[#d6e4fc]' : 'bg-pulse-blue',
          )}
        />
        <div
          className={clsx(
            'h-1.5 flex-1 rounded-pill',
            step === 2 ? 'bg-gradient-to-r from-pulse-blue to-[#d6e4fc]' : 'bg-slate-200',
          )}
        />
      </div>
      <div className="flex justify-between font-sans text-xs">
        <span className={step === 1 ? 'font-medium text-pulse-navy' : 'text-pulse-muted'}>
          {t('tenants.create.steps.data')}
        </span>
        <span className={step === 2 ? 'font-medium text-pulse-navy' : 'text-pulse-muted'}>
          {t('tenants.create.steps.integration')}
        </span>
      </div>
    </div>
  )
}
