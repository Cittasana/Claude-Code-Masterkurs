import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const RegisterView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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

  // Passwort-Stärke
  const passwordChecks = {
    length: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError(t('auth.passwordMismatch', 'Passwörter stimmen nicht überein'));
      return;
    }

    if (password.length < 8) {
      setLocalError(t('auth.passwordTooShort', 'Passwort muss mindestens 8 Zeichen haben'));
      return;
    }

    const success = await register(email, password, displayName || undefined);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-apple-xl bg-apple-accent/10 border border-apple-accent/20 mb-5">
            <UserPlus size={28} className="text-apple-accent" />
          </div>
          <h1 className="text-2xl font-bold text-apple-text mb-2">
            {t('auth.registerTitle', 'Account erstellen')}
          </h1>
          <p className="text-apple-muted text-sm">
            {t('auth.registerSubtitle', 'Erstelle einen Account, um deinen Fortschritt zu sichern')}
          </p>
        </div>

        {/* Form Card */}
        <div className="apple-card">
          {/* Fehler-Anzeige */}
          {displayError && (
            <div className="flex items-center gap-3 p-3 mb-5 rounded-apple bg-apple-error/10 border border-apple-error/20 text-sm text-apple-error">
              <AlertCircle size={18} className="shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Anzeigename (optional) */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                {t('auth.displayName', 'Anzeigename')}
                <span className="text-apple-muted ml-1 text-xs font-normal">
                  ({t('auth.optional', 'optional')})
                </span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="z.B. MaxCode"
                  maxLength={50}
                  autoComplete="nickname"
                  className="w-full pl-11 pr-4 py-3 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/30 transition-colors text-sm"
                />
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                {t('auth.password', 'Passwort')}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mindestens 8 Zeichen"
                  required
                  minLength={8}
                  autoComplete="new-password"
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

              {/* Passwort-Stärke */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength >= level
                            ? passwordStrength === 1
                              ? 'bg-apple-error'
                              : passwordStrength === 2
                                ? 'bg-apple-warning'
                                : 'bg-apple-success'
                            : 'bg-apple-border'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="space-y-1">
                    {[
                      { key: 'length', label: t('auth.pwMin8', 'Mindestens 8 Zeichen') },
                      { key: 'hasUppercase', label: t('auth.pwUppercase', 'Großbuchstabe') },
                      { key: 'hasNumber', label: t('auth.pwNumber', 'Zahl') },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <Check
                          size={14}
                          className={
                            passwordChecks[key as keyof typeof passwordChecks]
                              ? 'text-apple-success'
                              : 'text-apple-muted/30'
                          }
                        />
                        <span
                          className={
                            passwordChecks[key as keyof typeof passwordChecks]
                              ? 'text-apple-textSecondary'
                              : 'text-apple-muted/50'
                          }
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Passwort bestätigen */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                {t('auth.confirmPassword', 'Passwort bestätigen')}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Passwort wiederholen"
                  required
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-4 py-3 rounded-apple bg-apple-bg border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:ring-1 transition-colors text-sm ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-apple-error focus:border-apple-error focus:ring-apple-error/30'
                      : 'border-apple-border focus:border-apple-accent focus:ring-apple-accent/30'
                  }`}
                />
                {confirmPassword && confirmPassword === password && (
                  <Check size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-success" />
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password || !confirmPassword}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('auth.registerButton', 'Account erstellen')}
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

        {/* Login Link */}
        <p className="text-center text-sm text-apple-muted mt-5">
          {t('auth.hasAccount', 'Bereits ein Account?')}{' '}
          <Link
            to="/login"
            className="text-apple-accent hover:text-apple-accentHover font-medium transition-colors"
          >
            {t('auth.loginLink', 'Jetzt anmelden')}
          </Link>
        </p>

        {/* DSGVO Hinweis */}
        <div className="mt-6 p-4 rounded-apple bg-apple-surface/50 border border-apple-border/50 text-center">
          <p className="text-xs text-apple-muted leading-relaxed">
            {t(
              'auth.privacyNote',
              'Mit der Registrierung stimmst du unserer Datenschutzerklärung zu. Du kannst deinen Account jederzeit löschen (DSGVO Art. 17).',
            )}{' '}
            <Link to="/datenschutz" className="text-apple-accent hover:underline">
              {t('auth.privacyLink', 'Datenschutzerklärung')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
