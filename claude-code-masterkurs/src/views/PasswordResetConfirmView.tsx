import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
import { authApi, ApiError } from '../lib/api';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

export default function PasswordResetConfirmView() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (!token) {
      setError('Ungültiger Reset-Link');
      return;
    }

    setLoading(true);

    try {
      await authApi.confirmPasswordReset(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="apple-card text-center">
            <div className="w-16 h-16 bg-apple-success/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-apple-text mb-4">
              Passwort erfolgreich zurückgesetzt!
            </h2>
            <p className="text-apple-textSecondary mb-6 text-sm">
              Du kannst dich jetzt mit deinem neuen Passwort anmelden.
            </p>
            <p className="text-sm text-apple-muted">
              Du wirst automatisch zur Login-Seite weitergeleitet...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <ClaudeCodeLogo size="md" showSubtitle={false} className="mb-8" />
          <div className="eyebrow center mb-5"><KeyRound size={12} /><span>Neues Passwort</span></div>
          <h1 className="text-[clamp(28px,3.6vw,44px)] font-semibold text-apple-text mb-3 tracking-[-0.032em] leading-[1.04]">
            Neues <em className="italic-serif">Passwort</em> erstellen
          </h1>
          <p className="text-apple-textSecondary text-sm leading-relaxed">
            Bitte wähle ein sicheres Passwort für deinen Account.
          </p>
        </div>

        <div className="apple-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-apple bg-apple-error/10 border border-apple-error/20 text-sm text-apple-error">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                Neues Passwort
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Mindestens 8 Zeichen"
                  className="w-full pl-11 pr-4 py-3 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/30 transition-colors text-sm"
                  disabled={loading}
                />
              </div>
              <p className="mt-1.5 text-xs text-apple-muted">
                Mindestens 8 Zeichen
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                Passwort bestätigen
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Passwort wiederholen"
                  className="w-full pl-11 pr-4 py-3 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/30 transition-colors text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Passwort zurücksetzen'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-apple-accent hover:text-apple-accentHover font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Zurück zum Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
