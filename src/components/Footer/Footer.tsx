import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4">
      <p className="text-center font-sans text-xs text-pulse-muted">
        {t('footer.copyright', { year })}
      </p>
    </footer>
  )
}
