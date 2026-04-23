import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <p className="text-[10rem] font-extrabold text-primary/10 leading-none select-none">
          404
        </p>

        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto -mt-8 mb-6">
          <FileQuestion className="h-8 w-8 text-accent" />
        </div>

        <h1 className="font-display mb-4 text-3xl font-extrabold tracking-tight text-primary">
          Page not found
        </h1>
        <p className="text-text-muted mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Try going back or check your URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-accent hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
          >
            Back to Home
          </Link>
          <Link
            href="/schedule"
            className="bg-white border-2 border-slate-200 hover:border-accent text-primary font-bold py-3 px-8 rounded-full transition-all"
          >
            View Schedule
          </Link>
        </div>
      </div>
    </div>
  );
}
