'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8 bg-surface">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-3">Something went wrong</h2>
        <p className="text-text-muted mb-8 text-sm leading-relaxed">
          {error.message || 'We encountered an unexpected error. Please try again or contact us if it persists.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-primary font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
