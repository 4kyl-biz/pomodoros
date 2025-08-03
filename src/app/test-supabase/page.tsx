'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState<string>('Testing...')

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('pg_catalog.pg_tables').select('*').limit(1)
        
        if (error) {
          setStatus(`Error: ${error.message}`)
        } else {
          setStatus('Supabase connection successful!')
        }
      } catch (err) {
        setStatus(`Connection failed: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <p className="text-lg">{status}</p>
    </div>
  )
} 