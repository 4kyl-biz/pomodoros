export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string | null
          type: 'work' | 'short_break' | 'long_break'
          started_at: string
          ended_at: string | null
          task_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: 'work' | 'short_break' | 'long_break'
          started_at: string
          ended_at?: string | null
          task_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'work' | 'short_break' | 'long_break'
          started_at?: string
          ended_at?: string | null
          task_id?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'todo' | 'done'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'done'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'done'
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          session_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          content?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          created_at?: string
        }
      }
      task_tag_xref: {
        Row: {
          task_id: string
          tag_id: string
        }
        Insert: {
          task_id: string
          tag_id: string
        }
        Update: {
          task_id?: string
          tag_id?: string
        }
      }
      preferences: {
        Row: {
          user_id: string
          settings: {
            timer: {
              workDuration: number
              shortBreakDuration: number
              longBreakDuration: number
              autoStartBreaks: boolean
            }
            theme: 'light' | 'dark' | 'system'
            notifications: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          settings: {
            timer: {
              workDuration: number
              shortBreakDuration: number
              longBreakDuration: number
              autoStartBreaks: boolean
            }
            theme: 'light' | 'dark' | 'system'
            notifications: boolean
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          settings?: {
            timer: {
              workDuration: number
              shortBreakDuration: number
              longBreakDuration: number
              autoStartBreaks: boolean
            }
            theme: 'light' | 'dark' | 'system'
            notifications: boolean
          }
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Session = Database['public']['Tables']['sessions']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Preferences = Database['public']['Tables']['preferences']['Row'] 