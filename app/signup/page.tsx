'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

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
          <h1 className="font-mono font-bold text-2xl text-center mb-8">Create Account</h1>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Nakato"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
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
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            {error && (
              <p className="font-mono text-xs text-brutal-pink font-bold">{error}</p>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </Button>

            <p className="text-center font-body text-sm text-brutal-muted">
              Have an account?{' '}
              <Link href="/login" className="font-mono font-bold text-brutal-black hover:text-brutal-yellow transition-colors">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
