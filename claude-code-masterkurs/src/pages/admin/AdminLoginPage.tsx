import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { adminApi } from '../../lib/api';
import { Code2, Loader2, AlertCircle, Lock } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, verify admin and redirect
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    adminApi.getDashboard()
      .then(() => { if (!cancelled) navigate('/admin/dashboard', { replace: true }); })
      .catch(() => { if (!cancelled) setError('Keine Admin-Berechtigung'); });
    return () => { cancelled = true; };
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await login(email, password);
    if (!success) {
      setError('Login fehlgeschlagen. Überprüfe deine Zugangsdaten.');
      setLoading(false);
      return;
    }

    try {
      await adminApi.getDashboard();
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('Du hast keine Admin-Berechtigung.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin CMS</h1>
          <p className="mt-1 text-sm text-gray-400">Claude Code Masterkurs</p>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-8 shadow-xl backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-2 text-gray-300">
            <Lock className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Admin Login</h2>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Anmelden...
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-700 pt-4 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Zurück zur Startseite
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
