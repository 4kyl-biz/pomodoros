'use client'

import { useEffect, useState } from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSettings() {
  const { settings, updateTimerSettings, updateTheme, toggleNotifications } = useSettings()
  const [currentTheme, setCurrentTheme] = useState<string>('')
  const [localStorageData, setLocalStorageData] = useState<string>('')

  useEffect(() => {
    // Get the actual theme class applied to the document
    const root = document.documentElement
    setCurrentTheme(root.classList.contains('dark') ? 'dark' : 'light')

    // Get localStorage data safely
    try {
      const data = {
        settings: localStorage.getItem('pomodoro-settings'),
        timer: localStorage.getItem('pomodoro-timer'),
        muted: localStorage.getItem('pomodoro-muted')
      }
      setLocalStorageData(JSON.stringify(data, null, 2))
    } catch (error) {
      setLocalStorageData('localStorage not available')
    }
  }, [settings.theme])

  const testNotification = async () => {
    try {
      const { NotificationService } = await import('@/lib/notifications')
      const notificationService = NotificationService.getInstance()
      await notificationService.notifySessionComplete('Test')
    } catch (error) {
      console.error('Failed to test notification:', error)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings Test Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Work Duration:</strong> {settings.timer.workDuration} minutes</p>
          <p><strong>Short Break:</strong> {settings.timer.shortBreakDuration} minutes</p>
          <p><strong>Long Break:</strong> {settings.timer.longBreakDuration} minutes</p>
          <p><strong>Auto-start Breaks:</strong> {settings.timer.autoStartBreaks ? 'Yes' : 'No'}</p>
          <p><strong>Theme:</strong> {settings.theme} (Applied: {currentTheme})</p>
          <p><strong>Notifications:</strong> {settings.notifications ? 'Enabled' : 'Disabled'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Theme Switching</CardTitle>
        </CardHeader>
        <CardContent className="space-x-2">
          <Button onClick={() => updateTheme('light')}>Light</Button>
          <Button onClick={() => updateTheme('dark')}>Dark</Button>
          <Button onClick={() => updateTheme('system')}>System</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testNotification}>Test Notification</Button>
          <Button onClick={toggleNotifications} className="ml-2">
            Toggle Notifications
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Timer Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-x-2">
          <Button onClick={() => updateTimerSettings({ workDuration: 30 })}>
            Set Work to 30min
          </Button>
          <Button onClick={() => updateTimerSettings({ workDuration: 25 })}>
            Reset to 25min
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LocalStorage Check</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {localStorageData}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 