"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, ClipboardList, Settings, LogOut, Dumbbell } from 'lucide-react';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';

const mainNav = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Calendar', href: '/calendar', icon: Calendar },
  { title: 'Appointments', href: '/appointments', icon: ClipboardList },
  { title: 'Clients', href: '/clients', icon: Users },
  { title: 'Sessions Manager', href: '/sessions', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 bg-primary text-white h-screen fixed top-0 left-0 border-r border-slate-800 shadow-xl z-50">

      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-accent" />
          <span className="font-extrabold text-xl tracking-tight">Jiwambe Pro</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                isActive
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "text-gray-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className={clsx("h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors font-medium"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
