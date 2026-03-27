import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Find expired subscriptions
    const { data: expired } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id')
      .eq('status', 'active')
      .lt('expires_at', new Date().toISOString());

    if (expired && expired.length > 0) {
      for (const sub of expired) {
        // Mark subscription as expired
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('id', sub.id);

        // Downgrade user tier to free
        await supabaseAdmin
          .from('profiles')
          .update({ tier: 'free', updated_at: new Date().toISOString() })
          .eq('id', sub.user_id);
      }
    }

    return NextResponse.json({
      processed: expired?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Cron job failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
