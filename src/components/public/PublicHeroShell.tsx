import type { ReactNode } from 'react';

type PublicHeroShellProps = {
  children: ReactNode;
  /** Taller hero for home */
  size?: 'default' | 'tall';
};

export default function PublicHeroShell({ children, size = 'default' }: PublicHeroShellProps) {
  return (
    <div
      className={
        size === 'tall'
          ? 'relative overflow-hidden border-b border-white/10 bg-slate-950 pt-28 pb-20 md:pt-32 md:pb-28'
          : 'relative overflow-hidden border-b border-white/10 bg-slate-950 pt-28 pb-16 md:pt-32 md:pb-20'
      }
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(233,69,96,0.22),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.3)_0%,rgba(15,23,42,0.95)_100%)]" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">{children}</div>
    </div>
  );
}
