import { DUMMY_TRUST_LABELS } from '@/lib/marketing-dummy';

export default function TrustLogoStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-y border-slate-200 bg-white py-8">
      {DUMMY_TRUST_LABELS.map((name) => (
        <span
          key={name}
          className="font-display text-sm font-bold uppercase tracking-[0.15em] text-slate-400"
        >
          {name}
        </span>
      ))}
    </div>
  );
}
