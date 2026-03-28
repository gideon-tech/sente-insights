'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Supabase handles the token exchange from the URL hash automatically
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasSession(true);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.updateUser({ password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/convert'), 2000);
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

          <h1 className="font-mono font-bold text-2xl text-center mb-2">New Password</h1>
          <p className="font-body text-sm text-brutal-muted text-center mb-8">
            Choose a strong password for your account.
          </p>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-brutal-green/10 border-[3px] border-brutal-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brutal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="font-mono font-bold text-sm text-brutal-black mb-2">
                Password updated!
              </p>
              <p className="font-body text-xs text-brutal-muted">
                Redirecting you to the app...
              </p>
            </div>
          ) : !hasSession ? (
            <div className="text-center">
              <p className="font-body text-sm text-brutal-muted mb-4">
                Loading your reset session...
              </p>
              <p className="font-body text-xs text-brutal-muted mb-6">
                If this takes too long, the link may have expired.
              </p>
              <Link href="/forgot-password" className="font-mono font-bold text-sm text-brutal-black hover:text-brutal-yellow transition-colors">
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="New Password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />

              {error && (
                <p className="font-mono text-xs text-brutal-pink font-bold">{error}</p>
              )}

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
