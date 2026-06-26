import { useState } from 'react'
import { ArrowRight, CaretLeft } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components'
import type { TenantWizardStep } from '../hooks/useTenantWizard'
import { TenantStepper } from './TenantStepper'
import { TenantStepData } from './steps/TenantStepData'
import { TenantStepIntegration } from './steps/TenantStepIntegration'

interface TenantCreateFormProps {
  step: TenantWizardStep
  onNext: () => void
  onBack: () => void
}

export function TenantCreateForm({ step, onNext, onBack }: TenantCreateFormProps) {
  const { t } = useTranslation()
  const [canProceed, setCanProceed] = useState(false)

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-1 font-sans text-sm text-pulse-navy transition-colors hover:text-pulse-blue"
        >
          <CaretLeft size={16} weight="bold" aria-hidden="true" />
          {t('tenants.create.back')}
        </button>
        <h2 className="font-sans text-2xl font-semibold text-pulse-navy">
          {t('tenants.create.title')}
        </h2>
        <TenantStepper step={step} />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          className={clsx(
            'absolute inset-0 flex flex-col gap-4 transition-transform duration-300 ease-out',
            step === 1 ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex-1 overflow-y-auto">
            <TenantStepData onInput={() => setCanProceed(true)} />
          </div>
          <Button
            variant={canProceed ? 'brand' : 'idle'}
            size="lg"
            disabled={!canProceed}
            className="w-full gap-2 !rounded-[12px]"
            onClick={onNext}
          >
            {t('tenants.create.next')}
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </Button>
        </div>

        <div
          className={clsx(
            'absolute inset-0 flex flex-col gap-4 transition-transform duration-300 ease-out',
            step === 2 ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex-1 overflow-y-auto">
            <TenantStepIntegration />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full !rounded-[12px] border-pulse-blue text-pulse-blue hover:bg-pulse-blue/5"
            >
              {t('tenants.create.testConnection')}
            </Button>
            <Button variant="idle" size="lg" disabled className="w-full !rounded-[12px]">
              {t('tenants.create.createGym')}
            </Button>
            <p className="font-sans text-xs text-pulse-muted">
              {t('tenants.create.createHint')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
