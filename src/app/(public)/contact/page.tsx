"use client";

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormSchema } from '@/lib/validations';
import type { z } from 'zod';

type ContactFormData = z.infer<typeof ContactFormSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
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
    <div className="bg-surface min-h-screen py-24 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg text-text-muted">Have a question? Interested in corporate packages? Leave a message and I&apos;ll get back to you within 24 hours.</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">

          {status === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-2">Message Sent!</h3>
              <p className="text-text-muted mb-8">Thanks for reaching out. Check your email soon for a reply.</p>
              <button
                onClick={() => setStatus('idle')}
                className="text-accent font-semibold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-bold text-primary mb-2">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="e.g. John Doe"
                  disabled={status === 'loading'}
                />
                {errors.name && <p className="text-red-500 text-xs font-semibold mt-2">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-primary mb-2">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="john@example.com"
                  disabled={status === 'loading'}
                />
                {errors.email && <p className="text-red-500 text-xs font-semibold mt-2">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-primary mb-2">Your Message *</label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                  placeholder="How can I help you?"
                  disabled={status === 'loading'}
                />
                {errors.message && <p className="text-red-500 text-xs font-semibold mt-2">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
              >
                {status === 'loading' ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="h-5 w-5" /> Send Message</>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
