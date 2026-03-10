export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
            <div className="h-8 w-16 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      {/* Table skeleton */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <div className="h-5 w-48 bg-slate-200 rounded mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
