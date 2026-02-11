import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { newsletterApi, ApiError } from '../../lib/api';

interface NewsletterSignupProps {
  /** Where this component is placed (for analytics source tracking) */
  source?: 'footer' | 'landing' | 'website';
  /** Compact mode for footer placement */
  compact?: boolean;
}

const NewsletterSignup = ({ source = 'website', compact = false }: NewsletterSignupProps) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(t('newsletter.errorEmailRequired'));
      return;
    }

    setLoading(true);

    try {
      await newsletterApi.subscribe(email.trim(), undefined, source);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof TypeError) {
        setError(t('newsletter.errorNetwork'));
      } else {
        setError(t('newsletter.errorGeneric'));
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ──────────────────────────────────────────
  if (success) {
    return (
      <div className={compact ? '' : 'max-w-lg mx-auto'}>
        <div className="p-6 rounded-apple-lg bg-apple-success/10 border border-apple-success/20 text-center">
          <CheckCircle2 size={36} className="mx-auto text-apple-success mb-3" />
          <p className="text-apple-success font-semibold text-lg">
            {t('newsletter.successTitle')}
          </p>
          <p className="text-apple-textSecondary text-sm mt-2">
            {t('newsletter.successDesc')}
          </p>
        </div>
      </div>
    );
  }

  // ── Compact Footer Version ─────────────────────────────────
  if (compact) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-apple-accent" />
          <span className="text-sm font-semibold text-apple-text">
            {t('newsletter.brandName')}
          </span>
        </div>
        <p className="text-xs text-apple-muted mb-3">
          {t('newsletter.compactDesc')}
        </p>

        {error && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-apple-error">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.emailPlaceholder')}
              required
              autoComplete="email"
              className="w-full pl-9 pr-3 py-2 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/20 transition-colors text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="btn-primary px-4 py-2 text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : t('newsletter.subscribeButton')}
          </button>
        </form>

        <p className="text-[11px] text-apple-muted/60 mt-2">
          {t('newsletter.trustSignal')}
        </p>
      </div>
    );
  }

  // ── Full-Size Version (for /newsletter page and landing) ───
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Zap size={22} className="text-apple-accent" />
        <h3 className="text-xl sm:text-2xl font-bold text-apple-text">
          {t('newsletter.brandName')}
        </h3>
      </div>

      <p className="text-apple-textSecondary leading-relaxed mb-6">
        {t('newsletter.fullDesc')}
      </p>

      {error && (
        <div className="flex items-center justify-center gap-2 p-3 mb-5 rounded-apple bg-apple-error/10 border border-apple-error/20 text-sm text-apple-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.emailPlaceholder')}
              required
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3.5 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-2 focus:ring-apple-accent/20 transition-colors text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t('newsletter.subscribingButton')}
              </>
            ) : (
              t('newsletter.subscribeButton')
            )}
          </button>
        </div>
      </form>

      {/* Trust Signals */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-apple-muted">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-apple-success" />
          {t('newsletter.trustNoSpam')}
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-apple-success" />
          {t('newsletter.trustUnsubscribe')}
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-apple-success" />
          {t('newsletter.trustWeekly')}
        </span>
      </div>
    </div>
  );
};

export default NewsletterSignup;
