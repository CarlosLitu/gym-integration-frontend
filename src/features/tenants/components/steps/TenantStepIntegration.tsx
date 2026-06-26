import { useTranslation } from 'react-i18next'
import { Alert, Input } from '@/components'
import type { TestConnectionStatus } from '../../hooks/useCreateTenant'
import type { TenantFormValues } from '../../types/tenant.types'

interface TenantStepIntegrationProps {
  values: TenantFormValues
  onChange: (field: keyof TenantFormValues, value: string) => void
  testStatus: TestConnectionStatus
  testMessage: string | null
}

export function TenantStepIntegration({
  values,
  onChange,
  testStatus,
  testMessage,
}: TenantStepIntegrationProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t('tenants.create.fields.token')}
        placeholder={t('tenants.create.placeholders.token')}
        value={values.token}
        onChange={(event) => onChange('token', event.target.value)}
      />
      <Input
        type="password"
        label={t('tenants.create.fields.apiKey')}
        placeholder={t('tenants.create.placeholders.apiKey')}
        value={values.apiKey}
        onChange={(event) => onChange('apiKey', event.target.value)}
      />
      <Input
        type="password"
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
