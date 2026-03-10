import ScheduleGrid from './ScheduleGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Class Schedule | Jiwambe',
  description: 'View upcoming availability and book your next session instantly.',
};

import { prisma } from '@/lib/prisma';
import { getSpotsLeft } from '@/lib/utils';

async function getOpenSessions() {
  try {
    const sessions = await prisma.session.findMany({
      where: { status: 'OPEN', startTime: { gte: new Date() } },
      orderBy: { startTime: 'asc' },
      take: 50,
      include: { service: true },
    });

    return sessions.map(session => ({
      id: session.id,
      title: session.title || session.service.title,
      startTime: session.startTime.toISOString(),
      duration: session.service.durationMins,
      location: session.location,
      capacity: session.capacity,
      bookedCount: session.bookedCount,
      spotsLeft: getSpotsLeft(session.capacity, session.bookedCount),
      service: {
        type: session.service.type,
        duration: session.service.durationMins,
      }
    }));
  } catch (error) {
    console.error("Failed to fetch schedule sessions:", error);
    return [];
  }
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
