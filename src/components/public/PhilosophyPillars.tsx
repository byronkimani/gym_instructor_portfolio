import { DUMMY_PHILOSOPHY_PILLARS } from '@/lib/marketing-dummy';

export default function PhilosophyPillars() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {DUMMY_PHILOSOPHY_PILLARS.map((p) => (
        <div
          key={p.title}
          className="card-elevate rounded-2xl p-8 md:p-10"
        >
          <h3 className="font-display text-2xl font-bold text-white uppercase tracking-widest">{p.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">{p.body}</p>
        </div>
      ))}
    </div>
  );
}
