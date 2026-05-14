import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

// ── Tier types & classifier ──────────────────────────────────
// NOTE: This file's single source of truth for `TierKey` and
// `classifyTier()` lives in Lane A's `../lib/local-llm-tier-catalog.js`.
// At the time this lane was implemented, Lane A's file may not yet exist
// in the merged tree. The import below resolves post-merge. The local
// type alias below is a duplicate-of (kept in sync with) Lane A's export
// and exists ONLY so the route-file type-checks in isolation.
//
// duplicate of local-llm-tier-catalog.ts (Lane A) — single source of truth post-merge
export type TierKey = 'tier-s' | 'tier-m' | 'tier-l' | 'unsupported' | 'unknown';

// Imported from Lane A. The TS-build will report a missing-module error
// here until Lane A merges; this is documented in the task contract and
// will be resolved by the merge.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- Lane A merge brings this module; see comment above.
import { classifyTier } from '../lib/local-llm-tier-catalog.js';

// ── Router ───────────────────────────────────────────────────

export const tutorHardwareRouter = Router();

// All hardware-probe endpoints require auth.
tutorHardwareRouter.use(requireAuth);

// ── Shared helpers ───────────────────────────────────────────

const TIER_KEYS = ['tier-s', 'tier-m', 'tier-l', 'unsupported', 'unknown'] as const;
const tierKeySchema = z.enum(TIER_KEYS);

// Tier ordering for downgrade-detection. Higher index = stronger tier.
// `unknown` is treated as "no opinion" and never triggers a downgrade.
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

// Recommended model per tier (kept inline for now; can be moved to Lane A
// catalog if/when the catalog grows a model-mapping table).
function recommendedModelFor(tier: TierKey): string {
  switch (tier) {
    case 'tier-l':
      return 'llama3.1:70b-instruct-q4_K_M';
    case 'tier-m':
      return 'llama3.1:8b-instruct-q5_K_M';
    case 'tier-s':
      return 'llama3.2:3b-instruct-q4_K_M';
    case 'unsupported':
    case 'unknown':
    default:
      return 'none';
  }
}

// ── POST /api/tutor/probe/static ─────────────────────────────
// Client sends static hardware info (RAM, GPU vendor/VRAM, CPU, arch)
// gathered from `navigator` / `gpu` APIs. We classify and persist.

const staticProbeSchema = z.object({
  totalRamGB: z.number().positive().max(2048),
  gpuVendor: z.string().min(1).max(64).optional(),
  gpuVramGB: z.number().nonnegative().max(512).optional(),
  cpuModel: z.string().min(1).max(128).optional(),
  osArch: z.string().min(1).max(32).optional(),
});

tutorHardwareRouter.post('/probe/static', async (req, res) => {
  try {
    const data = staticProbeSchema.parse(req.body);
    const userId = req.user!.userId;

    const tier: TierKey = classifyTier({
      totalRamGB: data.totalRamGB,
      gpuVramGB: data.gpuVramGB,
    });

    // Validate the classifier output (defensive: Lane A could regress).
    const safeTier = tierKeySchema.parse(tier);

    const now = new Date();
    await prisma.user.update({
      where: { id: userId },
      data: {
        localLlmTutorTier: safeTier,
        localLlmLastProbeAt: now,
      },
    });

    res.json({
      tier: safeTier,
      reason: safeTier === 'unsupported'
        ? 'RAM/GPU below minimum requirements for local LLM tutor'
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
// Client measured tokens/sec by running a short prompt through local
// Ollama. We re-classify with the actual throughput data and persist.

const benchmarkProbeSchema = z.object({
  tokensPerSec: z.number().nonnegative().max(10000),
  timeToFirstTokenMs: z.number().nonnegative().max(600_000),
  peakRamGB: z.number().nonnegative().max(2048),
});

tutorHardwareRouter.post('/probe/benchmark', async (req, res) => {
  try {
    const data = benchmarkProbeSchema.parse(req.body);
    const userId = req.user!.userId;

    // Load the most recent static probe so the classifier has RAM context.
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        localLlmTutorTier: true,
      },
    });

    const tier: TierKey = classifyTier({
      totalRamGB: data.peakRamGB,
      tokensPerSec: data.tokensPerSec,
    });
    const safeTier = tierKeySchema.parse(tier);

    const now = new Date();
    await prisma.user.update({
      where: { id: userId },
      data: {
        localLlmTutorTier: safeTier,
        localLlmLastProbeAt: now,
        localLlmLastTokPerSec: data.tokensPerSec,
      },
    });

    logger.info(
      { userId, prev: currentUser?.localLlmTutorTier ?? null, next: safeTier, tokensPerSec: data.tokensPerSec },
      'Benchmark probe classified'
    );

    res.json({
      tier: safeTier,
      recommendedModel: recommendedModelFor(safeTier),
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
// Live in-session telemetry, posted ~every 30s. We re-classify with the
// current tokensPerSec; if the new tier ranks below the stored tier we
// signal a downgrade (SSE-event 'tier-downgrade' is wired up on the
// chat-route by Lane B). If `unsupported`, we signal a session close.

const telemetrySchema = z.object({
  sessionId: z.string().min(1).max(128),
  tokensPerSec: z.number().nonnegative().max(10000),
  peakRamGB: z.number().nonnegative().max(2048),
  thermalState: z.enum(['nominal', 'fair', 'serious', 'critical']).optional(),
});

type TelemetryAction = 'continue' | 'downgrade' | 'close';

tutorHardwareRouter.post('/probe/telemetry', async (req, res) => {
  try {
    const data = telemetrySchema.parse(req.body);
    const userId = req.user!.userId;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        localLlmTutorTier: true,
      },
    });

    const prevTier = (currentUser?.localLlmTutorTier ?? null) as TierKey | null;

    const nextTier: TierKey = classifyTier({
      totalRamGB: data.peakRamGB,
      tokensPerSec: data.tokensPerSec,
    });
    const safeNext = tierKeySchema.parse(nextTier);

    // Decide action.
    let action: TelemetryAction = 'continue';
    let returnNewTier: TierKey | undefined = undefined;

    if (safeNext === 'unsupported') {
      action = 'close';
      returnNewTier = safeNext;
    } else if (isDowngrade(prevTier, safeNext)) {
      action = 'downgrade';
      returnNewTier = safeNext;
    }

    // Persist if the tier changed OR on every telemetry write to keep
    // lastProbeAt + lastTokPerSec fresh (cheap update, single row).
    await prisma.user.update({
      where: { id: userId },
      data: {
        localLlmTutorTier: safeNext,
        localLlmLastProbeAt: new Date(),
        localLlmLastTokPerSec: data.tokensPerSec,
      },
    });

    if (action !== 'continue') {
      logger.warn(
        { userId, sessionId: data.sessionId, prev: prevTier, next: safeNext, action, thermalState: data.thermalState },
        'Tier action triggered by telemetry'
      );
    }

    res.json({
      tier: safeNext,
      action,
      ...(returnNewTier ? { newTier: returnNewTier } : {}),
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
