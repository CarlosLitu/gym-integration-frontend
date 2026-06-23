const requiredEnvVars = ['VITE_API_URL'] as const

function getEnvVar(key: (typeof requiredEnvVars)[number]): string {
  const value = import.meta.env[key]

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

export const env = {
  apiUrl: getEnvVar('VITE_API_URL'),
} as const
