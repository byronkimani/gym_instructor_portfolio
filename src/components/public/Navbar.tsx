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
        'fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300',
        scrolled
          ? 'border-white/10 bg-slate-950/90 shadow-lg shadow-black/20 backdrop-blur-md'
          : 'border-transparent bg-slate-950/70 backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-red-600 shadow-lg shadow-accent/25">
            <Dumbbell className="h-5 w-5 text-white" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">
              Coach Byron
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
              Train smart · Live strong
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                pathname === link.href
                  ? 'text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/book"
            className="ml-3 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-accent/30"
          >
            Book
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/book"
            className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white"
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
          'overflow-hidden border-t border-white/10 bg-slate-950/98 backdrop-blur-lg transition-all duration-300 md:hidden',
          isOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 border-transparent opacity-0',
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                'block rounded-xl px-4 py-3 text-base font-semibold',
                pathname === link.href
                  ? 'bg-white/10 text-accent'
                  : 'text-slate-200 hover:bg-white/5 hover:text-white',
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
