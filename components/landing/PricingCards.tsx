import Link from 'next/link';

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

export default function PricingCards() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="font-mono font-black text-4xl md:text-6xl mb-4 tracking-tighter uppercase text-center">
        Transparent Pricing
      </h2>
      <p className="font-body text-lg text-brutal-muted text-center mb-16 max-w-xl mx-auto">
        Choose your tier of computational rigor.
      </p>
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

            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-brutal-muted mb-4">
              {tier.label}
            </span>

            <h3 className="font-mono font-black text-2xl mb-6">{tier.name}</h3>

            <div className="mb-8">
              <span className="font-mono font-black text-5xl">{tier.price}</span>
              {tier.period && (
                <span className="font-mono text-sm text-brutal-muted ml-1">{tier.period}</span>
              )}
            </div>

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
  );
}
