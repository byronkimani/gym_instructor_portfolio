import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, Users, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const [
    pendingCount,
    upcomingConfirmed,
    clientCount,
    upcomingSessions,
    recentAppointments
  ] = await Promise.all([
    // 1. Pending Bookings Count
    prisma.booking.count({
      where: { status: 'PENDING' }
    }),

    // 2. Confirmed Bookings Next 7 Days
    prisma.booking.count({
      where: {
        status: 'CONFIRMED',
        session: {
          startTime: { gte: now, lte: nextWeek }
        }
      }
    }),

    // 3. Total Distinct Clients
    prisma.booking.groupBy({
      by: ['clientEmail'],
      _count: true
    }).then(res => res.length),

    // 4. Upcoming Open Sessions (Next 7 Days)
    prisma.session.count({
      where: {
        status: 'OPEN',
        startTime: { gte: now, lte: nextWeek }
      }
    }),

    // 5. Recent 5 Appointments (Across all statuses)
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        session: {
          include: { service: true }
        }
      }
    })
  ]);

  return { pendingCount, upcomingConfirmed, clientCount, upcomingSessions, recentAppointments };
}

const statusConfig: Record<string, { label: string, className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-green-100  text-green-800' },
  DECLINED: { label: 'Declined', className: 'bg-red-100    text-red-800' },
  CANCELLED: { label: 'Cancelled', className: 'bg-gray-100   text-gray-600' },
};

export default async function OverviewPage() {
  const data = await getDashboardData();

  const statCards = [
    { label: 'Pending Requests', value: data.pendingCount, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100', href: '/appointments?tab=PENDING' },
    { label: 'Upcoming (7 Days)', value: data.upcomingConfirmed, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100', href: '/appointments?tab=CONFIRMED' },
    { label: 'Total Clients', value: data.clientCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100', href: '/clients' },
    { label: 'Open Sessions', value: data.upcomingSessions, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-100', href: '/sessions' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-primary mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Recent Bookings</h2>
            <Link href="/appointments" className="text-sm font-semibold text-accent hover:underline">View All</Link>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Session</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted">No recent bookings found.</td>
                  </tr>
                ) : (
                  data.recentAppointments.map(booking => {
                    const statusIcon = statusConfig[booking.status];
                    const sessionDate = new Date(booking.session.startTime);
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-primary">{booking.clientName}</div>
                          <div className="text-xs text-slate-500">{booking.clientEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-700">{booking.session.title}</div>
                          <div className="text-xs text-slate-500">{booking.session.service?.type?.replace('_', ' ')}</div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="font-medium text-slate-600">{sessionDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                          <div className="text-xs text-slate-500">{sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusIcon.className}`}>
                            {statusIcon.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Snapshot Panel */}
        <div className="bg-primary rounded-3xl shadow-lg border border-slate-800 p-6 flex flex-col text-white">
          <div className="flex items-center gap-2 mb-6 text-accent">
            <Clock className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white">Next 3 Days</h2>
          </div>

          <div className="space-y-4 flex-1">
            {/* We'd fetch these specifically, but for the dashboard snapshot we can reuse the generic Open Sessions query or just prompt "View Calendar" */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <p className="text-sm text-gray-300 font-medium leading-relaxed">
                Your agenda is packed! Review your <Link href="/calendar" className="text-accent hover:underline font-bold">Calendar</Link> to see the complete schedule of 1-on-1s and group classes. Don&apos;t forget to confirm {data.pendingCount > 0 ? `the ${data.pendingCount} pending request(s)!` : 'any incoming requests.'}
              </p>
            </div>
          </div>

          <Link href="/sessions/new" className="mt-6 w-full bg-accent hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-center">
            + Quick Add Session
          </Link>
        </div>

      </div>
    </div>
  );
}
