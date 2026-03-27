'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import Label from '@/components/ui/Label';
import { formatBytes } from '@/lib/utils';
import type { ExportFormat } from '@/lib/tiers';
import type { Transaction, InsightsResponse } from '@/types';

// Dummy data for development
const DUMMY_TRANSACTIONS: Transaction[] = [
  { date: '2026-02-03', description: 'Airtime MTN 5000', debit: 5000, credit: '', balance: 1245000 },
  { date: '2026-02-03', description: 'SafeBoda Ride', debit: 8000, credit: '', balance: 1237000 },
  { date: '2026-02-04', description: 'Received from Jane Apio', debit: '', credit: 250000, balance: 1487000 },
  { date: '2026-02-05', description: 'UMEME Electricity', debit: 45000, credit: '', balance: 1442000 },
  { date: '2026-02-05', description: 'Market — Owino', debit: 32000, credit: '', balance: 1410000 },
  { date: '2026-02-06', description: 'M-Pesa to 0772XXXXXX', debit: 100000, credit: '', balance: 1310000 },
  { date: '2026-02-07', description: 'Salary — Kampala Ltd', debit: '', credit: 850000, balance: 2160000 },
  { date: '2026-02-08', description: 'School Fees St. Mary\'s Kisubi', debit: 500000, credit: '', balance: 1660000 },
];

const DUMMY_INSIGHTS: InsightsResponse = {
  spendingBreakdown: [
    { category: 'Airtime & Data', amount: 145000, percentage: 24, currency: 'UGX' },
    { category: 'Transport (Boda)', amount: 98000, percentage: 16, currency: 'UGX' },
    { category: 'Food & Market', amount: 187000, percentage: 31, currency: 'UGX' },
    { category: 'Bills & Utilities', amount: 76000, percentage: 13, currency: 'UGX' },
    { category: 'Transfers Out', amount: 54000, percentage: 9, currency: 'UGX' },
    { category: 'Other', amount: 42000, percentage: 7, currency: 'UGX' },
  ],
  monthlySummary: {
    totalIncome: 850000, totalExpenses: 602000, savingsRate: 29.2, currency: 'UGX', period: 'Feb 2026',
  },
  habitInsights: [
    'You spend 24% on airtime — mostly evenings and weekends. A weekly cap of UGX 30,000 could save you UGX 25,000/month.',
    'Your food spending is consistent and well-managed. Nice budgeting.',
    'You retain about 29% of income. Automating UGX 50,000/month into a SACCO would compound fast.',
  ],
  transactionCount: 48,
  periodCovered: 'Feb 1 to Feb 28, 2026',
};

type ConvertStep = 'idle' | 'uploading' | 'extracting' | 'converting' | 'done' | 'error';

const barColors = ['bg-brutal-yellow', 'bg-brutal-cyan', 'bg-brutal-pink', 'bg-brutal-green', 'bg-purple-400', 'bg-orange-400'];

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [step, setStep] = useState<ConvertStep>('idle');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

  // TODO: Replace with real usage from API
  const usageLeft = 2;
  const isLoggedIn = false;
  const isPremium = false;

  const handleFile = useCallback((f: File) => {
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg', '.csv'];
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!validExts.includes(ext)) {
      setErrorMsg('Unsupported file type. Please upload PDF, PNG, JPG, or CSV.');
      return;
    }
    setFile(f);
    setErrorMsg('');
    setStep('idle');
    setTransactions([]);
    setInsights(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  async function handleConvert() {
    if (!file) return;
    setErrorMsg('');

    try {
      // Step 1: Uploading
      setStep('uploading');
      await new Promise((r) => setTimeout(r, 1200));

      // Step 2: Extracting
      setStep('extracting');
      await new Promise((r) => setTimeout(r, 1800));

      // Step 3: Converting
      setStep('converting');
      await new Promise((r) => setTimeout(r, 1000));

      // TODO: Replace with real API call
      setTransactions(DUMMY_TRANSACTIONS);
      setStep('done');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStep('error');
    }
  }

  async function handleGetInsights() {
    setInsightsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    // TODO: Replace with real API call
    setInsights(DUMMY_INSIGHTS);
    setInsightsLoading(false);
  }

  function handleReset() {
    setFile(null);
    setStep('idle');
    setTransactions([]);
    setInsights(null);
    setErrorMsg('');
  }

  const formats: ExportFormat[] = ['csv', 'json', 'excel'];
  const steps: { key: ConvertStep; label: string }[] = [
    { key: 'uploading', label: 'Uploading' },
    { key: 'extracting', label: 'Extracting' },
    { key: 'converting', label: 'Converting' },
  ];

  const isProcessing = step === 'uploading' || step === 'extracting' || step === 'converting';

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="font-mono font-black text-3xl md:text-4xl tracking-tighter">Convert Statement</h1>
          <div className="font-mono text-sm">
            {isLoggedIn ? (
              <Tag color="gray">{usageLeft} left today</Tag>
            ) : (
              <span className="text-brutal-muted">
                {usageLeft} left today &middot;{' '}
                <a href="/signup" className="font-bold text-brutal-black hover:text-brutal-yellow transition-colors">
                  Sign up &rarr; 5/day free
                </a>
              </span>
            )}
          </div>
        </div>

        {/* Upload Zone */}
        <div
          className={`
            border-[3px] border-dashed p-12 flex flex-col items-center justify-center cursor-pointer
            transition-colors rounded-[4px] mb-6
            ${dragOver ? 'border-brutal-yellow bg-brutal-yellow/10' : 'border-brutal-black bg-brutal-card hover:bg-neutral-50'}
            ${isProcessing || step === 'done' ? 'pointer-events-none' : ''}
          `}
          onClick={() => { if (!isProcessing && step !== 'done') document.getElementById('fileInput')?.click(); }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.csv"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />

          {!file && step === 'idle' && (
            <>
              <span className="text-5xl mb-4">📄</span>
              <p className="font-mono font-bold text-lg mb-2">Drop your PDF, PNG, or JPG here</p>
              <p className="font-body text-sm text-brutal-muted">Supports M-Pesa, MTN, Airtel, Stanbic, Equity & more</p>
            </>
          )}

          {file && step === 'idle' && (
            <>
              <span className="text-5xl mb-4">📋</span>
              <p className="font-mono font-bold text-lg mb-1">{file.name}</p>
              <p className="font-body text-sm text-brutal-muted mb-3">{formatBytes(file.size)}</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="font-mono text-sm font-bold text-brutal-pink hover:underline cursor-pointer"
              >
                Remove file
              </button>
            </>
          )}

          {isProcessing && (
            <>
              {/* Processing bars */}
              <div className="flex items-end gap-1 h-12 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-full ${i % 2 === 0 ? 'bg-brutal-black' : 'bg-brutal-yellow'} processing-bar origin-bottom`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              {/* Steps */}
              <div className="flex gap-6 mt-2">
                {steps.map((s, i) => {
                  const stepOrder = ['uploading', 'extracting', 'converting'];
                  const currentIdx = stepOrder.indexOf(step);
                  const stepIdx = i;
                  const isDone = stepIdx < currentIdx;
                  const isCurrent = stepIdx === currentIdx;
                  return (
                    <div key={s.key} className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${isDone ? 'text-brutal-green' : isCurrent ? 'text-brutal-black' : 'text-brutal-muted'}`}>
                        {isDone ? '✓' : `${i + 1}.`}
                      </span>
                      <span className={`font-mono text-xs ${isCurrent ? 'font-bold' : 'text-brutal-muted'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {step === 'done' && (
            <>
              <span className="text-5xl mb-4">✅</span>
              <p className="font-mono font-bold text-lg mb-2">Conversion complete!</p>
              <p className="font-body text-sm text-brutal-muted">
                {transactions.length} transactions extracted
              </p>
            </>
          )}
        </div>

        {/* Password field for locked PDFs */}
        {file && step === 'idle' && file.name.endsWith('.pdf') && (
          <div className="mb-6">
            <button
              onClick={() => setShowPasswordField(!showPasswordField)}
              className="font-mono text-xs text-brutal-muted hover:text-brutal-black transition-colors cursor-pointer"
            >
              {showPasswordField ? '▾' : '▸'} Password-protected PDF?
            </button>
            {showPasswordField && (
              <input
                type="password"
                placeholder="PDF password"
                value={pdfPassword}
                onChange={(e) => setPdfPassword(e.target.value)}
                className="mt-2 w-full max-w-xs px-4 py-2 bg-brutal-card text-brutal-black font-body text-sm border-[3px] border-brutal-black rounded-[4px] outline-none focus:border-brutal-yellow"
              />
            )}
          </div>
        )}

        {/* Format & Convert */}
        {step !== 'done' && (
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between mb-8">
            <div className="flex border-[3px] border-brutal-black rounded-[4px] overflow-hidden w-full sm:w-auto">
              {formats.map((f, i) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`
                    flex-1 px-4 py-2 font-mono font-bold text-sm text-brutal-black transition-colors cursor-pointer
                    ${f === format ? 'bg-brutal-yellow' : 'bg-brutal-card hover:bg-neutral-100'}
                    ${i < formats.length - 1 ? 'border-r-[3px] border-brutal-black' : ''}
                  `}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="sm:w-auto"
              disabled={!file || isProcessing}
              onClick={handleConvert}
            >
              {isProcessing ? 'Processing...' : 'CONVERT STATEMENT →'}
            </Button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-brutal-pink/10 border-[3px] border-brutal-pink p-4 rounded-[4px] mb-6">
            <p className="font-mono text-sm font-bold text-brutal-pink">{errorMsg}</p>
          </div>
        )}

        {/* Results */}
        {step === 'done' && transactions.length > 0 && (
          <div className="space-y-6">
            {/* Stats tags */}
            <div className="flex flex-wrap gap-3">
              <Tag color="yellow">{transactions.length} Transactions</Tag>
              <Tag color="cyan">{format.toUpperCase()}</Tag>
              <Tag color="gray">{file?.name}</Tag>
            </div>

            {/* Preview table */}
            <div className="bg-brutal-card border-[3px] border-brutal-black rounded-[4px] overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-[3px] border-brutal-black bg-neutral-50">
                    <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-right">Debit</th>
                    <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-right">Credit</th>
                    <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {transactions.slice(0, 10).map((t, i) => (
                    <tr key={i} className="border-b border-neutral-200 last:border-0">
                      <td className="px-4 py-2.5 whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-2.5">{t.description}</td>
                      <td className="px-4 py-2.5 text-right text-brutal-pink">{t.debit || '—'}</td>
                      <td className="px-4 py-2.5 text-right text-brutal-green">{t.credit || '—'}</td>
                      <td className="px-4 py-2.5 text-right">{t.balance?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Download button */}
            <Button variant="cyan" size="lg" fullWidth>
              DOWNLOAD {format.toUpperCase()} ↓
            </Button>

            {/* AI Insights */}
            {isPremium ? (
              !insights ? (
                <Button
                  variant="green"
                  size="lg"
                  fullWidth
                  onClick={handleGetInsights}
                  disabled={insightsLoading}
                >
                  {insightsLoading ? 'Analyzing...' : 'GET AI INSIGHTS →'}
                </Button>
              ) : (
                <div className="space-y-6">
                  {/* Spending Breakdown */}
                  <div className="bg-brutal-card border-[3px] border-brutal-black p-6 rounded-[4px]">
                    <Label>Spending Breakdown</Label>
                    <div className="mt-4 space-y-3">
                      {insights.spendingBreakdown.map((cat, i) => (
                        <div key={cat.category}>
                          <div className="flex justify-between mb-1">
                            <span className="font-mono text-xs font-bold">{cat.category}</span>
                            <span className="font-mono text-xs text-brutal-muted">
                              {cat.currency} {cat.amount.toLocaleString()} ({cat.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-4 bg-neutral-100 border border-brutal-black rounded-[2px] overflow-hidden">
                            <div
                              className={`h-full ${barColors[i % barColors.length]}`}
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-brutal-green/10 border-[3px] border-brutal-black p-4 rounded-[4px] text-center">
                      <Label className="text-brutal-green">Income</Label>
                      <p className="font-mono font-black text-2xl mt-2">
                        {insights.monthlySummary.currency} {insights.monthlySummary.totalIncome.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-brutal-pink/10 border-[3px] border-brutal-black p-4 rounded-[4px] text-center">
                      <Label className="text-brutal-pink">Expenses</Label>
                      <p className="font-mono font-black text-2xl mt-2">
                        {insights.monthlySummary.currency} {insights.monthlySummary.totalExpenses.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-brutal-cyan/10 border-[3px] border-brutal-black p-4 rounded-[4px] text-center">
                      <Label className="text-brutal-cyan">Savings Rate</Label>
                      <p className="font-mono font-black text-2xl mt-2">
                        {insights.monthlySummary.savingsRate}%
                      </p>
                    </div>
                  </div>

                  {/* Habit Insights */}
                  <div className="bg-brutal-card border-[3px] border-brutal-black p-6 rounded-[4px]">
                    <Label>Habit Insights</Label>
                    <div className="mt-4 space-y-3">
                      {insights.habitInsights.map((tip, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <span className="text-brutal-green font-mono font-bold text-sm mt-0.5">💡</span>
                          <p className="font-body text-sm text-brutal-black leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="border-[3px] border-dashed border-brutal-muted p-6 rounded-[4px] text-center">
                <p className="font-mono text-sm text-brutal-muted mb-2">
                  🔒 AI Spending Insights — <span className="font-bold">Premium</span>
                </p>
                <a href="/pricing" className="font-mono text-xs font-bold text-brutal-yellow hover:underline">
                  Upgrade to unlock →
                </a>
              </div>
            )}

            {/* New conversion */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="font-mono text-sm font-bold text-brutal-muted hover:text-brutal-black transition-colors cursor-pointer"
              >
                ← Convert another statement
              </button>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="font-mono text-[10px] text-brutal-muted uppercase tracking-widest">
            Your data is processed securely and never stored 🔒
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
