import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import NewsletterSignup from '../components/Newsletter/NewsletterSignup';
import { newsletterApi } from '../lib/api';

const NewsletterView = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg">
      {/* Hero */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-apple-text mb-5 tracking-tight leading-tight">
            {t('newsletter.pageTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-apple-textSecondary leading-relaxed max-w-2xl mx-auto">
            {t('newsletter.pageSubtitle')}
          </p>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border bg-apple-surface/30">
        <NewsletterSignup source="website" />
      </section>

      {/* What You Get */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-apple-text text-center mb-8">
            {t('newsletter.whatYouGet')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {['benefit1', 'benefit2', 'benefit3', 'benefit4'].map((key) => (
              <div
                key={key}
                className="flex items-start gap-3 p-4 rounded-apple-lg bg-apple-surface border border-apple-border"
              >
                <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-apple-accent" />
                <span className="text-apple-textSecondary text-sm">
                  {t(`newsletter.${key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ── Newsletter Confirm View ─────────────────────────────────────

export const NewsletterConfirmView = () => {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('newsletter.errorInvalidToken'));
      return;
    }

    const tokenStr = Array.isArray(token) ? token[0] : token;

    newsletterApi
      .confirm(tokenStr)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || t('newsletter.errorGeneric'));
      });
  }, [token, t]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="p-8">
            <Loader2 size={40} className="mx-auto text-apple-accent animate-spin mb-4" />
            <p className="text-apple-textSecondary">{t('newsletter.confirming')}</p>
          </div>
        )}
        {status === 'success' && (
          <div className="p-8 rounded-apple-lg bg-apple-success/10 border border-apple-success/20">
            <CheckCircle2 size={48} className="mx-auto text-apple-success mb-4" />
            <h2 className="text-xl font-bold text-apple-text mb-2">
              {t('newsletter.confirmSuccessTitle')}
            </h2>
            <p className="text-apple-textSecondary">{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="p-8 rounded-apple-lg bg-apple-error/10 border border-apple-error/20">
            <XCircle size={48} className="mx-auto text-apple-error mb-4" />
            <h2 className="text-xl font-bold text-apple-text mb-2">
              {t('newsletter.confirmErrorTitle')}
            </h2>
            <p className="text-apple-textSecondary">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Newsletter Unsubscribe View ─────────────────────────────────

export const NewsletterUnsubscribeView = () => {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('newsletter.errorInvalidToken'));
      return;
    }

    const tokenStr = Array.isArray(token) ? token[0] : token;

    newsletterApi
      .unsubscribe(tokenStr)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || t('newsletter.errorGeneric'));
      });
  }, [token, t]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="p-8">
            <Loader2 size={40} className="mx-auto text-apple-accent animate-spin mb-4" />
            <p className="text-apple-textSecondary">{t('newsletter.unsubscribing')}</p>
          </div>
        )}
        {status === 'success' && (
          <div className="p-8 rounded-apple-lg bg-apple-surface border border-apple-border">
            <CheckCircle2 size={48} className="mx-auto text-apple-muted mb-4" />
            <h2 className="text-xl font-bold text-apple-text mb-2">
              {t('newsletter.unsubscribeSuccessTitle')}
            </h2>
            <p className="text-apple-textSecondary">{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="p-8 rounded-apple-lg bg-apple-error/10 border border-apple-error/20">
            <XCircle size={48} className="mx-auto text-apple-error mb-4" />
            <h2 className="text-xl font-bold text-apple-text mb-2">
              {t('newsletter.unsubscribeErrorTitle')}
            </h2>
            <p className="text-apple-textSecondary">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterView;
