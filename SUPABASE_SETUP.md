# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Configure Environment Variables

Create or update your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_VERSION=2025-01-27
```

## 3. Set Up Database Schema

### Step 1: Check Current Database State
First, run the `check-tables.sql` script to see what currently exists in your database:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `check-tables.sql`
4. Run the script to see what tables/functions exist

### Step 2: Choose Your Setup Approach

#### Option A: Fresh Setup (Recommended for new projects)
If no tables exist or you want to start completely fresh:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the script

#### Option B: Clean Slate Setup (If you have previous tables)
If you have existing tables and want to start fresh:

1. **⚠️ WARNING: This will delete all existing data!**
2. Go to your Supabase project dashboard
3. Navigate to **SQL Editor**
4. First, run the contents of `drop-tables.sql` to remove existing tables
5. Then, run the contents of `supabase-schema.sql` to create the new schema

#### Option C: Manual Table Updates (If you want to keep existing data)
If you want to preserve existing data, you'll need to manually update your tables:

1. Check which tables already exist in your database (use `check-tables.sql`)
2. For each missing table, run the corresponding `CREATE TABLE` statement from `supabase-schema.sql`
3. Add any missing columns to existing tables using `ALTER TABLE` statements
4. Run the RLS policies and functions separately

## 4. Configure Authentication

1. Go to **Authentication > Settings** in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/reset-password`

## 5. Set Up GitHub OAuth (Optional)

1. Go to **Authentication > Providers** in your Supabase dashboard
2. Enable GitHub provider
3. Create a GitHub OAuth app at [github.com/settings/developers](https://github.com/settings/developers)
4. Set the callback URL to: `https://your-project-ref.supabase.co/auth/v1/callback`
5. Add your GitHub client ID and secret to Supabase

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/test-db` to test the database connection
3. Try signing up/signing in at `http://localhost:3000/auth/signin`
4. Test creating tasks at `http://localhost:3000/tasks`

## Troubleshooting

### "Could not find the 'description' column" Error

This error occurs when the database schema hasn't been set up yet. Make sure you've:

1. **For new projects**: Run the SQL script from `supabase-schema.sql` in your Supabase SQL Editor
2. **For existing projects**: Either:
   - Run `drop-tables.sql` followed by `supabase-schema.sql` (⚠️ deletes all data)
   - Or manually add the missing `description` column: `ALTER TABLE tasks ADD COLUMN description TEXT;`
3. Checked that all tables were created successfully
4. Verified your environment variables are correct

### "relation 'public.users' does not exist" Error

This error occurs when the drop script tries to remove tables that don't exist. The updated `drop-tables.sql` script now handles this properly:

1. **The script is safe to run** - it uses `IF EXISTS` to prevent errors
2. **Run the drop script first** to clean up any existing tables
3. **Then run the schema script** to create the new tables
4. **Use `check-tables.sql`** to verify the current state

### "Table already exists" Error

If you get errors about tables already existing:

1. **Option 1**: Use the `drop-tables.sql` script to remove all existing tables, then run `supabase-schema.sql`
2. **Option 2**: Modify the `CREATE TABLE` statements in `supabase-schema.sql` to use `CREATE TABLE IF NOT EXISTS`
3. **Option 3**: Manually drop individual tables that are causing conflicts

### Authentication Issues

1. Check that your site URL and redirect URLs are configured correctly
2. Ensure your environment variables are loaded properly
3. Check the browser console for any CORS errors

### Database Connection Issues

1. Verify your Supabase URL and keys are correct
2. Check that your project is not paused
3. Ensure Row Level Security (RLS) policies are set up correctly

## Schema Files

- **`check-tables.sql`** - Script to check what tables currently exist in your database
- **`drop-tables.sql`** - Script to remove all existing tables (⚠️ deletes all data)
- **`supabase-schema.sql`** - Complete database schema with all tables, RLS policies, and functions
- **`src/app/test-db/page.tsx`** - Database connection test page

## Database Tables

The schema creates the following tables:

- **`users`** - User profiles (extends Supabase auth)
- **`sessions`** - Pomodoro session records
- **`tasks`** - User tasks with title, description, and status
- **`notes`** - Session notes and reflections
- **`tags`** - Task organization tags
- **`task_tag_xref`** - Many-to-many relationship between tasks and tags
- **`preferences`** - User settings and preferences 