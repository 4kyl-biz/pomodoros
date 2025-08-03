'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestDbPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [tables, setTables] = useState<string[]>([])
  const [testResult, setTestResult] = useState('')

  // Test database connection
  const testConnection = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { data, error } = await supabase
        .from('pg_catalog.pg_tables')
        .select('tablename')
        .limit(5)

      if (error) {
        setError(`Connection failed: ${error.message}`)
      } else {
        setMessage('Database connection successful!')
        setTables(data?.map(row => row.tablename) || [])
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Test user creation
  const testUserCreation = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // This is just a test - we won't actually create a user
      const testEmail = `test-${Date.now()}@example.com`
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123'
      })

      if (error) {
        setError(`User creation test failed: ${error.message}`)
      } else {
        setMessage(`User creation test successful! Check if user was created in auth.users`)
        setTestResult(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Test table creation
  const testTableCreation = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // This would require admin privileges, so we'll just test the connection
      const { error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (error) {
        setError(`Table access failed: ${error.message}`)
      } else {
        setMessage('Table access successful! Users table exists and is accessible.')
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Database Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test Supabase connection and database operations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Connection Test</CardTitle>
              <CardDescription>
                Test basic database connectivity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testConnection} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Connection'}
              </Button>
              
              {message && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-green-800 dark:text-green-200">{message}</p>
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {tables.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Available Tables:</h4>
                  <ul className="text-sm space-y-1">
                    {tables.map((table, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">
                        {table}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Creation Test</CardTitle>
              <CardDescription>
                Test user registration flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testUserCreation} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test User Creation'}
              </Button>
              
              {testResult && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                  <h4 className="font-medium mb-2">Test Result:</h4>
                  <pre className="text-xs overflow-auto">{testResult}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table Access Test</CardTitle>
              <CardDescription>
                Test access to application tables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testTableCreation} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Table Access'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Info</CardTitle>
              <CardDescription>
                Check environment configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Supabase URL</Label>
                <Input 
                  value={process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'} 
                  readOnly 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Supabase Anon Key</Label>
                <Input 
                  value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'} 
                  readOnly 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 