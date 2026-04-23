'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormSchema } from '@/lib/validations';
import type { z } from 'zod';

type ContactFormData = z.infer<typeof ContactFormSchema>;

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit form');
      }

      setStatus('success');
      reset();
    } catch (err: unknown) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="card-elevate rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
      {status === 'success' ? (
        <div className="py-12 text-center">
          <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-emerald-500" />
          <h3 className="font-display text-2xl font-bold text-primary">Message sent</h3>
          <p className="mt-2 text-text-muted">Thanks — you will hear back shortly.</p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-8 font-semibold text-accent hover:underline"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {status === 'error' && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-bold text-primary">
              Full name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full rounded-xl border border-slate-300 bg-surface px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. John Doe"
              disabled={status === 'loading'}
            />
            {errors.name && <p className="mt-2 text-xs font-semibold text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold text-primary">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full rounded-xl border border-slate-300 bg-surface px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="john@example.com"
              disabled={status === 'loading'}
            />
            {errors.email && <p className="mt-2 text-xs font-semibold text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-bold text-primary">
              Message *
            </label>
            <textarea
              id="message"
              {...register('message')}
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-300 bg-surface px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Goals, corporate packages, injuries..."
              disabled={status === 'loading'}
            />
            {errors.message && (
              <p className="mt-2 text-xs font-semibold text-red-500">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-md transition-all hover:bg-slate-800 disabled:bg-slate-400"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" /> Send message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
