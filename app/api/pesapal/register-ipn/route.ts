import { NextRequest, NextResponse } from 'next/server';
import { registerIPN } from '@/lib/pesapal';

/**
 * One-time utility to register the IPN URL with PesaPal.
 * Call this once, then save the returned ipn_id to PESAPAL_IPN_ID env var.
 *
 * curl -X POST https://sente-insights-two.vercel.app/api/pesapal/register-ipn \
 *   -H "Content-Type: application/json" \
 *   -d '{"ipnUrl": "https://sente-insights-two.vercel.app/api/webhooks/pesapal"}'
 */
export async function POST(request: NextRequest) {
  try {
    const { ipnUrl } = await request.json();

    if (!ipnUrl) {
      return NextResponse.json({ error: 'Missing ipnUrl in request body' }, { status: 400 });
    }

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
