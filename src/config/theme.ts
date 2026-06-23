export const theme = {
  fonts: {
    body: '"Hanken Grotesk", system-ui, sans-serif',
    display: '"Space Grotesk", system-ui, sans-serif',
  },
  colors: {
    primary: '#2563eb',
    secondary: '#f1f5f9',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
} as const

export type Theme = typeof theme
