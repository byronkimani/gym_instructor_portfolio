export default function SessionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded" />
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
