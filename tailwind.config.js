export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pulse: {
          navy: '#14213D',
          teal: '#00C2A8',
          blue: '#2D6CDF',
          muted: '#5C6470',
          surface: '#F7F9FC',
          border: '#DADDE2',
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
    },
  },
  plugins: [],
}
