import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import WhoItsFor from '@/components/landing/WhoItsFor';
import SupportedBanks from '@/components/landing/SupportedBanks';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[73px] flex-1">
        <Hero />
        <HowItWorks />
        <WhoItsFor />
        <SupportedBanks />

        {/* CTA Section */}
        <section className="bg-brutal-yellow border-y-[3px] border-brutal-black py-20 px-6 text-center">
          <h2 className="font-mono font-black text-4xl md:text-7xl mb-8 tracking-tighter uppercase">
            Take Control of Your Spending.
          </h2>
          <p className="font-body text-xl md:text-2xl mb-12 text-brutal-black font-medium max-w-2xl mx-auto">
            Upload your statement. See where every shilling goes. Start making smarter money decisions today.
          </p>
          <a href="/convert">
            <button className="bg-brutal-black text-brutal-white px-12 py-6 border-[3px] border-brutal-black font-mono font-black text-2xl neo-shadow transition-transform hover:-translate-x-1 hover:-translate-y-1 rounded-[4px] cursor-pointer">
              GET STARTED FOR FREE
            </button>
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
