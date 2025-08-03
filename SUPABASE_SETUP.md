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

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the script

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
2. Visit `http://localhost:3000`
3. Try signing up/signing in
4. Test creating tasks at `http://localhost:3000/tasks`

## Troubleshooting

### "Could not find the 'description' column" Error

This error occurs when the database schema hasn't been set up yet. Make sure you've:

1. Run the SQL script in your Supabase SQL Editor
2. Checked that all tables were created successfully
3. Verified your environment variables are correct

### Authentication Issues

1. Check that your site URL and redirect URLs are configured correctly
2. Ensure your environment variables are loaded properly
3. Check the browser console for any CORS errors

### Database Connection Issues

1. Verify your Supabase URL and keys are correct
2. Check that your project is not paused
3. Ensure Row Level Security (RLS) policies are set up correctly 