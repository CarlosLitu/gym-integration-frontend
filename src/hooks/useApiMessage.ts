import { useCallback } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import type { ApiResponseCode } from '@/i18n/response-codes'

function isDuplicateEmailMessage(message: string): boolean {
  const normalized = message.toLowerCase()

  return (
    normalized.includes('dup key') &&
    (normalized.includes('email') || normalized.includes('email_1'))
  )
}

export function useApiMessage() {
  const { t } = useTranslation()

  const translateResponse = useCallback(
    (code: ApiResponseCode | string) => {
      const key = `responses.${code}`
      const translated = t(key)

      return translated === key ? t('responses.INTERNAL_SERVER_ERROR') : translated
    },
    [t],
  )

  const getErrorMessage = useCallback(
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message

        if (typeof message === 'string' && message.length > 0) {
          if (isDuplicateEmailMessage(message)) {
            return translateResponse('USER_EMAIL_ALREADY_EXISTS')
          }

          return translateResponse(message)
        }
      }

      return translateResponse('INTERNAL_SERVER_ERROR')
    },
    [translateResponse],
  )

  return { translateResponse, getErrorMessage }
}
