import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { analyzeTransactions } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    // Auth required
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check tier
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single();

    if (!profile || !['premium', 'enterprise'].includes(profile.tier)) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 });
    }

    const { transactions, conversionId } = await request.json();

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: 'Transactions array required' }, { status: 400 });
    }

    const insights = await analyzeTransactions(transactions);

    // Save insights
    if (conversionId) {
      await supabaseAdmin.from('insights').insert({
        conversion_id: conversionId,
        user_id: user.id,
        spending_breakdown: insights.spendingBreakdown,
        monthly_summary: insights.monthlySummary,
        habit_insights: insights.habitInsights,
        period_covered: insights.periodCovered,
      });
    }

    return NextResponse.json(insights);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Insights generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
