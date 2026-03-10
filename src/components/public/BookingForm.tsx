'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBookingSchema } from '@/lib/validations';
import type { z } from 'zod';
import { Loader2, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type BookingFormData = z.infer<typeof CreateBookingSchema>;

interface Session {
  id: string;
  title: string | null;
  startTime: string;
  location: string | null;
  spotsLeft: number;
  service: { title: string; type: string };
}

interface BookingFormProps {
  /** Pre-selected session ID (from ?sessionId= query param) */
  preselectedSessionId?: string;
  /** Called on successful submission with the new booking ID */
  onSuccess?: (bookingId: string) => void;
  /** External error to display (from parent) */
  externalError?: string;
}

export default function BookingForm({
  preselectedSessionId = '',
  onSuccess,
  externalError,
}: BookingFormProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
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
    defaultValues: { sessionId: preselectedSessionId },
  });

  const selectedSessionId = watch('sessionId');
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions?status=OPEN');
        if (res.ok) {
          const json = await res.json();
          const list: Session[] = json.sessions || [];
          setSessions(list);
          if (preselectedSessionId && list.some((s) => s.id === preselectedSessionId)) {
            setValue('sessionId', preselectedSessionId);
          }
        }
      } catch {
        // silently fail — user can still type
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
      if (!res.ok) throw new Error(json.error || 'Failed to submit booking.');
      onSuccess?.(json.booking.id);
    } catch (err: unknown) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const displayError = externalError || (submitStatus === 'error' ? errorMessage : '');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Error Banner */}
      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-sm" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{displayError}</p>
        </div>
      )}

      {/* Step 1: Session Picker */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <span className="bg-primary text-white w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold">1</span>
          Select a Session
        </h2>

        {loadingSessions ? (
          <div className="h-14 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-text-muted text-sm gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading available sessions...
          </div>
        ) : (
          <>
            <label htmlFor="sessionId" className="sr-only">Select a session</label>
            <select
              id="sessionId"
              {...register('sessionId')}
              className={cn(
                'w-full bg-surface border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-all',
                errors.sessionId ? 'border-red-400' : 'border-slate-300'
              )}
              disabled={submitStatus === 'loading'}
            >
              <option value="" disabled>— Choose an open session —</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id} disabled={s.spotsLeft <= 0}>
                  {new Date(s.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  {' @ '}
                  {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' — '}
                  {s.title || s.service.title}
                  {s.spotsLeft <= 0 ? ' (FULL)' : ` (${s.spotsLeft} spots left)`}
                </option>
              ))}
            </select>
            {errors.sessionId && (
              <p className="text-red-500 text-xs font-semibold mt-2">{errors.sessionId.message}</p>
            )}

            {/* Selected session preview */}
            {selectedSession && (
              <div className="mt-5 bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center text-text-muted gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  {new Date(selectedSession.startTime).toLocaleDateString()}
                </div>
                <div className="flex items-center text-text-muted gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  {new Date(selectedSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center text-text-muted gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  {selectedSession.location || 'TBD'}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Step 2: Guest Details */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <span className="bg-primary text-white w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold">2</span>
          Your Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="clientName" className="block text-sm font-bold text-primary mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="clientName"
              type="text"
              {...register('clientName')}
              placeholder="Jane Mwangi"
              disabled={submitStatus === 'loading'}
              className={cn(
                'w-full bg-surface border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all',
                errors.clientName ? 'border-red-400' : 'border-slate-300'
              )}
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs font-semibold mt-2">{errors.clientName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-bold text-primary mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="clientEmail"
              type="email"
              {...register('clientEmail')}
              placeholder="jane@example.com"
              disabled={submitStatus === 'loading'}
              className={cn(
                'w-full bg-surface border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all',
                errors.clientEmail ? 'border-red-400' : 'border-slate-300'
              )}
            />
            {errors.clientEmail && (
              <p className="text-red-500 text-xs font-semibold mt-2">{errors.clientEmail.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="clientPhone" className="block text-sm font-bold text-primary mb-2">
              Phone Number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="clientPhone"
              type="tel"
              {...register('clientPhone')}
              placeholder="+254 700 000 000"
              disabled={submitStatus === 'loading'}
              className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            {errors.clientPhone && (
              <p className="text-red-500 text-xs font-semibold mt-2">{errors.clientPhone.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-bold text-primary mb-2">
              Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={3}
              placeholder="Injuries, experience level, or specific goals..."
              disabled={submitStatus === 'loading'}
              className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="booking-submit"
        disabled={submitStatus === 'loading'}
        className="w-full bg-accent hover:bg-red-500 disabled:bg-slate-400 text-white font-bold py-5 rounded-2xl transition-all shadow-lg text-lg flex justify-center items-center gap-3"
      >
        {submitStatus === 'loading' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting Request...
          </>
        ) : (
          'Confirm Booking Request →'
        )}
      </button>
    </form>
  );
}
