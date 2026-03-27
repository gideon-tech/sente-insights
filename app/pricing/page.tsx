'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

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
    price: '$10',
    period: '/monthly',
    features: [
      'Unlimited Files',
      'Multi-Bank Parsing',
      'Priority Support',
      'Custom Categories',
    ],
    cta: 'Go Premium',
    ctaHref: '/pricing',
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
    q: 'Do you provide direct bank API support?',
    a: 'Yes. Premium users can connect via Plaid or Salt Edge. For enterprise clients, we offer direct SWIFT and ISO 20022 messaging integration.',
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

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-20 md:py-28 max-w-7xl mx-auto">
          <span className="font-mono text-xs text-brutal-muted uppercase tracking-[0.2em] mb-6 block">
            System Architecture / v2.4
          </span>
          <h1 className="font-mono font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.95] mb-6 max-w-4xl">
            Transparent<br />Pricing Models.
          </h1>
          <p className="font-body text-lg md:text-xl text-brutal-muted max-w-2xl mb-2">
            Enterprise-grade financial data extraction without the SaaS fluff.
          </p>
          <p className="font-mono text-sm text-brutal-muted">
            Choose your tier of computational rigor.
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
                  <div className="absolute top-4 right-4 bg-brutal-black text-white text-[9px] font-mono font-black px-2 py-1 uppercase tracking-widest rounded-[4px]">
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
                <Link href={tier.ctaHref}>
                  {tier.highlighted ? (
                    <button className="w-full bg-brutal-black text-white py-3.5 font-mono font-bold text-sm hover:bg-neutral-800 transition-colors rounded-[4px] cursor-pointer">
                      {tier.cta}
                    </button>
                  ) : (
                    <button className="w-full border-[3px] border-brutal-black py-3 font-mono font-bold text-sm hover:bg-brutal-black hover:text-white transition-colors rounded-[4px] cursor-pointer">
                      {tier.cta}
                    </button>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t-[3px] border-brutal-black bg-brutal-card">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left — Title */}
              <div>
                <span className="font-mono text-xs text-brutal-muted uppercase tracking-[0.2em] mb-6 block">
                  Technical Specifications.
                </span>
                <h2 className="font-mono font-black text-4xl md:text-5xl tracking-tighter leading-[1.1] mb-4">
                  Frequently Asked<br />Questions Regarding<br />Structural Data<br />Integrity.
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
            Ready to automate<br />your ledger?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/convert">
              <Button variant="primary" size="lg" className="bg-brutal-black !text-white hover:!bg-neutral-800 border-brutal-black">
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="!bg-transparent border-brutal-black">
                View Documentation
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
