'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function UserAvatar({ avatarUrl, name, email, size = 28 }: { avatarUrl: string | null; name: string | null; email: string; size?: number }) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name || email}
        width={size}
        height={size}
        className="rounded-full border-2 border-brutal-black"
      />
    );
  }

  return (
    <div
      className="bg-brutal-yellow border-2 border-brutal-black rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="font-mono font-black text-brutal-black" style={{ fontSize: size * 0.36 }}>
        {getInitials(name, email)}
      </span>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, signOut, loading } = useAuth();

  const authUser = profile ? { email: profile.email, tier: profile.tier } : null;

  const navLinks = [
    { href: '/convert', label: 'Convert' },
    ...(authUser ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className="bg-brutal-bg border-b-[3px] border-brutal-black fixed top-0 w-full z-50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-full mx-auto">
        <Link href="/" className="text-2xl font-black tracking-tighter text-brutal-black font-mono uppercase">
          SENTE INSIGHTS
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-sm tracking-tight transition-all duration-200 ${
                pathname === link.href
                  ? 'text-brutal-black border-b-[3px] border-brutal-yellow pb-1 font-bold'
                  : 'text-brutal-muted font-medium hover:text-brutal-yellow'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {!loading && (authUser ? (
            <>
              <Badge variant={authUser.tier} />
              <UserAvatar avatarUrl={profile!.avatar_url} name={profile!.full_name} email={authUser.email} />
              <span className="hidden sm:block font-mono text-xs text-brutal-muted">
                {profile!.full_name || authUser.email}
              </span>
              <button onClick={signOut} className="font-mono font-bold text-sm text-brutal-black hover:text-brutal-yellow transition-colors cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block font-mono font-bold text-sm text-brutal-black hover:text-brutal-yellow transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Signup</Button>
              </Link>
            </>
          ))}
          <button className="md:hidden text-brutal-black cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t-[3px] border-brutal-black bg-brutal-bg px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-mono text-sm text-brutal-black" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
