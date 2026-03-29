import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { uploadAndConvert, waitUntilComplete } from '@/lib/bsc';
import { TIER_CONFIG, getEffectiveTier, canUseFormat, type ExportFormat } from '@/lib/tiers';
import { cookies } from 'next/headers';
import type { Tier } from '@/types';
import type { Transaction } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const format = (formData.get('format') as string) || 'JSON';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine user or session
    const { userId } = await auth();
    let sessionId: string | null = null;
    let tier: string = 'anonymous';

    if (userId) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || '';
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('tier')
        .eq('clerk_id', userId)
        .single();
      tier = getEffectiveTier((profile?.tier || 'free') as Tier, email);
    }

    if (!userId) {
      const cookieStore = await cookies();
      sessionId = cookieStore.get('sente_session')?.value || null;
    }

    // Check usage limits
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

    // Validate export format against tier
    if (!canUseFormat(tier as Tier, format.toLowerCase() as ExportFormat)) {
      return NextResponse.json({ error: 'Export format not available for your tier', allowedFormats: config.formats }, { status: 403 });
    }

    const fileInfo = { name: file.name, size: file.size, type: file.type };
    console.log(`[${new Date().toISOString()}] CONVERT START:`, JSON.stringify(fileInfo));

    // Step 1: Upload to BSC
    let job;
    try {
      const arrayBuffer = await file.arrayBuffer();
      job = await uploadAndConvert(arrayBuffer, file.name, file.type);
      console.log(`[${new Date().toISOString()}] CONVERT UPLOAD OK: job_id=${job.job_id}`, JSON.stringify(job));
    } catch (err) {
      console.error(`[${new Date().toISOString()}] CONVERT UPLOAD FAILED:`, JSON.stringify(fileInfo), err instanceof Error ? err.message : err);
      throw err;
    }

    // Step 2: Poll until complete
    let result;
    try {
      result = await waitUntilComplete(job.job_id);
      console.log(`[${new Date().toISOString()}] CONVERT POLL OK: job_id=${job.job_id}, keys=${Object.keys(result)}`);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] CONVERT POLL FAILED: job_id=${job.job_id}`, err instanceof Error ? err.message : err);
      throw err;
    }

    // Step 3: Extract transactions and raw table data from BSC result
    const bscData = result.data as { headers?: string[]; transactions?: string[][] } | undefined;
    const headers = bscData?.headers || [];
    const rawRows = bscData?.transactions || [];
    const transactions = normalizeTransactions(result);

    console.log(`[${new Date().toISOString()}] CONVERT RESULT: job_id=${job.job_id}, headers=${headers.length}, rows=${rawRows.length}, transactions=${transactions.length}`);

    if (rawRows.length === 0) {
      console.error(`[${new Date().toISOString()}] CONVERT EMPTY RESULT: job_id=${job.job_id}, full_response=${JSON.stringify(result).slice(0, 2000)}`);
    }

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
        transaction_count: transactions.length,
        status: 'completed',
        bsc_uuid: job.job_id,
      });
    }

    return NextResponse.json({
      transactions,
      transactionCount: transactions.length,
      filename: file.name,
      format,
      headers,
      rawRows,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Conversion failed';
    console.error(`[${new Date().toISOString()}] CONVERT ERROR:`, message, error instanceof Error ? error.stack : '');
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function normalizeTransactions(result: Record<string, unknown>): Transaction[] {
  const data = result.data as { headers?: string[]; transactions?: unknown[][] } | undefined;

  // BSC returns { data: { headers: [...], transactions: [[...], ...] } }
  if (data?.headers && data?.transactions) {
    const headers = data.headers.map((h: string) => h.toLowerCase());
    return data.transactions.map((row: unknown[]) => {
      const obj: Record<string, string> = {};
      headers.forEach((h: string, i: number) => {
        obj[h] = String(row[i] ?? '');
      });
      return rowToTransaction(obj);
    });
  }

  return [];
}

function parseAmount(val: string): number {
  // Handle values like "-5000.00", "+2642558.00", "UGX 2,958,044.78"
  const cleaned = val.replace(/[A-Z]{2,}\s*/gi, '').replace(/,/g, '').trim();
  return parseFloat(cleaned) || 0;
}

function rowToTransaction(row: Record<string, string>): Transaction {
  const amount = parseAmount(row['amount'] || '0');
  const balance = parseAmount(row['balance'] || '0');

  // Description from reference, account name, or to/from
  const description = [
    row['reference'],
    row['account name'],
    row['to/from'],
  ].filter(Boolean).join(' — ') || row['payment type'] || '';

  return {
    date: row['date & time'] || row['date'] || '',
    description,
    debit: amount < 0 ? Math.abs(amount) : 0,
    credit: amount > 0 ? amount : 0,
    balance,
    amount: Math.abs(amount),
  };
}
