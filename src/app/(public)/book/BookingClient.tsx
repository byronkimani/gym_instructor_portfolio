'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBookingSchema } from '@/lib/validations';
import type { z } from 'zod';
import { Loader2, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

type BookingFormData = z.infer<typeof CreateBookingSchema>;

interface SessionOption {
  id: string;
  title: string | null;
  startTime: string;
  location: string | null;
  spotsLeft: number;
  service: { title: string; type: string };
}

export default function BookingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSessionId = searchParams.get('sessionId');

  const [sessions, setSessions] = useState<SessionOption[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      sessionId: preselectedSessionId || '',
    },
  });

  const selectedSessionId = watch('sessionId');
  const selectedSessionData = sessions.find((s) => s.id === selectedSessionId);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions?status=OPEN');
        if (res.ok) {
          const json = await res.json();
          setSessions(json.sessions || []);

          if (preselectedSessionId && json.sessions.some((s: SessionOption) => s.id === preselectedSessionId)) {
            setValue('sessionId', preselectedSessionId);
          }
        }
      } catch (err) {
        console.error('Failed to load sessions', err);
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
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Failed to submit booking');

      router.push(`/book/confirm?bookingId=${json.booking.id}`);
    } catch (err: unknown) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="bg-surface px-4 pb-24 pt-10">
      <div className="mx-auto max-w-3xl">
        {submitStatus === 'error' && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="card-elevate rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-primary">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">
                1
              </span>
              Select a session
            </h2>

            {loadingSessions ? (
              <div className="flex h-16 items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm text-text-muted">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading available slots...
              </div>
            ) : (
              <div>
                <select
                  {...register('sessionId')}
                  className={clsx(
                    'w-full rounded-xl border bg-surface px-4 py-3 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent',
                    errors.sessionId ? 'border-red-400' : 'border-slate-300',
                  )}
                  disabled={submitStatus === 'loading'}
                >
                  <option value="" disabled>
                    -- Choose an open session --
                  </option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id} disabled={session.spotsLeft <= 0}>
                      {new Date(session.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} @{' '}
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {session.title}
                      {session.spotsLeft <= 0 ? ' (FULL)' : ` (${session.spotsLeft} spots left)`}
                    </option>
                  ))}
                </select>
                {errors.sessionId && (
                  <p className="mt-2 text-xs font-semibold text-red-500">{errors.sessionId.message}</p>
                )}

                {selectedSessionData && (
                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <p className="mb-3 text-sm font-bold text-primary">Session details</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Calendar className="h-4 w-4 text-accent" />
                        {new Date(selectedSessionData.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Clock className="h-4 w-4 text-accent" />
                        {new Date(selectedSessionData.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <MapPin className="h-4 w-4 text-accent" />
                        {selectedSessionData.location || 'TBD'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card-elevate rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-primary">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">
                2
              </span>
              Your details
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-primary">Full name *</label>
                <input
                  type="text"
                  {...register('clientName')}
                  className={clsx(
                    'w-full rounded-xl border bg-surface px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-accent',
                    errors.clientName ? 'border-red-400' : 'border-slate-300',
                  )}
                  placeholder="John Doe"
                  disabled={submitStatus === 'loading'}
                />
                {errors.clientName && (
                  <p className="mt-2 text-xs font-semibold text-red-500">{errors.clientName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-primary">Email *</label>
                <input
                  type="email"
                  {...register('clientEmail')}
                  className={clsx(
                    'w-full rounded-xl border bg-surface px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-accent',
                    errors.clientEmail ? 'border-red-400' : 'border-slate-300',
                  )}
                  placeholder="john@example.com"
                  disabled={submitStatus === 'loading'}
                />
                {errors.clientEmail && (
                  <p className="mt-2 text-xs font-semibold text-red-500">{errors.clientEmail.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-primary">Phone</label>
                <input
                  type="tel"
                  {...register('clientPhone')}
                  className="w-full rounded-xl border border-slate-300 bg-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="+254 700 000 000"
                  disabled={submitStatus === 'loading'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-primary">Notes (optional)</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Injuries, experience level, or goals for this session..."
                  disabled={submitStatus === 'loading'}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitStatus === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-5 text-lg font-bold text-white shadow-lg transition-all hover:bg-red-500 disabled:bg-slate-400"
          >
            {submitStatus === 'loading' ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" /> Submitting...
              </>
            ) : (
              'Confirm booking request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
