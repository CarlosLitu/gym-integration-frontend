import { useState } from 'react'

export type TenantWizardStep = 1 | 2

export function useTenantWizard() {
  const [step, setStep] = useState<TenantWizardStep>(1)

  return {
    step,
    next: () => setStep((current) => (current === 1 ? 2 : current)),
    back: () => setStep((current) => (current === 2 ? 1 : current)),
    reset: () => setStep(1),
  }
}
