"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBookingSchema } from '@/lib/validations';
import type { z } from 'zod';
import { Loader2, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

type BookingFormData = z.infer<typeof CreateBookingSchema>;

function BookingFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSessionId = searchParams.get('sessionId');

interface SessionOption {
    id: string;
    title: string | null;
    startTime: string;
    location: string | null;
    spotsLeft: number;
    service: { title: string; type: string };
  }

  const [sessions, setSessions] = useState<SessionOption[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      sessionId: preselectedSessionId || '',
    }
  });

  const selectedSessionId = watch('sessionId');
  const selectedSessionData = sessions.find(s => s.id === selectedSessionId);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions?status=OPEN');
        if (res.ok) {
          const json = await res.json();
          setSessions(json.sessions || []);

          // Auto-select if a matching ID was passed
          if (preselectedSessionId && json.sessions.some((s: SessionOption) => s.id === preselectedSessionId)) {
            setValue('sessionId', preselectedSessionId);
          }
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setLoadingSessions(false);
      }
    }
    fetchSessions();
  }, [preselectedSessionId, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Failed to submit booking');

      // Success! Redirect directly to the confirm page
      router.push(`/book/confirm?bookingId=${json.booking.id}`);

    } catch (err: unknown) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="bg-surface min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">Book Your Session</h1>
          <p className="text-lg text-text-muted">Reserve your spot now. Payment is only required after confirmation.</p>
        </div>

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 mb-8 shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Step 1: Session Picker */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">1</span>
              Select a Session
            </h2>

            {loadingSessions ? (
              <div className="h-16 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-text-muted text-sm gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading available slots...
              </div>
            ) : (
              <div>
                <select
                  {...register('sessionId')}
                  className={clsx(
                    "w-full bg-surface border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-all",
                    errors.sessionId ? "border-red-400" : "border-slate-300"
                  )}
                  disabled={submitStatus === 'loading'}
                >
                  <option value="" disabled>-- Choose an open session --</option>
                  {sessions.map(session => (
                    <option key={session.id} value={session.id} disabled={session.spotsLeft <= 0}>
                      {new Date(session.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} @ {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {session.title}
                      {session.spotsLeft <= 0 ? ' (FULL)' : ` (${session.spotsLeft} spots left)`}
                    </option>
                  ))}
                </select>
                {errors.sessionId && <p className="text-red-500 text-xs font-semibold mt-2">{errors.sessionId.message}</p>}

                {/* Selected Session Preview Card */}
                {selectedSessionData && (
                  <div className="mt-6 bg-slate-50 border border-slate-200 p-5 rounded-xl">
                    <p className="text-sm font-bold text-primary mb-3">Session Details:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center text-text-muted text-sm gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        {new Date(selectedSessionData.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-text-muted text-sm gap-2">
                        <Clock className="h-4 w-4 text-accent" />
                        {new Date(selectedSessionData.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center text-text-muted text-sm gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        {selectedSessionData.location || 'TBD'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Guest Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">2</span>
              Your Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-primary mb-2">Full Name *</label>
                <input
                  type="text"
                  {...register('clientName')}
                  className={clsx(
                    "w-full bg-surface border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all",
                    errors.clientName ? "border-red-400" : "border-slate-300"
                  )}
                  placeholder="John Doe"
                  disabled={submitStatus === 'loading'}
                />
                {errors.clientName && <p className="text-red-500 text-xs font-semibold mt-2">{errors.clientName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2">Email Address *</label>
                <input
                  type="email"
                  {...register('clientEmail')}
                  className={clsx(
                    "w-full bg-surface border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all",
                    errors.clientEmail ? "border-red-400" : "border-slate-300"
                  )}
                  placeholder="john@example.com"
                  disabled={submitStatus === 'loading'}
                />
                {errors.clientEmail && <p className="text-red-500 text-xs font-semibold mt-2">{errors.clientEmail.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2">Phone Number</label>
                <input
                  type="tel"
                  {...register('clientPhone')}
                  className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  placeholder="+254 700 000 000"
                  disabled={submitStatus === 'loading'}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-primary mb-2">Additional Notes (Optional)</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
                  placeholder="Injuries, experience level, or specific goals for this session..."
                  disabled={submitStatus === 'loading'}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitStatus === 'loading'}
            className="w-full bg-accent hover:bg-red-500 disabled:bg-slate-400 text-white font-bold py-5 rounded-2xl transition-all shadow-lg text-lg flex justify-center items-center gap-2"
          >
            {submitStatus === 'loading' ? (
              <><Loader2 className="h-6 w-6 animate-spin" /> Submitting Request...</>
            ) : (
              'Confirm Booking Request'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    }>
      <BookingFormInner />
    </Suspense>
  );
}
