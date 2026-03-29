'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tag from '@/components/ui/Tag';
import Label from '@/components/ui/Label';
import Card from '@/components/ui/Card';
import { useAuth } from '@clerk/nextjs';
import { useProfile } from '@/lib/use-profile';
import type { Conversion } from '@/types';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authLoading = !isLoaded || profileLoading;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    async function fetchHistory() {
      try {
        const token = await getToken();
        const res = await fetch('/api/history', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to load history');
        const data = await res.json();
        setConversions(data.conversions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [isLoaded, isSignedIn, getToken]);

  // Not logged in
  if (!authLoading && !profile) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-[73px] flex items-center justify-center px-6 py-24">
          <Card className="p-8 max-w-md text-center">
            <span className="text-4xl mb-4 block">🔒</span>
            <h2 className="font-mono font-bold text-xl mb-2">Sign in to view your dashboard</h2>
            <p className="font-body text-sm text-brutal-muted mb-6">
              Your conversion history and stats are saved to your account.
            </p>
            <Link href="/convert">
              <Button variant="primary" fullWidth>Sign In to Get Started</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-[73px] px-6 py-8 max-w-6xl mx-auto w-full">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-48 bg-brutal-surface rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-brutal-surface border-[3px] border-brutal-black rounded-[4px]" />
              ))}
            </div>
            <div className="h-64 bg-brutal-surface border-[3px] border-brutal-black rounded-[4px]" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const tier = profile?.tier || 'free';
  const completed = conversions.filter((c) => c.status === 'completed');
  const totalConversions = completed.length;
  const totalTxns = completed.reduce((sum, c) => sum + (c.transaction_count || 0), 0);
  const totalPages = completed.reduce((sum, c) => sum + (c.page_count || 0), 0);

  const fileTypeTag = (fileType: string | null) => {
    if (!fileType) return <Tag color="gray">Unknown</Tag>;
    const lower = fileType.toLowerCase();
    if (lower.includes('pdf')) return <Tag color="cyan">PDF</Tag>;
    if (lower.includes('png') || lower.includes('jpg') || lower.includes('jpeg')) return <Tag color="yellow">Image</Tag>;
    if (lower.includes('csv')) return <Tag color="green">CSV</Tag>;
    return <Tag color="gray">{fileType}</Tag>;
  };

  const statusDisplay = (status: Conversion['status']) => {
    switch (status) {
      case 'completed':
        return <span className="text-brutal-green font-bold">✓</span>;
      case 'processing':
      case 'ready':
        return <span className="text-brutal-yellow font-bold">⏳</span>;
      case 'failed':
        return <span className="text-brutal-pink font-bold">✗</span>;
      default:
        return <span className="text-brutal-muted">—</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-mono font-black text-3xl tracking-tighter">Dashboard</h1>
            <Badge variant={tier} />
          </div>
          <div className="flex gap-3">
            {tier !== 'premium' && tier !== 'enterprise' && (
              <Link href="/pricing">
                <Button variant="primary" size="sm">Upgrade</Button>
              </Link>
            )}
            <Link href="/convert">
              <Button variant="cyan" size="sm">New Conversion</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card accent="yellow" className="p-5">
            <Label className="text-brutal-muted">Conversions</Label>
            <p className="font-mono font-black text-3xl mt-1">{totalConversions}</p>
          </Card>
          <Card accent="cyan" className="p-5">
            <Label className="text-brutal-muted">Transactions</Label>
            <p className="font-mono font-black text-3xl mt-1">{totalTxns.toLocaleString()}</p>
          </Card>
          <Card accent="green" className="p-5">
            <Label className="text-brutal-muted">Pages Processed</Label>
            <p className="font-mono font-black text-3xl mt-1">{totalPages}</p>
          </Card>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brutal-pink/10 border-[3px] border-brutal-pink rounded-[4px]">
            <p className="font-mono text-sm text-brutal-pink font-bold">{error}</p>
          </div>
        )}

        {/* History Table */}
        {conversions.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-mono text-lg font-bold mb-2">No conversions yet</p>
            <p className="font-body text-sm text-brutal-muted mb-6">
              Upload your first bank or mobile money statement to get started.
            </p>
            <Link href="/convert">
              <Button variant="primary">Convert a Statement</Button>
            </Link>
          </Card>
        ) : (
          <div className="bg-brutal-card border-[3px] border-brutal-black rounded-[4px] overflow-x-auto neo-shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-[3px] border-brutal-black bg-brutal-surface">
                  <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">File</th>
                  <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-right">Pages</th>
                  <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-right">Txns</th>
                  <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {conversions.map((c) => (
                  <tr key={c.id} className="border-b border-brutal-muted/30 last:border-0 hover:bg-brutal-surface">
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3 font-bold max-w-[200px] truncate">{c.filename}</td>
                    <td className="px-4 py-3">{fileTypeTag(c.file_type)}</td>
                    <td className="px-4 py-3 text-right">{c.page_count ?? '—'}</td>
                    <td className="px-4 py-3 text-right">{c.transaction_count ?? '—'}</td>
                    <td className="px-4 py-3 text-center">{statusDisplay(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
