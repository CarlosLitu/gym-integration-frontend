import { useTranslation } from 'react-i18next'
import { Input } from '@/components'
import type { TenantFormValues } from '../../types/tenant.types'

interface TenantStepIntegrationProps {
  values: TenantFormValues
  onChange: (field: keyof TenantFormValues, value: string) => void
}

export function TenantStepIntegration({ values, onChange }: TenantStepIntegrationProps) {
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
      <p className="font-sans text-xs leading-relaxed text-pulse-muted">
        {t('tenants.create.integrationNote')}
      </p>
    </div>
  )
}
