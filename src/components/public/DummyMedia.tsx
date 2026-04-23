import { Play } from 'lucide-react';
import clsx from 'clsx';

type DummyMediaProps = {
  label: string;
  aspect?: 'video' | 'square' | 'portrait' | 'landscape';
  variant?: 'photo' | 'video';
  className?: string;
};

const aspectClass = {
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[21/9]',
};

/** Gradient placeholder until real photography or video assets ship. */
export default function DummyMedia({
  label,
  aspect = 'landscape',
  variant = 'photo',
  className,
}: DummyMediaProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-slate-900 via-primary to-slate-800 shadow-2xl',
        aspectClass[aspect],
        className,
      )}
    >
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_30%_20%,rgba(233,69,96,0.35),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(99,102,241,0.2),transparent_50%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        {variant === 'video' && (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm">
            <Play className="h-7 w-7 fill-white" aria-hidden />
          </div>
        )}
        <p className="max-w-xs text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Asset placeholder
        </p>
        <p className="max-w-sm text-sm font-medium text-white/90">{label}</p>
      </div>
    </div>
  );
}
