import { useState, useEffect, useCallback, useRef } from 'react'

export type TimerState = 'idle' | 'running' | 'paused' | 'break'

export interface TimerSettings {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  autoStartBreaks: boolean
}

export interface TimerData {
  timeLeft: number // in seconds
  state: TimerState
  cycles: number
  isBreak: boolean
  isLongBreak: boolean
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false
}

export function usePomodoroTimer(settings: TimerSettings = DEFAULT_SETTINGS) {
  const [timerData, setTimerData] = useState<TimerData>({
    timeLeft: settings.workDuration * 60,
    state: 'idle',
    cycles: 0,
    isBreak: false,
    isLongBreak: false
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const expectedEndTimeRef = useRef<number | null>(null)

  // Load timer state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-timer')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const now = Date.now()
        
        // If timer was running, calculate remaining time
        if (parsed.state === 'running' && parsed.expectedEndTime) {
          const elapsed = Math.floor((now - parsed.expectedEndTime + (parsed.timeLeft * 1000)) / 1000)
          const newTimeLeft = Math.max(0, parsed.timeLeft - elapsed)
          
          setTimerData({
            ...parsed,
            timeLeft: newTimeLeft,
            state: newTimeLeft > 0 ? 'running' : 'idle'
          })
        } else {
          setTimerData(parsed)
        }
      } catch (error) {
        console.error('Failed to load timer state:', error)
      }
    }
  }, [])

  // Save timer state to localStorage
  const saveToStorage = useCallback((data: TimerData) => {
    const storageData = {
      ...data,
      expectedEndTime: data.state === 'running' ? expectedEndTimeRef.current : null
    }
    localStorage.setItem('pomodoro-timer', JSON.stringify(storageData))
  }, [])

  // Update timer state and save to localStorage
  const updateTimer = useCallback((updates: Partial<TimerData>) => {
    setTimerData(prev => {
      const newData = { ...prev, ...updates }
      saveToStorage(newData)
      return newData
    })
  }, [saveToStorage])

  // Play notification sound
  const playNotification = useCallback(() => {
    const isMuted = localStorage.getItem('pomodoro-muted') === 'true'
    if (!isMuted) {
      const audio = new Audio('/notification.mp3')
      audio.play().catch(() => {
        // Fallback to browser beep if audio file doesn't exist
        console.log('\u0007')
      })
    }
  }, [])

  // Start timer
  const start = useCallback(() => {
    if (timerData.state === 'idle' || timerData.state === 'paused') {
      const now = Date.now()
      const duration = timerData.timeLeft * 1000
      const expectedEnd = now + duration
      
      startTimeRef.current = now
      expectedEndTimeRef.current = expectedEnd
      
      updateTimer({
        state: 'running',
        timeLeft: timerData.timeLeft
      })

      intervalRef.current = setInterval(() => {
        const currentTime = Date.now()
        const elapsed = Math.floor((currentTime - now) / 1000)
        const remaining = Math.max(0, timerData.timeLeft - elapsed)
        
        if (remaining <= 0) {
          // Timer finished
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          
          // Play notification sound
          playNotification()
          
          // Handle session completion
          if (!timerData.isBreak) {
            // Work session completed
            const newCycles = timerData.cycles + 1
            const isLongBreak = newCycles % 4 === 0
            
            updateTimer({
              state: 'idle',
              cycles: newCycles,
              isBreak: true,
              isLongBreak,
              timeLeft: isLongBreak ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60
            })
            
            if (settings.autoStartBreaks) {
              setTimeout(() => start(), 1000) // Auto-start break after 1 second
            }
          } else {
            // Break completed, start work session
            updateTimer({
              state: 'idle',
              isBreak: false,
              isLongBreak: false,
              timeLeft: settings.workDuration * 60
            })
          }
        } else {
          updateTimer({ timeLeft: remaining })
        }
      }, 1000)
    }
  }, [timerData, settings, updateTimer, playNotification])

  // Pause timer
  const pause = useCallback(() => {
    if (timerData.state === 'running') {
      clearInterval(intervalRef.current!)
      intervalRef.current = null
      updateTimer({ state: 'paused' })
    }
  }, [timerData.state, updateTimer])

  // Resume timer
  const resume = useCallback(() => {
    if (timerData.state === 'paused') {
      start()
    }
  }, [timerData.state, start])

  // Reset timer
  const reset = useCallback(() => {
    clearInterval(intervalRef.current!)
    intervalRef.current = null
    
    const isWorkSession = !timerData.isBreak
    const timeLeft = isWorkSession 
      ? settings.workDuration * 60 
      : (timerData.isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration) * 60
    
    updateTimer({
      state: 'idle',
      timeLeft,
      cycles: isWorkSession ? timerData.cycles : timerData.cycles
    })
  }, [timerData, settings, updateTimer])

  // Skip to next session
  const skip = useCallback(() => {
    clearInterval(intervalRef.current!)
    intervalRef.current = null
    
    if (timerData.isBreak) {
      // Skip break, start work session
      updateTimer({
        state: 'idle',
        isBreak: false,
        isLongBreak: false,
        timeLeft: settings.workDuration * 60
      })
    } else {
      // Skip work session, start break
      const newCycles = timerData.cycles + 1
      const isLongBreak = newCycles % 4 === 0
      
      updateTimer({
        state: 'idle',
        cycles: newCycles,
        isBreak: true,
        isLongBreak,
        timeLeft: isLongBreak ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60
      })
    }
  }, [timerData, settings, updateTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    timerData,
    start,
    pause,
    resume,
    reset,
    skip
  }
} 