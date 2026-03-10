export default function ClientsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-52 bg-slate-200 rounded" />
      <div className="h-12 bg-slate-100 rounded-2xl" />
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
            <div className="flex-1 h-5 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
