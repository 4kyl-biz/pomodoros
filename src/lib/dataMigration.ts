import { supabase } from './supabase'
import type { Session, Task, Preferences } from '@/types/database'

export class DataMigrationService {
  static async migrateLocalData(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user already has data in Supabase
      const { data: existingSessions } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (existingSessions && existingSessions.length > 0) {
        // User already has data, skip migration
        return { success: true }
      }

      // Migrate timer data
      const timerData = localStorage.getItem('pomodoro-timer')
      if (timerData) {
        try {
          const parsed = JSON.parse(timerData)
          if (parsed.cycles > 0) {
            // Create a session record for the completed cycles
            await supabase.from('sessions').insert({
              user_id: userId,
              type: 'work',
              started_at: new Date().toISOString(),
              ended_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            })
          }
        } catch (error) {
          console.error('Failed to migrate timer data:', error)
        }
      }

      // Migrate settings
      const settingsData = localStorage.getItem('pomodoro-settings')
      if (settingsData) {
        try {
          const parsed = JSON.parse(settingsData)
          await supabase.from('preferences').insert({
            user_id: userId,
            settings: parsed,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        } catch (error) {
          console.error('Failed to migrate settings:', error)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Data migration failed:', error)
      return { success: false, error: 'Failed to migrate data' }
    }
  }

  static async syncSettingsToCloud(userId: string, settings: any): Promise<void> {
    try {
      await supabase
        .from('preferences')
        .upsert({
          user_id: userId,
          settings,
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to sync settings to cloud:', error)
    }
  }

  static async loadSettingsFromCloud(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('preferences')
        .select('settings')
        .eq('user_id', userId)
        .single()

      if (error || !data) {
        return null
      }

      return data.settings
    } catch (error) {
      console.error('Failed to load settings from cloud:', error)
      return null
    }
  }

  static async saveSessionToCloud(userId: string, sessionData: {
    type: 'work' | 'short_break' | 'long_break'
    startedAt: Date
    endedAt: Date
    taskId?: string
  }): Promise<void> {
    try {
      await supabase.from('sessions').insert({
        user_id: userId,
        type: sessionData.type,
        started_at: sessionData.startedAt.toISOString(),
        ended_at: sessionData.endedAt.toISOString(),
        task_id: sessionData.taskId || null,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to save session to cloud:', error)
    }
  }

  static async saveNoteToCloud(sessionId: string, content: string): Promise<void> {
    try {
      await supabase.from('notes').insert({
        session_id: sessionId,
        content,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to save note to cloud:', error)
    }
  }
} 