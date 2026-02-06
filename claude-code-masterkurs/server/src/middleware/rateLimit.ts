import rateLimit from 'express-rate-limit';

// ── Global Rate Limit ────────────────────────────────────────
// 200 requests per minute per IP
export const globalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen. Bitte warte kurz.' },
});

// ── Strict Rate Limit (for Auth endpoints) ───────────────────
// 10 requests per 15 minutes per IP
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anmeldeversuche. Bitte warte 15 Minuten.' },
});

// ── Write Rate Limit (for POST/PUT endpoints) ────────────────
// 30 requests per minute per IP
export const writeRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Schreibvorgänge. Bitte warte kurz.' },
});
