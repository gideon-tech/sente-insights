'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Wire to backend or email service
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Contact Us"
          subtitle="Got a question, feedback, or partnership inquiry? We'd love to hear from you."
        />

        <div className="px-6 py-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <Card className="p-8 text-center">
                  <span className="text-5xl block mb-4">&#10003;</span>
                  <h2 className="font-mono font-bold text-2xl mb-2">Message Sent!</h2>
                  <p className="font-body text-brutal-muted mb-6">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button variant="secondary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Name"
                      type="text"
                      placeholder="Jane Nakato"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    label="Subject"
                    type="text"
                    placeholder="How can we help?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-[1.5px] text-brutal-black">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell us more..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-brutal-card text-brutal-black font-body text-sm border-brutal-black rounded-[4px] outline-none focus:border-brutal-yellow transition-colors placeholder:text-brutal-muted resize-none"
                      style={{ borderWidth: '3px', borderStyle: 'solid' }}
                    />
                  </div>
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    SEND MESSAGE &rarr;
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card accent="yellow" className="p-6">
                <h3 className="font-mono font-bold text-sm mb-2">EMAIL</h3>
                <p className="font-body text-sm text-brutal-muted">support@senteinsights.com</p>
              </Card>
              <Card accent="cyan" className="p-6">
                <h3 className="font-mono font-bold text-sm mb-2">WHATSAPP</h3>
                <p className="font-body text-sm text-brutal-muted">+256 700 000 000</p>
              </Card>
              <Card accent="green" className="p-6">
                <h3 className="font-mono font-bold text-sm mb-2">OFFICE</h3>
                <p className="font-body text-sm text-brutal-muted">Kampala, Uganda</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-mono font-bold text-sm mb-2">RESPONSE TIME</h3>
                <p className="font-body text-sm text-brutal-muted">
                  We typically respond within 24 hours on business days.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
