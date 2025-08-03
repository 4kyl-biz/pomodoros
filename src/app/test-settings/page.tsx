'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function TestSettingsPage() {
  const { settings, updateTimerSettings, updateTheme, toggleNotifications } = useSettings()
  const [currentTheme, setCurrentTheme] = useState('light')

  useEffect(() => {
    // Get current theme from document
    const root = document.documentElement
    setCurrentTheme(root.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  const handleWorkDurationChange = (value: string) => {
    const duration = parseInt(value)
    if (!isNaN(duration) && duration > 0) {
      updateTimerSettings({ workDuration: duration })
    }
  }

  const handleShortBreakChange = (value: string) => {
    const duration = parseInt(value)
    if (!isNaN(duration) && duration > 0) {
      updateTimerSettings({ shortBreakDuration: duration })
    }
  }

  const handleLongBreakChange = (value: string) => {
    const duration = parseInt(value)
    if (!isNaN(duration) && duration > 0) {
      updateTimerSettings({ longBreakDuration: duration })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test and debug settings functionality
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Settings</CardTitle>
            <CardDescription>
              View the current settings state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Work Duration:</strong> {settings.timer.workDuration} minutes</p>
            <p><strong>Short Break:</strong> {settings.timer.shortBreakDuration} minutes</p>
            <p><strong>Long Break:</strong> {settings.timer.longBreakDuration} minutes</p>
            <p><strong>Auto Start Breaks:</strong> {settings.timer.autoStartBreaks ? 'Enabled' : 'Disabled'}</p>
            <p><strong>Theme:</strong> {settings.theme} (Applied: {currentTheme})</p>
            <p><strong>Notifications:</strong> {settings.notifications ? 'Enabled' : 'Disabled'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timer Settings</CardTitle>
            <CardDescription>
              Adjust timer durations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="work-duration">Work Duration (minutes)</Label>
              <Input
                id="work-duration"
                type="number"
                min="1"
                max="60"
                value={settings.timer.workDuration}
                onChange={(e) => handleWorkDurationChange(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="short-break">Short Break (minutes)</Label>
              <Input
                id="short-break"
                type="number"
                min="1"
                max="30"
                value={settings.timer.shortBreakDuration}
                onChange={(e) => handleShortBreakChange(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="long-break">Long Break (minutes)</Label>
              <Input
                id="long-break"
                type="number"
                min="1"
                max="60"
                value={settings.timer.longBreakDuration}
                onChange={(e) => handleLongBreakChange(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>
              Change the application theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Light Theme</Label>
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                onClick={() => updateTheme('light')}
              >
                Light
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Dark Theme</Label>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                onClick={() => updateTheme('dark')}
              >
                Dark
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <Label>System Theme</Label>
              <Button
                variant={settings.theme === 'system' ? 'default' : 'outline'}
                onClick={() => updateTheme('system')}
              >
                System
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Toggle notification settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>Enable Notifications</Label>
              <Switch
                checked={settings.notifications}
                onCheckedChange={toggleNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Storage Debug</CardTitle>
            <CardDescription>
              View raw localStorage data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              {typeof window !== 'undefined' ? JSON.stringify({
                settings: localStorage.getItem('pomodoro-settings'),
                timer: localStorage.getItem('pomodoro-timer'),
                muted: localStorage.getItem('pomodoro-muted')
              }, null, 2) : 'localStorage not available during SSR'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 