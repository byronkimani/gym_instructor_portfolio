'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Check, X, Ban, ChevronRight, RefreshCw, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import BookingStatusBadge from './BookingStatusBadge';

type ActionType = 'CONFIRM' | 'DECLINE' | 'CANCEL';

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  notes?: string | null;
  status: string;
  statusNote?: string | null;
  createdAt: string;
  session: {
    id: string;
    title: string | null;
    startTime: string;
    service: { title: string; type: string };
  };
}

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionType: ActionType;
  onConfirm: (notes: string) => void;
  loading: boolean;
}

function ActionModal({ isOpen, onClose, title, actionType, onConfirm, loading }: ActionModalProps) {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const colors: Record<ActionType, string> = {
    CONFIRM: 'bg-green-600 hover:bg-green-700',
    DECLINE: 'bg-red-600 hover:bg-red-700',
    CANCEL: 'bg-slate-700 hover:bg-slate-800',
  };
  const labels: Record<ActionType, string> = {
    CONFIRM: 'Confirm Booking',
    DECLINE: 'Decline Request',
    CANCEL: 'Cancel Booking',
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 id="modal-title" className="text-xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-muted mb-6">
          This will send an automated email to the client{' '}
          {actionType === 'CONFIRM' ? 'with M-Pesa payment instructions.' : 'notifying them of the update.'}
        </p>

        <div className="mb-6">
          <label htmlFor="action-note" className="block text-sm font-bold text-slate-700 mb-2">
            Note to client <span className="font-normal text-slate-400">(optional — included in email)</span>
          </label>
          <textarea
            id="action-note"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-none"
            rows={3}
            placeholder="E.g. Great! Looking forward to seeing you. Please bring a mat."
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
            className={cn(
              'px-6 py-2 rounded-xl font-bold text-white transition-all flex items-center gap-2',
              colors[actionType]
            )}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {labels[actionType]}
          </button>
        </div>
      </div>
    </div>
  );
}

const TABS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'DECLINED'] as const;

interface AppointmentTableProps {
  initialBookings?: Booking[];
  defaultTab?: string;
  defaultSessionFilter?: string;
}

export default function AppointmentTable({
  initialBookings = [],
  defaultTab = 'ALL',
  defaultSessionFilter = '',
}: AppointmentTableProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sessionFilter] = useState(defaultSessionFilter);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    booking: Booking | null;
    actionType: ActionType | null;
  }>({ isOpen: false, booking: null, actionType: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async (tab: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (tab !== 'ALL') params.set('status', tab);
      if (sessionFilter) params.set('sessionId', sessionFilter);
      const res = await fetch(`/api/bookings?${params}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const json = await res.json();
      setBookings(json.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    fetchBookings(tab);
  };

  const handleAction = async (notes: string) => {
    if (!modal.booking || !modal.actionType) return;
    setActionLoading(true);
    try {
      const statusMap: Record<ActionType, string> = {
        CONFIRM: 'CONFIRMED',
        DECLINE: 'DECLINED',
        CANCEL: 'CANCELLED',
      };
      const res = await fetch(`/api/bookings/${modal.booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusMap[modal.actionType], statusNote: notes || undefined }),
      });
      if (!res.ok) throw new Error('Failed to update booking');
      // Optimistic update
      const newStatus = statusMap[modal.actionType];
      setBookings((prev) =>
        prev.map((b) => (b.id === modal.booking!.id ? { ...b, status: newStatus } : b))
      );
      setModal({ isOpen: false, booking: null, actionType: null });
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={cn(
              'px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-colors',
              activeTab === tab
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-primary border border-slate-200'
            )}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <RefreshCw className="h-7 w-7 text-accent animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="p-12 text-center text-red-500 flex flex-col items-center gap-3">
            <AlertCircle className="h-8 w-8" />
            <p className="font-bold">{error}</p>
            <button onClick={() => fetchBookings(activeTab)} className="text-sm font-semibold text-primary underline">Retry</button>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="p-16 text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-semibold">No appointments found</p>
            <p className="text-sm mt-1 text-text-muted">Try changing the filter or check back later.</p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" aria-label="Appointments table">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4">Client</th>
                  <th scope="col" className="px-6 py-4">Session</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Submitted</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-primary">{booking.clientName}</div>
                      <Link
                        href={`/clients/${encodeURIComponent(booking.clientEmail)}`}
                        className="text-xs text-accent hover:underline"
                      >
                        {booking.clientEmail}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {booking.session.title || booking.session.service.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(booking.session.startTime), 'MMM d, yyyy • h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {format(new Date(booking.createdAt), 'MMM d, h:mm a')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => setModal({ isOpen: true, booking, actionType: 'CONFIRM' })}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                            title="Confirm booking"
                            aria-label={`Confirm booking for ${booking.clientName}`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setModal({ isOpen: true, booking, actionType: 'DECLINE' })}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="Decline request"
                            aria-label={`Decline request from ${booking.clientName}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setModal({ isOpen: true, booking, actionType: 'CANCEL' })}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white transition-colors"
                          title="Cancel booking"
                          aria-label={`Cancel booking for ${booking.clientName}`}
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      <Link
                        href={`/appointments/${booking.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-primary transition-colors"
                        aria-label="View booking details"
                      >
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

      {/* Modal */}
      {modal.actionType && (
        <ActionModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ isOpen: false, booking: null, actionType: null })}
          actionType={modal.actionType}
          title={
            modal.actionType === 'CONFIRM'
              ? `Confirm booking for ${modal.booking?.clientName}?`
              : modal.actionType === 'DECLINE'
              ? `Decline request from ${modal.booking?.clientName}?`
              : `Cancel booking for ${modal.booking?.clientName}?`
          }
          onConfirm={handleAction}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
