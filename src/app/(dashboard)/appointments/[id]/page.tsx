import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Clock, MapPin, Activity, FileText } from 'lucide-react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

async function getBookingDetail(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      session: {
        include: { service: true }
      }
    }
  });

  if (!booking) notFound();
  return booking;
}

const statusConfig: Record<string, { t: string, c: string }> = {
  PENDING: { t: 'Pending Review', c: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  CONFIRMED: { t: 'Confirmed', c: 'bg-green-100 text-green-800 border-green-200' },
  DECLINED: { t: 'Declined', c: 'bg-red-100 text-red-800 border-red-200' },
  CANCELLED: { t: 'Cancelled', c: 'bg-slate-100 text-slate-800 border-slate-200' },
};

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingDetail(id);
  const statusBadge = statusConfig[booking.status];
  const sessionDate = new Date(booking.session.startTime);

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back Link */}
      <Link href="/appointments" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Appointments
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-primary p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusBadge.c}`}>
                {statusBadge.t}
              </span>
              <span className="text-slate-400 text-sm">Ref ID: {booking.id.split('-')[0]}</span>
            </div>
            <h1 className="text-3xl font-black text-white">{booking.clientName}</h1>
            <p className="text-slate-400 mt-1">Requested on {format(new Date(booking.createdAt), 'MMMM d, yyyy h:mm a')}</p>
          </div>

          {/* Action Callout based on status */}
          {booking.status === 'PENDING' && (
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-sm text-slate-300">
              Action required: Go to the <Link href="/appointments" className="text-accent underline font-bold">Appointments table</Link> to Confirm or Decline.
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Client Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Client Contact</h2>
              <div className="space-y-4">
                <a href={`mailto:${booking.clientEmail}`} className="flex items-center gap-3 text-primary hover:text-accent group transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-accent/10">
                    <Mail className="w-5 h-5 text-slate-500 group-hover:text-accent" />
                  </div>
                  <span className="font-semibold">{booking.clientEmail}</span>
                </a>
                <a href={`tel:${booking.clientPhone}`} className="flex items-center gap-3 text-primary hover:text-accent group transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-accent/10">
                    <Phone className="w-5 h-5 text-slate-500 group-hover:text-accent" />
                  </div>
                  <span className="font-semibold">{booking.clientPhone}</span>
                </a>
              </div>
            </div>

            {booking.guestNotes && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Notes specific to request</h2>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-slate-700 italic">
                  "{booking.guestNotes}"
                </div>
              </div>
            )}
          </div>

          {/* Session Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Session Target</h2>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">

                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-primary">{booking.session.title}</h3>
                  <Link href={`/sessions`} className="text-xs font-bold text-accent hover:underline">View Session</Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="text-sm">
                      <span className="block font-semibold text-slate-700">{format(sessionDate, 'MMM d, yyyy')}</span>
                      <span className="block text-slate-500">{format(sessionDate, 'h:mm a')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="text-sm">
                      <span className="block font-semibold text-slate-700">{booking.session.service?.type?.replace('_', ' ')}</span>
                      <span className="block text-slate-500">{booking.session.service?.duration} Min</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="text-sm">
                      <span className="block font-semibold text-slate-700">Location</span>
                      <span className="block text-slate-500">{booking.session.location || 'Not Specified'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Instructor Notes */}
            {booking.statusNote && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Instructor Log (Email Attached)</h2>
                <div className="flex gap-3 text-sm text-slate-600 border-l-2 border-accent pl-4">
                  <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                  <p>{booking.statusNote}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
