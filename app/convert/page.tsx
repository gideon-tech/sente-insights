'use client';

import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { formatBytes } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import InsightsPanel from '@/components/insights/InsightsPanel';
import type { ExportFormat } from '@/lib/tiers';
import type { InsightsResponse } from '@/lib/claude';

type ConvertStep = 'idle' | 'uploading' | 'extracting' | 'converting' | 'done' | 'error';

export default function ConvertPage() {
  const { user, session, profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [step, setStep] = useState<ConvertStep>('idle');
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [tableRows, setTableRows] = useState<string[][]>([]);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [usageLeft, setUsageLeft] = useState<number | null>(null);

  const isLoggedIn = !!user;
  const isPremium = profile?.tier === 'premium' || profile?.tier === 'enterprise';

  useEffect(() => {
    async function fetchUsage() {
      try {
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        const res = await fetch('/api/usage', { headers });
        if (res.ok) {
          const data = await res.json();
          setUsageLeft(data.remaining === Infinity ? null : data.remaining);
        }
      } catch {
        // ignore
      }
    }
    fetchUsage();
  }, [session]);

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
    setTableHeaders([]);
    setTableRows([]);
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
      setStep('uploading');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      if (pdfPassword) {
        formData.append('password', pdfPassword);
      }

      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      setStep('extracting');

      const res = await fetch('/api/convert', {
        method: 'POST',
        headers,
        body: formData,
      });

      setStep('converting');

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Conversion failed');
      }

      const data = await res.json();
      setTableHeaders(data.headers || []);
      setTableRows(data.rawRows || []);
      setStep('done');

      // Refresh usage count
      const usageRes = await fetch('/api/usage', { headers });
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setUsageLeft(usageData.remaining === Infinity ? null : usageData.remaining);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStep('error');
    }
  }

  async function handleGetInsights() {
    if (!session?.access_token) return;
    setInsightsLoading(true);

    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ headers: tableHeaders, transactions: tableRows }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get insights');
      }

      const data = await res.json();
      setInsights(data);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to get insights');
    } finally {
      setInsightsLoading(false);
    }
  }

  function handleDownload() {
    if (tableRows.length === 0) return;

    let content: string;
    let mimeType: string;
    let ext: string;

    if (format === 'json') {
      const data = tableRows.map(row => {
        const obj: Record<string, string> = {};
        tableHeaders.forEach((h, i) => { obj[h] = row[i] ?? ''; });
        return obj;
      });
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else {
      const csvEscape = (v: string) => v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
      const rows = tableRows.map(row => row.map(csvEscape).join(','));
      content = [tableHeaders.map(csvEscape).join(','), ...rows].join('\n');
      mimeType = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'transactions';
    a.download = `${baseName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setFile(null);
    setStep('idle');
    setTableHeaders([]);
    setTableRows([]);
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
      <main className="flex-1 pt-[73px] px-6 py-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="font-mono font-black text-3xl md:text-4xl tracking-tighter">Convert Statement</h1>
          <div className="font-mono text-sm">
            {isLoggedIn ? (
              <Tag color="gray">{usageLeft === null ? 'Unlimited' : `${usageLeft} left today`}</Tag>
            ) : (
              <span className="text-brutal-muted">
                {usageLeft !== null ? `${usageLeft} left today` : ''} &middot;{' '}
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
                {tableRows.length} transactions extracted
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
        {step === 'done' && tableRows.length > 0 && (
          <div className="space-y-6">
            {/* Stats tags */}
            <div className="flex flex-wrap gap-3">
              <Tag color="yellow">{tableRows.length} Transactions</Tag>
              <Tag color="cyan">{format.toUpperCase()}</Tag>
              <Tag color="gray">{file?.name}</Tag>
            </div>

            {/* Preview table */}
            <div className="bg-brutal-card border-[3px] border-brutal-black rounded-[4px] overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-[3px] border-brutal-black bg-neutral-50">
                    {tableHeaders.map((h) => (
                      <th key={h} className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {tableRows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-neutral-200 last:border-0">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2.5 whitespace-nowrap">
                          {cell || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Download button */}
            <Button variant="cyan" size="lg" fullWidth onClick={handleDownload}>
              DOWNLOAD {format.toUpperCase()} ↓
            </Button>

            {/* AI Insights */}
            <InsightsPanel
              insights={insights}
              isLocked={!isPremium}
              isLoading={insightsLoading}
              onGenerate={handleGetInsights}
              onUpgrade={() => { window.location.href = '/pricing'; }}
            />

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
