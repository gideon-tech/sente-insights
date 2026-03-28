interface RawTransaction {
  dateTime: string;
  paymentType: string;
  toFrom: string;
  accountName: string;
  amount: string;
  transactionId: string;
  fees: string;
  tax: string;
  balance: string;
  reference: string;
}

export interface PreProcessedData {
  period: { start: string; end: string };
  totalTransactions: number;
  totalCredits: number;
  totalDebits: number;
  totalFees: number;
  netFlow: number;
  savingsRate: number;
  currency: string;
  avgDailySpend: number;
  transactionsPerDay: number;
  categoryBreakdown: { category: string; total: number; count: number; percentage: number }[];
  topRecipients: { name: string; total: number; count: number }[];
  topSources: { name: string; total: number; count: number }[];
  incomeStreams: number;
  largestSingleExpense: { amount: number; description: string; date: string };
  sampleTransactions: RawTransaction[];
}

function categorize(paymentType: string, accountName: string, reference: string): string {
  const type = paymentType.toUpperCase();
  const name = accountName.toUpperCase();
  const ref = reference.toUpperCase();

  if (type === 'AIRTIME' || type === 'VOICE BUNDLE' || type === 'SMS BUNDLE' ||
      type === 'INTERNET BUNDLE' || type === 'YANGE' ||
      ref.includes('BUNDLE') || name.includes('AIRTIME') ||
      name.includes('CISDATABUN')) {
    return 'Airtime & Data';
  }

  if (type === 'CASH OUT') return 'Cash Out (Agent)';
  if (type === 'CASH IN') return 'Cash In (Deposit)';

  if (type === 'MOMO TO BANK' || name.includes('ABSA BANK') ||
      name.includes('UNITED BANK') || name.includes('STANBIC') ||
      name.includes('EQUITY') || name.includes('CENTENARY')) {
    return 'Bank Transfer';
  }

  if (type === 'PAYMENT' || ref.includes('TILL:')) return 'Merchant Payment';
  if (type === 'OTHER NETWORKS' || name.includes('AIRTEL')) return 'Cross-Network Transfer';
  if (name.includes('WORLD REMIT') || name.includes('REMIT')) return 'Remittance';

  if (name.includes('FIDO') || name.includes('YO UGANDA') ||
      ref.includes('YO PAYMENTS')) return 'Loans & Services';

  if (name.includes('JUMIA')) return 'Online Shopping';
  if (type === 'MOMO USER') return 'P2P Transfer';
  if (type === 'DEBIT') return 'Services & Subscriptions';

  return 'Other';
}

function parseAmount(amountStr: string): number {
  return parseFloat(amountStr.replace(/[+,]/g, '')) || 0;
}

function parseFees(feeStr: string): number {
  const match = feeStr.replace(/[A-Z\s,]/g, '');
  return parseFloat(match) || 0;
}

export function preProcess(headers: string[], transactions: string[][]): PreProcessedData {
  const rows: RawTransaction[] = transactions.map(row => ({
    dateTime: row[0] || '',
    paymentType: row[1] || '',
    toFrom: row[2] || '',
    accountName: row[3] || '',
    amount: row[4] || '0',
    transactionId: row[5] || '',
    fees: row[6] || '',
    tax: row[7] || '',
    balance: row[8] || '',
    reference: row[9] || '',
  }));

  let totalCredits = 0;
  let totalDebits = 0;
  let totalFees = 0;

  const recipientMap = new Map<string, { total: number; count: number }>();
  const sourceMap = new Map<string, { total: number; count: number }>();
  const categoryMap = new Map<string, { total: number; count: number }>();

  let largestExpense = { amount: 0, description: '', date: '' };

  rows.forEach(row => {
    const amt = parseAmount(row.amount);
    const fee = parseFees(row.fees);
    totalFees += fee;

    const category = categorize(row.paymentType, row.accountName, row.reference);

    if (amt > 0) {
      totalCredits += amt;
      const src = row.accountName || row.toFrom || 'Unknown';
      const existing = sourceMap.get(src) || { total: 0, count: 0 };
      sourceMap.set(src, { total: existing.total + amt, count: existing.count + 1 });
    } else if (amt < 0) {
      const absAmt = Math.abs(amt);
      totalDebits += absAmt;

      const recipient = row.accountName || row.toFrom || 'Unknown';
      const existing = recipientMap.get(recipient) || { total: 0, count: 0 };
      recipientMap.set(recipient, { total: existing.total + absAmt, count: existing.count + 1 });

      const catExisting = categoryMap.get(category) || { total: 0, count: 0 };
      categoryMap.set(category, { total: catExisting.total + absAmt, count: catExisting.count + 1 });

      if (absAmt > largestExpense.amount) {
        largestExpense = { amount: absAmt, description: `${row.accountName} — ${row.reference}`, date: row.dateTime };
      }
    }
  });

  const dates = rows.map(r => r.dateTime).filter(Boolean);
  const period = { start: dates[dates.length - 1] || '', end: dates[0] || '' };

  const dayCount = Math.max(1, Math.ceil(
    (new Date(period.end).getTime() - new Date(period.start).getTime()) / (1000 * 60 * 60 * 24)
  )) || 30;

  const netFlow = totalCredits - totalDebits;
  const savingsRate = totalCredits > 0 ? Math.round((netFlow / totalCredits) * 100) : 0;

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, { total, count }]) => ({
      category,
      total: Math.round(total),
      count,
      percentage: totalDebits > 0 ? Math.round((total / totalDebits) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const topRecipients = Array.from(recipientMap.entries())
    .map(([name, { total, count }]) => ({ name, total: Math.round(total), count }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const topSources = Array.from(sourceMap.entries())
    .map(([name, { total, count }]) => ({ name, total: Math.round(total), count }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const sampleTransactions = [
    ...rows.slice(0, 10),
    ...rows.slice(-10),
  ].filter((v, i, a) => a.findIndex(t => t.transactionId === v.transactionId) === i)
    .slice(0, 20);

  const currencyMatch = rows.find(r => r.balance || r.fees);
  const currency = currencyMatch?.balance?.match(/^[A-Z]{3}/)?.[0] ||
                   currencyMatch?.fees?.match(/^[A-Z]{3}/)?.[0] || 'UGX';

  return {
    period,
    totalTransactions: rows.length,
    totalCredits: Math.round(totalCredits),
    totalDebits: Math.round(totalDebits),
    totalFees: Math.round(totalFees),
    netFlow: Math.round(netFlow),
    savingsRate,
    currency,
    avgDailySpend: Math.round(totalDebits / dayCount),
    transactionsPerDay: Math.round((rows.length / dayCount) * 10) / 10,
    categoryBreakdown,
    topRecipients,
    topSources,
    incomeStreams: sourceMap.size,
    largestSingleExpense: { ...largestExpense, amount: Math.round(largestExpense.amount) },
    sampleTransactions,
  };
}
