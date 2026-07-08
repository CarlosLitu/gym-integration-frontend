import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
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
    <div className="flex flex-col gap-2">
      <div>
        <p className="font-sans text-sm font-semibold text-pulse-navy">
          {t('users.form.passwordRequirements.title')}
        </p>
        <p className="font-sans text-xs text-pulse-muted">
          {t('users.form.passwordRequirements.subtitle')}
        </p>
      </div>

      <ul className="flex flex-col gap-1">
        {PASSWORD_REQUIREMENT_IDS.map((id: PasswordRequirementId) => {
          const isMet = status[id]

          return (
            <li
              key={id}
              className={clsx(
                'font-sans text-sm',
                isMet ? 'text-[#24893E]' : 'text-pulse-error-border',
              )}
            >
              <span aria-hidden="true">• </span>
              {t(`users.form.passwordRequirements.${id}`)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
