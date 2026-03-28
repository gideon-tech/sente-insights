'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';

const tiers = [
  {
    label: 'Session-Based',
    name: 'Anonymous',
    price: '$0',
    period: '/one-off',
    features: [
      'Single File Upload',
      'No Account Required',
      'Basic CSV Export',
      'No History Tracking',
    ],
    cta: 'Start Now',
    ctaHref: '/convert',
  },
  {
    label: 'Individual',
    name: 'Free',
    price: '$0',
    period: '/forever',
    features: [
      '5 Files / Month',
      'Basic CSV Export',
      '30-Day History',
      'Custom Categories',
    ],
    cta: 'Sign Up',
    ctaHref: '/signup',
  },
  {
    label: 'Professional',
    name: 'Premium',
    price: 'UGX 500',
    period: '/monthly',
    features: [
      'Unlimited Files',
      'Multi-Bank Parsing',
      'Priority Support',
      'AI Financial Insights',
    ],
    cta: 'Go Premium',
    ctaHref: '#checkout',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    label: 'Global Scale',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'On-Premise Deployment',
      'API Access (Beta)',
      'SOC2 Compliance Reports',
      'Custom Categories',
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact',
  },
];

const faqs = [
  {
    q: 'Which file types are supported for extraction?',
    a: 'We support PDF, CSV, XLSX, and MT940 formats. Our OCR engine is specifically tuned for high-density financial statements with a 99.9% accuracy rate on tabular data.',
  },
  {
    q: 'How is my financial data secured?',
    a: 'All data is encrypted with AES-256 at rest and TLS 1.3 in transit. We follow a strict zero-knowledge architecture—we never store your original statement files after processing is complete.',
  },
  {
    q: 'Can I export to accounting software?',
    a: 'Direct exports are supported for QuickBooks, Xero, and Sage. Custom mapping is available for proprietary ERP systems under our Enterprise plan.',
  },
];

const COUNTRY_CODES = [
  { code: 'UG', name: 'Uganda', dial: '+256' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'TZ', name: 'Tanzania', dial: '+255' },
  { code: 'RW', name: 'Rwanda', dial: '+250' },
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'GH', name: 'Ghana', dial: '+233' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
];

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('UG');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'pending' | 'failed'>('idle');

  const { profile, session, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const isAlreadyPremium = profile?.tier === 'premium' || profile?.tier === 'enterprise';

  // Handle PesaPal callback redirect
  useEffect(() => {
    if (searchParams.get('payment') === 'callback') {
      setPaymentStatus('pending');
      // Check subscription status
      if (session?.access_token) {
        fetch('/api/subscription', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.subscription?.status === 'active') {
              setPaymentStatus('success');
            } else {
              setPaymentStatus('pending');
            }
          })
          .catch(() => setPaymentStatus('pending'));
      }
    }
  }, [searchParams, session]);

  function handlePremiumClick() {
    if (!profile) {
      // Not logged in — send to login first
      window.location.href = '/login';
      return;
    }
    setShowCheckout(true);
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setCheckoutError('');
    setCheckoutLoading(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ phone, countryCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed');
      setCheckoutLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[73px]">
        {/* Payment callback status */}
        {paymentStatus !== 'idle' && (
          <div className={`px-6 py-4 text-center font-mono text-sm font-bold border-b-[3px] border-brutal-black ${
            paymentStatus === 'success'
              ? 'bg-brutal-green/20 text-brutal-green'
              : paymentStatus === 'failed'
                ? 'bg-brutal-pink/20 text-brutal-pink'
                : 'bg-brutal-yellow/20 text-brutal-black'
          }`}>
            {paymentStatus === 'success' && 'Payment successful! Your account has been upgraded to Premium.'}
            {paymentStatus === 'pending' && 'Payment is being processed. Your account will be upgraded shortly.'}
            {paymentStatus === 'failed' && 'Payment failed. Please try again or contact support.'}
          </div>
        )}

        {/* Hero */}
        <section className="px-6 py-20 md:py-28 max-w-7xl mx-auto">
          <span className="font-mono text-xs text-brutal-muted uppercase tracking-[0.2em] mb-6 block">
            Simple & Transparent
          </span>
          <h1 className="font-mono font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.95] mb-6 max-w-4xl">
            Pick a Plan.<br />Start Converting.
          </h1>
          <p className="font-body text-lg md:text-xl text-brutal-muted max-w-2xl mb-2">
            Free to start. Upgrade when you need AI insights and unlimited conversions.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-[3px] border-brutal-black rounded-[4px] overflow-hidden">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`
                  relative flex flex-col p-8
                  ${i < tiers.length - 1 ? 'lg:border-r-[3px] border-brutal-black' : ''}
                  ${i < 2 ? 'md:border-b-[3px] lg:border-b-0 border-brutal-black' : ''}
                  ${tier.highlighted ? 'bg-brutal-yellow' : 'bg-brutal-card'}
                `}
              >
                {tier.badge && (
                  <div className="absolute top-4 right-4 bg-brutal-black text-brutal-white text-[9px] font-mono font-black px-2 py-1 uppercase tracking-widest rounded-[4px]">
                    {tier.badge}
                  </div>
                )}

                {/* Label */}
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-brutal-muted mb-4">
                  {tier.label}
                </span>

                {/* Name */}
                <h3 className="font-mono font-black text-2xl mb-6">{tier.name}</h3>

                {/* Price */}
                <div className="mb-8">
                  <span className="font-mono font-black text-5xl">{tier.price}</span>
                  {tier.period && (
                    <span className="font-mono text-sm text-brutal-muted ml-1">{tier.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-10 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className={`font-mono text-xs mt-0.5 ${tier.highlighted ? 'text-brutal-black' : 'text-brutal-muted'}`}>
                        +
                      </span>
                      <span className="font-body text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {tier.ctaHref === '#checkout' ? (
                  <button
                    onClick={handlePremiumClick}
                    className="w-full py-3.5 font-mono font-bold text-sm rounded-[4px] cursor-pointer transition-colors bg-brutal-black text-brutal-white hover:opacity-80"
                  >
                    {isAlreadyPremium ? 'Current Plan' : tier.cta}
                  </button>
                ) : (
                  <Link href={tier.ctaHref}>
                    {tier.highlighted ? (
                      <button className="w-full bg-brutal-black text-brutal-white py-3.5 font-mono font-bold text-sm hover:opacity-80 transition-colors rounded-[4px] cursor-pointer">
                        {tier.cta}
                      </button>
                    ) : (
                      <button className="w-full border-[3px] border-brutal-black py-3 font-mono font-bold text-sm hover:bg-brutal-black hover:text-brutal-white transition-colors rounded-[4px] cursor-pointer">
                        {tier.cta}
                      </button>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-brutal-black/60" onClick={() => !checkoutLoading && setShowCheckout(false)} />

            {/* Modal */}
            <div className="relative w-full max-w-[420px] bg-brutal-card border-[3px] border-brutal-black neo-shadow p-8 rounded-[4px] z-10">
              <button
                onClick={() => !checkoutLoading && setShowCheckout(false)}
                className="absolute top-4 right-4 font-mono font-bold text-brutal-muted hover:text-brutal-black transition-colors cursor-pointer"
              >
                X
              </button>

              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-brutal-yellow border-[3px] border-brutal-black flex items-center justify-center rounded-[4px]">
                  <span className="font-mono font-black text-xl text-brutal-black">S</span>
                </div>
              </div>

              <h2 className="font-mono font-bold text-xl text-center mb-2">Upgrade to Premium</h2>
              <p className="font-body text-sm text-brutal-muted text-center mb-6">
                UGX 500/month — Unlimited conversions + AI Insights
              </p>

              <form onSubmit={handleCheckout} className="flex flex-col gap-4">
                {/* Country */}
                <div>
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-brutal-muted mb-1.5 block">
                    Country
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full border-[3px] border-brutal-black rounded-[4px] px-3 py-2.5 font-mono text-sm bg-brutal-bg focus:outline-none focus:border-brutal-yellow transition-colors"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.dial})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone */}
                <Input
                  label="Phone Number (optional)"
                  type="tel"
                  placeholder="e.g. 770123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="font-body text-[11px] text-brutal-muted -mt-2">
                  For mobile money payments. Leave blank for card payment.
                </p>

                {checkoutError && (
                  <p className="font-mono text-xs text-brutal-pink font-bold">{checkoutError}</p>
                )}

                <div className="border-t-[3px] border-brutal-black/20 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-sm text-brutal-muted">Total</span>
                    <span className="font-mono font-black text-xl">UGX 500</span>
                  </div>

                  <Button type="submit" variant="primary" fullWidth disabled={checkoutLoading}>
                    {checkoutLoading ? 'Redirecting to payment...' : 'Pay with PesaPal'}
                  </Button>
                </div>

                <p className="font-body text-[11px] text-brutal-muted text-center">
                  You&apos;ll be redirected to PesaPal to complete payment securely via card, mobile money, or bank transfer.
                </p>
              </form>
            </div>
          </div>
        )}

        {/* FAQ */}
        <section className="border-t-[3px] border-brutal-black bg-brutal-card">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left — Title */}
              <div>
                <span className="font-mono text-xs text-brutal-muted uppercase tracking-[0.2em] mb-6 block">
                  Common Questions
                </span>
                <h2 className="font-mono font-black text-4xl md:text-5xl tracking-tighter leading-[1.1] mb-4">
                  Frequently<br />Asked<br />Questions.
                </h2>
              </div>

              {/* Right — Questions */}
              <div className="space-y-0 border-t-[3px] border-brutal-black">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border-b-[3px] border-brutal-black"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left py-5 flex justify-between items-start gap-4 cursor-pointer"
                    >
                      <span className="font-mono font-bold text-sm leading-relaxed">{faq.q}</span>
                      <span className="font-mono text-lg shrink-0 mt-[-2px]">
                        {openFaq === i ? '−' : '+'}
                      </span>
                    </button>
                    {openFaq === i && (
                      <p className="font-body text-sm text-brutal-muted leading-relaxed pb-5 pr-8">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brutal-yellow border-t-[3px] border-brutal-black py-20 md:py-28 px-6 text-center">
          <h2 className="font-mono font-black text-4xl md:text-6xl tracking-tighter mb-10">
            Start understanding<br />your spending today.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/convert">
              <Button variant="primary" size="lg" className="bg-brutal-black !text-brutal-white hover:!opacity-80 border-brutal-black">
                Convert Your First Statement
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="!bg-transparent border-brutal-black">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
