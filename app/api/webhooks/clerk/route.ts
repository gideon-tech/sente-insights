import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserData {
  id: string;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, data } = payload as { type: string; data: ClerkUserData };

    if (type === 'user.created' || type === 'user.updated') {
      const primaryEmail = data.email_addresses.find(
        (e: ClerkEmailAddress) => e.id === data.primary_email_address_id
      );
      const email = primaryEmail?.email_address || data.email_addresses[0]?.email_address || '';
      const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;

      await supabaseAdmin.from('profiles').upsert(
        {
          clerk_id: data.id,
          email,
          full_name: fullName,
          avatar_url: data.image_url,
        },
        { onConflict: 'clerk_id' }
      );
    }

    if (type === 'user.deleted') {
      await supabaseAdmin.from('profiles').delete().eq('clerk_id', data.id);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Clerk webhook error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
