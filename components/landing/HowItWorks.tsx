export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload',
      icon: '📤',
      desc: 'Simply drop your digital bank statement or take a photo of your paper ledger. Our AI handles the mess.',
    },
    {
      num: '02',
      title: 'Extract',
      icon: '📊',
      desc: 'Our proprietary engine maps every transaction, identifying vendors, taxes, and hidden fees automatically.',
    },
    {
      num: '03',
      title: 'Download',
      icon: '📥',
      desc: 'Get your data in the format your accounting software loves. Ready for filing or deep analysis.',
    },
  ];

  return (
    <section className="bg-brutal-surface border-y-[3px] border-brutal-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-mono font-black text-4xl md:text-6xl mb-16 tracking-tighter uppercase">
          The Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-brutal-card border-[3px] border-brutal-black p-8 relative overflow-hidden group rounded-[4px]"
            >
              <span className="absolute -top-4 -right-4 font-mono font-black text-8xl text-brutal-yellow opacity-40 group-hover:scale-110 transition-transform duration-300 select-none">
                {step.num}
              </span>
              <div className="relative z-10">
                <div className="text-4xl mb-6 bg-brutal-black text-brutal-white p-3 w-fit rounded-[4px]">
                  {step.icon}
                </div>
                <h3 className="font-mono font-bold text-2xl mb-4">{step.title}</h3>
                <p className="font-body text-brutal-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
