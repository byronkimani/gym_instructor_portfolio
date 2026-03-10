import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getClientProfile(email: string) {
  const decodedEmail = decodeURIComponent(email);
  const bookings = await prisma.booking.findMany({
    where: { clientEmail: decodedEmail },
    include: {
      session: {
        include: { service: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!bookings || bookings.length === 0) return null;

  // Aggregate stats
  const clientName = bookings[0].clientName;
  const clientPhone = bookings[0].clientPhone;
  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const declinedCount = bookings.filter(b => b.status === 'DECLINED' || b.status === 'CANCELLED').length;

  return {
    name: clientName,
    email: decodedEmail,
    phone: clientPhone,
    totalBookings,
    confirmedCount,
    pendingCount,
    declinedCount,
    bookings
  };
}

const statusConfig: Record<string, { t: string, c: string }> = {
  PENDING: { t: 'Pending', c: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { t: 'Confirmed', c: 'bg-green-100 text-green-800' },
  DECLINED: { t: 'Declined', c: 'bg-red-100 text-red-800' },
  CANCELLED: { t: 'Cancelled', c: 'bg-slate-100 text-slate-800' },
};

export default async function ClientProfilePage({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  const profile = await getClientProfile(email);

  if (!profile) return notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Back Link */}
      <Link href="/clients" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="md:col-span-1 border border-slate-200 bg-white rounded-3xl shadow-sm p-6 flex flex-col">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-primary text-3xl font-black border-4 border-slate-50 shadow-sm">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary leading-tight">{profile.name}</h1>
              <p className="text-sm text-slate-500">Client since {format(new Date(profile.bookings[profile.bookings.length - 1].createdAt), 'MMM yyyy')}</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Mail className="h-5 w-5 text-slate-400" />
              <a href={`mailto:${profile.email}`} className="text-sm font-medium hover:text-accent truncate">{profile.email}</a>
            </div>
            <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Phone className="h-5 w-5 text-slate-400" />
              <a href={`tel:${profile.phone}`} className="text-sm font-medium hover:text-accent">{profile.phone}</a>
            </div>
          </div>
        </div>

        {/* Stats & History */}
        <div className="md:col-span-2 space-y-6">

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 text-white rounded-2xl p-4 flex flex-col justify-center items-center text-center">
              <span className="text-3xl font-black mb-1">{profile.totalBookings}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Total Bookings</span>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
              <span className="text-3xl font-black text-green-700 mb-1">{profile.confirmedCount}</span>
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Confirmed</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
              <span className="text-3xl font-black text-yellow-700 mb-1">{profile.pendingCount}</span>
              <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Action Required</span>
            </div>
          </div>

          {/* Full History Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-primary">Booking History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Session Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Requested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.bookings.map(booking => {
                    const statusBadge = statusConfig[booking.status];
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/appointments/${booking.id}`} className="block">
                            <div className="font-bold text-primary mb-1 hover:text-accent transition-colors">{booking.session.title}</div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(booking.session.startTime), 'MMM d, yyyy')}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(booking.session.startTime), 'h:mm a')}</span>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusBadge.c}`}>{statusBadge.t}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-slate-400">
                          {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
