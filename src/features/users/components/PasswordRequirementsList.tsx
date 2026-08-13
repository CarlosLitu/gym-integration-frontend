import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { Check } from '@phosphor-icons/react'
import {
  PASSWORD_REQUIREMENT_IDS,
  getPasswordRequirementStatus,
  type PasswordRequirementId,
} from '../utils/password-requirements'

interface PasswordRequirementsListProps {
  password: string
}

export function PasswordRequirementsList({ password }: PasswordRequirementsListProps) {
  const { t } = useTranslation()
  const status = getPasswordRequirementStatus(password)

  return (
    <div className="space-y-2">
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-pulse-muted">
        {t('users.form.passwordRequirements.title')}
      </p>
      <ul className="space-y-1.5">
        {PASSWORD_REQUIREMENT_IDS.map((id: PasswordRequirementId) => {
          const isMet = status[id]

          return (
            <li
              key={id}
              className={clsx(
                'flex items-center gap-2 font-sans text-xs transition-colors',
                isMet ? 'text-[#24893E]' : 'text-pulse-muted',
              )}
            >
              <span
                className={clsx(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                  isMet
                    ? 'border-[#24893E] bg-[#24893E] text-white'
                    : 'border-pulse-border bg-white text-transparent',
                )}
                aria-hidden="true"
              >
                <Check size={10} weight="bold" />
              </span>
              {t(`users.form.passwordRequirements.${id}`)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
