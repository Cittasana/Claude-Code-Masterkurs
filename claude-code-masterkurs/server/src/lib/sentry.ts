import * as Sentry from '@sentry/node';
import { logger } from '../index.js';

// ── Sentry Initialization ────────────────────────────────────
// Sentry wird nur initialisiert wenn SENTRY_DSN gesetzt ist.
// In Entwicklung wird Sentry übersprungen.

const SENTRY_DSN = process.env.SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    logger.info('Sentry DSN not configured – error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.RAILWAY_GIT_COMMIT_SHA || 'unknown',

    // Performance Monitoring – 10% der Transaktionen in Produktion
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Persönliche Daten nicht senden
    sendDefaultPii: false,

    // Integrations
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],

    // Vor dem Senden: Sensitive Daten filtern
    beforeSend(event) {
      // Passwords und Tokens aus Breadcrumbs entfernen
      if (event.request?.data) {
        const data = event.request.data as Record<string, unknown>;
        if (typeof data === 'object' && data !== null) {
          if ('password' in data) data.password = '[REDACTED]';
          if ('token' in data) data.token = '[REDACTED]';
          if ('refreshToken' in data) data.refreshToken = '[REDACTED]';
        }
      }
      return event;
    },
  });

  logger.info('Sentry error tracking initialized');
}

// Re-export für Nutzung in anderen Modulen
export { Sentry };
