import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, ChevronDown, ChevronUp } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'cookie-consent';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      // Kleines Delay damit die Seite erst laden kann
      const timer = setTimeout(() => {
        setVisible(true);
        // Trigger animation nach mount
        requestAnimationFrame(() => setIsAnimating(true));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (consent: ConsentState) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    setIsAnimating(false);
    setTimeout(() => setVisible(false), 300);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAcceptSelected = () => {
    saveConsent({
      necessary: true,
      analytics: analyticsConsent,
      marketing: marketingConsent,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 -top-screen bg-black/20 backdrop-blur-[1px] pointer-events-none" />

      {/* Banner */}
      <div className="relative bg-apple-surface/95 backdrop-blur-xl border-t border-apple-border shadow-2xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-apple-accent/10 shrink-0">
                  <Cookie className="w-5 h-5 text-apple-accent" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-apple-text">
                    Cookie-Einstellungen
                  </h3>
                  <p className="text-sm text-apple-muted mt-0.5 leading-relaxed max-w-2xl">
                    Wir respektieren deine Privatsphäre. Diese Website verwendet Cookies und
                    LocalStorage, um dir die bestmögliche Erfahrung zu bieten. Mehr dazu in
                    unserer{' '}
                    <Link
                      to="/datenschutz"
                      className="text-apple-accent hover:underline"
                    >
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <button
                onClick={handleRejectAll}
                className="p-1.5 rounded-lg text-apple-muted hover:text-apple-text hover:bg-apple-elevated transition-colors shrink-0"
                aria-label="Schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1.5 text-sm text-apple-muted hover:text-apple-accent transition-colors self-start"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Weniger anzeigen
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Cookie-Details anzeigen
                </>
              )}
            </button>

            {/* Cookie Details */}
            {showDetails && (
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Notwendige Cookies */}
                <div className="rounded-xl bg-apple-bg/60 border border-apple-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-apple-text">Notwendig</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-apple-accent/10 text-apple-accent font-medium">
                      Immer aktiv
                    </span>
                  </div>
                  <p className="text-xs text-apple-muted leading-relaxed">
                    Essentielle Cookies für die Grundfunktionen der Website (z.B. Lernfortschritt,
                    Spracheinstellung). Ohne diese funktioniert die Plattform nicht richtig.
                  </p>
                </div>

                {/* Analyse Cookies */}
                <div className="rounded-xl bg-apple-bg/60 border border-apple-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-apple-text">Analyse</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analyticsConsent}
                        onChange={(e) => setAnalyticsConsent(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-apple-border rounded-full peer peer-checked:bg-apple-accent transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <p className="text-xs text-apple-muted leading-relaxed">
                    Helfen uns zu verstehen, wie die Plattform genutzt wird, um das Lernerlebnis
                    zu verbessern. Keine personenbezogenen Daten.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="rounded-xl bg-apple-bg/60 border border-apple-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-apple-text">Marketing</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-apple-border rounded-full peer peer-checked:bg-apple-accent transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <p className="text-xs text-apple-muted leading-relaxed">
                    Werden aktuell nicht verwendet. Falls zukünftig eingesetzt, dienen sie
                    zur Anzeige relevanter Inhalte.
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={handleAcceptAll}
                className="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                <Check className="w-4 h-4" />
                Alle akzeptieren
              </button>
              {showDetails && (
                <button
                  onClick={handleAcceptSelected}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm"
                >
                  Auswahl bestätigen
                </button>
              )}
              <button
                onClick={handleRejectAll}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-apple-muted hover:text-apple-text hover:bg-apple-elevated border border-apple-border transition-colors"
              >
                Nur notwendige
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

/**
 * Hilfsfunktion: Cookie-Consent-Status auslesen.
 * Kann in anderen Komponenten importiert werden, um zu prüfen,
 * ob z.B. Analytics geladen werden darf.
 */
export function getCookieConsent(): ConsentState | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ConsentState;
  } catch {
    return null;
  }
}

/**
 * Hilfsfunktion: Prüft ob eine bestimmte Cookie-Kategorie erlaubt ist.
 */
export function hasConsent(category: 'necessary' | 'analytics' | 'marketing'): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent[category];
}

/**
 * Consent zurücksetzen (z.B. über Datenschutz-Seite aufrufbar).
 */
export function resetCookieConsent(): void {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  window.location.reload();
}
