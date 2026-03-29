import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getEffectiveTier } from '@/lib/tiers';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || '';

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    const effectiveTier = getEffectiveTier(profile?.tier || 'free', email);
    const effectiveProfile = profile
      ? { ...profile, tier: effectiveTier }
      : { clerk_id: userId, email, full_name: clerkUser?.fullName || null, avatar_url: clerkUser?.imageUrl || null, tier: effectiveTier };

    return NextResponse.json({
      profile: effectiveProfile,
      subscription: subscription || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
