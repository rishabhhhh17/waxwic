import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { MetaPixel } from '@/components/MetaPixel';
import { AnnouncementBar } from '@/components/AnnouncementBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Waxwic — Solid perfumes, hand-poured.',
  description:
    'Wax-based solid perfumes, alcohol-free, hand-poured in small batches. Pocket-sized tins built to travel close to the skin.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waxwic.in'),
  openGraph: {
    title: 'Waxwic — Solid perfumes, hand-poured.',
    description: 'Wax-based solid perfumes, alcohol-free, hand-poured in small batches.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-ivory text-ink antialiased">
        <MetaPixel />
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
