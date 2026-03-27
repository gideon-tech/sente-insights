export type Tier = 'anonymous' | 'free' | 'premium' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  tier: Exclude<Tier, 'anonymous'>;
  created_at: string;
  updated_at: string;
}

export interface DailyUsage {
  id: string;
  user_id: string | null;
  session_id: string | null;
  date: string;
  conversions_used: number;
}

export interface Conversion {
  id: string;
  user_id: string | null;
  filename: string;
  file_type: string | null;
  output_format: string | null;
  page_count: number | null;
  transaction_count: number | null;
  status: 'processing' | 'ready' | 'completed' | 'failed';
  bsc_uuid: string | null;
  error_message: string | null;
  created_at: string;
}

export interface Insight {
  id: string;
  conversion_id: string;
  user_id: string;
  spending_breakdown: SpendingCategory[];
  monthly_summary: MonthlySummary;
  habit_insights: string[];
  period_covered: string;
  created_at: string;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  currency: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  currency: string;
  period: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'premium' | 'enterprise';
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  pesapal_order_tracking_id: string | null;
  pesapal_merchant_reference: string | null;
  amount: number | null;
  currency: string;
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface Transaction {
  date: string;
  description: string;
  debit: number | string;
  credit: number | string;
  balance: number;
  amount?: number | string;
}

export interface BSCUploadResponse {
  uuid: string;
  filename: string;
  pdfType: 'TEXT_BASED' | 'IMAGE_BASED';
  state: 'READY' | 'PROCESSING';
}

export interface BSCConvertResponse {
  normalised: Transaction[];
}

export interface InsightsResponse {
  spendingBreakdown: SpendingCategory[];
  monthlySummary: MonthlySummary;
  habitInsights: string[];
  transactionCount: number;
  periodCovered: string;
}
