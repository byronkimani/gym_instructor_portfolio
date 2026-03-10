"use client";

import { useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, Users, Activity } from 'lucide-react';
import clsx from 'clsx';

// Optional: import shadcn/ui components here if installed, otherwise basic modal.
// We'll use a basic raw Tailwind Slide-over for the session details below.

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function CalendarComponent({ initialSessions }: { initialSessions: any[] }) {
    const router = useRouter();
    const [view, setView] = useState<View>(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const [selectedSession, setSelectedSession] = useState<any | null>(null);

    // Map sessions to RBI events
    const events = useMemo(() => {
        return initialSessions.map(session => ({
            ...session,
            start: new Date(session.startTime),
            end: new Date(new Date(session.startTime).getTime() + (session.service?.duration || 60) * 60000),
            title: `${session.title} (${session.bookedCount}/${session.capacity})`,
        }));
    }, [initialSessions]);

    const eventPropGetter = useCallback((event: any) => {
        let backgroundColor = '#2563eb'; // Default Blue
        let border = 'none';

        if (event.status === 'CANCELLED') {
            backgroundColor = '#64748b'; // Slate
        } else if (event.service?.type === 'GROUP') {
            backgroundColor = '#8b5cf6'; // Violet
        } else if (event.service?.type === 'ONE_ON_ONE') {
            backgroundColor = '#059669'; // Emerald
        }

        if (event.bookedCount >= event.capacity) {
            border = '2px solid #ef4444'; // Red border if full
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border,
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '2px 4px'
            }
        };
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col h-[800px] relative overflow-hidden">

            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Master Calendar</h2>
                <button
                    onClick={() => router.push('/sessions/new')}
                    className="bg-primary hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-sm"
                >
                    + Add Session
                </button>
            </div>

            {/* Calendar Core */}
            <div className="flex-1">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={setView}
                    date={date}
                    onNavigate={setDate}
                    style={{ height: '100%' }}
                    eventPropGetter={eventPropGetter}
                    onSelectEvent={(event) => setSelectedSession(event)}
                    popup
                    DayLayoutAlgorithm="no-overlap"
                    className="font-sans text-sm text-slate-700"
                />
            </div>

            {/* Slide-over Detail Panel */}
            <div className={clsx("absolute inset-y-0 right-0 w-96 bg-surface shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-300 transform border-l border-slate-200 z-50 flex flex-col", selectedSession ? "translate-x-0" : "translate-x-full")}>
                {selectedSession && (
                    <>
                        {/* Slide-over Header */}
                        <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-start">
                            <div>
                                <span className={clsx("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block", selectedSession.service?.type === 'GROUP' ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700")}>
                                    {selectedSession.service?.type?.replace('_', ' ')}
                                </span>
                                <h3 className="text-xl font-bold text-primary">{selectedSession.title}</h3>
                                <span className={clsx("text-xs font-bold uppercase", selectedSession.status === 'OPEN' ? 'text-green-600' : 'text-red-500')}>
                                    Status: {selectedSession.status}
                                </span>
                            </div>
                            <button onClick={() => setSelectedSession(null)} className="text-slate-400 hover:text-primary">✕</button>
                        </div>

                        {/* Slide-over Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <Clock className="w-4 h-4 text-accent" />
                                    <span className="font-semibold text-primary">{format(selectedSession.start, 'MMM d, yyyy')}</span>
                                    <span>• {format(selectedSession.start, 'h:mm a')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <Activity className="w-4 h-4 text-accent" />
                                    <span>{selectedSession.service?.duration} Minutes</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <MapPin className="w-4 h-4 text-accent" />
                                    <span>{selectedSession.location || 'Location TBD'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <Users className="w-4 h-4 text-accent" />
                                    <span className="font-semibold">{selectedSession.bookedCount} / {selectedSession.capacity} Spots Booked</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-primary">Associated Bookings</h4>
                                    <button
                                        onClick={() => router.push(`/appointments?sessionId=${selectedSession.id}`)}
                                        className="text-xs font-bold text-accent hover:underline"
                                    >
                                        Manage All
                                    </button>
                                </div>

                                {/* Raw SQL/API needed to get bookings per session, but for the slideover we might just show a CTA or fetch them client-side if missing. Assuming we don't fetch deep nested bookings up front for performance, we show a CTA */}
                                <div className="bg-slate-100 rounded-xl p-4 text-center text-sm text-slate-500">
                                    <p>Click "Manage All" to review, confirm, or cancel bookings for this specific session.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}
