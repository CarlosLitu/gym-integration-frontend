import { useTranslation } from 'react-i18next'
import { Alert, Input, Select } from '@/components'
import type { TestConnectionStatus } from '../../hooks/useCreateTenant'
import type { TenantFormValues } from '../../types/tenant.types'

interface TenantStepIntegrationProps {
  values: TenantFormValues
  onChange: (field: keyof TenantFormValues, value: string) => void
  testStatus: TestConnectionStatus
  testMessage: string | null
}

const GATEWAY_OPTIONS = [{ value: 'EVO', label: 'EVO' }] as const

export function TenantStepIntegration({
  values,
  onChange,
  testStatus,
  testMessage,
}: TenantStepIntegrationProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <Select
        id="tenant-gateway"
        label={t('tenants.create.fields.gateway')}
        value={values.gateway || GATEWAY_OPTIONS[0].value}
        options={GATEWAY_OPTIONS}
        onChange={(gateway) => onChange('gateway', gateway)}
      />
      <Input
        type="password"
        revealToggle
        revealLabel={t('tenants.create.reveal')}
        hideLabel={t('tenants.create.hide')}
        label={t('tenants.create.fields.apiKey')}
        placeholder={t('tenants.create.placeholders.apiKey')}
        value={values.apiKey}
        onChange={(event) => onChange('apiKey', event.target.value)}
      />
      <Input
        type="password"
        revealToggle
        revealLabel={t('tenants.create.reveal')}
        hideLabel={t('tenants.create.hide')}
        label={t('tenants.create.fields.apiSecret')}
        placeholder={t('tenants.create.placeholders.apiSecret')}
        value={values.apiSecret}
        onChange={(event) => onChange('apiSecret', event.target.value)}
      />
      {testStatus === 'error' && testMessage ? <Alert>{testMessage}</Alert> : null}
      <p className="font-sans text-xs leading-relaxed text-pulse-muted">
        {t('tenants.create.integrationNote')}
      </p>
    </div>
  )
}
