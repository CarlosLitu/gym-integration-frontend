import axios from 'axios'
import { AUTH_MESSAGES } from '../constants/auth-messages'

export function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message

    if (typeof message === 'string' && message.length > 0) {
      return message
    }

    if (error.response?.status === 400 || error.response?.status === 401) {
      return AUTH_MESSAGES.invalidCredentials
    }
  }

  return AUTH_MESSAGES.loginFailed
}
