import { useTranslation } from 'react-i18next'
import { Input } from '@/components'

export function TenantStepIntegration() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t('tenants.create.fields.token')}
        placeholder={t('tenants.create.placeholders.token')}
      />
      <Input
        type="password"
        label={t('tenants.create.fields.apiKey')}
        placeholder={t('tenants.create.placeholders.apiKey')}
      />
      <Input
        type="password"
        label={t('tenants.create.fields.apiSecret')}
        placeholder={t('tenants.create.placeholders.apiSecret')}
      />
      <p className="font-sans text-xs leading-relaxed text-pulse-muted">
        {t('tenants.create.integrationNote')}
      </p>
    </div>
  )
}
