"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Check, X, Ban, FileText, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

// Simple modal component for Confirm/Decline/Cancel actions
function ActionModal({
  isOpen,
  onClose,
  title,
  actionType,
  onConfirm,
  loading
}: {
  isOpen: boolean,
  onClose: () => void,
  title: string,
  actionType: 'CONFIRM' | 'DECLINE' | 'CANCEL',
  onConfirm: (notes: string) => void,
  loading: boolean
}) {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-muted mb-6">
          This will trigger an automated email to the client {actionType === 'CONFIRM' ? 'with payment instructions.' : 'notifying them.'}
        </p>

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Optional Note to Client (included in email)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            rows={3}
            placeholder="E.g. Validated! Looking forward to the session."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 font-bold text-slate-500 hover:text-primary transition-colors disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            onClick={() => onConfirm(notes)}
            disabled={loading}
            className={clsx(
              "px-6 py-2 rounded-xl font-bold text-white transition-all shadow-sm flex items-center gap-2",
              actionType === 'CONFIRM' ? 'bg-green-600 hover:bg-green-700' :
                actionType === 'DECLINE' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-800'
            )}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
            {actionType === 'CONFIRM' ? 'Confirm Booking' :
              actionType === 'DECLINE' ? 'Decline Request' : 'Cancel Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  status: string;
  createdAt: string;
  session: {
    id: string;
    title: string | null;
    startTime: string;
    service: { title: string; type: string };
  };
}

const TABS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'DECLINED'];

export default function AppointmentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'ALL');
  const [sessionIdFilter, setSessionIdFilter] = useState(searchParams.get('sessionId') || '');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    booking: Booking | null;
    actionType: 'CONFIRM' | 'DECLINE' | 'CANCEL' | null;
  }>({ isOpen: false, booking: null, actionType: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = `/api/bookings`;
      const params = new URLSearchParams();
      if (activeTab !== 'ALL') params.append('status', activeTab);
      if (sessionIdFilter) params.append('sessionId', sessionIdFilter);

      const res = await fetch(`${url}?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');

      const json = await res.json();
      setBookings(json.bookings || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const params = new URLSearchParams();
    if (activeTab !== 'ALL') params.set('tab', activeTab);
    if (sessionIdFilter) params.set('sessionId', sessionIdFilter);
    const qs = params.toString();
    router.replace(qs ? `/appointments?${qs}` : '/appointments', { scroll: false });
  }, [activeTab, sessionIdFilter]);

  // Handle Action Submit
  const handleAction = async (notes: string) => {
    if (!modalState.booking || !modalState.actionType) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${modalState.booking.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: modalState.actionType === 'CONFIRM' ? 'CONFIRMED' :
            modalState.actionType === 'DECLINE' ? 'DECLINED' : 'CANCELLED',
          statusNote: notes || undefined
        })
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Optimistic UI update
      setBookings(prev => prev.map(b => {
        if (modalState.booking && b.id === modalState.booking.id) {
          return {
            ...b, status: modalState.actionType === 'CONFIRM' ? 'CONFIRMED' :
              modalState.actionType === 'DECLINE' ? 'DECLINED' : 'CANCELLED'
          };
        }
        return b;
      }));

      setModalState({ isOpen: false, booking: null, actionType: null });
    } catch (err: unknown) {
      alert(`Error updating booking: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const renderBadge = (status: string) => {
    const config: Record<string, { t: string, c: string }> = {
      PENDING: { t: 'Pending', c: 'bg-yellow-100 text-yellow-800' },
      CONFIRMED: { t: 'Confirmed', c: 'bg-green-100 text-green-800' },
      DECLINED: { t: 'Declined', c: 'bg-red-100 text-red-800' },
      CANCELLED: { t: 'Cancelled', c: 'bg-slate-100 text-slate-800' },
    };
    const c = config[status] || { t: status, c: 'bg-slate-100 text-slate-800' };
    return <span className={`px-3 py-1 text-xs font-bold rounded-full ${c.c}`}>{c.t}</span>;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Appointments</h1>
          <p className="text-text-muted mt-1">Manage all client booking requests and statuses.</p>
        </div>
        {sessionIdFilter && (
          <button
            onClick={() => setSessionIdFilter('')}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-1 rounded-full inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear Session Filter
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-100">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-colors",
              activeTab === tab
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-500 hover:bg-slate-100 hover:text-primary border border-slate-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <RefreshCw className="h-8 w-8 text-accent animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-4" />
            <p className="font-bold">{error}</p>
            <button onClick={fetchBookings} className="mt-4 text-sm font-semibold text-primary underline">Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-semibold">No appointments found</p>
            <p className="text-sm mt-1">Try adjusting your filters or checking back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Session Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-primary">{booking.clientName}</div>
                      <Link href={`/clients/${encodeURIComponent(booking.clientEmail)}`} className="text-xs text-accent hover:underline">
                        {booking.clientEmail}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{booking.session.title}</div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(booking.session.startTime), 'MMM d, yyyy • h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {format(new Date(booking.createdAt), 'MMM d, h:mm a')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => setModalState({ isOpen: true, booking, actionType: 'CONFIRM' })}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors tooltip-trigger"
                            title="Confirm request"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ isOpen: true, booking, actionType: 'DECLINE' })}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="Decline request"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setModalState({ isOpen: true, booking, actionType: 'CANCEL' })}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white transition-colors"
                          title="Cancel booking"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}

                      {/* Arrow link to full detail page */}
                      <Link href={`/appointments/${booking.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-primary transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ActionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, booking: null, actionType: null })}
        actionType={modalState.actionType!}
        title={
          modalState.actionType === 'CONFIRM' ? `Confirm booking for ${modalState.booking?.clientName}?` :
            modalState.actionType === 'DECLINE' ? `Decline request from ${modalState.booking?.clientName}?` :
              `Cancel confirmed booking for ${modalState.booking?.clientName}?`
        }
        onConfirm={handleAction}
        loading={actionLoading}
      />

    </div>
  );
}
