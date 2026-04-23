import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Calendar, Clock, MapPin } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PublicHeroShell from '@/components/public/PublicHeroShell';
import PublicPageHeader from '@/components/public/PublicPageHeader';

export const dynamic = 'force-dynamic';

async function getBookingDetails(id: string) {
  if (!id) return null;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        session: {
          include: { service: true }
        }
      }
    });
    return booking;
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    return null;
  }
}

export default async function BookingConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;

  if (!bookingId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-surface px-4">
        <p className="text-text-muted">Invalid booking reference.</p>
      </div>
    );
  }

  const booking = await getBookingDetails(bookingId);

  if (!booking) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Booking Not Found</h1>
        <p className="text-text-muted mb-6">We couldn&apos;t locate that booking reference. It may have been removed.</p>
        <Link href="/schedule" className="font-semibold text-accent hover:underline">
          Return to schedule
        </Link>
      </div>
    );
  }

  const sessionDate = new Date(booking.session.startTime);

  // M-Pesa Envs (Ensure these exist in .env.local)
  const mpesaPaybill = process.env.NEXT_PUBLIC_MPESA_PAYBILL;
  const mpesaTill = process.env.NEXT_PUBLIC_MPESA_TILL;
  const mpesaRef = process.env.NEXT_PUBLIC_MPESA_ACCOUNT_REF || booking.clientName.split(' ')[0];

  return (
    <div className="min-h-screen bg-surface">
      <PublicHeroShell>
        <PublicPageHeader
          eyebrow="Confirmed"
          title="Booking request received"
          subtitle={`Thanks ${booking.clientName.split(' ')[0]} — confirmation is on its way to ${booking.clientEmail}.`}
        />
      </PublicHeroShell>

      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-10 flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 drop-shadow-sm" aria-hidden />
        </div>

        <div className="card-elevate mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Session Details */}
          <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50 p-8">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-accent" />
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-accent">Requested session</h2>
            <h3 className="font-display mb-4 text-2xl font-bold text-primary">{booking.session.title}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-text-primary font-medium gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                {sessionDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center text-text-primary font-medium gap-3">
                <Clock className="h-5 w-5 text-slate-400" />
                {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center text-text-primary font-medium gap-3 sm:col-span-2">
                <MapPin className="h-5 w-5 text-slate-400" />
                {booking.session.location || 'Location TBD'}
              </div>
            </div>
          </div>

          {/* Early M-Pesa Instructions Block */}
          <div className="p-8">
            <h3 className="font-display mb-4 text-xl font-bold text-primary">Payment instructions</h3>
            <p className="text-text-muted mb-6">
              Please complete payment utilizing the details below to secure your spot. Your booking remains in <span className="text-yellow-600 font-bold bg-yellow-100 px-2 py-0.5 rounded">Pending</span> status until the instructor manually confirms receipt.
            </p>

            {(mpesaPaybill || mpesaTill) && (
              <div className="bg-[#f0fdf4] border-2 border-[#22c55e] rounded-2xl p-6 relative">
                <div className="absolute -top-3 left-6 bg-[#22c55e] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  M-Pesa
                </div>

                {mpesaPaybill ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-sm text-green-800 font-semibold mb-1">Paybill Number:</p>
                      <p className="text-3xl font-black text-green-900 font-mono tracking-widest">{mpesaPaybill}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-800 font-semibold mb-1">Account Reference:</p>
                      <p className="text-lg font-bold text-green-900">{mpesaRef}</p>
                    </div>
                  </div>
                ) : (mpesaTill && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-sm text-green-800 font-semibold mb-1">Buy Goods (Till Number):</p>
                      <p className="text-3xl font-black text-green-900 font-mono tracking-widest">{mpesaTill}</p>
                    </div>
                  </div>
                ))}

                {booking.session.service?.priceNote && (
                  <div className="mt-6 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-800 font-semibold mb-1">Amount Due:</p>
                    <p className="text-xl font-bold text-green-900">{booking.session.service.priceNote}</p>
                  </div>
                )}
              </div>
            )}

            {(!mpesaPaybill && !mpesaTill) && (
              <div className="bg-slate-100 p-6 rounded-2xl text-center border border-slate-200 text-slate-600">
                <p>The instructor will provide payment details directly via email upon confirmation.</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 font-bold text-primary transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden /> Back to schedule
          </Link>
        </div>
      </div>
    </div>
  );
}
