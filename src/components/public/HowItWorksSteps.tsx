import { DUMMY_HOW_IT_WORKS } from '@/lib/marketing-dummy';

export default function HowItWorksSteps() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {DUMMY_HOW_IT_WORKS.map((item) => (
        <div
          key={item.step}
          className="card-elevate relative overflow-hidden rounded-2xl p-10"
        >
          <span className="font-display text-8xl font-black text-white/5 absolute -right-4 -bottom-4">{item.step}</span>
          <h3 className="font-display text-2xl font-bold text-white uppercase tracking-widest">{item.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-text-muted relative z-10">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
