import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, Check, Tag, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { subscriptionApi } from '../lib/api';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

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
  const [promoCode, setPromoCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoValidation, setPromoValidation] = useState<{
    valid: boolean;
    message?: string;
    durationMonths?: number;
  } | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');

  // Ref um zu verhindern, dass der useEffect-Redirect während des
  // Registrierungs- & Checkout-Flows auslöst
  const isRegisteringRef = useRef(false);

  // Redirect wenn bereits eingeloggt (aber NICHT während Registrierung/Checkout)
  useEffect(() => {
    if (isAuthenticated && !isRegisteringRef.current) {
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

  // Preismodelle
  const plans = [
    {
      id: 'monthly' as const,
      name: 'Monatlich',
      price: '24 EUR',
      period: '/Monat',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY,
      description: 'Flexibel kündbar',
      badge: null,
    },
    {
      id: 'yearly' as const,
      name: 'Jährlich',
      price: '229 EUR',
      period: '/Jahr',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ID_YEARLY,
      description: '19 EUR/Monat',
      badge: 'Spare 20%',
    },
    {
      id: 'lifetime' as const,
      name: 'Lifetime',
      price: '499 EUR',
      period: 'einmalig',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ID_LIFETIME,
      description: 'Lebenslanger Zugriff',
      badge: 'Best Value',
    },
  ];

  const selectedPlanDetails = plans.find(p => p.id === selectedPlan)!;

  // Promo Code validieren
  const handleValidatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoValidation(null);
      return;
    }

    setIsValidatingPromo(true);
    setPromoValidation(null);

    try {
      const result = await subscriptionApi.validatePromoCode(promoCode.trim());
      
      if (result.valid) {
        setPromoValidation({
          valid: true,
          message: result.description || `✓ ${result.durationMonths} Monate kostenlos`,
          durationMonths: result.durationMonths,
        });
      } else {
        setPromoValidation({
          valid: false,
          message: result.error || 'Ungültiger Code',
        });
      }
    } catch (error: any) {
      setPromoValidation({
        valid: false,
        message: error.message || 'Fehler beim Validieren',
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

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

    try {
      // Redirect-Guard aktivieren BEVOR register() aufgerufen wird,
      // damit der useEffect nicht zur Startseite navigiert
      isRegisteringRef.current = true;

      // 1. Account erstellen
      const success = await register(email, password, displayName || undefined);
      if (!success) {
        isRegisteringRef.current = false;
        return;
      }

      setIsCreatingCheckout(true);

      // 2. Stripe Checkout Session erstellen mit gewähltem Plan
      const checkoutSession = await subscriptionApi.createCheckoutSession(
        selectedPlanDetails.priceId,
        promoCode.trim() || undefined
      );

      // 3. Zu Stripe Checkout weiterleiten
      if (checkoutSession.url) {
        window.location.href = checkoutSession.url;
      } else {
        throw new Error('Keine Checkout-URL von Stripe erhalten');
      }
    } catch (error: any) {
      isRegisteringRef.current = false;
      setLocalError(error.message || 'Fehler beim Erstellen des Abonnements');
      setIsCreatingCheckout(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-2 sm:px-0 py-6">
      <div className="w-full max-w-md">
        {/* Claude Code Masterkurs Logo */}
        <div className="text-center mb-8">
          <ClaudeCodeLogo size="md" showSubtitle className="mb-6" />
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
            {/* Preisauswahl – einheitliche Kacheln, dezenter Akzent nur bei Auswahl */}
            <div>
              <label className="block text-sm font-medium text-apple-textSecondary mb-3">
                {t('register.planLabel', 'Wähle dein Abo-Modell')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-5 rounded-apple-lg border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-apple-accent/70 bg-apple-surface ring-2 ring-apple-accent/20'
                          : 'border-apple-border bg-apple-surface hover:border-apple-borderLight hover:bg-apple-hover/50'
                      }`}
                    >
                      {/* Badge dezent im Karteninneren */}
                      {plan.badge && (
                        <span className="inline-block text-[11px] font-medium text-apple-accent bg-apple-accent/15 px-2 py-0.5 rounded-full mb-3">
                          {plan.badge}
                        </span>
                      )}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-apple-accent bg-apple-accent'
                              : 'border-apple-borderLight'
                          }`}
                        >
                          {isSelected && (
                            <Check size={12} className="text-white" strokeWidth={3} />
                          )}
                        </div>
                        <h3 className="font-semibold text-apple-text text-sm">
                          {plan.name}
                        </h3>
                      </div>
                      <p className={`text-xl font-bold tabular-nums ${
                        isSelected ? 'text-apple-accent' : 'text-apple-text'
                      }`}>
                        {plan.price}
                      </p>
                      <p className="text-xs text-apple-muted mt-0.5">{plan.period}</p>
                      <p className="text-xs text-apple-textSecondary mt-3 leading-snug">
                        {plan.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

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

            {/* Aktionscode */}
            <div>
              <label htmlFor="promoCode" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                Aktionscode
                <span className="text-apple-muted ml-1 text-xs font-normal">
                  (optional - 6 Monate gratis)
                </span>
              </label>
              <div className="relative">
                <Tag size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                <input
                  id="promoCode"
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoValidation(null);
                  }}
                  onBlur={handleValidatePromoCode}
                  placeholder="z.B. WELCOME2024"
                  className={`w-full pl-11 pr-12 py-3 rounded-apple bg-apple-bg border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:ring-1 transition-colors text-sm uppercase ${
                    promoValidation
                      ? promoValidation.valid
                        ? 'border-apple-success focus:border-apple-success focus:ring-apple-success/30'
                        : 'border-apple-error focus:border-apple-error focus:ring-apple-error/30'
                      : 'border-apple-border focus:border-apple-accent focus:ring-apple-accent/30'
                  }`}
                />
                {isValidatingPromo && (
                  <Loader2 size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-muted animate-spin" />
                )}
                {!isValidatingPromo && promoValidation && promoValidation.valid && (
                  <Check size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-success" />
                )}
              </div>
              {promoValidation && (
                <p className={`mt-1.5 text-xs flex items-center gap-1.5 ${
                  promoValidation.valid ? 'text-apple-success' : 'text-apple-error'
                }`}>
                  {promoValidation.valid ? '✓' : '✕'} {promoValidation.message}
                </p>
              )}
            </div>

            {/* Abo-Hinweis */}
            <div className="p-4 rounded-apple bg-apple-surface border border-apple-border">
              <p className="text-sm text-apple-textSecondary">
                <strong>💳 {selectedPlan === 'lifetime' ? 'Einmalige Zahlung' : 'Abonnement'}:</strong> Nach der Registrierung wirst du zur sicheren Stripe-Zahlung weitergeleitet
                {selectedPlan === 'lifetime' 
                  ? ' für deinen Lifetime-Zugang.' 
                  : ', um dein Abo abzuschließen.'}
                {promoValidation?.valid && selectedPlan !== 'lifetime' && (
                  <span className="block mt-2 text-apple-accent font-medium">
                    🎉 Mit deinem Code erhältst du {promoValidation.durationMonths} Monate kostenlos!
                  </span>
                )}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isCreatingCheckout || !email || !password || !confirmPassword}
              className="btn-primary w-full flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isCreatingCheckout ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isCreatingCheckout ? 'Weiterleitung...' : 'Lädt...'}</span>
                </>
              ) : (
                <>
                  {t('auth.registerButton', 'Account erstellen & Abo abschließen')}
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
