import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dermashop-lb.vercel.app'),
  title: 'Dermashop LB | Premium Hair & Skin Solutions',
  description: 'Luxury clinical hair and skin care, delivered across Lebanon. Cash on Delivery & Whish Money accepted.',
  openGraph: {
    title: 'Dermashop LB | Premium Hair & Skin Solutions',
    description: 'Luxury clinical hair and skin care, delivered across Lebanon.',
    url: 'https://dermashop-lb.vercel.app',
    siteName: 'Dermashop LB',
    images: [
      {
        url: 'https://selippeolrpokuwralgo.supabase.co/storage/v1/object/public/product-media/products/1790345094632-znwgc9x.jpeg',
        width: 1200,
        height: 630,
        alt: 'Dermashop LB Catalog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dermashop LB | Premium Hair & Skin Solutions',
    description: 'Luxury clinical hair and skin care, delivered across Lebanon.',
    images: ['https://selippeolrpokuwralgo.supabase.co/storage/v1/object/public/product-media/products/1790345094632-znwgc9x.jpeg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}