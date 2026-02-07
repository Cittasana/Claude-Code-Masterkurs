import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

const LoginView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect wenn bereits eingeloggt
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fehler zurücksetzen beim Mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md">
        {/* Claude Code Masterkurs Logo */}
        <div className="text-center mb-8">
          <ClaudeCodeLogo size="md" showSubtitle className="mb-6" />
          <h1 className="text-2xl font-bold text-apple-text mb-2">
            {t('auth.loginTitle', 'Willkommen zurück')}
          </h1>
          <p className="text-apple-muted text-sm">
            {t('auth.loginSubtitle', 'Melde dich an, um deinen Fortschritt zu synchronisieren')}
          </p>
        </div>

        {/* Form Card */}
        <div className="apple-card">
          {/* Fehler-Anzeige */}
          {error && (
            <div className="flex items-center gap-3 p-3 mb-5 rounded-apple bg-apple-error/10 border border-apple-error/20 text-sm text-apple-error">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* E-Mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                {t('auth.email', 'E-Mail')}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/30 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Passwort */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-apple-textSecondary">
                  {t('auth.password', 'Passwort')}
                </label>
                <Link
                  to="/password-reset"
                  className="text-xs text-apple-accent hover:text-apple-accentHover transition-colors"
                >
                  {t('auth.forgotPassword', 'Passwort vergessen?')}
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/30 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-muted hover:text-apple-textSecondary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('auth.loginButton', 'Anmelden')}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-apple-border" />
            <span className="text-xs text-apple-muted uppercase tracking-wider">
              {t('auth.or', 'oder')}
            </span>
            <div className="flex-1 border-t border-apple-border" />
          </div>

          {/* Weiter ohne Account */}
          <Link
            to="/"
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
          >
            {t('auth.continueAsGuest', 'Ohne Account fortfahren')}
          </Link>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-apple-muted mt-5">
          {t('auth.noAccount', 'Noch kein Account?')}{' '}
          <Link
            to="/register"
            className="text-apple-accent hover:text-apple-accentHover font-medium transition-colors"
          >
            {t('auth.registerLink', 'Jetzt registrieren')}
          </Link>
        </p>

        {/* Info-Hinweis */}
        <div className="mt-6 p-4 rounded-apple bg-apple-surface/50 border border-apple-border/50 text-center">
          <p className="text-xs text-apple-muted leading-relaxed">
            {t(
              'auth.offlineNote',
              'Die App funktioniert auch ohne Account. Dein Fortschritt wird lokal im Browser gespeichert. Mit einem Account kannst du ihn geräteübergreifend synchronisieren.',
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
