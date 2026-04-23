import Link from 'next/link';
import { Dumbbell, Instagram, Twitter, Facebook } from 'lucide-react';
import NewsletterDummy from '@/components/public/NewsletterDummy';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12">
          <NewsletterDummy />
        </div>

        <div className="grid gap-12 border-t border-white/10 pt-12 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
                <Dumbbell className="h-5 w-5 text-accent" aria-hidden />
              </span>
              <span className="font-display text-lg font-bold text-white">Coach Byron</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Elite personal training and group fitness — technical coaching, structured progression, zero fluff.
            </p>
            <div className="flex gap-4 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-accent"
                aria-label="Instagram (placeholder)"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-accent"
                aria-label="Twitter (placeholder)"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-accent"
                aria-label="Facebook (placeholder)"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-white">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/book" className="font-semibold text-accent hover:text-red-400">
                  Book a session →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Instructor</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/login" className="hover:text-white">
                  Instructor login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-slate-300">
                  Privacy policy (placeholder)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-slate-300">
                  Terms (placeholder)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 md:flex-row">
          <p>&copy; {currentYear} Coach Byron. All rights reserved.</p>
          <p>Platform · Jiwambe Gym Instructor</p>
        </div>
      </div>
    </footer>
  );
}
