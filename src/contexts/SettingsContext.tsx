'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface TimerSettings {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  autoStartBreaks: boolean
}

export interface AppSettings {
  timer: TimerSettings
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  timer: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    autoStartBreaks: false
  },
  theme: 'system',
  notifications: true
}

interface SettingsContextType {
  settings: AppSettings
  loading: boolean
  updateTimerSettings: (settings: Partial<TimerSettings>) => void
  updateTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleNotifications: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('pomodoro-settings')
          if (saved) {
            const parsed = JSON.parse(saved)
            setSettings({ ...DEFAULT_SETTINGS, ...parsed })
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
    }
  }, [settings, loading])

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      const theme = settings.theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : settings.theme
      
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [settings.theme])

  const updateTimerSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({
      ...prev,
      timer: { ...prev.timer, ...newSettings }
    }))
  }

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }))
  }

  const toggleNotifications = () => {
    setSettings(prev => ({ 
      ...prev, 
      notifications: !prev.notifications 
    }))
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateTimerSettings,
      updateTheme,
      toggleNotifications
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 