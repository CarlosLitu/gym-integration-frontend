export const theme = {
  fonts: {
    body: '"Hanken Grotesk", system-ui, sans-serif',
    display: '"Space Grotesk", system-ui, sans-serif',
    heading: '"Space Grotesk", system-ui, sans-serif',
  },
  colors: {
    navy: '#14213D',
    teal: '#00C2A8',
    blue: '#2D6CDF',
    accent: '#007AFF',
    muted: '#5C6470',
    surface: '#F7F9FC',
    border: '#DADDE2',
    errorBorder: '#D85A30',
    errorBg: '#FAECE7',
    background: '#F7F9FC',
    foreground: '#14213D',
    primary: '#14213D',
    secondary: '#F7F9FC',
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
    input: '14px',
    pill: '999px',
  },
} as const

export type Theme = typeof theme
