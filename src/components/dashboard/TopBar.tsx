"use client";

import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Calendar, Users, ClipboardList, Settings, LogOut, Dumbbell } from 'lucide-react';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';

const mainNav = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Calendar', href: '/calendar', icon: Calendar },
  { title: 'Appointments', href: '/appointments', icon: ClipboardList },
  { title: 'Clients', href: '/clients', icon: Users },
  { title: 'Sessions', href: '/sessions', icon: Settings },
];

export default function TopBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Derive title from pathname
  const activeItem = mainNav.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const pageTitle = activeItem ? activeItem.title : 'Dashboard';

  return (
    <>
      <header className="h-20 bg-primary/80 backdrop-blur-md border-b border-foreground/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-40 sticky top-0 w-full">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-slate-400 hover:text-accent transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground tracking-tight font-display uppercase">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-foreground">Instructor Calvo</span>
            <span className="text-xs text-text-muted">Pro Account</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-accent font-bold overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer">
            B
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Drawer */}
      <div className={clsx("fixed inset-0 z-50 bg-black/50 transition-opacity md:hidden", mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={() => setMobileMenuOpen(false)} />

      <div className={clsx("fixed inset-y-0 left-0 z-50 w-72 bg-primary transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl border-r border-white/5", mobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-2xl tracking-wider text-white uppercase">Instructor <span className="text-accent">portal</span></span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium relative",
                  isActive
                    ? "bg-linear-to-r from-accent to-red-600 text-white shadow-lg shadow-accent/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-slate-900/50">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 transition-all font-medium rounded-xl hover:bg-red-500/10 group"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
