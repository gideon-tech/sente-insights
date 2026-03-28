import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getEffectiveTier } from '@/lib/tiers';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // Apply admin override
    const effectiveTier = getEffectiveTier(profile?.tier || 'free', user.email);
    const effectiveProfile = profile ? { ...profile, tier: effectiveTier } : profile;

    return NextResponse.json({
      profile: effectiveProfile,
      subscription: subscription || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
