import { DUMMY_INSTAGRAM } from '@/lib/marketing-dummy';

export default function InstagramDummyGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-6">
      {DUMMY_INSTAGRAM.map((cell) => (
        <div
          key={cell.id}
          className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-linear-to-br from-slate-200 via-slate-100 to-slate-200"
        >
          <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
            <span className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-slate-500 opacity-80 transition-opacity group-hover:opacity-100">
              {cell.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
