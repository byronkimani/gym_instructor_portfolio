import { DUMMY_TRUST_LABELS } from '@/lib/marketing-dummy';

export default function TrustLogoStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 border-b border-white/5 bg-primary py-10">
      {DUMMY_TRUST_LABELS.map((name) => (
        <span
          key={name}
          className="font-display text-xs font-bold uppercase tracking-[0.4em] text-white/20 hover:text-white/40 transition-colors cursor-default"
        >
          {name}
        </span>
      ))}
    </div>
  );
}
