// ─────────────────────────────────────────────────────────────────────────────
// /api/tutor — Phase 3 Tutor-Chat endpoints
// -----------------------------------------------------------------------------
//   POST   /api/tutor/chat               → SSE stream (chat turn)
//   GET    /api/tutor/sessions           → paginated session list
//   DELETE /api/tutor/sessions/:id       → hard-delete a session (+ cascade)
//
// All endpoints require auth. Chat additionally runs `tutorRateLimit`.
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { tutorRateLimit } from '../middleware/tutorRateLimit.js';
import {
  route as routeTutor,
  type TrackKey,
  type TutorHistoryMessage,
  type TutorStreamEvent,
} from '../lib/tutor-router.js';
import { TIER_CATALOG, type TierKey } from '../lib/local-llm-tier-catalog.js';

export const tutorRouter = Router();

tutorRouter.use(requireAuth);

// ── Helpers ──────────────────────────────────────────────────────────────

function sseWrite(
  res: import('express').Response,
  event: string,
  data: unknown
): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
  // Force-flush per event so buffering proxies (Cloudflare, nginx) don't
  // hold the stream until a write-buffer fills. Without flush the user sees
  // chunked-but-late tokens; with it, true token-by-token streaming.
  // `flush` exists when compression middleware is in the pipe; optional-chain
  // handles raw-stream responses.
  (res as { flush?: () => void }).flush?.();
}

function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * In-memory idempotency cache for the /chat endpoint.
 *
 * Maps `sessionId` → `{hash, ts}` of the most recent user message. The chat
 * route consults this cache BEFORE doing the DB findFirst → create dance.
 * That makes the dedupe atomic on a single Node process (Railway runs this
 * server as a single instance today; if we ever scale to multi-instance,
 * swap this for a Redis SETNX with TTL).
 *
 * Entries auto-expire after `IDEMPOTENCY_WINDOW_MS`. We also lazy-GC on
 * every check so the Map can't grow unbounded.
 */
const IDEMPOTENCY_WINDOW_MS = 5_000;
const recentMessages = new Map<string, { hash: string; ts: number }>();

function checkIdempotency(sessionId: string, hash: string): boolean {
  const now = Date.now();
  // Lazy GC: drop expired entries on each call. Cheap because the Map is
  // bounded by the count of concurrent live tutor sessions.
  for (const [key, entry] of recentMessages) {
    if (now - entry.ts > IDEMPOTENCY_WINDOW_MS) recentMessages.delete(key);
  }
  const prev = recentMessages.get(sessionId);
  return !!prev && prev.hash === hash && now - prev.ts <= IDEMPOTENCY_WINDOW_MS;
}

function markIdempotency(sessionId: string, hash: string): void {
  recentMessages.set(sessionId, { hash, ts: Date.now() });
}

const TRACK_VALUES = [
  'claude-code',
  'claude-desktop',
  'codex',
  'local-llm',
] as const;

// ── POST /api/tutor/chat ─────────────────────────────────────────────────

const chatSchema = z.object({
  track: z.enum(TRACK_VALUES),
  lessonId: z.number().int().optional(),
  message: z.string().min(1).max(8000),
  sessionId: z.string().optional(),
});

tutorRouter.post('/chat', tutorRateLimit, async (req, res) => {
  let parsed: z.infer<typeof chatSchema>;
  try {
    parsed = chatSchema.parse(req.body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0]?.message ?? 'Ungültige Eingabe' });
      return;
    }
    throw err;
  }

  const userId = req.user!.userId;
  const rateInfo = req.tutorRateLimit!;

  // ── 1. Load or create the session.
  let session;
  if (parsed.sessionId) {
    session = await prisma.tutorSession.findUnique({
      where: { id: parsed.sessionId },
    });
    if (!session || session.userId !== userId) {
      res.status(404).json({ error: 'Session nicht gefunden' });
      return;
    }
  } else {
    session = await prisma.tutorSession.create({
      data: {
        userId,
        track: parsed.track,
        lessonId: parsed.lessonId ?? null,
      },
    });
  }

  // ── 2. Idempotency: same user content within the last 5s on the same
  //      session is treated as a retry — we don't re-insert, and we
  //      return a short-circuit SSE that closes the connection cleanly.
  //
  //      Atomic check via in-memory Map (`checkIdempotency`) — eliminates
  //      the find+create race that a DB-only check would have. Concurrent
  //      double-fire of identical content is collapsed to a single insert.
  const incomingHash = hashContent(parsed.message);
  const isDuplicate = checkIdempotency(session.id, incomingHash);

  // Begin SSE headers up front so any subsequent error is delivered via SSE.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  if (isDuplicate) {
    sseWrite(res, 'done', {
      sessionId: session.id,
      totalTokens: 0,
      idempotent: true,
    });
    res.end();
    return;
  }

  // ── 3. Persist user message (counts toward rate limit next time).
  // Mark idempotency BEFORE the await so a concurrent second request
  // sees the in-memory entry even if the DB insert is still in flight.
  markIdempotency(session.id, incomingHash);
  await prisma.tutorMessage.create({
    data: {
      sessionId: session.id,
      role: 'user',
      content: parsed.message,
    },
  });

  // ── 4. Build history for the model. The most-recently-inserted row is
  //      the user message from step 3 — `.slice(0, -1)` drops it so the
  //      router doesn't see it twice (router prepends `userMessage`
  //      explicitly).
  const priorMessages = await prisma.tutorMessage.findMany({
    where: {
      sessionId: session.id,
      role: { in: ['user', 'assistant'] },
    },
    orderBy: { createdAt: 'asc' },
  });

  const history: TutorHistoryMessage[] = priorMessages
    .slice(0, -1)
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

  // ── 5. Emit a soft-cap warning before streaming, if applicable.
  if (rateInfo.softCapWarning) {
    sseWrite(res, 'rate-limit-warning', rateInfo.softCapWarning);
  }

  // ── 6. For local-llm: resolve the Ollama model from the user's stored tier
  //      so the prompt-ready event can carry it. Browser cannot guess.
  let localLlmModel: string | undefined;
  if (parsed.track === 'local-llm') {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { localLlmTutorTier: true },
    });
    const tier = (u?.localLlmTutorTier ?? null) as TierKey | null;
    if (tier && tier !== 'unknown' && tier !== 'unsupported') {
      localLlmModel = TIER_CATALOG[tier].recommendedModel;
    }
    // Else: tutor-router's route() applies its default fallback model.
  }

  // ── 7. Stream events from the router.
  let assistantContent = '';
  let totalTokens = 0;
  let errored = false;

  try {
    const generator = routeTutor({
      track: parsed.track as TrackKey,
      tier: rateInfo.tier,
      lessonId: parsed.lessonId ?? null,
      userMessage: parsed.message,
      history,
      localLlmModel,
    });

    for await (const ev of generator as AsyncGenerator<TutorStreamEvent>) {
      if (ev.type === 'token') {
        sseWrite(res, 'token', { value: ev.value });
      } else if (ev.type === 'prompt-ready') {
        sseWrite(res, 'prompt-ready', {
          systemPrompt: ev.systemPrompt,
          history: ev.history,
          userMessage: ev.userMessage,
          model: ev.model,
          sessionId: session.id,
        });
      } else if (ev.type === 'done') {
        assistantContent = ev.assistantContent;
        totalTokens = ev.totalTokens;
      } else if (ev.type === 'error') {
        errored = true;
        sseWrite(res, 'error', {
          code: ev.code,
          message: ev.message,
          hint: ev.hint,
        });
      }
    }
  } catch (err) {
    errored = true;
    logger.error(err, 'tutor /chat stream error');
    sseWrite(res, 'error', {
      code: 'stream_failed',
      message: err instanceof Error ? err.message : 'Unbekannter Fehler.',
    });
  }

  // ── 7. Persist assistant message for cloud track (local-llm persists
  //      its assistant turn client-side via a separate endpoint later).
  if (!errored && parsed.track !== 'local-llm' && assistantContent.length > 0) {
    await prisma.tutorMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: assistantContent,
        tokenCount: totalTokens || null,
      },
    });
  }

  if (!errored) {
    sseWrite(res, 'done', {
      sessionId: session.id,
      totalTokens,
    });
  }
  res.end();
});

// ── GET /api/tutor/sessions ──────────────────────────────────────────────

const sessionsListSchema = z.object({
  track: z.enum(TRACK_VALUES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

tutorRouter.get('/sessions', async (req, res) => {
  try {
    const { track, limit, cursor } = sessionsListSchema.parse(req.query);
    const userId = req.user!.userId;

    const where: Record<string, unknown> = { userId };
    if (track) where.track = track;
    if (cursor) {
      const cursorDate = new Date(cursor);
      if (!Number.isNaN(cursorDate.getTime())) {
        where.createdAt = { lt: cursorDate };
      }
    }

    const rows = await prisma.tutorSession.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // +1 to detect next page
      include: {
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, role: true, createdAt: true },
        },
      },
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && page.length > 0
        ? page[page.length - 1].createdAt.toISOString()
        : undefined;

    res.json({
      sessions: page.map((s) => ({
        id: s.id,
        track: s.track,
        lessonId: s.lessonId,
        createdAt: s.createdAt,
        messageCount: s._count.messages,
        lastMessage: s.messages[0]
          ? {
              role: s.messages[0].role,
              content: s.messages[0].content.slice(0, 280),
              createdAt: s.messages[0].createdAt,
            }
          : null,
      })),
      ...(nextCursor ? { nextCursor } : {}),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0]?.message ?? 'Ungültige Anfrage' });
      return;
    }
    logger.error(err, 'tutor /sessions error');
    res.status(500).json({ error: 'Sessions konnten nicht geladen werden' });
  }
});

// ── DELETE /api/tutor/sessions/:id ───────────────────────────────────────

tutorRouter.delete('/sessions/:id', async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const session = await prisma.tutorSession.findUnique({ where: { id } });
    if (!session || session.userId !== userId) {
      res.status(404).json({ error: 'Session nicht gefunden' });
      return;
    }

    // Hard delete — cascading delete of TutorMessage is configured on the
    // schema's `onDelete: Cascade`. This fulfills the user-setting
    // "Delete my tutor history" compliance requirement.
    await prisma.tutorSession.delete({ where: { id } });

    res.json({ deleted: true, id });
  } catch (err) {
    logger.error(err, 'tutor DELETE /sessions error');
    res.status(500).json({ error: 'Session konnte nicht gelöscht werden' });
  }
});
