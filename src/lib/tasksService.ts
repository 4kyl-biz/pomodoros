import { supabase } from './supabase'
import type { Task } from '@/types/database'

export interface CreateTaskData {
  title: string
  description?: string
  userId: string
}

export interface UpdateTaskData {
  id: string
  title?: string
  description?: string
  status?: 'todo' | 'done'
}

export interface TaskError {
  message: string
  code?: string
  details?: unknown
}

export class TasksService {
  static async createTask(data: CreateTaskData): Promise<{ task: Task | null; error: TaskError | null }> {
    try {
      // First, check if the user exists in public.users
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.userId)
        .single()

      if (userError || !user) {
        console.error('User not found in public.users:', data.userId, userError)
        return { 
          task: null, 
          error: { 
            message: 'User not found. Please try signing out and signing in again.',
            code: 'USER_NOT_FOUND',
            details: userError 
          } 
        }
      }

      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          user_id: data.userId,
          title: data.title,
          description: data.description || null,
          status: 'todo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      return { task, error: error ? { message: error.message, details: error } : null }
    } catch (error) {
      console.error('Error creating task:', error)
      return { 
        task: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error 
        } 
      }
    }
  }

  static async getTasks(userId: string): Promise<{ tasks: Task[] | null; error: TaskError | null }> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { tasks, error: error ? { message: error.message, details: error } : null }
    } catch (error) {
      return { 
        tasks: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error 
        } 
      }
    }
  }

  static async getTask(id: string): Promise<{ task: Task | null; error: TaskError | null }> {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

      return { task, error: error ? { message: error.message, details: error } : null }
    } catch (error) {
      return { 
        task: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error 
        } 
      }
    }
  }

  static async updateTask(data: UpdateTaskData): Promise<{ task: Task | null; error: TaskError | null }> {
    try {
      const updateData: Partial<Task> = {
        updated_at: new Date().toISOString()
      }

      if (data.title !== undefined) updateData.title = data.title
      if (data.description !== undefined) updateData.description = data.description
      if (data.status !== undefined) updateData.status = data.status

      const { data: task, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', data.id)
        .select()
        .single()

      return { task, error: error ? { message: error.message, details: error } : null }
    } catch (error) {
      return { 
        task: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error 
        } 
      }
    }
  }

  static async deleteTask(id: string): Promise<{ error: TaskError | null }> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      return { error: error ? { message: error.message, details: error } : null }
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error 
        } 
      }
    }
  }

  static async toggleTaskStatus(id: string): Promise<{ task: Task | null; error: TaskError | null }> {
    try {
      // First get the current task
      const { data: currentTask, error: getError } = await supabase
        .from('tasks')
        .select('status')
        .eq('id', id)
        .single()

      if (getError || !currentTask) {
        return { task: null, error: getError ? { message: getError.message, details: getError } : null }
      }

      // Toggle the status
      const newStatus = currentTask.status === 'todo' ? 'done' : 'todo'

      const { data: task, error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      return { task, error: error ? { message: error.message, details: error } : null }
    } catch (error) {
      return { 
        task: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error 
        } 
      }
    }
  }
} 