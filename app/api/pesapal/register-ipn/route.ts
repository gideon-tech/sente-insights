import { NextRequest, NextResponse } from 'next/server';
import { registerIPN } from '@/lib/pesapal';

/**
 * One-time utility to register the IPN URL with PesaPal.
 * Call this once, then save the returned ipn_id to PESAPAL_IPN_ID env var.
 * Protected by a simple secret check so only you can call it.
 */
export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();

    // Simple protection — use your Supabase service key as the secret
    if (secret !== process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const ipnUrl = `${appUrl}/api/webhooks/pesapal`;

    const result = await registerIPN(ipnUrl);

    return NextResponse.json({
      message: 'IPN registered successfully. Save the ipn_id to your PESAPAL_IPN_ID env var.',
      ipn_id: result.ipn_id,
      ipn_url: ipnUrl,
      full_response: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'IPN registration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
