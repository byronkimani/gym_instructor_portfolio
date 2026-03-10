export default function AppointmentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded" />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-slate-200 rounded-xl" />
        ))}
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
