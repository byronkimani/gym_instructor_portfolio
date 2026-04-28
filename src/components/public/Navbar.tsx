"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Dumbbell } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-white/5 bg-primary/80 shadow-2xl shadow-black/40 backdrop-blur-xl'
          : 'border-transparent bg-primary/40 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-accent to-accent-violet shadow-lg shadow-accent/25">
            <Dumbbell className="h-5 w-5 text-white" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl font-bold tracking-widest text-white sm:text-2xl uppercase">
              Core & Grit
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors',
                pathname === link.href
                  ? 'text-white'
                  : 'text-text-muted hover:bg-white/5 hover:text-white',
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/book"
            className="ml-3 rounded-lg bg-linear-to-br from-accent to-accent-violet px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md shadow-accent/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/30"
          >
            Book Now
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/book"
            className="rounded-lg bg-accent px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
            onClick={() => setIsOpen(false)}
          >
            Book
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-200 hover:bg-white/10 hover:text-white"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={clsx(
          'overflow-hidden border-t border-white/5 bg-primary/98 backdrop-blur-xl transition-all duration-300 md:hidden',
          isOpen ? 'max-h-112 opacity-100' : 'max-h-0 border-transparent opacity-0',
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                'block rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest',
                pathname === link.href
                  ? 'bg-white/10 text-accent'
                  : 'text-text-muted hover:bg-white/5 hover:text-white',
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
