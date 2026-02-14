import { useState, useEffect } from 'react';
import {
  BarChart3,
  Loader2,
  AlertCircle,
  Users,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface AnalyticsOverview {
  totalEvents: number;
  events7d: number;
  events30d: number;
  activeUsers: number;
  eventsByType: { type: string; count: number }[];
  recentEvents: Array<{
    id: string;
    type: string;
    timestamp: string;
    metadata: unknown;
    user: { displayName: string; email: string };
  }>;
}

const eventTypeLabels: Record<string, string> = {
  session_start: 'Session Start',
  lesson_complete: 'Lektion abgeschlossen',
  quiz_complete: 'Quiz abgeschlossen',
  project_complete: 'Projekt abgeschlossen',
  review_complete: 'Review abgeschlossen',
};

export function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getAnalyticsOverview()
      .then((res) => setData(res.data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Fehler</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxEventCount = Math.max(...data.eventsByType.map((e) => e.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">Platform-weite Metriken und Statistiken</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalEvents.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Letzte 7 Tage</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{data.events7d.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Letzte 30 Tage</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">{data.events30d.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive User (30d)</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">{data.activeUsers}</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Event Type Breakdown */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Events nach Typ</h2>
        <div className="space-y-3">
          {data.eventsByType.map((event) => (
            <div key={event.type} className="flex items-center gap-4">
              <div className="w-40 text-sm font-medium text-gray-700">
                {eventTypeLabels[event.type] || event.type}
              </div>
              <div className="flex-1">
                <div className="h-6 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${(event.count / maxEventCount) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-gray-900">
                {event.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Letzte Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Typ</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Zeitpunkt</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentEvents.slice(0, 20).map((event) => (
                <tr key={event.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {eventTypeLabels[event.type] || event.type}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm text-gray-700">{event.user.displayName}</p>
                    <p className="text-xs text-gray-500">{event.user.email}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
