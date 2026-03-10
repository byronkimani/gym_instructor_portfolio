'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Mail, Phone, ChevronRight, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ClientRow {
  clientEmail: string;
  clientName: string;
  clientPhone?: string | null;
  _count: { id: number };
  confirmedBookings?: number;
  _min: { createdAt: string | null };
}

interface ClientTableProps {
  clients: ClientRow[];
}

export default function ClientTable({ clients }: ClientTableProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.clientName.toLowerCase().includes(q) ||
        c.clientEmail.toLowerCase().includes(q)
    );
  }, [clients, search]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        <input
          type="search"
          id="client-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-medium"
        />
        {search && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-slate-200" />
            <p className="text-lg font-semibold">No clients found</p>
            {search && (
              <p className="text-sm mt-1 text-text-muted">
                No results for &ldquo;{search}&rdquo;.{' '}
                <button onClick={() => setSearch('')} className="text-accent hover:underline font-semibold">
                  Clear search
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" aria-label="Client directory">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4">Client</th>
                  <th scope="col" className="px-6 py-4">Contact</th>
                  <th scope="col" className="px-6 py-4 text-center">Total Bookings</th>
                  <th scope="col" className="px-6 py-4 text-center">Confirmed</th>
                  <th scope="col" className="px-6 py-4">First Booking</th>
                  <th scope="col" className="px-6 py-4 sr-only">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((client) => (
                  <tr
                    key={client.clientEmail}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/clients/${encodeURIComponent(client.clientEmail)}`)
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Avatar + Name */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0"
                          aria-hidden="true"
                        >
                          {client.clientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-primary">{client.clientName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${client.clientEmail}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-accent hover:underline text-xs"
                          aria-label={`Email ${client.clientName}`}
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {client.clientEmail}
                        </a>
                        {client.clientPhone && (
                          <a
                            href={`tel:${client.clientPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-primary text-xs"
                            aria-label={`Call ${client.clientName}`}
                          >
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            {client.clientPhone}
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-primary">{client._count.id}</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          'font-bold',
                          (client.confirmedBookings ?? 0) > 0 ? 'text-green-600' : 'text-slate-400'
                        )}
                      >
                        {client.confirmedBookings ?? '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {client._min.createdAt
                        ? format(new Date(client._min.createdAt), 'MMM d, yyyy')
                        : '—'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/clients/${encodeURIComponent(client.clientEmail)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-300 group-hover:text-primary group-hover:bg-slate-100 transition-colors"
                        aria-label={`View ${client.clientName}'s profile`}
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
    </div>
  );
}
