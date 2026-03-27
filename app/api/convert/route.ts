import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { uploadStatement, waitUntilReady, convertStatement, setPassword } from '@/lib/bsc';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const format = (formData.get('format') as string) || 'JSON';
    const pdfPassword = formData.get('password') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine user or session
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    let sessionId: string | null = null;
    let tier = 'anonymous';

    if (authHeader) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        userId = user.id;
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('tier')
          .eq('id', userId)
          .single();
        tier = profile?.tier || 'free';
      }
    }

    if (!userId) {
      const cookieStore = await cookies();
      sessionId = cookieStore.get('sente_session')?.value || null;
    }

    // Check usage limits
    const { TIER_CONFIG } = await import('@/lib/tiers');
    const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];

    let currentUsage = 0;
    if (userId) {
      const { data } = await supabaseAdmin
        .from('daily_usage')
        .select('conversions_used')
        .eq('user_id', userId)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();
      currentUsage = data?.conversions_used || 0;
    } else if (sessionId) {
      const { data } = await supabaseAdmin
        .from('daily_usage')
        .select('conversions_used')
        .eq('session_id', sessionId)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();
      currentUsage = data?.conversions_used || 0;
    }

    if (currentUsage >= config.dailyLimit) {
      return NextResponse.json({ error: 'Daily conversion limit reached', limit: config.dailyLimit }, { status: 429 });
    }

    // Upload to BSC
    const arrayBuffer = await file.arrayBuffer();
    const uploadResult = await uploadStatement(arrayBuffer, file.name);
    const bscUuid = uploadResult[0].uuid;
    const state = uploadResult[0].state;

    // Set password if provided
    if (pdfPassword) {
      await setPassword(bscUuid, pdfPassword);
    }

    // Wait if processing (scanned/image PDF)
    if (state === 'PROCESSING') {
      await waitUntilReady(bscUuid);
    }

    // Convert
    const result = await convertStatement(bscUuid, format === 'excel' ? 'JSON' : 'JSON');
    const transactions = result[0]?.normalised || [];

    // Increment usage
    await supabaseAdmin.rpc('increment_usage', {
      p_user_id: userId,
      p_session_id: sessionId,
    });

    // Save conversion record (logged-in users only)
    if (userId) {
      await supabaseAdmin.from('conversions').insert({
        user_id: userId,
        filename: file.name,
        file_type: file.type,
        output_format: format,
        page_count: uploadResult[0].pdfType === 'IMAGE_BASED' ? 1 : null,
        transaction_count: transactions.length,
        status: 'completed',
        bsc_uuid: bscUuid,
      });
    }

    return NextResponse.json({
      transactions,
      transactionCount: transactions.length,
      filename: file.name,
      format,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Conversion failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
