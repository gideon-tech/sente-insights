import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="flex-1 pt-[73px] flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1
        className="font-mono font-black text-[120px] md:text-[200px] leading-none text-brutal-yellow tracking-tighter"
        style={{ textShadow: '5px 5px 0px var(--color-brutal-black)' }}
      >
        404
      </h1>
      <p className="font-mono font-bold text-2xl md:text-3xl mb-8 text-brutal-black">
        Lost in the ledger.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">
          Back to Home &rarr;
        </Button>
      </Link>
    </main>
  );
}
