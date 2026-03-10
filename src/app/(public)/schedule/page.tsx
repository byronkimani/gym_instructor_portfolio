import ScheduleGrid from './ScheduleGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Class Schedule | Jiwambe',
  description: 'View upcoming availability and book your next session instantly.',
};

async function getOpenSessions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/sessions?status=OPEN&limit=50`, {
    cache: 'no-store'
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.sessions || [];
}

export default async function SchedulePage() {
  const sessions = await getOpenSessions();

  return (
    <div className="bg-surface min-h-screen pb-24">
      <div className="bg-primary text-white py-20 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Availability Schedule</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Browse upcoming 1-on-1 slots and group classes. Spots fill up fast!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Pass fetched data to the interactive client component */}
        <ScheduleGrid initialSessions={sessions} />
      </div>
    </div>
  );
}
