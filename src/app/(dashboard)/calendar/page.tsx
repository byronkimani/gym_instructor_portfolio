import { prisma } from '@/lib/prisma';
import CalendarComponent from './CalendarComponent';

export const dynamic = 'force-dynamic';

async function getAllSessions() {
  const sessions = await prisma.session.findMany({
    include: {
      service: true
    },
    orderBy: { startTime: 'asc' }
  });
  return sessions;
}

export default async function CalendarPage() {
  const sessions = await getAllSessions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Schedule Calendar</h1>
          <p className="text-text-muted mt-1">Manage and view all your 1-on-1 and group sessions.</p>
        </div>
      </div>

      <CalendarComponent initialSessions={sessions} />
    </div>
  );
}
