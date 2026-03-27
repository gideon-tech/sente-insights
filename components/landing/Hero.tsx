import Link from 'next/link';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';

export default function Hero() {
  return (
    <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
      <span className="bg-brutal-yellow text-brutal-black font-mono font-bold px-4 py-1 text-xs md:text-sm border-[2px] border-brutal-black mb-6 tracking-tight rounded-[4px]">
        FINANCIAL INTELLIGENCE FOR EAST AFRICA
      </span>
      <h1 className="font-mono font-black text-5xl md:text-8xl lg:text-9xl text-brutal-black leading-[0.9] tracking-tighter mb-8">
        Sente Insights
      </h1>
      <p className="font-body text-lg md:text-2xl text-brutal-muted max-w-2xl leading-relaxed mb-8">
        Upload your bank or mobile money statement. Get clean, structured data back in seconds.
      </p>
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <Tag color="gray">PDF</Tag>
        <Tag color="gray">PNG</Tag>
        <Tag color="gray">JPG</Tag>
        <Tag color="yellow">CSV</Tag>
        <Tag color="cyan">XLSX</Tag>
        <Tag color="green">JSON</Tag>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/convert">
          <Button variant="primary" size="lg">
            Convert Free &mdash; No Signup &rarr;
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="secondary" size="lg">
            Create Account
          </Button>
        </Link>
      </div>
    </section>
  );
}
