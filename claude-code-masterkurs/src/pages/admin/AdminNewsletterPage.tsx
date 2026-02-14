import { useState, useEffect } from 'react';
import {
  Mail,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface NewsletterSubscriber {
  id: string;
  email: string;
  displayName: string | null;
  status: string;
  source: string;
  subscribedAt: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
}

interface NewsletterStats {
  total: number;
  active: number;
  pending: number;
  unsubscribed: number;
}

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'active', label: 'Aktiv' },
  { value: 'pending', label: 'Ausstehend' },
  { value: 'unsubscribed', label: 'Abgemeldet' },
];

export function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminApi.getNewsletterSubscribers({ status: statusFilter }),
      adminApi.getNewsletterStats(),
    ])
      .then(([subsRes, statsRes]) => {
        setSubscribers(subsRes.data);
        setStats(statsRes.data);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Subscriber wirklich entfernen?')) return;
    try {
      await adminApi.deleteNewsletterSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      if (stats) setStats({ ...stats, total: stats.total - 1 });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    }
  };

  function statusBadge(status: string) {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700"><CheckCircle2 className="h-3 w-3" />Aktiv</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700"><Clock className="h-3 w-3" />Ausstehend</span>;
      case 'unsubscribed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700"><XCircle className="h-3 w-3" />Abgemeldet</span>;
      default:
        return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">{status}</span>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Newsletter</h1>
        <p className="mt-1 text-sm text-gray-600">Newsletter-Subscriber verwalten</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Gesamt</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Aktiv</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Ausstehend</p>
            <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Abgemeldet</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{stats.unsubscribed}</p>
          </div>
        </div>
      )}

      {/* Status Filter */}
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
        ) : subscribers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Mail className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Subscriber</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Quelle</th>
                  <th className="px-6 py-3">Angemeldet</th>
                  <th className="px-6 py-3">Bestätigt</th>
                  <th className="px-6 py-3">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sub.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{sub.displayName || '-'}</td>
                    <td className="px-6 py-4">{statusBadge(sub.status)}</td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{sub.source}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(sub.subscribedAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {sub.confirmedAt ? new Date(sub.confirmedAt).toLocaleDateString('de-DE') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
