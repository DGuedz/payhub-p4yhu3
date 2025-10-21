import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { Appearance } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { theme as darkBase } from './theme' // current dark as default

const lightBase = {
  colors: {
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surface2: '#F1F5F9',
    text: '#0F172A',
    textSubtle: '#334155',
    textMuted: '#64748B',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    accentGreen: '#16A34A',
    accentCyan: '#06B6D4',
    border: '#E2E8F0',
    success: '#16A34A',
    danger: '#DC2626',
    textOnPrimary: '#FFFFFF',
  },
  radii: { sm: 8, md: 12 },
}

export type ThemeName = 'light' | 'dark'
export type ThemeTokens = typeof darkBase

type ThemeContextValue = {
  name: ThemeName
  theme: ThemeTokens
  toggleTheme: () => void
  setTheme: (name: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  name: 'dark',
  theme: darkBase,
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<ThemeName>('dark')

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('themeName')
        if (saved === 'light' || saved === 'dark') {
          setName(saved)
        } else {
          const sys = Appearance.getColorScheme()
          setName(sys === 'dark' ? 'dark' : 'light')
        }
      } catch {
        const sys = Appearance.getColorScheme()
        setName(sys === 'dark' ? 'dark' : 'light')
      }
    })()
  }, [])

  useEffect(() => {
    AsyncStorage.setItem('themeName', name).catch(() => {})
  }, [name])

  const toggleTheme = useCallback(() => setName(prev => (prev === 'dark' ? 'light' : 'dark')), [])

  const theme = useMemo(() => (name === 'dark' ? darkBase : lightBase), [name])

  const value = useMemo(() => ({ name, theme, toggleTheme, setTheme: setName }), [name, theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext).theme
export const useThemeActions = () => useContext(ThemeContext)