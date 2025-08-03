-- Drop all existing tables in the Pomodoro app database
-- WARNING: This will delete all data in these tables!
-- Run this script before running supabase-schema.sql if you have existing tables

-- This script uses IF EXISTS to prevent errors when tables don't exist

-- Drop tables in reverse dependency order to avoid foreign key constraint issues

-- Drop task_tag_xref table (many-to-many relationship)
DROP TABLE IF EXISTS public.task_tag_xref CASCADE;

-- Drop notes table (depends on sessions)
DROP TABLE IF EXISTS public.notes CASCADE;

-- Drop sessions table (depends on tasks and users)
DROP TABLE IF EXISTS public.sessions CASCADE;

-- Drop tasks table (depends on users)
DROP TABLE IF EXISTS public.tasks CASCADE;

-- Drop tags table (depends on users)
DROP TABLE IF EXISTS public.tags CASCADE;

-- Drop preferences table (depends on users)
DROP TABLE IF EXISTS public.preferences CASCADE;

-- Drop users table (depends on auth.users)
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop any triggers that might exist (with error handling)
DO $$
BEGIN
    -- Drop triggers if they exist
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tasks_updated_at') THEN
        DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_preferences_updated_at') THEN
        DROP TRIGGER IF EXISTS update_preferences_updated_at ON public.preferences;
    END IF;
END $$;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop any indexes that might exist
DROP INDEX IF EXISTS idx_sessions_user_id;
DROP INDEX IF EXISTS idx_sessions_started_at;
DROP INDEX IF EXISTS idx_tasks_user_id;
DROP INDEX IF EXISTS idx_tasks_status;
DROP INDEX IF EXISTS idx_notes_session_id;
DROP INDEX IF EXISTS idx_tags_user_id;

-- Drop any RLS policies that might exist
DO $$
DECLARE
    policy_name text;
BEGIN
    -- Drop policies for users table
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', policy_name);
    END LOOP;
    
    -- Drop policies for sessions table
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'sessions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.sessions', policy_name);
    END LOOP;
    
    -- Drop policies for tasks table
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'tasks' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tasks', policy_name);
    END LOOP;
    
    -- Drop policies for notes table
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'notes' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.notes', policy_name);
    END LOOP;
    
    -- Drop policies for tags table
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'tags' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tags', policy_name);
    END LOOP;
    
    -- Drop policies for task_tag_xref table
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'task_tag_xref' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.task_tag_xref', policy_name);
    END LOOP;
    
    -- Drop policies for preferences table
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'preferences' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.preferences', policy_name);
    END LOOP;
END $$;

-- Verify cleanup and show status
SELECT 
    'Database cleanup completed successfully' as status,
    'All existing tables, triggers, functions, and policies have been removed' as details; 