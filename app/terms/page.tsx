import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/ui/PageHeader';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using Sente Insights ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and continued use of the Service constitutes acceptance of any changes.`,
  },
  {
    title: '2. Description of Service',
    content: `Sente Insights is an AI-powered financial data extraction platform. The Service allows users to upload bank statements and mobile money records in PDF, PNG, JPG, or CSV format and receive structured transaction data in CSV, JSON, or Excel format. Premium users may also access AI-generated spending insights.`,
  },
  {
    title: '3. User Accounts',
    content: `Some features require a registered account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must provide accurate and complete information during registration. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: '4. Acceptable Use',
    content: `You agree to use the Service only for lawful purposes. You may not: (a) upload files containing malware or malicious code; (b) attempt to gain unauthorized access to our systems; (c) use the Service to process documents you do not have the right to access; (d) resell or redistribute the Service without written permission; (e) use automated tools to scrape or extract data from the Service beyond the intended API.`,
  },
  {
    title: '5. Data Privacy & Security',
    content: `Uploaded files are processed in memory and are not stored permanently on our servers. We do not retain your financial data after conversion is complete. For full details on how we handle your data, please refer to our Privacy Policy. We use industry-standard encryption (HTTPS/TLS) for all data transmission.`,
  },
  {
    title: '6. Subscription & Payments',
    content: `Premium subscriptions are billed monthly via Pesapal (supporting MTN Mobile Money, Airtel Money, and other local payment methods). Subscriptions auto-renew unless cancelled before the end of the billing period. Refunds are handled on a case-by-case basis. We reserve the right to change pricing with 30 days notice to existing subscribers.`,
  },
  {
    title: '7. Service Tiers & Limits',
    content: `The Service offers multiple tiers: Anonymous (2 conversions/day, no account required), Free (5 conversions/day), Premium (unlimited conversions, AI insights), and Enterprise (custom). We reserve the right to modify tier limits or features with reasonable notice.`,
  },
  {
    title: '8. Intellectual Property',
    content: `The Service, including its design, code, AI models, and branding, is owned by Sente Insights. You retain ownership of all data you upload and the structured output generated from your data. You grant us a limited, temporary license to process your uploaded files solely for the purpose of providing the Service.`,
  },
  {
    title: '9. Disclaimer of Warranties',
    content: `The Service is provided "as is" without warranties of any kind, express or implied. We do not guarantee that extracted transaction data will be 100% accurate. Users should verify extracted data before using it for accounting, tax filing, or legal purposes. We are not a licensed financial advisor and our AI insights do not constitute financial advice.`,
  },
  {
    title: '10. Limitation of Liability',
    content: `To the maximum extent permitted by law, Sente Insights shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability for any claim shall not exceed the amount you paid for the Service in the 12 months preceding the claim.`,
  },
  {
    title: '11. Termination',
    content: `We may suspend or terminate your access to the Service at any time for violation of these terms or for any other reason at our discretion. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination shall remain in effect.`,
  },
  {
    title: '12. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of the Republic of Uganda, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved in the courts of Kampala, Uganda.`,
  },
  {
    title: '13. Contact',
    content: `If you have any questions about these Terms and Conditions, please contact us at support@senteinsights.com.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[73px]">
        <PageHeader
          title="Terms & Conditions"
          subtitle="Last updated: March 2026"
        />

        <div className="px-6 py-16 max-w-4xl mx-auto space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-mono font-bold text-lg mb-3">{section.title}</h2>
              <p className="font-body text-sm text-brutal-black leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
