'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const FEATURED_PROVIDERS = [
  { name: 'MTN MoMo', logo: '/MTN.png' },
  { name: 'Airtel Money', logo: '/Airtel.png' },
  { name: 'Stanbic Bank', logo: '/Stanbic.png' },
  { name: 'ABSA', logo: '/Absa.png' },
  { name: 'Centenary Bank', logo: '/Centenary.png' },
];

const SUPPORTED_BANKS = [
  // Mobile Money
  'MTN MoMo', 'Airtel Money', 'M-Pesa', 'Tigo Pesa', 'Orange Money', 'EcoCash',
  // Uganda
  'Stanbic Bank', 'Equity Bank', 'Centenary Bank', 'ABSA', 'DTB', 'Housing Finance Bank',
  'Bank of Africa', 'PostBank', 'DFCU Bank', 'Opportunity Bank', 'Bank of Baroda',
  // Kenya
  'KCB Bank', 'Co-op Bank', 'NCBA', 'I&M Bank', 'Family Bank', 'Standard Chartered',
  'Diamond Trust Bank', 'Absa Kenya',
  // Tanzania
  'CRDB', 'NMB Bank', 'NBC', 'Exim Bank',
  // Rwanda
  'Bank of Kigali', 'BPR', 'Access Bank',
  // Nigeria
  'GTBank', 'First Bank', 'Zenith Bank', 'UBA', 'Access Bank Nigeria',
  // South Africa
  'FNB', 'Nedbank', 'Standard Bank', 'Capitec',
  // Ghana
  'GCB Bank', 'Ecobank', 'CalBank', 'Fidelity Bank',
  // Global
  'Barclays', 'HSBC', 'Citibank', 'Chase', 'Bank of America', 'Wells Fargo',
  'Deutsche Bank', 'Revolut', 'Wise', 'N26',
];

export default function SupportedBanks() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const matches = query.length >= 2
    ? SUPPORTED_BANKS.filter((b) => b.toLowerCase().includes(query.toLowerCase()))
    : [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  return (
    <section className="bg-brutal-black text-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <h2 className="font-mono font-black text-4xl md:text-6xl tracking-tighter uppercase max-w-2xl">
            Works With Your Bank
          </h2>
          <p className="font-body text-neutral-400 max-w-lg">
            We support banks and mobile money providers worldwide. Search below to check yours.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className="flex border-[3px] border-white rounded-[4px] overflow-hidden">
            <input
              type="text"
              placeholder="Search your bank or provider..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
              className="flex-1 px-5 py-4 bg-neutral-900 text-white font-body text-sm outline-none placeholder:text-neutral-500"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-brutal-yellow text-brutal-black font-mono font-bold text-sm hover:bg-yellow-300 transition-colors cursor-pointer"
            >
              CHECK
            </button>
          </div>

          {/* Results */}
          {query.length >= 2 && (
            <div className="mt-4">
              {matches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matches.map((bank) => (
                    <span
                      key={bank}
                      className="bg-brutal-green/20 border border-brutal-green text-brutal-green px-3 py-1.5 font-mono text-xs font-bold rounded-[4px]"
                    >
                      ✓ {bank}
                    </span>
                  ))}
                </div>
              ) : searched ? (
                <div className="bg-neutral-800 border-[2px] border-neutral-700 p-4 rounded-[4px] text-center">
                  <p className="font-body text-sm text-neutral-300 mb-2">
                    Don&apos;t see your bank? We likely still support it.
                  </p>
                  <p className="font-mono text-xs text-neutral-500">
                    Upload any bank statement PDF and our AI will extract the data automatically.
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </form>

        {/* Featured providers */}
        <div className="flex flex-col items-center gap-6">
          <span className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-neutral-500">
            Featured Integrations
          </span>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {FEATURED_PROVIDERS.map((provider) => (
              <div
                key={provider.name}
                className="bg-white rounded-[4px] p-4 flex items-center justify-center"
              >
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={48}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-neutral-500 mt-2">
            + hundreds more banks and providers globally
          </p>
        </div>
      </div>
    </section>
  );
}
