-- Fix user trigger to be more robust
-- Run this in your Supabase SQL editor

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a more robust function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user already exists in public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        INSERT INTO public.users (id, email, created_at, updated_at)
        VALUES (NEW.id, NEW.email, NEW.created_at, NEW.created_at);
    END IF;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the auth user creation
        RAISE WARNING 'Failed to create user in public.users: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create a function to manually sync users
CREATE OR REPLACE FUNCTION public.sync_missing_users()
RETURNS INTEGER AS $$
DECLARE
    missing_count INTEGER;
BEGIN
    -- Count missing users
    SELECT COUNT(*) INTO missing_count
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL;
    
    -- Insert missing users
    INSERT INTO public.users (id, email, created_at, updated_at)
    SELECT 
        au.id,
        au.email,
        au.created_at,
        au.created_at
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL;
    
    RETURN missing_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the sync function to fix any existing missing users
SELECT public.sync_missing_users() as users_synced; 