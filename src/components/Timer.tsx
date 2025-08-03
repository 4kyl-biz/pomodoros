'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer'
import { useSettings } from '@/contexts/SettingsContext'
import { formatTime } from '@/lib/utils'
import { Play, Pause, RotateCcw, SkipForward, Settings } from 'lucide-react'
import Link from 'next/link'

export default function Timer() {
  const { settings } = useSettings()
  const { timerData, start, pause, resume, reset, skip } = usePomodoroTimer(settings.timer)
  const [isMuted, setIsMuted] = useState(false)

  // Load mute state from localStorage
  useEffect(() => {
    const savedMute = localStorage.getItem('pomodoro-muted')
    if (savedMute) {
      setIsMuted(JSON.parse(savedMute))
    }
  }, [])

  // Save mute state to localStorage
  const toggleMute = () => {
    const newMuteState = !isMuted
    setIsMuted(newMuteState)
    localStorage.setItem('pomodoro-muted', JSON.stringify(newMuteState))
  }

  const handleStartPause = () => {
    if (timerData.state === 'running') {
      pause()
    } else {
      if (timerData.state === 'paused') {
        resume()
      } else {
        start()
      }
    }
  }

  const handleReset = () => {
    reset()
  }

  const handleSkip = () => {
    skip()
  }

  const getSessionType = () => {
    if (timerData.isBreak) {
      return timerData.isLongBreak ? 'Long Break' : 'Short Break'
    }
    return 'Work Session'
  }

  const getProgressColor = () => {
    if (timerData.isBreak) {
      return timerData.isLongBreak ? 'bg-green-500' : 'bg-blue-500'
    }
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center relative">
          <Link href="/settings" className="absolute top-0 right-0">
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pomodoro Timer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getSessionType()}
          </p>
        </div>

        {/* Timer Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Progress Ring */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                className={`${getProgressColor()} transition-all duration-1000 ease-linear`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - (timerData.timeLeft / (timerData.isBreak ? (timerData.isLongBreak ? settings.timer.longBreakDuration : settings.timer.shortBreakDuration) : settings.timer.workDuration) / 60))}`}
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatTime(timerData.timeLeft)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {timerData.state === 'running' ? 'Running' : 
                   timerData.state === 'paused' ? 'Paused' : 'Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={handleStartPause}
              size="lg"
              className="w-16 h-16 rounded-full"
            >
              {timerData.state === 'running' ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={handleSkip}
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          {/* Cycle Counter */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Completed Sessions
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {timerData.cycles}
            </p>
          </div>
        </div>

        {/* Mute Toggle */}
        <div className="text-center">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </Button>
        </div>
      </div>
    </div>
  )
} 