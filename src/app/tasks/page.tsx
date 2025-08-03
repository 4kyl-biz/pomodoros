'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { TasksService } from '@/lib/tasksService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckSquare, Square, Plus, Edit, Trash2 } from 'lucide-react'
import type { Task } from '@/types/database'

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })

  const loadTasks = useCallback(async () => {
    if (!user) return

    setLoading(true)
    const { tasks: fetchedTasks, error } = await TasksService.getTasks(user.id)
    
    if (error) {
      setError(error.message)
    } else if (fetchedTasks) {
      setTasks(fetchedTasks)
    }
    
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user, loadTasks])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { task, error } = await TasksService.createTask({
      title: formData.title,
      description: formData.description,
      userId: user.id
    })

    if (error) {
      setError(error.message)
    } else if (task) {
      setTasks([task, ...tasks])
      setFormData({ title: '', description: '' })
      setShowForm(false)
      setError('')
    }
  }

  const handleEdit = async (task: Task) => {
    const { task: updatedTask, error } = await TasksService.updateTask({
      id: task.id,
      title: formData.title,
      description: formData.description
    })

    if (error) {
      setError(error.message)
    } else if (updatedTask) {
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t))
      setFormData({ title: '', description: '' })
      setEditingTask(null)
      setError('')
    }
  }

  const handleDelete = async (taskId: string) => {
    const { error } = await TasksService.deleteTask(taskId)
    
    if (error) {
      setError(error.message)
    } else {
      setTasks(tasks.filter(t => t.id !== taskId))
      setError('')
    }
  }

  const handleToggleStatus = async (task: Task) => {
    const { task: updatedTask, error } = await TasksService.toggleTaskStatus(task.id)
    
    if (error) {
      setError(error.message)
    } else if (updatedTask) {
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t))
      setError('')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to manage your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/auth/signin'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Create Task</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {editingTask && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleEdit(editingTask); }} className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description (optional)</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Update Task</Button>
                  <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No tasks yet. Create your first task!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className="mt-1"
                      >
                        {task.status === 'done' ? (
                          <CheckSquare className="w-5 h-5 text-green-500" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${task.status === 'done' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {task.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Created {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTask(task)
                          setFormData({ title: task.title, description: task.description || '' })
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 