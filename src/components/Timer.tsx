'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer'
import { useSettings } from '@/contexts/SettingsContext'
import { useAuth } from '@/contexts/AuthContext'
import { formatTime } from '@/lib/utils'
import { Play, Pause, RotateCcw, SkipForward, Settings, User, LogOut, CheckSquare, Square } from 'lucide-react'
import Link from 'next/link'
import { TasksService } from '@/lib/tasksService'
import { DataMigrationService } from '@/lib/dataMigration'
import type { Task } from '@/types/database'

export default function Timer() {
  const { settings, loading: settingsLoading } = useSettings()
  const { user, signOut } = useAuth()
  const { timerData, start, pause, resume, reset, skip } = usePomodoroTimer(settings.timer)
  const [isMuted, setIsMuted] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskSelector, setShowTaskSelector] = useState(false)
  const [sessionNote, setSessionNote] = useState('')
  const [showNoteDialog, setShowNoteDialog] = useState(false)

  // Load mute state from localStorage
  useEffect(() => {
    const savedMute = localStorage.getItem('pomodoro-muted')
    if (savedMute) {
      setIsMuted(JSON.parse(savedMute))
    }
  }, [])

  // Load tasks if user is authenticated
  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  // Load tasks
  const loadTasks = async () => {
    if (!user) return

    const { tasks, error } = await TasksService.getTasks(user.id)
    if (!error && tasks) {
      setTasks(tasks)
    }
  }

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

  const handleSessionComplete = async () => {
    if (user && selectedTask) {
      // Save session to cloud
      await DataMigrationService.saveSessionToCloud(user.id, {
        type: 'work',
        startedAt: new Date(Date.now() - (settings.timer.workDuration * 60 * 1000)),
        endedAt: new Date(),
        taskId: selectedTask.id
      })
    }

    // Show note dialog for work sessions
    if (!timerData.isBreak) {
      setShowNoteDialog(true)
    }
  }

  const saveSessionNote = async () => {
    if (user && sessionNote.trim()) {
      // Save note to cloud (this would need the session ID)
      // For now, we'll just clear the note
      setSessionNote('')
    }
    setShowNoteDialog(false)
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

  // Show loading state while settings are being loaded
  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center relative">
          <div className="absolute top-0 right-0 flex space-x-2">
            {user ? (
              <>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm">
                    <CheckSquare className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pomodoro Timer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getSessionType()}
          </p>
          {user && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Signed in as {user.email}
            </p>
          )}
        </div>

        {/* Task Selection */}
        {user && !timerData.isBreak && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Current Task
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTaskSelector(!showTaskSelector)}
              >
                {selectedTask ? 'Change' : 'Select Task'}
              </Button>
            </div>
            
            {selectedTask ? (
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {selectedTask.title}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <Square className="w-4 h-4" />
                <span className="text-sm">No task selected</span>
              </div>
            )}

            {showTaskSelector && (
              <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task)
                      setShowTaskSelector(false)
                    }}
                    className={`w-full text-left p-2 rounded text-sm ${
                      selectedTask?.id === task.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {task.title}
                  </button>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No tasks available. <Link href="/tasks" className="text-blue-500 hover:underline">Create one</Link>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

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

        {/* Session Note Dialog */}
        {showNoteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Session Complete!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                How did this session go? Add a note (optional):
              </p>
              <textarea
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                placeholder="Enter your notes..."
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
              <div className="flex space-x-2 mt-4">
                <Button onClick={saveSessionNote} className="flex-1">
                  Save Note
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNoteDialog(false)}
                  className="flex-1"
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 