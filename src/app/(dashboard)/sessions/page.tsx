"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Plus, Calendar, Clock, MapPin, Users, Trash2, Edit, RefreshCw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions'); // By default GET /api/sessions returns OPEN without date filter if instructor, but actually public is ?status=OPEN. For dashboard, we want ALL.
      // Wait, standard GET /api/sessions only returns OPEN by default for guests. Let's fetch all.
      // We will add ?all=true or similar to the API so we can fetch PAST and CANCELLED sessions too,
      // but standard GET /api/sessions without filters actually returns all if instructor according to our API design.
      const fetchRes = await fetch('/api/sessions');
      if (!fetchRes.ok) throw new Error('Failed to fetch sessions');
      const json = await fetchRes.json();
      setSessions(json.sessions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to completely delete "${title}"?\n\nThis will also delete ALL associated bookings! Consider editing it or marking its capacity full instead.`)) return;

    try {
      // Assuming a DELETE /api/sessions/[id] route exists or we'll build it
      const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete session');

      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(`Error deleting session: ${err.message}`);
    }
  };

  const now = new Date();

  // Sort and filter
  const upcoming = sessions
    .filter(s => new Date(s.startTime) >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const past = sessions
    .filter(s => new Date(s.startTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  // Render Row Helper
  const SessionRow = ({ session }: { session: any }) => {
    const isFull = session.bookedCount >= session.capacity;
    return (
      <tr className="hover:bg-slate-50/50 transition-colors group">
        <td className="px-6 py-4">
          <div className="font-bold text-primary mb-1">{session.title}</div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(session.startTime), 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(session.startTime), 'h:mm a')}</span>
          </div>
        </td>
        <td className="px-6 py-4 hidden sm:table-cell text-sm">
          <span className="font-semibold text-slate-700">{session.service?.type?.replace('_', ' ')}</span>
          <div className="text-xs text-slate-500 mt-0.5">{session.service?.duration} Min</div>
        </td>
        <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-600">
          <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> {session.location || 'N/A'}</div>
        </td>
        <td className="px-6 py-4 text-center">
          <div className="flex flex-col items-center">
            <span className={`font-bold text-sm ${isFull ? 'text-red-500' : 'text-primary'}`}>
              {session.bookedCount} <span className="text-slate-400 font-normal">/ {session.capacity}</span>
            </span>
            {isFull && <span className="text-[10px] uppercase font-bold text-red-500 tracking-widest mt-0.5">Full</span>}
          </div>
        </td>
        <td className="px-6 py-4 text-right space-x-2">
          {/* Edit route (Optional/future enhancement) */}
          <button className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors" title="Edit Session (Not Implemented)">
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(session.id, session.title)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Sessions Manager</h1>
          <p className="text-text-muted mt-1">Create and manage your available training slots.</p>
        </div>
        <Link
          href="/sessions/new"
          className="bg-primary hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Session
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[400px] relative overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <RefreshCw className="h-8 w-8 text-accent animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-4" />
            <p className="font-bold">{error}</p>
            <button onClick={fetchSessions} className="mt-4 text-sm font-semibold text-primary underline">Retry</button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <Settings className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-semibold">No sessions created yet</p>
            <Link href="/sessions/new" className="text-sm mt-2 text-accent hover:underline font-bold inline-block">Create your first structured session</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Upcoming Session</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Type & Duration</th>
                  <th className="px-6 py-4 hidden md:table-cell">Location</th>
                  <th className="px-6 py-4 text-center">Capacity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcoming.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No upcoming sessions.</td>
                  </tr>
                ) : (
                  upcoming.map(session => <SessionRow key={session.id} session={session} />)
                )}
              </tbody>
            </table>

            {/* Past Sessions Accordion */}
            {past.length > 0 && (
              <div className="border-t border-slate-200">
                <button
                  onClick={() => setShowPast(!showPast)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 font-bold"
                >
                  <span>View Past Sessions ({past.length})</span>
                  {showPast ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>

                {showPast && (
                  <table className="w-full text-sm text-left opacity-75">
                    <tbody className="divide-y divide-slate-100">
                      {past.map(session => <SessionRow key={session.id} session={session} />)}
                    </tbody>
                  </table>
                )}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
