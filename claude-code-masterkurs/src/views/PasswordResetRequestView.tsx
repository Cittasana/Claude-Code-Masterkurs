import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
import { authApi, ApiError } from '../lib/api';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

export default function PasswordResetRequestView() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.requestPasswordReset(email);
      setSuccess(true);
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
              <span className="text-3xl">✉️</span>
            </div>
            <h2 className="text-2xl font-bold text-apple-text mb-4">
              E-Mail versendet!
            </h2>
            <p className="text-apple-textSecondary mb-6 text-sm leading-relaxed">
              Falls ein Account mit dieser E-Mail-Adresse existiert, haben wir dir einen Link zum Zurücksetzen deines Passworts gesendet.
            </p>
            <p className="text-sm text-apple-muted mb-6">
              Prüfe auch deinen Spam-Ordner, falls du keine E-Mail erhältst.
            </p>
            <Link
              to="/login"
              className="btn-primary inline-flex items-center gap-2"
            >
              Zurück zum Login
            </Link>
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
          <div className="eyebrow center mb-5"><KeyRound size={12} /><span>Passwort-Reset</span></div>
          <h1 className="text-[clamp(28px,3.6vw,44px)] font-semibold text-apple-text mb-3 tracking-[-0.032em] leading-[1.04]">
            <em className="italic-serif">Passwort</em> vergessen?
          </h1>
          <p className="text-apple-textSecondary text-sm leading-relaxed max-w-sm mx-auto">
            Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.
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
              <label htmlFor="email" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
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
                'Reset-Link senden'
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
