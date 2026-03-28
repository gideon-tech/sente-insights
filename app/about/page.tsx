import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[73px]">
        <PageHeader
          title="About Us"
          subtitle="We're building the financial infrastructure the world deserves."
        />

        <div className="px-6 py-16 max-w-4xl mx-auto space-y-16">
          {/* Mission */}
          <section>
            <h2 className="font-mono font-bold text-2xl mb-6 uppercase tracking-tight">Our Mission</h2>
            <Card accent="yellow" className="p-8">
              <p className="font-body text-lg leading-relaxed">
                Sente Insights exists to make financial data accessible, structured, and actionable for
                everyone. &ldquo;Sente&rdquo; means money in Luganda, and we believe that understanding
                your sente is the first step to growing it.
              </p>
            </Card>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="font-mono font-bold text-2xl mb-6 uppercase tracking-tight">What We Do</h2>
            <div className="space-y-4 font-body text-brutal-black leading-relaxed">
              <p>
                We use AI to transform messy bank statements and mobile money records into clean,
                structured data. Upload a PDF, a photo of a paper statement, or a CSV export &mdash;
                and get back organized transaction data you can use in your accounting software,
                spreadsheets, or financial analysis.
              </p>
              <p>
                For Premium users, our AI-powered spending insights analyze your transactions and
                surface actionable patterns &mdash; helping you understand where your money goes and
                how to save more.
              </p>
            </div>
          </section>

          {/* Who We Serve */}
          <section>
            <h2 className="font-mono font-bold text-2xl mb-6 uppercase tracking-tight">Who We Serve</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card accent="yellow" className="p-6">
                <h3 className="font-mono font-bold text-lg mb-2">Accountants & Bookkeepers</h3>
                <p className="font-body text-sm text-brutal-muted">
                  Batch-process hundreds of client statements into QuickBooks, Xero, or Tally-ready formats.
                </p>
              </Card>
              <Card accent="cyan" className="p-6">
                <h3 className="font-mono font-bold text-lg mb-2">SME Owners</h3>
                <p className="font-body text-sm text-brutal-muted">
                  Track business cash flow without manual data entry or expensive software.
                </p>
              </Card>
              <Card accent="pink" className="p-6">
                <h3 className="font-mono font-bold text-lg mb-2">Individuals</h3>
                <p className="font-body text-sm text-brutal-muted">
                  Understand your spending habits and take control of your personal finances.
                </p>
              </Card>
              <Card accent="black" className="p-6">
                <h3 className="font-mono font-bold text-lg mb-2">Loan Officers & Lenders</h3>
                <p className="font-body text-sm text-brutal-muted">
                  Verify applicant financials instantly with structured, verified data extraction.
                </p>
              </Card>
            </div>
          </section>

          {/* AI */}
          <section>
            <h2 className="font-mono font-bold text-2xl mb-6 uppercase tracking-tight">AI-Powered</h2>
            <p className="font-body leading-relaxed">
              Our platform leverages advanced AI for both statement extraction and financial insights.
              We use intelligent document processing to handle even the messiest bank statements,
              and our spending analysis AI understands financial contexts across the globe &mdash;
              from M-Pesa transfers to wire transfers to utility bills.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
