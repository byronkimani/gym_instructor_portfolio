"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Dumbbell } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Contact', href: '/contact' }, // Note LLD puts Contact CTA but Contact form is in /book ? Wait, LLD Section 8.1 says Contact link -> Contact page. 
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <Dumbbell className="h-8 w-8 text-accent" />
              <span className="text-white font-bold text-xl tracking-tight hidden sm:block">Coach Byron</span>
              <span className="text-white font-bold text-xl tracking-tight sm:hidden">Byron</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-accent",
                  pathname === link.href ? "text-accent" : "text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/book"
              className="bg-accent hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-md transition-all shadow-sm hover:shadow-md"
            >
              Book a Session
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu (Slide down) */}
      <div className={clsx("md:hidden absolute w-full bg-primary border-t border-slate-800 transition-all duration-300 overflow-hidden", isOpen ? "max-h-96 border-b border-slate-800" : "max-h-0 border-transparent")}>
        <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                "block px-3 py-3 rounded-md text-base font-medium",
                pathname === link.href ? "bg-slate-800 text-accent" : "text-gray-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-accent hover:bg-red-500 text-white font-semibold py-3 rounded-md transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
