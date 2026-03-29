import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';

const steps = {
  mtn: [
    {
      title: 'Dial *165*5#',
      description:
        'On your MTN line, open your phone dialer and enter *165*5# to access MTN MoMo self-service.',
    },
    {
      title: 'Select "Mini Statement"',
      description:
        'Choose the Mini Statement option from the menu. This gives you your last 5 transactions as an SMS.',
    },
    {
      title: 'For a Full Statement, use the MyMTN App',
      description:
        'Download the MyMTN app from the Play Store or App Store. Go to MoMo > Transaction History. You can view and download statements for any date range.',
    },
    {
      title: 'Request via Customer Care',
      description:
        'Call 100 (MTN Customer Care) or visit any MTN Service Centre. Request a full MoMo statement for your desired period. They will email you a PDF statement.',
    },
    {
      title: 'Upload to Sente Insights',
      description:
        'Once you have your PDF statement, go to the Convert page and upload it. We will extract all your transactions automatically.',
    },
  ],
  airtel: [
    {
      title: 'Dial *185*9#',
      description:
        'On your Airtel line, dial *185*9# to access Airtel Money self-service options.',
    },
    {
      title: 'Select "My Account" then "Mini Statement"',
      description:
        'Navigate through the menu to My Account and select Mini Statement. You will receive your last 5 transactions via SMS.',
    },
    {
      title: 'Use the Airtel Money App',
      description:
        'Download the Airtel Money app. Go to My Account > Transaction History to view your full transaction history. You can filter by date and download a statement.',
    },
    {
      title: 'Visit an Airtel Shop or Call 100',
      description:
        'Visit any Airtel shop with your national ID or call 100. Request a detailed Airtel Money statement for your desired date range. They will provide a PDF via email.',
    },
    {
      title: 'Upload to Sente Insights',
      description:
        'Once you have your PDF statement, head to the Convert page and upload it. We handle the rest — your transactions will be parsed and structured instantly.',
    },
  ],
};

const tips = [
  {
    title: 'Request PDF format',
    description:
      'Always ask for a PDF statement rather than a printed copy. PDFs work best with our parsing engine.',
  },
  {
    title: 'Choose a specific date range',
    description:
      'Narrow your statement to the period you want to analyze. Smaller files process faster and give more focused insights.',
  },
  {
    title: 'Check your email',
    description:
      'Both MTN and Airtel typically send full statements to your registered email address. Check your inbox and spam folder.',
  },
  {
    title: 'Bring valid ID',
    description:
      'If visiting a service centre, bring your national ID or passport. They need to verify your identity before releasing statement data.',
  },
];

export default function GuidesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[73px]">
        <PageHeader
          title="How to Get Your Statements"
          subtitle="Step-by-step guides for downloading your mobile money statements from MTN and Airtel."
        />

        <div className="px-6 py-16 max-w-4xl mx-auto space-y-20">
          {/* MTN Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brutal-yellow border-[3px] border-brutal-black flex items-center justify-center rounded-[4px]">
                <span className="font-mono font-black text-sm">MTN</span>
              </div>
              <h2 className="font-mono font-bold text-2xl uppercase tracking-tight">
                MTN Mobile Money
              </h2>
            </div>
            <div className="space-y-4">
              {steps.mtn.map((step, i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 bg-brutal-black text-brutal-white flex items-center justify-center rounded-[4px]">
                      <span className="font-mono font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-base mb-1">{step.title}</h3>
                      <p className="font-body text-sm text-brutal-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Airtel Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brutal-pink border-[3px] border-brutal-black flex items-center justify-center rounded-[4px]">
                <span className="font-mono font-black text-[10px] text-brutal-white">AIR</span>
              </div>
              <h2 className="font-mono font-bold text-2xl uppercase tracking-tight">
                Airtel Money
              </h2>
            </div>
            <div className="space-y-4">
              {steps.airtel.map((step, i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 bg-brutal-black text-brutal-white flex items-center justify-center rounded-[4px]">
                      <span className="font-mono font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-base mb-1">{step.title}</h3>
                      <p className="font-body text-sm text-brutal-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 className="font-mono font-bold text-2xl uppercase tracking-tight mb-8">
              Tips for Getting Your Statement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, i) => (
                <Card key={i} accent="yellow" className="p-6">
                  <h3 className="font-mono font-bold text-sm mb-2">{tip.title}</h3>
                  <p className="font-body text-sm text-brutal-muted leading-relaxed">
                    {tip.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-8">
            <h2 className="font-mono font-bold text-2xl mb-4">Got your statement?</h2>
            <p className="font-body text-brutal-muted mb-6">
              Upload it now and get your transactions extracted in seconds.
            </p>
            <Link
              href="/convert"
              className="inline-block bg-brutal-black text-brutal-white font-mono font-bold text-sm px-8 py-3.5 rounded-[4px] hover:opacity-80 transition-colors"
            >
              Convert Your Statement
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
