'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tag from '@/components/ui/Tag';
import Label from '@/components/ui/Label';
import Card from '@/components/ui/Card';

const DUMMY_HISTORY = [
  { id: '1', date: '2026-02-08', filename: 'equity_feb.pdf', type: 'Bank', pages: 3, txns: 48, format: 'CSV', status: 'completed' },
  { id: '2', date: '2026-02-06', filename: 'mpesa_mar.jpg', type: 'Mobile Money', pages: 1, txns: 23, format: 'JSON', status: 'completed' },
  { id: '3', date: '2026-02-04', filename: 'airtel_q1.pdf', type: 'Mobile Money', pages: 7, txns: 156, format: 'Excel', status: 'completed' },
  { id: '4', date: '2026-02-01', filename: 'mtn_momo.png', type: 'Mobile Money', pages: 1, txns: 12, format: 'CSV', status: 'completed' },
  { id: '5', date: '2026-01-28', filename: 'stanbic_jan.pdf', type: 'Bank', pages: 5, txns: 89, format: 'JSON', status: 'completed' },
];

export default function DashboardPage() {
  // TODO: Replace with real auth state
  const isLoggedIn = true;
  const user = { email: 'jane@example.com', tier: 'free' as 'free' | 'premium' | 'enterprise' };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-24">
          <Card className="p-8 max-w-md text-center">
            <span className="text-4xl mb-4 block">🔒</span>
            <h2 className="font-mono font-bold text-xl mb-2">Sign in to view your dashboard</h2>
            <p className="font-body text-sm text-brutal-muted mb-6">
              Your conversion history and stats are saved to your account.
            </p>
            <Link href="/login">
              <Button variant="primary" fullWidth>Log In</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const totalConversions = DUMMY_HISTORY.length;
  const totalTxns = DUMMY_HISTORY.reduce((sum, h) => sum + h.txns, 0);
  const totalPages = DUMMY_HISTORY.reduce((sum, h) => sum + h.pages, 0);

  const typeColor = (type: string) => type === 'Bank' ? 'cyan' as const : 'yellow' as const;
  const formatColor = (fmt: string) => {
    if (fmt === 'CSV') return 'gray' as const;
    if (fmt === 'JSON') return 'green' as const;
    return 'cyan' as const;
  };

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-mono font-black text-3xl tracking-tighter">Dashboard</h1>
            <Badge variant={user.tier} />
          </div>
          <div className="flex gap-3">
            {user.tier !== 'premium' && (
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

        {/* History Table */}
        <div className="bg-brutal-card border-[3px] border-brutal-black rounded-[4px] overflow-x-auto neo-shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-[3px] border-brutal-black bg-neutral-50">
                <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">File</th>
                <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-right">Pages</th>
                <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-right">Txns</th>
                <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider">Format</th>
                <th className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {DUMMY_HISTORY.map((h) => (
                <tr key={h.id} className="border-b border-neutral-200 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3 whitespace-nowrap">{h.date}</td>
                  <td className="px-4 py-3 font-bold">{h.filename}</td>
                  <td className="px-4 py-3"><Tag color={typeColor(h.type)}>{h.type}</Tag></td>
                  <td className="px-4 py-3 text-right">{h.pages}</td>
                  <td className="px-4 py-3 text-right">{h.txns}</td>
                  <td className="px-4 py-3"><Tag color={formatColor(h.format)}>{h.format}</Tag></td>
                  <td className="px-4 py-3 text-center text-brutal-green font-bold">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
