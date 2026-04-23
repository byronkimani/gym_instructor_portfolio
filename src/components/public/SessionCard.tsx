import Link from 'next/link';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatTime } from '@/lib/utils';

export interface SessionCardSession {
  id: string;
  title: string | null;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  spotsLeft: number;
  location: string | null;
  service: {
    title: string;
    type: string;
    durationMins: number;
    priceNote?: string | null;
  };
}

interface SessionCardProps {
  session: SessionCardSession;
  /** If true, suppress the Book Now button (e.g. for just display) */
  readOnly?: boolean;
}

export default function SessionCard({ session, readOnly = false }: SessionCardProps) {
  const isFull = session.spotsLeft <= 0;
  const pctBooked = Math.min(100, (session.bookedCount / Math.max(session.capacity, 1)) * 100);
  const isOneOnOne = session.service.type === 'ONE_ON_ONE';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span
          className={cn(
            'text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider',
            isOneOnOne
              ? 'bg-accent/10 text-accent'
              : 'bg-primary/10 text-primary'
          )}
        >
          {session.service.type.replace('_', ' ')}
        </span>
        <span className="text-xs font-semibold text-text-muted bg-slate-100 px-2 py-1 rounded">
          {session.service.durationMins} min
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-primary mb-4 leading-tight flex-none">
        {session.title || session.service.title}
      </h3>

      {/* Details */}
      <div className="space-y-2 mb-5 bg-surface p-4 rounded-xl grow text-sm">
        <div className="flex items-center text-primary font-semibold gap-3">
          <Calendar className="h-4 w-4 text-accent shrink-0" />
          <span>{formatDate(session.startTime)}</span>
        </div>
        <div className="flex items-center text-text-muted gap-3">
          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
          <span>{formatTime(session.startTime)}</span>
        </div>
        <div className="flex items-center text-text-muted gap-3">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="truncate">{session.location || 'TBA'}</span>
        </div>
        {!isOneOnOne && (
          <div className="flex items-center text-text-muted gap-3">
            <Users className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{session.bookedCount} / {session.capacity} booked</span>
          </div>
        )}
      </div>

      {/* Capacity bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs font-bold mb-1.5">
          <span className="text-slate-500">Availability</span>
          <span className={isFull ? 'text-red-500' : 'text-green-600'}>
            {isFull ? 'Full' : `${session.spotsLeft} spot${session.spotsLeft === 1 ? '' : 's'} left`}
          </span>
        </div>
        <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', isFull ? 'bg-red-500' : 'bg-green-500')}
            style={{ width: `${pctBooked}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      {!readOnly &&
        (isFull ? (
          <span
            id={`book-session-${session.id}`}
            className="block w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 text-center font-bold text-slate-400"
          >
            Fully booked
          </span>
        ) : (
          <Link
            href={`/book?sessionId=${session.id}`}
            id={`book-session-${session.id}`}
            className="block w-full rounded-xl bg-primary py-3 text-center font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg"
          >
            Book now →
          </Link>
        ))}
    </div>
  );
}
