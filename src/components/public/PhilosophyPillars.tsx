import { DUMMY_PHILOSOPHY_PILLARS } from '@/lib/marketing-dummy';

export default function PhilosophyPillars() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {DUMMY_PHILOSOPHY_PILLARS.map((p) => (
        <div
          key={p.title}
          className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm md:p-8"
        >
          <h3 className="font-display text-lg font-bold text-white">{p.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{p.body}</p>
        </div>
      ))}
    </div>
  );
}
