import { useState, useEffect } from 'react';
import {
  CreditCard,
  Loader2,
  AlertCircle,
  Crown,
  Clock,
  XCircle,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface AdminSubscription {
  id: string;
  userId: string;
  status: string;
  isLifetime: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  user: { id: string; email: string; displayName: string };
  promoCode: { code: string } | null;
}

interface SubStats {
  active: number;
  lifetime: number;
  trialing: number;
  canceled: number;
  total: number;
}

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'active', label: 'Aktiv' },
  { value: 'lifetime', label: 'Lifetime' },
  { value: 'trialing', label: 'Trial' },
  { value: 'canceled', label: 'Gekündigt' },
];

export function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [stats, setStats] = useState<SubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminApi.getSubscriptions({ status: statusFilter }),
      adminApi.getSubscriptionStats(),
    ])
      .then(([subsRes, statsRes]) => {
        setSubscriptions(subsRes.data);
        setStats(statsRes.data);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  function statusBadge(status: string, isLifetime: boolean) {
    if (isLifetime) return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700"><Crown className="h-3 w-3" />Lifetime</span>;
    switch (status) {
      case 'active': return <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Aktiv</span>;
      case 'trialing': return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700"><Clock className="h-3 w-3" />Trial</span>;
      case 'canceled': return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700"><XCircle className="h-3 w-3" />Gekündigt</span>;
      default: return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">{status}</span>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-600">Übersicht aller Abonnements (read-only)</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Gesamt</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Aktiv</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Lifetime</p>
            <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.lifetime}</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Trial</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">{stats.trialing}</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Gekündigt</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{stats.canceled}</p>
          </div>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Subscriptions</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Zeitraum</th>
                  <th className="px-6 py-3">Promo Code</th>
                  <th className="px-6 py-3">Erstellt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{sub.user.displayName}</p>
                      <p className="text-xs text-gray-500">{sub.user.email}</p>
                    </td>
                    <td className="px-6 py-4">{statusBadge(sub.status, sub.isLifetime)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sub.currentPeriodStart && sub.currentPeriodEnd ? (
                        <>
                          {new Date(sub.currentPeriodStart).toLocaleDateString('de-DE')} –{' '}
                          {new Date(sub.currentPeriodEnd).toLocaleDateString('de-DE')}
                        </>
                      ) : sub.isLifetime ? 'Unbegrenzt' : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {sub.promoCode ? (
                        <span className="rounded bg-purple-100 px-2 py-0.5 font-mono text-xs text-purple-700">
                          {sub.promoCode.code}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString('de-DE')}
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
