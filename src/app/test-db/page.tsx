'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestDBPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [tables, setTables] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setLoading(true)
      setError('')

      // Test basic connection
      const { data, error: connectionError } = await supabase
        .from('pg_catalog.pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .limit(1)

      if (connectionError) {
        setConnectionStatus('❌ Connection Failed')
        setError(connectionError.message)
        setLoading(false)
        return
      }

      setConnectionStatus('✅ Connected to Supabase')

      // Test if our tables exist
      const expectedTables = ['users', 'sessions', 'tasks', 'notes', 'tags', 'task_tag_xref', 'preferences']
      const existingTables: string[] = []

      for (const tableName of expectedTables) {
        try {
          const { error: tableError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1)

          if (!tableError) {
            existingTables.push(tableName)
          }
        } catch (err) {
          console.log(`Table ${tableName} not found or not accessible`)
        }
      }

      setTables(existingTables)
      setLoading(false)
    } catch (err) {
      setConnectionStatus('❌ Connection Failed')
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  const testTaskCreation = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Test user ID
          title: 'Test Task',
          description: 'This is a test task',
          status: 'todo'
        })
        .select()

      if (error) {
        alert(`Error creating task: ${error.message}`)
      } else {
        alert('✅ Task created successfully!')
        // Clean up the test task
        if (data && data[0]) {
          await supabase
            .from('tasks')
            .delete()
            .eq('id', data[0].id)
        }
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
            <CardDescription>
              Test your Supabase connection and database schema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Connection Status:</span>
              <span className={connectionStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                {connectionStatus}
              </span>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                {error}
              </div>
            )}

            {!loading && tables.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Found Tables:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tables.map((table) => (
                    <div key={table} className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      ✅ {table}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && tables.length === 0 && (
              <div className="text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                ⚠️ No tables found. Make sure you've run the database schema setup.
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={testConnection} disabled={loading}>
                {loading ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button onClick={testTaskCreation} variant="outline">
                Test Task Creation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Create a Supabase project at <a href="https://supabase.com" className="text-blue-500 hover:underline">supabase.com</a></li>
              <li>Copy your project URL and anon key to <code>.env.local</code></li>
              <li>Run the SQL script from <code>supabase-schema.sql</code> in your Supabase SQL Editor</li>
              <li>Configure authentication settings in your Supabase dashboard</li>
              <li>Test the connection using the buttons above</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 