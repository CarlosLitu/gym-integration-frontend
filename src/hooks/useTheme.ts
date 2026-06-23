import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'gym_theme_mode'

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_KEY)
    return stored === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    localStorage.setItem(THEME_KEY, mode)
  }, [mode])

  const toggleTheme = () => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return { mode, toggleTheme, setMode }
}
