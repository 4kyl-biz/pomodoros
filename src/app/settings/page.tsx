'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useSettings } from '@/contexts/SettingsContext'
import { ArrowLeft, Sun, Moon, Monitor } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { settings, updateTimerSettings, updateTheme, toggleNotifications } = useSettings()
  const [localSettings, setLocalSettings] = useState(settings.timer)

  const handleSave = () => {
    updateTimerSettings(localSettings)
  }

  const handleReset = () => {
    setLocalSettings(settings.timer)
  }

  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings.timer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Timer
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
        </div>

        {/* Timer Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Timer Settings</CardTitle>
            <CardDescription>
              Customize your Pomodoro timer durations and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workDuration">Work Duration (minutes)</Label>
                <Input
                  id="workDuration"
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.workDuration}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    workDuration: parseInt(e.target.value) || 25
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortBreakDuration">Short Break (minutes)</Label>
                <Input
                  id="shortBreakDuration"
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    shortBreakDuration: parseInt(e.target.value) || 5
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longBreakDuration">Long Break (minutes)</Label>
                <Input
                  id="longBreakDuration"
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    longBreakDuration: parseInt(e.target.value) || 15
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoStartBreaks"
                checked={localSettings.autoStartBreaks}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  autoStartBreaks: checked
                }))}
              />
              <Label htmlFor="autoStartBreaks">Auto-start breaks</Label>
            </div>

            {hasChanges && (
              <div className="flex space-x-2">
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Choose your preferred theme and appearance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className="flex space-x-2">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('light')}
                  className="flex items-center space-x-2"
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </Button>
                
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('dark')}
                  className="flex items-center space-x-2"
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </Button>
                
                <Button
                  variant={settings.theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('system')}
                  className="flex items-center space-x-2"
                >
                  <Monitor className="w-4 h-4" />
                  <span>System</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={toggleNotifications}
              />
              <Label htmlFor="notifications">Enable in-tab notifications</Label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Receive notifications when timer sessions end, even when the tab is in the background
            </p>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your timer data and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to reset all settings to default?')) {
                    localStorage.removeItem('pomodoro-settings')
                    localStorage.removeItem('pomodoro-timer')
                    localStorage.removeItem('pomodoro-muted')
                    window.location.reload()
                  }
                }}
              >
                Reset All Settings
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will reset all timer settings, progress, and preferences to their default values.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 