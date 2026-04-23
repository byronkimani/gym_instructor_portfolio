'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  headline?: string;
  subHeadline?: string;
  accentText?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export default function HeroSection({
  headline = 'Elite Personal Training &',
  accentText = 'Group Fitness',
  subHeadline = 'Achieve your fitness goals with Coach Byron. Tailored programs, expert guidance, and a supportive community.',
  primaryCta = { label: 'Book a Session', href: '/book' },
  secondaryCta = { label: 'View Schedule', href: '/schedule' },
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration guard
    setMounted(true);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-primary overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary via-[#16213E] to-[#0F3460] z-0" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-24 w-80 h-80 bg-accent/20 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl z-0 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div
        className={`relative z-10 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <p className="text-accent font-bold tracking-[0.3em] uppercase text-sm mb-6">
          Train Smart • Live Strong
        </p>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          {headline} <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-red-400">
            {accentText}
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          {subHeadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryCta.href}
            id="hero-book-cta"
            className="bg-accent hover:bg-red-500 text-white font-bold py-4 px-10 rounded-full transition-all text-lg shadow-[0_0_24px_rgba(233,69,96,0.5)] hover:shadow-[0_0_36px_rgba(233,69,96,0.7)] hover:-translate-y-0.5"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="bg-transparent border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-bold py-4 px-10 rounded-full transition-all text-lg flex items-center justify-center gap-2"
          >
            {secondaryCta.label} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 animate-bounce flex flex-col items-center gap-1">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
}
