'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Label from '@/components/ui/Label';
import Tag from '@/components/ui/Tag';
import type { InsightsResponse } from '@/lib/claude';

interface InsightsPanelProps {
  insights: InsightsResponse | null;
  isLocked: boolean;
  isLoading: boolean;
  onGenerate: () => void;
  onUpgrade: () => void;
}

const trendColor = (trend: string) => {
  if (trend === 'high') return 'bg-brutal-pink';
  if (trend === 'normal') return 'bg-brutal-yellow';
  return 'bg-brutal-green';
};

const tierColor = (tier: string) => {
  if (tier === 'Excellent') return 'green' as const;
  if (tier === 'Good') return 'cyan' as const;
  if (tier === 'Fair') return 'yellow' as const;
  return 'pink' as const;
};

function SkeletonCard() {
  return (
    <Card className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-3 w-32 bg-brutal-surface rounded" />
        <div className="space-y-3">
          <div className="h-4 bg-brutal-surface rounded w-full" />
          <div className="h-4 bg-brutal-surface rounded w-3/4" />
          <div className="h-4 bg-brutal-surface rounded w-1/2" />
        </div>
      </div>
    </Card>
  );
}

function fmt(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

export default function InsightsPanel({ insights, isLocked, isLoading, onGenerate, onUpgrade }: InsightsPanelProps) {
  const [copied, setCopied] = useState(false);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Label>AI Insights</Label>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Premium user, no insights yet
  if (!isLocked && !insights) {
    return (
      <Button variant="green" size="lg" fullWidth onClick={onGenerate}>
        GET AI INSIGHTS →
      </Button>
    );
  }

  // No insights data at all (shouldn't happen but safety)
  if (!insights) return null;

  const data = insights;

  function handleCopyScore() {
    const hs = data.financialHealthScore;
    const text = `Sente Insights Financial Health Score: ${hs.score}/100 (${hs.tier}) | Savings rate: ${data.monthlySummary.savingsRate}% | Period: ${data.monthlySummary.period}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadReport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sente-insights-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const insightsContent = (
    <div className="space-y-6">
      <Label>AI Insights</Label>

      {/* Card 1: Spending Breakdown */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brutal-muted">Spending Breakdown</span>
        </div>
        <div className="space-y-4">
          {data.spendingBreakdown.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold">{cat.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-brutal-muted">
                    {fmt(cat.amount, data.monthlySummary.currency)} ({cat.percentage}%)
                  </span>
                  <span className={`inline-block px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase rounded-[2px] text-brutal-white ${trendColor(cat.trend)}`}>
                    {cat.trend}
                  </span>
                </div>
              </div>
              <div className="w-full h-3 bg-brutal-surface border border-brutal-black rounded-[2px] overflow-hidden">
                <div className={`h-full ${trendColor(cat.trend)}`} style={{ width: `${Math.min(cat.percentage, 100)}%` }} />
              </div>
              {cat.tip && (
                <p className="font-body text-[11px] text-brutal-muted mt-1 ml-0.5">{cat.tip}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Card 2: Monthly Summary */}
      <Card className="p-6">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brutal-muted">Monthly Summary</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="bg-brutal-green/10 border-2 border-brutal-black p-4 rounded-[4px] text-center">
            <span className="font-mono text-[10px] font-bold uppercase text-brutal-green">Income</span>
            <p className="font-mono font-black text-xl mt-1">{fmt(data.monthlySummary.totalIncome, data.monthlySummary.currency)}</p>
          </div>
          <div className="bg-brutal-pink/10 border-2 border-brutal-black p-4 rounded-[4px] text-center">
            <span className="font-mono text-[10px] font-bold uppercase text-brutal-pink">Expenses</span>
            <p className="font-mono font-black text-xl mt-1">{fmt(data.monthlySummary.totalExpenses, data.monthlySummary.currency)}</p>
          </div>
          <div className="bg-brutal-cyan/10 border-2 border-brutal-black p-4 rounded-[4px] text-center">
            <span className="font-mono text-[10px] font-bold uppercase text-brutal-cyan">Savings</span>
            <p className="font-mono font-black text-xl mt-1">{data.monthlySummary.savingsRate}%</p>
          </div>
        </div>
        <p className="font-mono text-xs text-brutal-muted mt-3">
          Fees paid: {fmt(data.monthlySummary.totalFees, data.monthlySummary.currency)}
        </p>
        <p className="font-body text-sm text-brutal-black mt-2 leading-relaxed">{data.monthlySummary.verdict}</p>
      </Card>

      {/* Card 3: Habit Coaching */}
      <Card accent="green" className="p-6">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brutal-muted">Saving Tips</span>
        <div className="mt-5 divide-y-2 divide-brutal-black/10">
          {data.habitCoaching.map((tip, i) => (
            <div key={i} className={`${i > 0 ? 'pt-4' : ''} pb-4`}>
              <div className="flex gap-2 items-start">
                <div className="w-5 h-5 bg-brutal-green rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-brutal-white text-[10px] font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-mono font-bold text-sm">{tip.title}</h4>
                  <p className="font-body text-xs text-brutal-muted mt-1">{tip.observation}</p>
                  <p className="font-body text-xs text-brutal-black mt-1">{tip.action}</p>
                  <p className="font-mono text-xs font-bold text-brutal-green mt-1.5">
                    Save {fmt(tip.potentialSaving, tip.currency)}/month
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Card 4: Top Recipients */}
      <Card className="p-6">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brutal-muted">Where Your Money Goes</span>
        <div className="mt-5 space-y-3">
          {data.topRecipients.map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-brutal-muted w-4">{i + 1}.</span>
                <span className="font-mono text-xs font-bold">{r.name}</span>
                <Tag color="gray">{r.category}</Tag>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold">{fmt(r.amount, data.monthlySummary.currency)}</span>
                <span className="font-mono text-[10px] text-brutal-muted">{r.count}x</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Card 5: Financial Health Score */}
      <Card className="p-6">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brutal-muted">Financial Health Score</span>

        <div className="flex flex-col items-center mt-6 mb-6">
          <div className="w-24 h-24 border-[4px] border-brutal-black rounded-full flex flex-col items-center justify-center">
            <span className="font-mono font-black text-3xl leading-none">{data.financialHealthScore.score}</span>
            <span className="font-mono text-[10px] text-brutal-muted">/ 100</span>
          </div>
          <div className="mt-3">
            <Tag color={tierColor(data.financialHealthScore.tier)}>{data.financialHealthScore.tier}</Tag>
          </div>
        </div>

        <div className="space-y-3">
          {data.financialHealthScore.factors.map((f) => (
            <div key={f.name}>
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs font-bold">{f.name}</span>
                <span className="font-mono text-xs text-brutal-muted">{f.score}/100</span>
              </div>
              <div className="w-full h-2.5 bg-brutal-surface border border-brutal-black rounded-[2px] overflow-hidden">
                <div
                  className={`h-full ${f.score >= 70 ? 'bg-brutal-green' : f.score >= 50 ? 'bg-brutal-yellow' : 'bg-brutal-pink'}`}
                  style={{ width: `${f.score}%` }}
                />
              </div>
              <p className="font-body text-[11px] text-brutal-muted mt-0.5">{f.detail}</p>
            </div>
          ))}
        </div>

        {/* Lender Summary */}
        <div className="mt-6 border-t-2 border-brutal-black pt-4">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-brutal-muted">For Lenders</span>
          <p className="font-body text-sm text-brutal-black mt-2 leading-relaxed">
            {data.financialHealthScore.lenderSummary}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <Button variant="outline" size="sm" onClick={handleCopyScore} className="flex-1">
            {copied ? 'Copied!' : 'Copy Score'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadReport} className="flex-1">
            Download Report
          </Button>
        </div>
      </Card>
    </div>
  );

  // Locked state — blurred with upgrade overlay
  if (isLocked) {
    return (
      <div className="relative">
        <div className="blur-[6px] pointer-events-none select-none">
          {insightsContent}
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Card className="p-8 max-w-sm text-center neo-shadow">
            <div className="w-12 h-12 border-[3px] border-brutal-black rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="font-mono font-bold text-lg mb-2">Unlock AI Insights</h3>
            <p className="font-body text-sm text-brutal-muted mb-6">
              See where your money goes, get personalized saving tips, and build your financial health score.
            </p>
            <Button variant="primary" fullWidth onClick={onUpgrade}>
              Go Premium
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return insightsContent;
}
