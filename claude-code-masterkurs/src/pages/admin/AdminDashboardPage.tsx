import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Wrench,
  CreditCard,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminDashboardData } from '../../lib/api';
import { lessons } from '../../data/lessons';
import { allTools } from '../../data/tools';

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || 'Fehler beim Laden'))
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Übersicht über deinen Claude Code Masterkurs</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data?.totalUsers ?? 0}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Abos</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data?.activeSubscriptions ?? 0}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lektionen</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{lessons.length}</p>
              {(data?.lektionenCount ?? 0) > 0 && (
                <p className="mt-1 text-xs text-gray-500">+{data?.lektionenCount} CMS</p>
              )}
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tools</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{allTools.length}</p>
              {(data?.toolsCount ?? 0) > 0 && (
                <p className="mt-1 text-xs text-gray-500">+{data?.toolsCount} CMS</p>
              )}
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <Wrench className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/lektionen/new"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50"
          >
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Neue Lektion</p>
              <p className="text-xs text-gray-600">Erstelle Content</p>
            </div>
          </Link>
          <Link
            to="/admin/tools"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-purple-500 hover:bg-purple-50"
          >
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Tools verwalten</p>
              <p className="text-xs text-gray-600">{allTools.length} Tools</p>
            </div>
          </Link>
          <Link
            to="/admin/lektionen"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-green-500 hover:bg-green-50"
          >
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Lektionen</p>
              <p className="text-xs text-gray-600">{lessons.length} Lektionen</p>
            </div>
          </Link>
          <Link
            to="/admin/agent"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-orange-500 hover:bg-orange-50"
          >
            <Sparkles className="h-8 w-8 text-orange-600" />
            <div>
              <p className="font-medium text-gray-900">Agent Monitor</p>
              <p className="text-xs text-gray-600">Agent überwachen</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
