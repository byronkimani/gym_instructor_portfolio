import type { ReactNode } from 'react';
import Link from 'next/link';
import { Dumbbell, Instagram, Twitter, Facebook } from 'lucide-react';
import NewsletterDummy from '@/components/public/NewsletterDummy';
import { getSocialUrl } from '@/lib/site';

function SocialLink({
  platform,
  children,
  label,
}: {
  platform: 'instagram' | 'twitter' | 'facebook';
  children: ReactNode;
  label: string;
}) {
  const url = getSocialUrl(platform);
  const className = 'text-text-muted transition-colors hover:text-accent';
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <Link href="/contact#social-handles" className={className} aria-label={`${label} — request link via contact`}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-primary text-text-muted">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16">
          <NewsletterDummy />
        </div>

        <div className="grid gap-16 border-t border-white/5 pt-16 md:grid-cols-3">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-accent to-accent-violet shadow-lg shadow-accent/20">
                <Dumbbell className="h-5 w-5 text-white" aria-hidden />
              </span>
              <span className="font-display text-2xl font-bold text-white uppercase tracking-widest">Core & Grit</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-text-muted font-bold uppercase tracking-widest opacity-60">
              Redefining strength through inclusive, high-performance coaching.
            </p>
            <div className="flex gap-6 pt-2">
              <SocialLink platform="instagram" label="Instagram">
                <Instagram className="h-5 w-5" />
              </SocialLink>
              <SocialLink platform="twitter" label="X (Twitter)">
                <Twitter className="h-5 w-5" />
              </SocialLink>
              <SocialLink platform="facebook" label="Facebook">
                <Facebook className="h-5 w-5" />
              </SocialLink>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white">Explore</h3>
            <ul className="mt-6 space-y-4 text-xs font-bold uppercase tracking-widest">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-accent transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-accent hover:text-white transition-colors">
                  Book a session →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white">Instructor</h3>
            <ul className="mt-6 space-y-4 text-xs font-bold uppercase tracking-widest">
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  Instructor login
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/20 hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/20 hover:text-white transition-colors">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 md:flex-row">
          <p>&copy; {currentYear} Core & Grit. All rights reserved.</p>
          <p>Platform · Gym Instructor</p>
        </div>
      </div>
    </footer>
  );
}
