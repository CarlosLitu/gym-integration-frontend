export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pulse: {
          navy: '#14213D',
          teal: '#00C2A8',
          blue: '#2D6CDF',
          accent: '#007AFF',
          muted: '#5C6470',
          surface: '#F7F9FC',
          border: '#DADDE2',
          'error-border': '#D85A30',
          'error-bg': '#FAECE7',
        },
        primary: {
          DEFAULT: '#14213D',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F7F9FC',
          foreground: '#14213D',
        },
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        input: '14px',
        pill: '999px',
      },
      boxShadow: {
        card: '0px 12px 32px 0px rgba(20, 33, 61, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.4)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 250ms ease-in forwards',
        'scale-in': 'scale-in 280ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
