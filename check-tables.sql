-- Check what tables currently exist in the database
-- Run this script to see the current state of your database

-- List all tables in the public schema
SELECT 
    table_name,
    'Table exists' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- List all functions in the public schema
SELECT 
    routine_name,
    'Function exists' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- List all triggers
SELECT 
    trigger_name,
    event_object_table,
    'Trigger exists' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY trigger_name;

-- List all indexes
SELECT 
    indexname,
    tablename,
    'Index exists' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- List all RLS policies
SELECT 
    policyname,
    tablename,
    'Policy exists' as status
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Summary
SELECT 
    COUNT(*) as total_tables,
    'Tables found in public schema' as description
FROM information_schema.tables 
WHERE table_schema = 'public'; 