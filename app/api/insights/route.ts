import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { preProcess } from '@/lib/insights-preprocessor';
import { generateInsights } from '@/lib/claude';
import { getEffectiveTier } from '@/lib/tiers';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || '';

    // Check tier
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('tier')
      .eq('clerk_id', userId)
      .single();

    const effectiveTier = getEffectiveTier(profile?.tier || 'free', email);
    if (!['premium', 'enterprise'].includes(effectiveTier)) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 });
    }

    const { headers, transactions, conversionId } = await request.json();

    if (!headers || !transactions || transactions.length === 0) {
      return NextResponse.json({ error: 'No transaction data provided' }, { status: 400 });
    }

    // Step 1: Pre-process raw BSC data
    const preprocessed = preProcess(headers, transactions);

    // Step 2: Claude analysis
    const insights = await generateInsights(preprocessed);

    // Step 3: Save to database
    if (conversionId) {
      await supabaseAdmin.from('insights').insert({
        conversion_id: conversionId,
        user_id: userId,
        spending_breakdown: insights.spendingBreakdown,
        monthly_summary: insights.monthlySummary,
        habit_insights: insights.habitCoaching,
        top_recipients: insights.topRecipients,
        financial_health_score: insights.financialHealthScore,
        period_covered: `${preprocessed.period.start} to ${preprocessed.period.end}`,
      });
    }

    return NextResponse.json(insights);
  } catch (error: unknown) {
    console.error('Insights error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Could not generate insights. Please try again.' },
      { status: 500 }
    );
  }
}

export const maxDuration = 60;
