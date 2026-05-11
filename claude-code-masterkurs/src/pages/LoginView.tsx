import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { discordApi } from '../lib/api';
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
  const [discordLoading, setDiscordLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Check for Discord login errors in URL params
  useEffect(() => {
    const discordParam = searchParams.get('discord');
    if (discordParam === 'error') {
      const reason = searchParams.get('reason');
      const errorMessages: Record<string, string> = {
        email_exists: 'Diese E-Mail ist bereits mit einem anderen Account verbunden.',
        no_email: 'Discord hat keine E-Mail bereitgestellt. Bitte nutze die normale Registrierung.',
        auth_failed: 'Discord-Authentifizierung fehlgeschlagen.',
      };
      useAuthStore.setState({ error: errorMessages[reason || ''] || 'Discord-Login fehlgeschlagen.' });
      searchParams.delete('discord');
      searchParams.delete('reason');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  const handleDiscordLogin = async () => {
    setDiscordLoading(true);
    try {
      const { url } = await discordApi.getLoginUrl();
      window.location.href = url;
    } catch {
      useAuthStore.setState({ error: 'Discord-Login nicht verfuegbar. Bitte versuche es spaeter erneut.' });
      setDiscordLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-2 sm:px-0 py-6">
      <div className="w-full max-w-md">
        {/* Header — Ethereal */}
        <div className="text-center mb-10">
          <ClaudeCodeLogo size="md" showSubtitle className="mb-8" />
          <div className="eyebrow center mb-5"><span className="pulse" />Account</div>
          <h1 className="text-[clamp(28px,3.6vw,40px)] font-semibold text-apple-text mb-3 tracking-[-0.032em] leading-[1.04]">
            <em className="italic-serif">{t('auth.loginTitle', 'Willkommen zurück')}</em>
          </h1>
          <p className="text-apple-textSecondary text-sm leading-relaxed">
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
              className="btn-primary w-full flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Discord Login */}
          <button
            onClick={handleDiscordLogin}
            disabled={discordLoading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-apple font-medium text-white transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mb-3 text-sm"
            style={{ backgroundColor: '#5865F2' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
            </svg>
            {discordLoading ? 'Verbinde...' : t('auth.discordLogin', 'Mit Discord anmelden')}
          </button>

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
