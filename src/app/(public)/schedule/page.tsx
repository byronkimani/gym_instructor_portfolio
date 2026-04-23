import ScheduleGrid from './ScheduleGrid';
import PublicHeroShell from '@/components/public/PublicHeroShell';
import PublicPageHeader from '@/components/public/PublicPageHeader';
import { prisma } from '@/lib/prisma';
import { getSpotsLeft } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Class Schedule | Coach Byron',
  description: 'Upcoming 1-on-1 and group sessions — reserve before spots fill.',
};

async function getOpenSessions() {
  try {
    const sessions = await prisma.session.findMany({
      where: { status: 'OPEN', startTime: { gte: new Date() } },
      orderBy: { startTime: 'asc' },
      take: 50,
      include: { service: true },
    });

    return sessions.map((session) => ({
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
      },
    }));
  } catch (error) {
    console.error('Failed to fetch schedule sessions:', error);
    return [];
  }
}

export default async function SchedulePage() {
  const sessions = await getOpenSessions();

  return (
    <div className="min-h-screen pb-24">
      <PublicHeroShell>
        <PublicPageHeader
          eyebrow="Calendar"
          title="Availability"
          subtitle="Browse open 1-on-1 slots and group classes. High-demand blocks move fast."
        />
      </PublicHeroShell>

      <div className="mx-auto max-w-7xl px-4 pt-4 lg:px-8">
        <ScheduleGrid initialSessions={sessions} />
      </div>
    </div>
  );
}
