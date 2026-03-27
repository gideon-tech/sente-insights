import Card from '@/components/ui/Card';

export default function WhoItsFor() {
  const audiences = [
    { title: 'Accountants', desc: 'Automate manual entry for hundreds of clients across multiple currencies.', accent: 'yellow' as const },
    { title: 'SME Owners', desc: 'Understand your cash flow without needing a degree in finance.', accent: 'cyan' as const },
    { title: 'Individuals', desc: 'Clean up years of mobile money history for personal budgeting.', accent: 'pink' as const },
    { title: 'Loan Officers', desc: 'Verify applicant income instantly with verified data extraction.', accent: 'black' as const },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="font-mono font-black text-4xl md:text-6xl mb-16 tracking-tighter uppercase text-center md:text-left">
        Built for Scale
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {audiences.map((a) => (
          <Card key={a.title} accent={a.accent} className="p-6">
            <h4 className="font-mono font-bold text-xl mb-2">{a.title}</h4>
            <p className="font-body text-sm text-brutal-muted">{a.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
