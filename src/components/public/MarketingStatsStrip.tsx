import { DUMMY_STATS } from '@/lib/marketing-dummy';

export default function MarketingStatsStrip() {
  return (
    <section className="border-y border-white/5 bg-primary py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:gap-4 lg:px-8">
        {DUMMY_STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-4xl font-bold text-white md:text-5xl uppercase tracking-widest">
              {s.value}
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
