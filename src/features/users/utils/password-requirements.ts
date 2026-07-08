export const PASSWORD_REQUIREMENT_IDS = [
  'minLength',
  'uppercase',
  'lowercase',
  'number',
  'special',
] as const

export type PasswordRequirementId = (typeof PASSWORD_REQUIREMENT_IDS)[number]

export type PasswordRequirementStatus = Record<PasswordRequirementId, boolean>

export function getPasswordRequirementStatus(password: string): PasswordRequirementStatus {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

export function areAllPasswordRequirementsMet(password: string): boolean {
  const status = getPasswordRequirementStatus(password)
  return Object.values(status).every(Boolean)
}
