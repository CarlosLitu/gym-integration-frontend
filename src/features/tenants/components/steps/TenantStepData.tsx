import { useTranslation } from 'react-i18next'
import { Input } from '@/components'
import type { TenantFormValues } from '../../types/tenant.types'
import { maskCnpj, maskPhone } from '../../utils/masks'

interface TenantStepDataProps {
  values: TenantFormValues
  onChange: (field: keyof TenantFormValues, value: string) => void
}

export function TenantStepData({ values, onChange }: TenantStepDataProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t('tenants.create.fields.name')}
        placeholder={t('tenants.create.placeholders.name')}
        value={values.name}
        onChange={(event) => onChange('name', event.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('tenants.create.fields.cnpj')}
          placeholder={t('tenants.create.placeholders.cnpj')}
          value={values.cnpj}
          inputMode="numeric"
          onChange={(event) => onChange('cnpj', maskCnpj(event.target.value))}
        />
        <Input
          label={t('tenants.create.fields.phone')}
          placeholder={t('tenants.create.placeholders.phone')}
          value={values.phone}
          inputMode="numeric"
          onChange={(event) => onChange('phone', maskPhone(event.target.value))}
        />
      </div>
      <Input
        type="email"
        label={t('tenants.create.fields.email')}
        placeholder={t('tenants.create.placeholders.email')}
        value={values.email}
        onChange={(event) => onChange('email', event.target.value)}
      />
      <Input
        label={t('tenants.create.fields.address')}
        placeholder={t('tenants.create.placeholders.address')}
        value={values.address}
        onChange={(event) => onChange('address', event.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('tenants.create.fields.city')}
          placeholder={t('tenants.create.placeholders.city')}
          value={values.city}
          onChange={(event) => onChange('city', event.target.value)}
        />
        <Input
          label={t('tenants.create.fields.state')}
          placeholder={t('tenants.create.placeholders.state')}
          value={values.state}
          onChange={(event) => onChange('state', event.target.value)}
        />
      </div>
    </div>
  )
}
