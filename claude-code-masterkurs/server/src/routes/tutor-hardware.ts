import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import {
  classifyTier,
  TIER_CATALOG,
  type TierKey,
} from '../lib/local-llm-tier-catalog.js';

// ── Router ───────────────────────────────────────────────────

export const tutorHardwareRouter = Router();

tutorHardwareRouter.use(requireAuth);

// ── Shared helpers ───────────────────────────────────────────

const TIER_KEYS = ['tier-s', 'tier-m', 'tier-l', 'unsupported', 'unknown'] as const;
const tierKeySchema = z.enum(TIER_KEYS);

const TIER_RANK: Record<TierKey, number> = {
  'unsupported': 0,
  'tier-s': 1,
  'tier-m': 2,
  'tier-l': 3,
  'unknown': -1,
};

function isDowngrade(prev: TierKey | null | undefined, next: TierKey): boolean {
  if (!prev || prev === 'unknown' || next === 'unknown') return false;
  return TIER_RANK[next] < TIER_RANK[prev];
}

function recommendedModelFor(tier: TierKey): string {
  if (tier === 'unknown' || tier === 'unsupported') return 'none';
  return TIER_CATALOG[tier].recommendedModel;
}

/**
 * Benchmark-time re-classification.
 *
 * The static probe already classified the user against RAM+VRAM floors. The
 * benchmark then measures actual throughput on the chosen model. We do NOT
 * reclassify based on a hypothetical `totalRamGB = peakRamGB` — peakRamGB is
 * the model's footprint (e.g. ~4.5 GB for a 7B), not system memory. Instead
 * we confirm the stored static tier holds against measured `tokensPerSec`,
 * stepping down one tier at a time until the throughput floor is satisfied.
 */
function reclassifyAgainstTokensPerSec(
  staticTier: TierKey,
  tokensPerSec: number,
): TierKey {
  if (staticTier === 'unknown' || staticTier === 'unsupported') return staticTier;

  const ladder = ['tier-l', 'tier-m', 'tier-s'] as const;
  const startIdx = ladder.indexOf(staticTier as (typeof ladder)[number]);
  if (startIdx === -1) return 'unsupported';

  for (let i = startIdx; i < ladder.length; i++) {
    const cand = ladder[i];
    if (tokensPerSec >= TIER_CATALOG[cand].minTokPerSec) return cand;
  }
  return 'unsupported';
}

// ── POST /api/tutor/probe/static ─────────────────────────────
// Client sends what the browser actually can detect: `deviceMemoryGb`
// (navigator.deviceMemory, Chrome-only, capped at 8) and hardware concurrency.
// Optional GPU/CPU/UA fields are recorded for telemetry but not used in tier
// classification today (TIER_CATALOG requires VRAM data we can't reliably read
// cross-browser).

const staticProbeSchema = z.object({
  // Accept either of the two conventions: Lane E sent `deviceMemoryGb`,
  // the original spec used `totalRamGB`. Map to a single internal value.
  deviceMemoryGb: z.number().positive().max(2048).optional(),
  totalRamGB: z.number().positive().max(2048).optional(),
  gpuVendor: z.string().min(1).max(64).optional(),
  gpuVramGB: z.number().nonnegative().max(512).optional(),
  cpuModel: z.string().min(1).max(128).optional(),
  osArch: z.string().min(1).max(32).optional(),
  hardwareConcurrency: z.number().int().nonnegative().max(1024).optional(),
  userAgent: z.string().max(512).optional(),
});

tutorHardwareRouter.post('/probe/static', async (req, res) => {
  try {
    const data = staticProbeSchema.parse(req.body);
    const userId = req.user!.userId;

    const totalRamGB = data.totalRamGB ?? data.deviceMemoryGb;

    // No usable RAM signal → unknown (rather than guessing or rejecting).
    if (totalRamGB == null) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          localLlmTutorTier: 'unknown',
          localLlmLastProbeAt: new Date(),
        },
      });
      res.json({
        tier: 'unknown',
        reason:
          'Browser kann RAM nicht melden (navigator.deviceMemory ist nicht in allen Browsern verfügbar). Der Benchmark-Schritt klärt die Tier-Zuweisung.',
      });
      return;
    }

    const tier: TierKey = classifyTier({
      totalRamGB,
      gpuVramGB: data.gpuVramGB,
    });
    const safeTier = tierKeySchema.parse(tier);

    await prisma.user.update({
      where: { id: userId },
      data: {
        localLlmTutorTier: safeTier,
        localLlmLastProbeAt: new Date(),
      },
    });

    res.json({
      tier: safeTier,
      reason:
        safeTier === 'unsupported'
          ? 'RAM/GPU unter dem Tier-S-Floor (16 GB RAM / 8 GB VRAM optional). Lokaler Tutor nicht empfohlen.'
          : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Ungültige Hardware-Daten', details: error.errors });
      return;
    }
    logger.error(error, 'Static hardware probe error');
    res.status(500).json({ error: 'Hardware-Probe konnte nicht verarbeitet werden' });
  }
});

// ── POST /api/tutor/probe/benchmark ──────────────────────────
// Client measured tokens/sec on local Ollama. We confirm the static tier
// holds against measured throughput, stepping down one tier at a time if
// the floor isn't met. `peakRamGB` is accepted-but-ignored — it's the
// model's footprint, not system memory, so it can't drive classification.

const benchmarkProbeSchema = z.object({
  tokensPerSec: z.number().nonnegative().max(10000),
  timeToFirstTokenMs: z.number().nonnegative().max(600_000),
  // Optional metadata for telemetry / logging — not used in classification.
  peakRamGB: z.number().nonnegative().max(2048).optional(),
  totalRamGB: z.number().positive().max(2048).optional(),
  model: z.string().min(1).max(128).optional(),
  evalCount: z.number().int().nonnegative().max(1_000_000).optional(),
});

tutorHardwareRouter.post('/probe/benchmark', async (req, res) => {
  try {
    const data = benchmarkProbeSchema.parse(req.body);
    const userId = req.user!.userId;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { localLlmTutorTier: true },
    });
    const staticTier = (currentUser?.localLlmTutorTier ?? 'unknown') as TierKey;

    const safeNext = tierKeySchema.parse(
      reclassifyAgainstTokensPerSec(staticTier, data.tokensPerSec),
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        localLlmTutorTier: safeNext,
        localLlmLastProbeAt: new Date(),
        localLlmLastTokPerSec: data.tokensPerSec,
      },
    });

    logger.info(
      {
        userId,
        prev: staticTier,
        next: safeNext,
        tokensPerSec: data.tokensPerSec,
        model: data.model,
      },
      'Benchmark probe classified',
    );

    res.json({
      tier: safeNext,
      recommendedModel: recommendedModelFor(safeNext),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Ungültige Benchmark-Daten', details: error.errors });
      return;
    }
    logger.error(error, 'Benchmark hardware probe error');
    res.status(500).json({ error: 'Benchmark-Probe konnte nicht verarbeitet werden' });
  }
});

// ── POST /api/tutor/probe/telemetry ──────────────────────────
// Live in-session telemetry, posted ~every 5s from TutorChatPanel during a
// local-llm streaming response. We re-classify based on measured tokensPerSec
// against the *stored* tier. If the new tier is lower, signal a downgrade;
// if unsupported, signal a session close.
//
// Accepts the actual payload TutorChatPanel emits (`sessionId`, `lessonId`,
// `tokenCount`, `tokensPerSec?`, `errorCode?`) plus optional `peakRamGB` /
// `thermalState` for richer telemetry.

const telemetrySchema = z
  .object({
    sessionId: z.string().min(1).max(128).nullable().optional(),
    lessonId: z.number().int().nullable().optional(),
    tokenCount: z.number().int().nonnegative().max(1_000_000).optional(),
    tokensPerSec: z.number().nonnegative().max(10000).optional(),
    errorCode: z.string().min(1).max(64).optional(),
    peakRamGB: z.number().nonnegative().max(2048).optional(),
    thermalState: z.enum(['nominal', 'fair', 'serious', 'critical']).optional(),
  })
  .passthrough();

type TelemetryAction = 'continue' | 'downgrade' | 'close';

tutorHardwareRouter.post('/probe/telemetry', async (req, res) => {
  try {
    const data = telemetrySchema.parse(req.body);
    const userId = req.user!.userId;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { localLlmTutorTier: true },
    });
    const prevTier = (currentUser?.localLlmTutorTier ?? null) as TierKey | null;

    let action: TelemetryAction = 'continue';
    let safeNext: TierKey = prevTier ?? 'unknown';

    // Only re-classify if we have a fresh throughput measurement.
    if (typeof data.tokensPerSec === 'number' && prevTier && prevTier !== 'unknown') {
      safeNext = tierKeySchema.parse(
        reclassifyAgainstTokensPerSec(prevTier, data.tokensPerSec),
      );

      if (safeNext === 'unsupported') {
        action = 'close';
      } else if (isDowngrade(prevTier, safeNext)) {
        action = 'downgrade';
      }
    }

    // Always refresh probe metadata (cheap single-row update).
    await prisma.user.update({
      where: { id: userId },
      data: {
        localLlmTutorTier: safeNext,
        localLlmLastProbeAt: new Date(),
        ...(typeof data.tokensPerSec === 'number'
          ? { localLlmLastTokPerSec: data.tokensPerSec }
          : {}),
      },
    });

    if (action !== 'continue') {
      logger.warn(
        {
          userId,
          sessionId: data.sessionId ?? null,
          prev: prevTier,
          next: safeNext,
          action,
          thermalState: data.thermalState,
        },
        'Tier action triggered by telemetry',
      );
    }

    res.json({
      tier: safeNext,
      action,
      ...(action !== 'continue' ? { newTier: safeNext } : {}),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Ungültige Telemetrie-Daten', details: error.errors });
      return;
    }
    logger.error(error, 'Telemetry hardware probe error');
    res.status(500).json({ error: 'Telemetrie-Probe konnte nicht verarbeitet werden' });
  }
});
