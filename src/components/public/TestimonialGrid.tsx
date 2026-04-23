import { Star } from 'lucide-react';
import { DUMMY_TESTIMONIALS } from '@/lib/marketing-dummy';

export default function TestimonialGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {DUMMY_TESTIMONIALS.map((t) => (
        <blockquote
          key={t.name}
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-4 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden />
            ))}
          </div>
          <p className="flex-grow text-sm leading-relaxed text-text-primary">&ldquo;{t.quote}&rdquo;</p>
          <footer className="mt-6 border-t border-slate-100 pt-4">
            <cite className="not-italic">
              <span className="font-display font-bold text-primary">{t.name}</span>
              <span className="mt-0.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                {t.role}
              </span>
            </cite>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
