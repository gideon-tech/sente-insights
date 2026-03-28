import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { submitOrder } from '@/lib/pesapal';

const PESAPAL_IPN_ID = process.env.PESAPAL_IPN_ID || '';

export async function POST(request: NextRequest) {
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

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { phone, countryCode = 'UG' } = await request.json();

    if (!PESAPAL_IPN_ID) {
      return NextResponse.json({ error: 'Payment system not configured (missing IPN ID)' }, { status: 500 });
    }

    const merchantRef = `sente_${user.id}_${Date.now()}`;
    const callbackUrl = 'https://sente-insights-two.vercel.app/pricing?payment=callback';

    const result = await submitOrder({
      id: merchantRef,
      amount: 500,
      currency: 'UGX',
      description: 'Sente Insights Premium — 1 month',
      callbackUrl,
      notificationId: PESAPAL_IPN_ID,
      billing: {
        email: profile.email,
        phone: phone || '',
        countryCode,
        firstName: profile.full_name?.split(' ')[0] || '',
        lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
      },
    });

    console.log('PesaPal SubmitOrderRequest full response:', JSON.stringify(result, null, 2));

    if (!result.redirect_url) {
      return NextResponse.json({ error: 'Payment gateway did not return a redirect URL', details: result }, { status: 502 });
    }

    // Save pending subscription
    await supabaseAdmin.from('subscriptions').insert({
      user_id: user.id,
      plan: 'premium',
      status: 'pending',
      pesapal_order_tracking_id: result.order_tracking_id,
      pesapal_merchant_reference: result.merchant_reference,
      amount: 500,
      currency: 'UGX',
    });

    return NextResponse.json({
      redirectUrl: result.redirect_url,
      orderTrackingId: result.order_tracking_id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Subscription failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
