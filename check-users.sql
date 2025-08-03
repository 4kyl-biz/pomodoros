-- Check and fix missing user rows
-- Run this in your Supabase SQL editor

-- First, let's see what users exist in auth.users
SELECT 
    id,
    email,
    created_at,
    confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Now let's see what users exist in public.users
SELECT 
    id,
    email,
    created_at,
    updated_at
FROM public.users
ORDER BY created_at DESC;

-- Find users that exist in auth.users but not in public.users
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Insert missing users into public.users
INSERT INTO public.users (id, email, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    au.created_at,
    au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Verify the fix worked
SELECT 
    'auth.users count' as table_name,
    COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
    'public.users count' as table_name,
    COUNT(*) as count
FROM public.users;

-- Check if the trigger is working
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user'; 