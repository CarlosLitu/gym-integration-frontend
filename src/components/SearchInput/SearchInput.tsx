import { clsx } from 'clsx'
import { Input } from '@/components/Input'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  name?: string
  id?: string
  className?: string
  clearLabel?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  name = 'search',
  id,
  className,
  clearLabel = 'Limpar busca',
}: SearchInputProps) {
  const hasValue = value.length > 0

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-pulse-muted">
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
        id={id}
        type="search"
        name={name}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={clsx(
          '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
          className ??
            'h-10 !rounded-[12px] border-slate-200 bg-white py-0 pl-11 placeholder:text-[#A6A6B8]',
          hasValue && 'pr-10',
        )}
      />
      {hasValue ? (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 z-10 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center text-pulse-navy transition-opacity hover:opacity-70"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
              fill="currentColor"
            />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
