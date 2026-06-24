import { useTranslation } from 'react-i18next'

export function RegisterCard() {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
      {t('auth.registerSoon')}
    </div>
  )
}
