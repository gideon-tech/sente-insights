'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface NavbarProps {
  user?: { email: string; tier: 'free' | 'premium' | 'enterprise' } | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = pathname === '/';

  const navLinks = [
    { href: '/convert', label: 'Convert' },
    ...(user ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    { href: '/pricing', label: 'Pricing' },
  ];

  if (isLanding) {
    return (
      <nav className="bg-brutal-bg border-b-[3px] border-brutal-black fixed top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-full mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tighter text-brutal-black font-mono uppercase">
            SENTE INSIGHTS
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/convert"
              className="text-brutal-black border-b-[3px] border-brutal-yellow pb-1 font-bold font-mono text-sm tracking-tight"
            >
              Convert
            </Link>
            <Link
              href="/pricing"
              className="text-brutal-muted font-medium font-mono text-sm tracking-tight hover:text-brutal-yellow transition-all duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-brutal-muted font-medium font-mono text-sm tracking-tight hover:text-brutal-yellow transition-all duration-200"
            >
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Badge variant={user.tier} />
                <span className="hidden sm:block font-mono text-xs text-brutal-muted">{user.email}</span>
                <button onClick={onLogout} className="font-mono font-bold text-sm text-brutal-black hover:text-brutal-yellow transition-colors cursor-pointer">
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
            )}
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
            <Link href="/convert" className="font-mono font-bold text-sm text-brutal-black" onClick={() => setMobileOpen(false)}>Convert</Link>
            <Link href="/pricing" className="font-mono text-sm text-brutal-muted" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link href="/dashboard" className="font-mono text-sm text-brutal-muted" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          </div>
        )}
      </nav>
    );
  }

  // App navbar (non-landing pages)
  return (
    <nav className="bg-brutal-card border-b-[3px] border-brutal-black sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] bg-brutal-yellow border-2 border-brutal-black flex items-center justify-center">
              <span className="font-mono font-black text-[10px] text-brutal-black leading-none">S</span>
            </div>
            <span className="font-mono font-bold text-sm tracking-tighter uppercase text-brutal-black">SENTE INSIGHTS</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-sm tracking-tight transition-colors ${
                pathname === link.href
                  ? 'text-brutal-black font-bold border-b-[3px] border-brutal-yellow pb-0.5'
                  : 'text-brutal-muted font-medium hover:text-brutal-yellow'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Badge variant={user.tier} />
              <span className="hidden lg:block font-mono text-xs text-brutal-muted">{user.email}</span>
              <button onClick={onLogout} className="font-mono font-bold text-xs text-brutal-black hover:text-brutal-yellow transition-colors cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="font-mono font-bold text-sm text-brutal-black hover:text-brutal-yellow transition-colors">
                Log In
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
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
        <div className="md:hidden border-t-[3px] border-brutal-black bg-brutal-card px-6 py-4 flex flex-col gap-4">
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
