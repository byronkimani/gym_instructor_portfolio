"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import clsx from 'clsx';

type Session = {
    id: string;
    title: string;
    startTime: string;
    duration: number;
    location: string | null;
    capacity: number;
    bookedCount: number;
    spotsLeft: number;
    service: { type: string; duration: number };
};

export default function ScheduleGrid({ initialSessions }: { initialSessions: Session[] }) {
    const [filter, setFilter] = useState<'ALL' | 'ONE_ON_ONE' | 'GROUP'>('ALL');

    const filteredSessions = initialSessions.filter(session => {
        if (filter === 'ALL') return true;
        return session.service.type === filter;
    });

    return (
        <div>
            {/* Filters (Client-side Island) */}
            <div className="mb-12 flex justify-center">
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setFilter('ALL')}
                        className={clsx("rounded-full px-6 py-2 text-sm font-bold transition-all", filter === 'ALL' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary')}
                    >
                        All Sessions
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter('ONE_ON_ONE')}
                        className={clsx("rounded-full px-6 py-2 text-sm font-bold transition-all", filter === 'ONE_ON_ONE' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary')}
                    >
                        1-on-1
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter('GROUP')}
                        className={clsx("rounded-full px-6 py-2 text-sm font-bold transition-all", filter === 'GROUP' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary')}
                    >
                        Group Classes
                    </button>
                </div>
            </div>

            {/* Grid */}
            {filteredSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.map((session) => {
                        const isFull = session.spotsLeft <= 0;
                        const dateObj = new Date(session.startTime);

                        return (
                            <div key={session.id} className="card-elevate flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
                                <div className="mb-4 flex items-start justify-between gap-2">
                                    <span className={clsx("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider", session.service.type === 'ONE_ON_ONE' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary")}>
                                        {session.service.type.replace('_', ' ')}
                                    </span>
                                    <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-text-muted">
                                        {session.service.duration} min
                                    </span>
                                </div>

                                <h4 className="font-display mb-2 text-xl font-bold text-primary">{session.title}</h4>

                                <div className="space-y-3 mb-6 bg-surface p-4 rounded-xl flex-grow">
                                    <div className="flex items-center text-primary text-sm gap-3 font-semibold">
                                        <Calendar className="h-5 w-5 text-accent" />
                                        <span>{dateObj.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center text-text-muted text-sm gap-3">
                                        <Clock className="h-5 w-5 text-slate-400" />
                                        <span>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center text-text-muted text-sm gap-3">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                        <span>{session.location || 'TBA'}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span className="text-slate-500">Capacity</span>
                                        <span className={isFull ? 'text-red-500' : 'text-green-600'}>
                                            {session.spotsLeft} / {session.capacity} spots left
                                        </span>
                                    </div>
                                    <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={clsx("h-full rounded-full transition-all", isFull ? 'bg-red-500' : 'bg-green-500')}
                                            style={{ width: `${Math.min(100, (session.bookedCount / session.capacity) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <Link
                                    href={isFull ? '#' : `/book?sessionId=${session.id}`}
                                    className={clsx(
                                        "w-full text-center font-bold py-3 rounded-xl transition-all shadow-sm block",
                                        isFull
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                            : "bg-primary hover:bg-slate-800 text-white shadow-md hover:shadow-lg"
                                    )}
                                    aria-disabled={isFull}
                                    onClick={(e) => isFull && e.preventDefault()}
                                >
                                    {isFull ? 'Fully Booked' : 'Book Now'}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center bg-white p-16 rounded-3xl border border-dashed border-slate-300 max-w-2xl mx-auto shadow-sm">
                    <Info className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-2">No Sessions Found</h3>
                    <p className="text-text-muted">There are currently no open sessions for this filter. Please check back later or contact me directly to schedule something.</p>
                </div>
            )}
        </div>
    );
}
