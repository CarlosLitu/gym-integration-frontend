import { useTranslation } from 'react-i18next'
import { Input } from '@/components'

interface TenantSearchProps {
  value: string
  onChange: (value: string) => void
}

export function TenantSearch({ value, onChange }: TenantSearchProps) {
  const { t } = useTranslation()

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pulse-muted">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('tenants.searchPlaceholder')}
        className="h-10 rounded-[12px] border-slate-200 bg-white py-0 pl-11 placeholder:text-[#A6A6B8]"
      />
    </div>
  )
}
