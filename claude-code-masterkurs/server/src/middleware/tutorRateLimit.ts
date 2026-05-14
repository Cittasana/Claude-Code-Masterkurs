// ─────────────────────────────────────────────────────────────────────────────
// Tutor Rate Limit Middleware
// -----------------------------------------------------------------------------
// Counts user-role messages in the current calendar month and gates the
// request based on the user's tier:
//
//   * local-llm track  → no limit (browser handles inference; we don't pay)
//   * free tier        → 20 user messages / month  → 429 + upgrade hint
//   * paid (standard|pro) cloud tier → soft-cap 500 / month
//       ≥ 400 messages → request still allowed; `req.tutorRateLimit`
//                        carries `softCapWarning` for the route to include
//                        in the SSE stream.
//       ≥ 500 messages → 429 hard-stop.
//
// "Tier" comes from Subscription.tutorTier when status is one of
// {active, trialing, lifetime}. Otherwise the user is treated as `free`.
//
// The track is read from the request body (`track`). If absent we default
// to cloud-paying-user behaviour (which is the safer side).
// ─────────────────────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import { prisma, logger } from '../index.js';
import type { TrackKey, TutorTier } from '../lib/tutor-router.js';

// ── Constants ────────────────────────────────────────────────────────────

const FREE_MONTHLY_CAP = 20;
const PAID_MONTHLY_CAP = 500;
const PAID_SOFT_CAP_THRESHOLD = 400;

const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  'active',
  'trialing',
  'lifetime',
]);

// ── Types ────────────────────────────────────────────────────────────────

export interface TutorRateLimitInfo {
  track: TrackKey;
  /** Effective tier after subscription lookup. */
  tier: TutorTier;
  /** True if the user has an active paid (or lifetime) subscription. */
  isPaid: boolean;
  used: number;
  cap: number;
  softCapWarning?: { used: number; cap: number; percent: number };
}

declare global {
  namespace Express {
    interface Request {
      tutorRateLimit?: TutorRateLimitInfo;
    }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────

function startOfMonth(d: Date = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function parseTrack(raw: unknown): TrackKey {
  if (
    raw === 'claude-code' ||
    raw === 'claude-desktop' ||
    raw === 'codex' ||
    raw === 'local-llm'
  ) {
    return raw;
  }
  // Unknown / missing: default to the most generic paid track.
  return 'claude-code';
}

async function countUserMessagesThisMonth(userId: string): Promise<number> {
  // Join TutorMessage -> TutorSession on session.userId = userId, role='user',
  // createdAt >= start-of-month. Prisma needs the relation filter.
  return prisma.tutorMessage.count({
    where: {
      role: 'user',
      createdAt: { gte: startOfMonth() },
      session: { userId },
    },
  });
}

// ── Middleware ───────────────────────────────────────────────────────────

export async function tutorRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      // `requireAuth` should run first — defensive guard.
      res.status(401).json({ error: 'Authentifizierung erforderlich' });
      return;
    }

    const track = parseTrack(req.body?.track);

    // ── 1. local-llm: bypass all counting/limits.
    if (track === 'local-llm') {
      req.tutorRateLimit = {
        track,
        tier: 'standard',
        isPaid: false,
        used: 0,
        cap: Number.POSITIVE_INFINITY,
      };
      next();
      return;
    }

    // ── 2. Look up subscription to determine tier.
    const sub = await prisma.subscription.findUnique({
      where: { userId },
      select: { status: true, tutorTier: true, isLifetime: true },
    });

    const isPaid =
      !!sub &&
      (sub.isLifetime || ACTIVE_SUBSCRIPTION_STATUSES.has(sub.status));

    const tier: TutorTier =
      isPaid && (sub.tutorTier === 'pro' || sub.tutorTier === 'standard')
        ? (sub.tutorTier as TutorTier)
        : 'standard';

    const used = await countUserMessagesThisMonth(userId);

    // ── 3. Free user → hard cap 20/month.
    if (!isPaid) {
      if (used >= FREE_MONTHLY_CAP) {
        res.status(429).json({
          code: 'rate_limit',
          error: 'Monatliches Tutor-Limit für den kostenlosen Tarif erreicht.',
          upgradeUrl: '/preise',
          used,
          cap: FREE_MONTHLY_CAP,
        });
        return;
      }
      req.tutorRateLimit = {
        track,
        tier: 'standard',
        isPaid: false,
        used,
        cap: FREE_MONTHLY_CAP,
      };
      next();
      return;
    }

    // ── 4. Paid user → soft cap 400/500.
    if (used >= PAID_MONTHLY_CAP) {
      res.status(429).json({
        code: 'rate_limit',
        error: 'Monatliches Soft-Cap (500 Nachrichten) erreicht.',
        upgradeUrl: '/preise',
        used,
        cap: PAID_MONTHLY_CAP,
      });
      return;
    }

    const info: TutorRateLimitInfo = {
      track,
      tier,
      isPaid: true,
      used,
      cap: PAID_MONTHLY_CAP,
    };

    if (used >= PAID_SOFT_CAP_THRESHOLD) {
      info.softCapWarning = {
        used,
        cap: PAID_MONTHLY_CAP,
        percent: Math.round((used / PAID_MONTHLY_CAP) * 100) / 100,
      };
    }

    req.tutorRateLimit = info;
    next();
  } catch (err) {
    logger.error(err, 'tutorRateLimit error');
    res.status(500).json({ error: 'Rate-Limit-Prüfung fehlgeschlagen' });
  }
}
