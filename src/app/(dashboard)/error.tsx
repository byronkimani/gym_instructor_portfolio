'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardError({
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
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-3">Something went wrong</h2>
        <p className="text-text-muted mb-6 text-sm leading-relaxed">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    </div>
  );
}
