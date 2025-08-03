import { supabase } from './supabase'

interface LocalSession {
  type: 'work' | 'short_break' | 'long_break'
  startedAt: Date
  endedAt: Date
  taskId?: string
}

interface LocalTask {
  id: string
  title: string
  description?: string
  status: 'todo' | 'done'
  createdAt: Date
}

interface LocalPreferences {
  timer: {
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    autoStartBreaks: boolean
  }
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
}

export class DataMigrationService {
  static async migrateLocalData(userId: string): Promise<void> {
    try {
      // Migrate sessions
      await this.migrateSessions(userId)
      
      // Migrate tasks
      await this.migrateTasks(userId)
      
      // Migrate preferences
      await this.migratePreferences(userId)
      
      console.log('Data migration completed successfully')
    } catch (error) {
      console.error('Data migration failed:', error)
    }
  }

  private static async migrateSessions(userId: string): Promise<void> {
    try {
      const sessionsData = localStorage.getItem('pomodoro-sessions')
      if (!sessionsData) return

      const sessions: LocalSession[] = JSON.parse(sessionsData)
      
      for (const session of sessions) {
        await supabase
          .from('sessions')
          .insert({
            user_id: userId,
            type: session.type,
            started_at: session.startedAt.toISOString(),
            ended_at: session.endedAt.toISOString(),
            task_id: session.taskId || null
          })
      }

      // Clear local sessions after successful migration
      localStorage.removeItem('pomodoro-sessions')
    } catch (error) {
      console.error('Failed to migrate sessions:', error)
    }
  }

  private static async migrateTasks(userId: string): Promise<void> {
    try {
      const tasksData = localStorage.getItem('pomodoro-tasks')
      if (!tasksData) return

      const tasks: LocalTask[] = JSON.parse(tasksData)
      
      for (const task of tasks) {
        await supabase
          .from('tasks')
          .insert({
            user_id: userId,
            title: task.title,
            description: task.description || null,
            status: task.status,
            created_at: task.createdAt.toISOString(),
            updated_at: task.createdAt.toISOString()
          })
      }

      // Clear local tasks after successful migration
      localStorage.removeItem('pomodoro-tasks')
    } catch (error) {
      console.error('Failed to migrate tasks:', error)
    }
  }

  private static async migratePreferences(userId: string): Promise<void> {
    try {
      const settingsData = localStorage.getItem('pomodoro-settings')
      if (!settingsData) return

      const settings: LocalPreferences = JSON.parse(settingsData)
      
      await supabase
        .from('preferences')
        .upsert({
          user_id: userId,
          settings: {
            timer: settings.timer,
            theme: settings.theme,
            notifications: settings.notifications
          }
        })

      // Don't clear local settings as they're still needed for the app
    } catch (error) {
      console.error('Failed to migrate preferences:', error)
    }
  }

  static async saveSessionToCloud(userId: string, session: LocalSession): Promise<void> {
    try {
      await supabase
        .from('sessions')
        .insert({
          user_id: userId,
          type: session.type,
          started_at: session.startedAt.toISOString(),
          ended_at: session.endedAt.toISOString(),
          task_id: session.taskId || null
        })
    } catch (error) {
      console.error('Failed to save session to cloud:', error)
    }
  }
} 