import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dermashop LB | Premium Hair & Skin Solutions',
  description: 'Luxury clinical hair and skin care, delivered across Lebanon.',
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