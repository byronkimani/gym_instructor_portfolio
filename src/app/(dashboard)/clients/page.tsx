"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Client {
  email: string;
  name: string;
  phone?: string | null;
  totalBookings: number;
  confirmedBookings: number;
  firstBookingDate?: string | null;
  recentActivity?: boolean;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clients');
      const json = await res.json();
      setClients(json.clients || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Client Directory</h1>
          <p className="text-text-muted mt-1">Manage your active and past clients.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-white placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/50 focus:border-accent sm:text-sm transition-all shadow-sm"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid view vs Table view choice: Cards often look better on mobile, table on desktop */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[400px] relative overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <RefreshCw className="h-8 w-8 text-accent animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-4" />
            <p className="font-bold">{error}</p>
            <button onClick={fetchClients} className="mt-4 text-sm font-semibold text-primary underline">Retry</button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <User className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-semibold">No clients found</p>
            {search && <p className="text-sm mt-1">Try adjusting your search query.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Client Info</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Contact</th>
                  <th className="px-6 py-4 text-center">Total Sessions</th>
                  <th className="px-6 py-4 text-center">Confirmed</th>
                  <th className="px-6 py-4 hidden md:table-cell text-right">Last Active</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client: Client) => (
                  <tr key={client.email} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          {client.recentActivity && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white" title="Active recently"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-primary">{client.name}</div>
                          <div className="text-sm text-slate-500 sm:hidden">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-slate-800">{client.email}</div>
                      <div className="text-xs text-slate-500">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{client.totalBookings}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">{client.confirmedBookings}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-right text-slate-500 text-xs">
                      {client.firstBookingDate ? format(new Date(client.firstBookingDate), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/clients/${encodeURIComponent(client.email)}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-accent hover:bg-accent/10 transition-colors">
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
