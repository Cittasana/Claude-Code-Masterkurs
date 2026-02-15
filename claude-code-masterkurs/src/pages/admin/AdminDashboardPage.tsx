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
  HelpCircle,
  Swords,
  Zap,
  FolderOpen,
  Rocket,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminDashboardData } from '../../lib/api';

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

  const stats = [
    { label: 'Total Users', value: data?.totalUsers ?? 0, icon: Users, color: 'blue' },
    { label: 'Aktive Abos', value: data?.activeSubscriptions ?? 0, icon: CreditCard, color: 'green' },
    { label: 'Lektionen', value: data?.lessonConfigsCount ?? 0, icon: BookOpen, color: 'purple', sub: data?.lektionenCount ? `+${data.lektionenCount} CMS` : undefined },
    { label: 'Tools', value: data?.toolsCount ?? 0, icon: Wrench, color: 'orange' },
  ];

  const contentStats = [
    { label: 'Quizzes', value: data?.quizzesCount ?? 0, icon: HelpCircle, color: 'indigo', href: '/admin/quizzes' },
    { label: 'Challenges', value: data?.challengesCount ?? 0, icon: Swords, color: 'red', href: '/admin/challenges' },
    { label: 'Features', value: data?.featuresCount ?? 0, icon: Zap, color: 'yellow', href: '/admin/features' },
    { label: 'Projekte', value: data?.projectConfigsCount ?? 0, icon: FolderOpen, color: 'cyan', href: '/admin/project-configs' },
    { label: 'Capstones', value: data?.capstoneConfigsCount ?? 0, icon: Rocket, color: 'pink', href: '/admin/capstone-configs' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Übersicht über deinen Claude Code Masterkurs</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.sub && <p className="mt-1 text-xs text-gray-500">{stat.sub}</p>}
              </div>
              <div className={`rounded-lg bg-${stat.color}-50 p-3`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Stats */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Content Übersicht</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {contentStats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <stat.icon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/lesson-configs"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50"
          >
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Lektionen</p>
              <p className="text-xs text-gray-600">Content verwalten</p>
            </div>
          </Link>
          <Link
            to="/admin/tools"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-purple-500 hover:bg-purple-50"
          >
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Tools verwalten</p>
              <p className="text-xs text-gray-600">{data?.toolsCount ?? 0} Tools</p>
            </div>
          </Link>
          <Link
            to="/admin/quizzes"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-green-500 hover:bg-green-50"
          >
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Quizzes</p>
              <p className="text-xs text-gray-600">{data?.quizzesCount ?? 0} Quizzes</p>
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
