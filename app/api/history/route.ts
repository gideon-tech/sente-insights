import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: conversions, error } = await supabaseAdmin
      .from('conversions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ conversions: conversions || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get history';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
