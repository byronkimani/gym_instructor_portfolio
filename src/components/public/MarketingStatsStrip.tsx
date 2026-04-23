import { DUMMY_STATS } from '@/lib/marketing-dummy';

export default function MarketingStatsStrip() {
  return (
    <section className="border-y border-white/10 bg-slate-950/80 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:gap-4 lg:px-8">
        {DUMMY_STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-extrabold text-white md:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
