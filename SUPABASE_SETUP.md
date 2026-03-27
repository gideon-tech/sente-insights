# Fixing the "Database error saving new user" Issue

## Problem
When users try to sign up, they get a "Database error saving new user" error.

## Root Cause
The `profiles` table has a foreign key constraint to `auth.users`, but there's no database trigger to automatically create a profile record when a new user signs up via Supabase Auth.

## Solution

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: `nzptqcfjfhbrlvtskyhx`
3. Click on **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Run the Trigger Setup SQL
Copy the contents of `supabase-setup.sql` and paste into the SQL Editor, then click **Run**.

This will:
- ✅ Create a function `handle_new_user()` that inserts a new profile
- ✅ Create a trigger that runs when a user signs up
- ✅ Set the new user's tier to 'free' by default
- ✅ Copy their email and full_name from auth metadata

### Step 3: Test Signup
1. Try signing up with a new email address
2. The signup should now work without errors
3. Check the `profiles` table - you should see a new record

## What the Trigger Does

```
User signs up → Supabase Auth creates user → Trigger fires → Profile created
```

**Before:**
- auth.users ✅ (user created)
- profiles ❌ (no profile, error!)

**After:**
- auth.users ✅ (user created)
- profiles ✅ (profile auto-created by trigger)

## Verification

Run this query in SQL Editor to verify the trigger exists:

```sql
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

You should see one row returned.

## Optional: Enable Row Level Security (RLS)

If you want users to only access their own profile data, uncomment the RLS policies at the bottom of `supabase-setup.sql`.

⚠️ **Note:** If you enable RLS, make sure your API routes use the `service_role` key (which they already do in `lib/supabase/server.ts`) to bypass RLS for backend operations.
