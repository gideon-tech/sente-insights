import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getTransactionStatus } from '@/lib/pesapal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderTrackingId = body.OrderTrackingId;

    if (!orderTrackingId) {
      return NextResponse.json({ error: 'Missing OrderTrackingId' }, { status: 400 });
    }

    // Get status from Pesapal
    const status = await getTransactionStatus(orderTrackingId);

    // Find subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*, user_id')
      .eq('pesapal_order_tracking_id', orderTrackingId)
      .single();

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (status.status_code === 1) {
      // COMPLETED — activate subscription
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq('id', subscription.id);

      // Upgrade user tier
      await supabaseAdmin
        .from('profiles')
        .update({ tier: subscription.plan, updated_at: new Date().toISOString() })
        .eq('id', subscription.user_id);

    } else if (status.status_code === 2 || status.status_code === 0) {
      // FAILED or INVALID
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', subscription.id);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
