import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { TIER_CONFIG, getEffectiveTier } from '@/lib/tiers';
import { cookies } from 'next/headers';
import type { Tier } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    let tier: Tier = 'anonymous';

    if (authHeader) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        userId = user.id;
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('tier')
          .eq('id', userId)
          .single();
        tier = getEffectiveTier((profile?.tier || 'free') as Tier, user.email);
      }
    }

    const today = new Date().toISOString().split('T')[0];
    let currentUsage = 0;

    if (userId) {
      const { data } = await supabaseAdmin
        .from('daily_usage')
        .select('conversions_used')
        .eq('user_id', userId)
        .eq('date', today)
        .single();
      currentUsage = data?.conversions_used || 0;
    } else {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('sente_session')?.value;
      if (sessionId) {
        const { data } = await supabaseAdmin
          .from('daily_usage')
          .select('conversions_used')
          .eq('session_id', sessionId)
          .eq('date', today)
          .single();
        currentUsage = data?.conversions_used || 0;
      }
    }

    const config = TIER_CONFIG[tier];
    return NextResponse.json({
      tier,
      used: currentUsage,
      limit: config.dailyLimit,
      remaining: config.dailyLimit === Infinity ? Infinity : config.dailyLimit - currentUsage,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get usage';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
