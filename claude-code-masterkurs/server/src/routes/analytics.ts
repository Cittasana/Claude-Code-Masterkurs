import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

export const analyticsRouter = Router();

// All analytics routes require authentication
analyticsRouter.use(requireAuth);

// ── Validation ───────────────────────────────────────────────

const VALID_EVENT_TYPES = [
  'lesson_complete',
  'quiz_complete',
  'project_complete',
  'session_start',
  'review_complete',
  'learning_time',
] as const;

const logEventSchema = z.object({
  type: z.enum(VALID_EVENT_TYPES),
  metadata: z
    .object({
      lessonId: z.number().optional(),
      quizId: z.string().optional(),
      projectId: z.string().optional(),
      score: z.number().optional(),
      duration: z.number().optional(),
      context: z.string().optional(),
    })
    .optional(),
});

const batchEventsSchema = z.array(logEventSchema).max(50);

// ── GET /api/analytics/events ────────────────────────────────
// Get all analytics events for the current user

analyticsRouter.get('/events', async (req, res) => {
  try {
    const since = req.query.since as string | undefined;
    const type = req.query.type as string | undefined;
    const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit as string) || 500));

    const where: Record<string, unknown> = { userId: req.user!.userId };
    if (since) where.timestamp = { gte: new Date(since) };
    if (type) where.type = type;

    const events = await prisma.analyticsEvent.findMany({
      where,
      orderBy: { timestamp: 'asc' },
      take: limit,
    });

    res.json({
      events: events.map((e) => ({
        id: e.id,
        type: e.type,
        timestamp: e.timestamp.toISOString(),
        metadata: e.metadata,
      })),
    });
  } catch (error) {
    logger.error(error, 'Get analytics events error');
    res.status(500).json({ error: 'Events konnten nicht geladen werden' });
  }
});

// ── POST /api/analytics/events ───────────────────────────────
// Log a single analytics event

analyticsRouter.post('/events', async (req, res) => {
  try {
    const data = logEventSchema.parse(req.body);

    const event = await prisma.analyticsEvent.create({
      data: {
        userId: req.user!.userId,
        type: data.type,
        metadata: data.metadata ?? undefined,
      },
    });

    res.status(201).json({
      id: event.id,
      type: event.type,
      timestamp: event.timestamp.toISOString(),
      metadata: event.metadata,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Log analytics event error');
    res.status(500).json({ error: 'Event konnte nicht gespeichert werden' });
  }
});

// ── POST /api/analytics/events/batch ─────────────────────────
// Log multiple analytics events at once (for offline sync)

analyticsRouter.post('/events/batch', async (req, res) => {
  try {
    const events = batchEventsSchema.parse(req.body);

    const created = await prisma.analyticsEvent.createMany({
      data: events.map((e) => ({
        userId: req.user!.userId,
        type: e.type,
        metadata: e.metadata ?? undefined,
      })),
    });

    res.status(201).json({ created: created.count });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Batch log analytics events error');
    res.status(500).json({ error: 'Events konnten nicht gespeichert werden' });
  }
});

// ── GET /api/analytics/summary ───────────────────────────────
// Get aggregated analytics summary

analyticsRouter.get('/summary', async (req, res) => {
  try {
    const userId = req.user!.userId;

    const [totalEvents, eventsByType, recentEvents] = await Promise.all([
      prisma.analyticsEvent.count({ where: { userId } }),
      prisma.analyticsEvent.groupBy({
        by: ['type'],
        where: { userId },
        _count: true,
      }),
      prisma.analyticsEvent.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
    ]);

    const typeCounts: Record<string, number> = {};
    for (const group of eventsByType) {
      typeCounts[group.type] = group._count;
    }

    res.json({
      totalEvents,
      eventsByType: typeCounts,
      recentEvents: recentEvents.map((e) => ({
        id: e.id,
        type: e.type,
        timestamp: e.timestamp.toISOString(),
        metadata: e.metadata,
      })),
    });
  } catch (error) {
    logger.error(error, 'Get analytics summary error');
    res.status(500).json({ error: 'Zusammenfassung konnte nicht geladen werden' });
  }
});
