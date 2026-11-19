import { useEffect, useState } from 'react'

export const THEME_STORAGE_KEY = 'pg-theme'

export const THEMES = {
  dark: 'cipher',
  light: 'cipher-light',
} as const

export type ThemeName = (typeof THEMES)[keyof typeof THEMES]

const THEME_COLOR: Record<ThemeName, string> = {
  cipher: '#12141c',
  'cipher-light': '#f4f1eb',
}

function readStoredTheme(): ThemeName | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEMES.dark || stored === THEMES.light) return stored
  } catch {
    return null
  }
  return null
}

function prefersLight() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  )
}

function themeFromDocument(): ThemeName {
  const current = document.documentElement.getAttribute('data-theme')
  if (current === THEMES.dark || current === THEMES.light) return current
  return prefersLight() ? THEMES.light : THEMES.dark
}

function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme === THEMES.light ? 'light' : 'dark'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(themeFromDocument)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (readStoredTheme() || typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      setTheme(media.matches ? THEMES.light : THEMES.dark)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function toggleTheme() {
    setTheme((current) => {
      const next = current === THEMES.dark ? THEMES.light : THEMES.dark
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // The theme still applies for this visit when storage is blocked.
      }
      return next
    })
  }

  return {
    theme,
    isDark: theme === THEMES.dark,
    toggleTheme,
  }
}
