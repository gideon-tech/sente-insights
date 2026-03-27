import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/ui/PageHeader';

const sections = [
  {
    title: '1. Introduction',
    content: `Sente Insights ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our AI-powered financial data extraction platform. By using the Service, you consent to the practices described in this policy.`,
  },
  {
    title: '2. Information We Collect',
    content: `We collect the following types of information:

• Account Information: When you register, we collect your name, email address, and hashed password. For Premium subscribers, we also collect payment-related information through our payment processor (Pesapal).

• Uploaded Files: Bank statements and mobile money records you upload for conversion. These files are processed in memory and are NOT stored permanently.

• Usage Data: We track the number of conversions performed per day for rate-limiting purposes. For registered users, we maintain a history of conversion metadata (filename, date, transaction count) but not the actual financial data.

• Session Data: For anonymous users, we use a session cookie to track daily usage limits. This cookie contains no personal financial information.

• Technical Data: IP address, browser type, and device information collected automatically for security and analytics purposes.`,
  },
  {
    title: '3. How We Use Your Information',
    content: `We use your information to:

• Provide the Service: Process your uploaded statements and return structured data.
• Generate AI Insights: For Premium users, analyze transaction data to provide spending breakdowns and financial tips.
• Manage Your Account: Authenticate you, track your subscription status, and enforce usage limits.
• Improve the Service: Understand usage patterns to improve accuracy and features.
• Communicate: Send transactional emails (account verification, password resets, subscription confirmations).

We do NOT sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: '4. Data Processing & Retention',
    content: `• Uploaded files are processed in memory and are deleted immediately after conversion. We do not store your bank statements or financial documents on our servers.
• AI insights are generated in real-time and stored only if you are a registered user (associated with your conversion history).
• Account data is retained for as long as your account is active.
• Usage logs are retained for 90 days for rate-limiting and abuse prevention.
• You may request deletion of your account and all associated data at any time by contacting us.`,
  },
  {
    title: '5. Third-Party Services',
    content: `We use the following third-party services to operate the platform:

• Supabase: Database and authentication hosting (EU/US data centers).
• BankStatementConverters.ai: Document parsing API — your uploaded file is sent to this service for extraction. Their processing is also ephemeral.
• Anthropic (Claude API): AI analysis for Premium spending insights. Transaction data is sent for analysis but is not stored by Anthropic per their data usage policies.
• Pesapal: Payment processing for Premium subscriptions. We do not store your mobile money or card details — these are handled entirely by Pesapal.
• Vercel: Application hosting.

Each third-party service has its own privacy policy governing how they handle data.`,
  },
  {
    title: '6. Data Security',
    content: `We take reasonable measures to protect your data:

• All data transmission is encrypted using HTTPS/TLS.
• API keys and credentials are stored securely as environment variables and never exposed to the client.
• Database access is protected by Row Level Security (RLS) ensuring users can only access their own data.
• Passwords are hashed using industry-standard algorithms through Supabase Auth.
• We conduct regular security reviews of our infrastructure.

However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '7. Cookies',
    content: `We use the following cookies:

• sente_session: A session identifier for anonymous users to track daily usage limits. Contains no personal or financial data. Expires after 24 hours.
• Supabase Auth cookies: Used to maintain your logged-in session. These are httpOnly and secure.

We do not use third-party tracking cookies or advertising cookies.`,
  },
  {
    title: '8. Your Rights',
    content: `You have the right to:

• Access: Request a copy of the personal data we hold about you.
• Correction: Update or correct your account information at any time.
• Deletion: Request deletion of your account and all associated data.
• Data Portability: Export your conversion history in a standard format.
• Withdraw Consent: Stop using the Service at any time.

To exercise any of these rights, contact us at support@senteinsights.com.`,
  },
  {
    title: '9. Children\'s Privacy',
    content: `The Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it.`,
  },
  {
    title: '10. International Data Transfers',
    content: `Your data may be processed in servers located outside your country of residence (including the United States and European Union) through our third-party service providers. By using the Service, you consent to such transfers. We ensure that appropriate safeguards are in place.`,
  },
  {
    title: '11. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email. Continued use of the Service after changes constitutes acceptance of the updated policy. The "Last updated" date at the top of this page indicates when the policy was last revised.`,
  },
  {
    title: '12. Contact Us',
    content: `If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:

Email: support@senteinsights.com
Address: Kampala, Uganda`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Privacy Policy"
          subtitle="Last updated: March 2026"
        />

        <div className="px-6 py-16 max-w-4xl mx-auto space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-mono font-bold text-lg mb-3">{section.title}</h2>
              <p className="font-body text-sm text-brutal-black leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
