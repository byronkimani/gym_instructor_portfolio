export default function CalendarLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-56 bg-slate-200 rounded" />
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 h-[800px] p-6">
        <div className="h-10 w-48 bg-slate-200 rounded mb-6" />
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
