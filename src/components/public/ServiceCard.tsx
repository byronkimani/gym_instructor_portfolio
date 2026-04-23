import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  duration?: number; // in minutes
  priceNote?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'light' | 'dark';
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  duration,
  priceNote,
  ctaLabel = 'Learn More',
  ctaHref = '/services',
  variant = 'light',
}: ServiceCardProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={cn(
        'p-10 rounded-3xl group hover:-translate-y-2 transition-all duration-300 shadow-sm border flex flex-col h-full',
        isDark
          ? 'bg-primary text-white border-white/10 shadow-xl'
          : 'bg-surface text-primary border-slate-100'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 transition-colors',
          isDark
            ? 'bg-slate-800 text-accent'
            : 'bg-white text-accent group-hover:bg-accent group-hover:text-white'
        )}
      >
        <Icon className="h-8 w-8" />
      </div>

      {/* Content */}
      <h3
        className={cn(
          'text-2xl font-bold mb-3',
          isDark ? 'text-white' : 'text-primary'
        )}
      >
        {title}
      </h3>

      {duration && (
        <p className={cn('text-sm font-semibold mb-4', isDark ? 'text-accent' : 'text-accent')}>
          {duration} min session
        </p>
      )}

      <p
        className={cn(
          'leading-relaxed mb-6 grow',
          isDark ? 'text-gray-300' : 'text-text-muted'
        )}
      >
        {description}
      </p>

      {priceNote && (
        <p
          className={cn(
            'text-xs font-semibold mb-6 py-2 px-3 rounded-lg border',
            isDark
              ? 'text-gray-400 border-white/10 bg-white/5'
              : 'text-text-muted border-slate-200 bg-white'
          )}
        >
          💳 {priceNote}
        </p>
      )}

      <Link
        href={ctaHref}
        className={cn(
          'font-semibold flex items-center gap-2 mt-auto group/link transition-colors',
          isDark
            ? 'text-white hover:text-accent'
            : 'text-primary hover:text-accent'
        )}
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
