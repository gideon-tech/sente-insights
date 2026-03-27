-- ============================================================
-- Supabase Trigger Setup for Auto-Creating User Profiles
-- ============================================================
-- Run this in your Supabase SQL Editor to fix signup errors
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================================

-- Step 1: Create a function that creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create a trigger that runs the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Verification Query (run after creating trigger)
-- ============================================================
-- SELECT trigger_name, event_manipulation, event_object_table 
-- FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_created';

-- ============================================================
-- Optional: Enable Row Level Security (RLS) on profiles table
-- ============================================================
-- Only enable if you want users to only see their own profiles

-- Enable RLS
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
-- CREATE POLICY "Users can read own profile"
--   ON public.profiles
--   FOR SELECT
--   USING (auth.uid() = id);

-- Allow users to update their own profile
-- CREATE POLICY "Users can update own profile"
--   ON public.profiles
--   FOR UPDATE
--   USING (auth.uid() = id);

-- Allow service role to do anything (for your backend)
-- CREATE POLICY "Service role has full access"
--   ON public.profiles
--   USING (auth.role() = 'service_role');
