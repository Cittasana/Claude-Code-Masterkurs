import { useState, useEffect } from 'react';
import {
  Settings,
  Server,
  Database,
  Globe,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { healthApi } from '../../lib/api';

export function AdminSettingsPage() {
  const [health, setHealth] = useState<{ status: string; database: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    healthApi.check()
      .then((res) => setHealth(res))
      .finally(() => setLoading(false));
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const env = import.meta.env.MODE;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Einstellungen</h1>
        <p className="mt-1 text-sm text-gray-600">System-Informationen und externe Services</p>
      </div>

      {/* System Info */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Environment</h3>
          </div>
          <p className="text-lg font-bold text-gray-900 capitalize">{env}</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-900">Datenbank</h3>
          </div>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : health?.database === 'connected' ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">Verbunden</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">Nicht verbunden</span>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-900">API URL</h3>
          </div>
          <p className="break-all text-sm font-mono text-gray-600">{apiUrl}</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            <h3 className="text-sm font-semibold text-gray-900">API Status</h3>
          </div>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : health?.status === 'ok' ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">{health?.status || 'Offline'}</span>
            </div>
          )}
        </div>
      </div>

      {/* External Services */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Externe Services</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <span className="text-lg font-bold text-purple-600">S</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Stripe Dashboard</p>
              <p className="text-xs text-gray-500">Zahlungen & Abos</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
          <a
            href="https://discord.com/channels"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <span className="text-lg font-bold text-indigo-600">D</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Discord</p>
              <p className="text-xs text-gray-500">Community Server</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
          <a
            href="https://sentry.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <span className="text-lg font-bold text-red-600">S</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Sentry</p>
              <p className="text-xs text-gray-500">Error Tracking</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Admin Profil</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white">
            CO
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">Cosmo</p>
            <p className="text-sm text-gray-500">Admin</p>
            <p className="text-xs text-gray-400">office@cittasana.de</p>
          </div>
        </div>
      </div>
    </div>
  );
}
