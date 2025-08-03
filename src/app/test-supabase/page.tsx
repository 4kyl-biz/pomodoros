'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestSupabasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const testConnection = async () => {
    setLoading(true)
    setError('')
    setResult('')

    try {
      const { error } = await supabase
        .from('pg_catalog.pg_tables')
        .select('tablename')
        .limit(1)

      if (error) {
        setError(`Connection failed: ${error.message}`)
      } else {
        setResult('✅ Supabase connection successful!')
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    setError('')
    setResult('')

    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setError(`Auth check failed: ${error.message}`)
      } else {
        setResult(`Auth status: ${data.session ? 'Authenticated' : 'Not authenticated'}`)
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Supabase Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test Supabase connection and authentication
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
            <CardDescription>
              Test basic Supabase connectivity
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
            
            {result && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p className="text-green-800 dark:text-green-200">{result}</p>
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>
              Test authentication status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testAuth} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Auth Status'}
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
          <CardContent className="space-y-2">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</p>
            <p><strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 