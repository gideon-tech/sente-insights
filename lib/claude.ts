import Anthropic from '@anthropic-ai/sdk';
import { InsightsResponse, Transaction } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyzeTransactions(transactions: Transaction[]): Promise<InsightsResponse> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are a financial analyst AI for East African users.
Analyze these transactions from a mobile money or bank statement.

TRANSACTIONS:
${JSON.stringify(transactions)}

Respond ONLY with valid JSON (no markdown fences):
{
  "spendingBreakdown": [
    { "category": "Airtime & Data", "amount": 45000, "percentage": 23, "currency": "UGX" }
  ],
  "monthlySummary": {
    "totalIncome": 850000,
    "totalExpenses": 720000,
    "savingsRate": 15.3,
    "currency": "UGX",
    "period": "Jan 2026"
  },
  "habitInsights": [
    "Actionable insight with specific amounts in local currency."
  ],
  "transactionCount": 142,
  "periodCovered": "Jan 1 to Jan 31, 2026"
}

Rules:
- Infer currency from the data (UGX, KES, TZS, RWF)
- Categories: Airtime & Data, Transport, Food & Market, Bills & Utilities,
  Transfers, Savings, Loans, Fees, Entertainment, Other
- 3 habit insights max, each actionable and encouraging
- Use East African context (M-Pesa, boda, airtime, UMEME, etc.)
- Be supportive — many users are tracking finances for the first time`
    }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return JSON.parse(text.replace(/```(\w+)?\n?/g, '').replace(/```$/g, '').trim());
}
