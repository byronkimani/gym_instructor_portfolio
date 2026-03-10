"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateSessionSchema } from '@/lib/validations';
import * as z from 'zod';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type SessionFormData = z.infer<typeof CreateSessionSchema>;

interface Service {
  id: string;
  name: string;
  type: 'ONE_ON_ONE' | 'GROUP';
  durationMins: number;
}

export default function NewSessionPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SessionFormData>({
    resolver: zodResolver(CreateSessionSchema),
    defaultValues: {
      capacity: 10,
    }
  });

  const selectedServiceId = watch('serviceId');
  const activeService = services.find(s => s.id === selectedServiceId);
  const startTime = watch('startTime');

  // Auto-lock capacity for 1-on-1
  useEffect(() => {
    if (activeService?.type === 'ONE_ON_ONE') {
      setValue('capacity', 1, { shouldValidate: true });
    }
  }, [activeService, setValue]);

  // Auto-calculate endTime based on startTime and activeService.durationMins
  useEffect(() => {
    if (startTime && activeService) {
      const start = new Date(startTime);
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime() + activeService.durationMins * 60000);
        // Format to ISO string for the backend as datetime-local returns local time string
        setValue('endTime', end.toISOString(), { shouldValidate: true });
      }
    }
  }, [startTime, activeService, setValue]);

  useEffect(() => {
    // We need services to populate the dropdown. Since we only have the sessions endpoint,
    // wait, we designed the DB to have Services.
    const getServices = async () => {
      try {
        const res = await fetch('/api/services', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch services');
        const json = await res.json();
        setServices(json.data?.services || json.services || []);
      } catch {
        // Fallback or handle later
        setApiError("Failed to load services. Please ensure the backend is running.");
      } finally {
        setFetchLoading(false);
      }
    };
    getServices();
  }, []);

  const onSubmit = async (data: SessionFormData) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to create session');
      }

      router.push('/sessions');
      router.refresh(); // Force a refresh to show the new session
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/sessions" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sessions
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Create New Session</h1>
          <p className="text-text-muted mt-2">Publish a new available timeslot to your public schedule.</p>
        </div>

        <div className="p-6 md:p-8">
          {apiError && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm font-bold">
              {apiError}
            </div>
          )}

          {fetchLoading ? (
            <div className="flex justify-center py-12"><RefreshCw className="h-8 w-8 text-accent animate-spin" /></div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Service Selection */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Select Service Type *</label>
                  <select
                    {...register('serviceId')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium"
                  >
                    <option value="">-- Choose a service --</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.type.replace('_', ' ')})</option>
                    ))}
                  </select>
                  {errors.serviceId && <p className="text-xs text-red-500 font-bold">{errors.serviceId.message}</p>}
                </div>

                {/* Title */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Session Title *</label>
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="e.g. Morning HIIT Blast"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium"
                  />
                  {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title.message}</p>}
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Start Date & Time *</label>
                  {/* Note: Native datetime-local returns string formats Zod might not cleanly parse without pre-processing. The CreateSessionSchema expects an ISO string. We'll use a standard local input and format it if necessary. */}
                  <input
                    {...register('startTime')}
                    type="datetime-local"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium"
                  />
                  {errors.startTime && <p className="text-xs text-red-500 font-bold">{errors.startTime.message}</p>}
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Capacity *</label>
                  <input
                    {...register('capacity', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    disabled={activeService?.type === 'ONE_ON_ONE'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium disabled:opacity-50 disabled:bg-slate-200"
                  />
                  {errors.capacity && <p className="text-xs text-red-500 font-bold">{errors.capacity.message}</p>}
                </div>

                {/* Location */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Location (Optional)</label>
                  <input
                    {...register('location')}
                    type="text"
                    placeholder="e.g. Main Studio, Virtual Zoom Link"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium"
                  />
                  {errors.location && <p className="text-xs text-red-500 font-bold">{errors.location.message}</p>}
                </div>

                {/* Notes */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Internal Notes (Optional)</label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Any private notes..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium"
                  />
                  {errors.notes && <p className="text-xs text-red-500 font-bold">{errors.notes.message}</p>}
                </div>

              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || fetchLoading}
                  className="bg-accent hover:bg-red-500 text-white font-bold py-3 px-10 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  {loading ? 'Creating...' : 'Publish Session'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
