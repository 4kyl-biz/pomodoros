-- Drop all existing tables in the Pomodoro app database
-- WARNING: This will delete all data in these tables!
-- Run this script before running supabase-schema.sql if you have existing tables

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

-- Drop any triggers that might exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
DROP TRIGGER IF EXISTS update_preferences_updated_at ON public.preferences;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop any indexes that might exist
DROP INDEX IF EXISTS idx_sessions_user_id;
DROP INDEX IF EXISTS idx_sessions_started_at;
DROP INDEX IF EXISTS idx_tasks_user_id;
DROP INDEX IF EXISTS idx_tasks_status;
DROP INDEX IF EXISTS idx_notes_session_id;
DROP INDEX IF EXISTS idx_tags_user_id;

-- Verify all tables are dropped
SELECT 'Tables dropped successfully' as status; 