'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateSessionSchema } from '@/lib/validations';
import type { z } from 'zod';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SessionFormData = z.infer<typeof CreateSessionSchema>;

interface Service {
  id: string;
  title: string;
  type: 'ONE_ON_ONE' | 'GROUP';
  durationMins: number;
}

interface SessionFormProps {
  /** If provided, the form pre-populates for editing */
  initialData?: Partial<SessionFormData> & { id?: string };
  /** Called after a successful create or update */
  onSuccess?: () => void;
}

export default function SessionForm({ initialData, onSuccess }: SessionFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [services, setServices] = useState<Service[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(CreateSessionSchema),
    defaultValues: {
      capacity: 10,
      ...initialData,
    },
  });

  const selectedServiceId = watch('serviceId');
  const activeService = services.find((s) => s.id === selectedServiceId);

  // Auto-lock capacity for 1-on-1 services
  useEffect(() => {
    if (activeService?.type === 'ONE_ON_ONE') {
      setValue('capacity', 1, { shouldValidate: true });
    }
  }, [activeService, setValue]);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load services');
        const json = await res.json();
        setServices(json.data?.services || json.services || []);
      } catch {
        setApiError('Could not load services. Please try refreshing the page.');
      } finally {
        setFetchLoading(false);
      }
    }
    loadServices();
  }, []);

  const onSubmit = async (data: SessionFormData) => {
    setSubmitLoading(true);
    setApiError('');
    try {
      const url = isEditing ? `/api/sessions/${initialData!.id}` : '/api/sessions';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save session.');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/sessions');
        router.refresh();
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <p id="debug-services-length" className="text-sm font-mono bg-yellow-100 hidden">
        DEBUG SERVICES ARRAY LENGTH: {services.length}
      </p>

      {apiError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{apiError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Type */}
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="serviceId" className="block text-sm font-bold text-slate-700">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            id="serviceId"
            {...register('serviceId')}
            className={cn(
              'w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium',
              errors.serviceId ? 'border-red-400' : 'border-slate-200'
            )}
          >
            <option value="">— Choose a service —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.type.replace('_', ' ')})
              </option>
            ))}
            <option value="fake-id">HARDCODED SERVICE B</option>
          </select>
          {errors.serviceId && <p className="text-xs text-red-500 font-bold">{errors.serviceId.message}</p>}
        </div>

        {/* Title */}
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="title" className="block text-sm font-bold text-slate-700">
            Session Title <span className="text-slate-400 font-normal">(optional override)</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            placeholder="e.g. Morning HIIT Blast"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium"
          />
          {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title.message}</p>}
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <label htmlFor="startTime" className="block text-sm font-bold text-slate-700">
            Start Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            id="startTime"
            type="datetime-local"
            {...register('startTime')}
            className={cn(
              'w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium',
              errors.startTime ? 'border-red-400' : 'border-slate-200'
            )}
          />
          {errors.startTime && <p className="text-xs text-red-500 font-bold">{errors.startTime.message}</p>}
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <label htmlFor="endTime" className="block text-sm font-bold text-slate-700">
            End Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            id="endTime"
            type="datetime-local"
            {...register('endTime')}
            className={cn(
              'w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium',
              errors.endTime ? 'border-red-400' : 'border-slate-200'
            )}
          />
          {errors.endTime && <p className="text-xs text-red-500 font-bold">{errors.endTime.message}</p>}
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <label htmlFor="capacity" className="block text-sm font-bold text-slate-700">
            Capacity <span className="text-red-500">*</span>
            {activeService?.type === 'ONE_ON_ONE' && (
              <span className="ml-2 text-xs text-slate-400 font-normal">(fixed at 1 for 1-on-1)</span>
            )}
          </label>
          <input
            id="capacity"
            type="number"
            min="1"
            max="100"
            {...register('capacity', { valueAsNumber: true })}
            disabled={activeService?.type === 'ONE_ON_ONE'}
            className={cn(
              'w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium',
              errors.capacity ? 'border-red-400' : 'border-slate-200',
              activeService?.type === 'ONE_ON_ONE' && 'opacity-50 cursor-not-allowed bg-slate-200'
            )}
          />
          {errors.capacity && <p className="text-xs text-red-500 font-bold">{errors.capacity.message}</p>}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-bold text-slate-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            placeholder="e.g. Westlands Gym, Studio B"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium"
          />
          {errors.location && <p className="text-xs text-red-500 font-bold">{errors.location.message}</p>}
        </div>

        {/* Notes */}
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="notes" className="block text-sm font-bold text-slate-700">
            Notes <span className="text-slate-400 font-normal">(internal, optional)</span>
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            placeholder="Client instructions, equipment needed, etc."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium resize-none"
          />
          {errors.notes && <p className="text-xs text-red-500 font-bold">{errors.notes.message}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 font-bold text-slate-500 hover:text-primary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="session-submit"
          disabled={submitLoading || fetchLoading}
          className="bg-accent hover:bg-red-500 text-white font-bold py-3 px-10 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {submitLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Session'}
        </button>
      </div>
    </form>
  );
}
