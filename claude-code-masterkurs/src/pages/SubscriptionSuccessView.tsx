import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { subscriptionApi } from '../lib/api';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

const SubscriptionSuccessView = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isLifetime, setIsLifetime] = useState(false);

  useEffect(() => {
    // Checkout verifizieren und Abo aktivieren (Fallback falls Webhook nicht ankam)
    const verifyAndActivate = async () => {
      try {
        // Schritt 1: Falls session_id vorhanden, Checkout direkt bei Stripe verifizieren
        if (sessionId) {
          const result = await subscriptionApi.verifyCheckout(sessionId);
          if (result.status === 'lifetime') setIsLifetime(true);
        }

        // Schritt 2: Aktuellen Status abrufen zur Bestätigung
        const status = await subscriptionApi.getStatus();
        setIsLifetime(status.isLifetime || false);

        setTimeout(() => setIsVerifying(false), 1500);
      } catch {
        // Fallback: Nach 2 Sekunden anzeigen
        setTimeout(() => setIsVerifying(false), 2000);
      }
    };

    verifyAndActivate();
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md text-center">
          <div className="apple-card">
            <Loader2 size={48} className="mx-auto text-apple-accent animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-apple-text mb-3">
              Zahlung wird überprüft...
            </h2>
            <p className="text-apple-muted">
              Bitte warte einen Moment, während wir deine Zahlung bestätigen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <ClaudeCodeLogo size="md" showSubtitle className="mb-6" />
        </div>

        {/* Success Card */}
        <div className="apple-card text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-apple-accent/10 mb-6">
            {isLifetime ? (
              <Sparkles size={32} className="text-apple-accent" />
            ) : (
              <CheckCircle size={32} className="text-apple-accent" />
            )}
          </div>

          <h1 className="text-[clamp(28px,3.6vw,44px)] font-semibold text-apple-text mb-4 tracking-[-0.032em] leading-[1.04]">
            {isLifetime ? <><em className="italic-serif">Lifetime</em> aktiviert</> : <><em className="italic-serif">Willkommen</em> im Kurs</>}
          </h1>

          <p className="text-apple-muted mb-6 leading-relaxed">
            {isLifetime ? (
              <>
                Du hast jetzt <strong>lebenslangen Zugriff</strong> auf alle Lektionen, Challenges 
                und Features des Claude Code Masterkurses – ohne monatliche Gebühren!
              </>
            ) : (
              <>
                Dein Abonnement wurde erfolgreich aktiviert. Du hast jetzt vollen Zugriff auf alle
                Lektionen, Challenges und Features des Claude Code Masterkurses.
              </>
            )}
          </p>

          {isLifetime && (
            <div className="mb-6 p-4 rounded-apple bg-apple-accent/10 border border-apple-accent/30">
              <p className="text-sm text-apple-textSecondary">
                ⭐ <strong className="text-apple-accent">Lifetime Member:</strong> Keine Sorgen über Verlängerungen – 
                dein Zugriff läuft nie ab!
              </p>
            </div>
          )}

          {/* Features Liste */}
          <div className="mb-8 p-4 rounded-apple bg-apple-surface/50 border border-apple-border/50 text-left">
            <h3 className="text-sm font-semibold text-apple-textSecondary mb-3">
              Das erwartet dich:
            </h3>
            <ul className="space-y-2 text-sm text-apple-muted">
              <li className="flex items-start gap-2">
                <span className="text-apple-success mt-0.5">✓</span>
                <span>Alle Lektionen mit interaktiven Übungen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-apple-success mt-0.5">✓</span>
                <span>Live Coding Challenges & Playground</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-apple-success mt-0.5">✓</span>
                <span>Fortschrittstracking & Zertifikate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-apple-success mt-0.5">✓</span>
                <span>Community Forum & Pattern Library</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-apple-success mt-0.5">✓</span>
                <span>Spaced Repetition für nachhaltiges Lernen</span>
              </li>
            </ul>
          </div>

          {/* Session ID für Support */}
          {sessionId && (
            <div className="mb-6 p-3 rounded-apple bg-apple-bg border border-apple-border">
              <p className="text-xs text-apple-muted">
                <strong>Session ID:</strong> {sessionId.slice(0, 24)}...
              </p>
            </div>
          )}

          {/* CTA */}
          <Link
            to="/dashboard"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {t('common.startLearning', 'Zum Kurs')}
            <ArrowRight size={18} />
          </Link>

          {/* Support Hinweis */}
          <p className="mt-6 text-xs text-apple-muted">
            Bei Fragen oder Problemen kontaktiere uns über das{' '}
            <Link to="/forum" className="text-apple-accent hover:underline">
              Forum
            </Link>
            .
          </p>
        </div>

        {/* Nächste Schritte */}
        <div className="mt-6 p-4 rounded-apple bg-apple-accent/[0.06] border border-apple-accent/15">
          <h3 className="text-sm font-semibold text-apple-text mb-2">
            💡 Tipp für den Start:
          </h3>
          <p className="text-xs text-apple-textSecondary leading-relaxed">
            Beginne mit Lektion 1 und arbeite dich Schritt für Schritt durch den Kurs. Nutze das
            Forum, um Fragen zu stellen und dich mit anderen Lernenden auszutauschen!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessView;
