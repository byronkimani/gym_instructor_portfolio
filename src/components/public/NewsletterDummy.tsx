'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

/** Visual-only capture UI; wire to provider when ready. */
export default function NewsletterDummy() {
  const [done, setDone] = useState(false);

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Intel brief</p>
          <h3 className="font-display mt-1 text-xl font-bold text-white md:text-2xl">
            Training notes in your inbox
          </h3>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            Dummy field for now — connect your email tool when you are ready. No messages are sent from this demo.
          </p>
        </div>
        {done ? (
          <p className="text-sm font-semibold text-emerald-400">Noted. Replace this with a real provider.</p>
        ) : (
          <form
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/20 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500"
            >
              Join
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
