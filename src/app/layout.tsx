import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Bebas_Neue } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'Coach Calvo | Redefine Your Strength',
  description:
    'Inclusive high-performance coaching designed to build resilience, foster confidence, and empower your unique fitness journey.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${bebasNeue.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
