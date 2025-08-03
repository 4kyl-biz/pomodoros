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

export class TasksService {
  static async createTask(data: CreateTaskData): Promise<{ task: Task | null; error: any }> {
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

      return { task, error }
    } catch (error) {
      console.error('Error creating task:', error)
      return { task: null, error }
    }
  }

  static async getTasks(userId: string): Promise<{ tasks: Task[] | null; error: any }> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { tasks, error }
    } catch (error) {
      return { tasks: null, error }
    }
  }

  static async getTask(id: string): Promise<{ task: Task | null; error: any }> {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

      return { task, error }
    } catch (error) {
      return { task: null, error }
    }
  }

  static async updateTask(data: UpdateTaskData): Promise<{ task: Task | null; error: any }> {
    try {
      const updateData: any = {
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

      return { task, error }
    } catch (error) {
      return { task: null, error }
    }
  }

  static async deleteTask(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async toggleTaskStatus(id: string): Promise<{ task: Task | null; error: any }> {
    try {
      // First get the current task
      const { data: currentTask, error: getError } = await supabase
        .from('tasks')
        .select('status')
        .eq('id', id)
        .single()

      if (getError || !currentTask) {
        return { task: null, error: getError }
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

      return { task, error }
    } catch (error) {
      return { task: null, error }
    }
  }
} 