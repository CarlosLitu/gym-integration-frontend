export type PasswordStrength = 'weak' | 'medium' | 'strong'

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 6) return 'weak'
  if (password.length < 10) return 'medium'
  return 'strong'
}
