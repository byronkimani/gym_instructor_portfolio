import { DUMMY_HOW_IT_WORKS } from '@/lib/marketing-dummy';

export default function HowItWorksSteps() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {DUMMY_HOW_IT_WORKS.map((item) => (
        <div
          key={item.step}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <span className="font-display text-5xl font-black text-slate-100">{item.step}</span>
          <h3 className="font-display -mt-4 text-xl font-bold text-primary">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
