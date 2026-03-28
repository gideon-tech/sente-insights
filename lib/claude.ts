import Anthropic from '@anthropic-ai/sdk';
import type { PreProcessedData } from './insights-preprocessor';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface InsightsResponse {
  spendingBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    trend: 'high' | 'normal' | 'low';
    tip: string;
  }[];
  monthlySummary: {
    totalIncome: number;
    totalExpenses: number;
    totalFees: number;
    savingsRate: number;
    currency: string;
    period: string;
    verdict: string;
  };
  habitCoaching: {
    title: string;
    observation: string;
    action: string;
    potentialSaving: number;
    currency: string;
  }[];
  topRecipients: {
    name: string;
    amount: number;
    count: number;
    category: string;
  }[];
  financialHealthScore: {
    score: number;
    tier: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
    factors: {
      name: string;
      score: number;
      detail: string;
    }[];
    lenderSummary: string;
  };
}

export async function generateInsights(preprocessed: PreProcessedData): Promise<InsightsResponse> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `You are a financial advisor AI built for East African mobile money users.

I have pre-processed a user's mobile money / bank statement. Here is the summary:

PERIOD: ${preprocessed.period.start} to ${preprocessed.period.end}
TOTAL TRANSACTIONS: ${preprocessed.totalTransactions}
TOTAL INCOME (credits): ${preprocessed.currency} ${preprocessed.totalCredits.toLocaleString()}
TOTAL EXPENSES (debits): ${preprocessed.currency} ${preprocessed.totalDebits.toLocaleString()}
TOTAL FEES PAID: ${preprocessed.currency} ${preprocessed.totalFees.toLocaleString()}
NET FLOW: ${preprocessed.currency} ${preprocessed.netFlow.toLocaleString()}
SAVINGS RATE: ${preprocessed.savingsRate}%
AVG DAILY SPEND: ${preprocessed.currency} ${preprocessed.avgDailySpend.toLocaleString()}
TRANSACTIONS PER DAY: ${preprocessed.transactionsPerDay}
INCOME SOURCES: ${preprocessed.incomeStreams}
LARGEST SINGLE EXPENSE: ${preprocessed.currency} ${preprocessed.largestSingleExpense.amount.toLocaleString()} — ${preprocessed.largestSingleExpense.description}

SPENDING BY CATEGORY:
${preprocessed.categoryBreakdown.map(c => `- ${c.category}: ${preprocessed.currency} ${c.total.toLocaleString()} (${c.percentage}%, ${c.count} transactions)`).join('\n')}

TOP MONEY RECIPIENTS:
${preprocessed.topRecipients.map(r => `- ${r.name}: ${preprocessed.currency} ${r.total.toLocaleString()} (${r.count}x)`).join('\n')}

TOP INCOME SOURCES:
${preprocessed.topSources.map(s => `- ${s.name}: ${preprocessed.currency} ${s.total.toLocaleString()} (${s.count}x)`).join('\n')}

SAMPLE TRANSACTIONS (for context):
${JSON.stringify(preprocessed.sampleTransactions.slice(0, 15), null, 2)}

Now generate financial insights. Respond ONLY with valid JSON (no markdown fences):
{
  "spendingBreakdown": [
    {
      "category": "Airtime & Data",
      "amount": 47000,
      "percentage": 24,
      "trend": "high",
      "tip": "One sentence tip specific to this category and their amounts"
    }
  ],
  "monthlySummary": {
    "totalIncome": 850000,
    "totalExpenses": 602000,
    "totalFees": 28000,
    "savingsRate": 29,
    "currency": "UGX",
    "period": "Nov 4, 2025 to Jan 2, 2026",
    "verdict": "One sentence overall financial health assessment"
  },
  "habitCoaching": [
    {
      "title": "Short title like 'Bundle your data'",
      "observation": "What you noticed in their spending pattern — be specific with amounts",
      "action": "Specific actionable advice they can do THIS WEEK",
      "potentialSaving": 22000,
      "currency": "UGX"
    }
  ],
  "topRecipients": [
    {
      "name": "SAMUEL LOGONYI",
      "amount": 55000,
      "count": 6,
      "category": "Cash Out (Agent)"
    }
  ],
  "financialHealthScore": {
    "score": 62,
    "tier": "Good",
    "factors": [
      { "name": "Savings rate", "score": 70, "detail": "You retain X% of income" },
      { "name": "Income consistency", "score": 55, "detail": "X income deposits over the period" },
      { "name": "Fee efficiency", "score": 60, "detail": "X% of spending goes to fees" },
      { "name": "Spending control", "score": 65, "detail": "Largest single expense was X% of income" }
    ],
    "lenderSummary": "2-3 sentence summary a SACCO or lender could read. Factual, not promotional. References specific numbers."
  }
}

RULES:
- Use the EXACT numbers from the pre-processed data. Do NOT invent amounts.
- Use ${preprocessed.currency} for all currency references.
- spendingBreakdown: use the categories from my pre-processed data, add tips. Max 8 categories.
- habitCoaching: exactly 3 tips. Each must reference specific amounts from the data. Each must have a concrete potentialSaving number that is realistic.
- trend values: "high" if category > 20% of spend, "normal" if 10-20%, "low" if < 10%.
- financialHealthScore: score 0-100. Tiers: 80-100 Excellent, 60-79 Good, 40-59 Fair, 0-39 Needs Work.
- factors: exactly 4 factors. Each scored 0-100.
- lenderSummary: factual and professional. A SACCO officer should be able to read this.
- topRecipients: top 5 from the pre-processed data.
- Be encouraging and supportive. Many users track finances for the first time.
- Use East African context: mention boda, M-Pesa, airtime bundles, UMEME, SACCOs, mobile money agents.
- All advice must be ACTIONABLE this week, not vague "spend less" advice.`
    }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const cleaned = text.replace(/```(\w+)?\n?/g, '').replace(/```$/g, '').trim();
  return JSON.parse(cleaned);
}
