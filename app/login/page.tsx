'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/convert');
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[73px] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[400px] bg-brutal-card border-[3px] border-brutal-black neo-shadow p-8 rounded-[4px]">
          <h1 className="font-mono font-bold text-2xl text-center mb-8">Log In</h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Link href="/forgot-password" className="font-mono text-xs text-brutal-muted hover:text-brutal-yellow transition-colors">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="font-mono text-xs text-brutal-pink font-bold">{error}</p>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>

            <p className="text-center font-body text-sm text-brutal-muted">
              No account?{' '}
              <Link href="/signup" className="font-mono font-bold text-brutal-black hover:text-brutal-yellow transition-colors">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
