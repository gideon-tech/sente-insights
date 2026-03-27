import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#DEDDD8] border-t-[3px] border-brutal-black w-full px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="font-mono font-black text-2xl tracking-tighter uppercase text-brutal-black">SENTE INSIGHTS</div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-brutal-muted">
            &copy; 2026 Sente Insights
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link href="/convert" className="font-mono text-xs uppercase tracking-widest text-brutal-black hover:text-brutal-yellow transition-colors duration-200">
            Convert
          </Link>
          <Link href="/pricing" className="font-mono text-xs uppercase tracking-widest text-brutal-muted hover:text-brutal-yellow transition-colors duration-200">
            Pricing
          </Link>
          <Link href="/about" className="font-mono text-xs uppercase tracking-widest text-brutal-muted hover:text-brutal-yellow transition-colors duration-200">
            About
          </Link>
          <Link href="/contact" className="font-mono text-xs uppercase tracking-widest text-brutal-muted hover:text-brutal-yellow transition-colors duration-200">
            Contact
          </Link>
          <Link href="/privacy" className="font-mono text-xs uppercase tracking-widest text-brutal-muted hover:text-brutal-yellow transition-colors duration-200">
            Privacy
          </Link>
          <Link href="/terms" className="font-mono text-xs uppercase tracking-widest text-brutal-muted hover:text-brutal-yellow transition-colors duration-200">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
