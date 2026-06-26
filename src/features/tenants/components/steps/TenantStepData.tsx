import { useTranslation } from 'react-i18next'
import { Input } from '@/components'

interface TenantStepDataProps {
  onInput?: () => void
}

export function TenantStepData({ onInput }: TenantStepDataProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t('tenants.create.fields.name')}
        placeholder={t('tenants.create.placeholders.name')}
        onChange={onInput}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('tenants.create.fields.cnpj')}
          placeholder={t('tenants.create.placeholders.cnpj')}
          onChange={onInput}
        />
        <Input
          label={t('tenants.create.fields.phone')}
          placeholder={t('tenants.create.placeholders.phone')}
          onChange={onInput}
        />
      </div>
      <Input
        type="email"
        label={t('tenants.create.fields.email')}
        placeholder={t('tenants.create.placeholders.email')}
        onChange={onInput}
      />
      <Input
        label={t('tenants.create.fields.address')}
        placeholder={t('tenants.create.placeholders.address')}
        onChange={onInput}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('tenants.create.fields.city')}
          placeholder={t('tenants.create.placeholders.city')}
          onChange={onInput}
        />
        <Input
          label={t('tenants.create.fields.state')}
          placeholder={t('tenants.create.placeholders.state')}
          onChange={onInput}
        />
      </div>
    </div>
  )
}
