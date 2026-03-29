'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  /* Read from localStorage on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vitality-theme') as Theme | null
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored)
      }
    } catch {}
  }, [])

  /* Apply theme to <html> data-theme attribute + body */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('vitality-theme', theme)
    } catch {}
  }, [theme])

  const toggle = () => {
    const html = document.documentElement

    // 1. Add the class — triggers the CSS ::before overlay fade-in
    html.classList.add('theme-switching')

    // 2. After a short delay (let the overlay reach peak opacity), flip the theme
    setTimeout(() => {
      setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

      // 3. Remove the class so the overlay fades back out
      setTimeout(() => {
        html.classList.remove('theme-switching')
      }, 300)
    }, 120)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
