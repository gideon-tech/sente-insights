'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useProfile } from '@/lib/use-profile';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useProfile();

  const navLinks = [
    { href: '/convert', label: 'Convert' },
    ...(profile ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    { href: '/pricing', label: 'Pricing' },
    { href: '/guides', label: 'Guides' },
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
          <Show when="signed-in">
            {profile && <Badge variant={profile.tier} />}
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="font-mono font-bold text-sm text-brutal-black hover:text-brutal-yellow transition-colors cursor-pointer">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="primary" size="sm">Signup</Button>
            </SignUpButton>
          </Show>
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
