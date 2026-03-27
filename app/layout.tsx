import type { Metadata } from 'next';
import { Space_Mono, Inter } from 'next/font/google';
import './globals.css';

const spaceMono = Space_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SENTE INSIGHTS | Financial Intelligence for East Africa',
  description: 'Upload your bank or mobile money statement. Get clean, structured data back in seconds. Built for East Africa.',
  keywords: ['bank statement', 'mobile money', 'M-Pesa', 'MTN MoMo', 'Airtel Money', 'East Africa', 'fintech'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-brutal-bg text-brutal-black font-body antialiased">
        {children}
      </body>
    </html>
  );
}
