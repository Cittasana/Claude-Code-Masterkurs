"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Euro,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage() {
  // Mock Data - In Produktion von API holen
  const stats = {
    totalUsers: 156,
    activeUsers: 123,
    totalRevenue: 12450,
    mrr: 3240,
    completedLessons: 1823,
    avgProgress: 64,
  };

  const recentActivity = [
    {
      type: "user",
      message: "Neuer User registriert: max.mueller@example.com",
      time: "Vor 5 Minuten",
    },
    {
      type: "lesson",
      message: 'Lektion "MCP Servers" wurde aktualisiert',
      time: "Vor 23 Minuten",
    },
    {
      type: "payment",
      message: "Neue Zahlung: €24 (Monatlich)",
      time: "Vor 1 Stunde",
    },
    {
      type: "error",
      message: "API-Fehler: Rate Limit erreicht",
      time: "Vor 2 Stunden",
    },
  ];

  const popularLessons = [
    { title: "01 - Einführung in Claude Code", views: 234, completion: 89 },
    { title: "15 - MCP Server Integration", views: 189, completion: 72 },
    { title: "27 - Eigene Projekte bauen", views: 156, completion: 68 },
    { title: "42 - Puppeteer MCP", views: 134, completion: 54 },
    { title: "43 - Slack MCP", views: 128, completion: 51 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Übersicht über deinen Claude Code Masterkurs
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <ArrowUp className="h-4 w-4" />
              12%
            </span>
            <span className="text-gray-600">vs. letzter Monat</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <ArrowUp className="h-4 w-4" />
              8%
            </span>
            <span className="text-gray-600">in den letzten 7 Tagen</span>
          </div>
        </div>

        {/* MRR */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MRR</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                €{stats.mrr.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <Euro className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <ArrowUp className="h-4 w-4" />
              €240
            </span>
            <span className="text-gray-600">vs. letzter Monat</span>
          </div>
        </div>

        {/* Avg Progress */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ø Fortschritt</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.avgProgress}%</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-red-600">
              <ArrowDown className="h-4 w-4" />
              3%
            </span>
            <span className="text-gray-600">vs. letzter Monat</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Neueste Aktivitäten</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Alle anzeigen
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-lg p-2 ${
                    activity.type === "user"
                      ? "bg-blue-50"
                      : activity.type === "lesson"
                      ? "bg-green-50"
                      : activity.type === "payment"
                      ? "bg-purple-50"
                      : "bg-red-50"
                  }`}
                >
                  {activity.type === "user" && <Users className="h-4 w-4 text-blue-600" />}
                  {activity.type === "lesson" && <BookOpen className="h-4 w-4 text-green-600" />}
                  {activity.type === "payment" && <Euro className="h-4 w-4 text-purple-600" />}
                  {activity.type === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Lessons */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Beliebte Lektionen</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Analytics
            </button>
          </div>
          <div className="space-y-4">
            {popularLessons.map((lesson, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                  <span className="text-sm text-gray-600">{lesson.views} Views</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${lesson.completion}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{lesson.completion}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Neue Lektion</p>
              <p className="text-xs text-gray-600">Erstelle Content</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-purple-500 hover:bg-purple-50">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-xs text-gray-600">Metriken ansehen</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-green-500 hover:bg-green-50">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">User Management</p>
              <p className="text-xs text-gray-600">Nutzer verwalten</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 p-4 text-left transition-colors hover:border-orange-500 hover:bg-orange-50">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div>
              <p className="font-medium text-gray-900">Research Agent</p>
              <p className="text-xs text-gray-600">Recherche starten</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
