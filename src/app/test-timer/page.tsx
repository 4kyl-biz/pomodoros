'use client'

import { useEffect, useState } from 'react'
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer'
import { formatTime } from '@/lib/utils'

export default function TestTimer() {
  const { timerData, start, pause, resume, reset, skip } = usePomodoroTimer()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addLog(`Timer state: ${timerData.state}, Time left: ${formatTime(timerData.timeLeft)}`)
  }, [timerData.state, timerData.timeLeft])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Timer Test Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Current State:</h2>
        <p>Time Left: {formatTime(timerData.timeLeft)}</p>
        <p>State: {timerData.state}</p>
        <p>Cycles: {timerData.cycles}</p>
        <p>Is Break: {timerData.isBreak ? 'Yes' : 'No'}</p>
        <p>Is Long Break: {timerData.isLongBreak ? 'Yes' : 'No'}</p>
      </div>

      <div className="space-x-2 mb-4">
        <button 
          onClick={() => { start(); addLog('Start clicked') }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start
        </button>
        <button 
          onClick={() => { pause(); addLog('Pause clicked') }}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Pause
        </button>
        <button 
          onClick={() => { resume(); addLog('Resume clicked') }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Resume
        </button>
        <button 
          onClick={() => { reset(); addLog('Reset clicked') }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
        <button 
          onClick={() => { skip(); addLog('Skip clicked') }}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Skip
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Logs:</h2>
        <div className="max-h-60 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono">{log}</div>
          ))}
        </div>
      </div>
    </div>
  )
} 