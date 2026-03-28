'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[73px] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[400px] bg-brutal-card border-[3px] border-brutal-black neo-shadow p-8 rounded-[4px]">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-brutal-yellow border-[3px] border-brutal-black flex items-center justify-center rounded-[4px]">
              <span className="font-mono font-black text-xl text-brutal-black">S</span>
            </div>
          </div>

          <h1 className="font-mono font-bold text-2xl text-center mb-2">Reset Password</h1>
          <p className="font-body text-sm text-brutal-muted text-center mb-8">
            Enter your email and we'll send you a link to reset your password.
          </p>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-brutal-green/10 border-[3px] border-brutal-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brutal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="font-body text-sm text-brutal-black mb-2">
                Check your email for the reset link!
              </p>
              <p className="font-body text-xs text-brutal-muted mb-6">
                If you don't see it, check your spam folder.
              </p>
              <Link href="/login" className="font-mono font-bold text-sm text-brutal-black hover:text-brutal-yellow transition-colors">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <p className="font-mono text-xs text-brutal-pink font-bold">{error}</p>
              )}

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <p className="text-center font-body text-sm text-brutal-muted">
                Remember your password?{' '}
                <Link href="/login" className="font-mono font-bold text-brutal-black hover:text-brutal-yellow transition-colors">
                  Log In
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
