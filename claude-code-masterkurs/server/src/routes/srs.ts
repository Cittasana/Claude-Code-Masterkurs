import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

export const srsRouter = Router();

// All SRS routes require authentication
srsRouter.use(requireAuth);

// SRS intervals in days (matching frontend SRS_INTERVALS_DAYS)
const SRS_INTERVALS_DAYS = [1, 3, 7, 14];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ── GET /api/srs ─────────────────────────────────────────────
// Get all SRS items for the current user

srsRouter.get('/', async (req, res) => {
  try {
    const items = await prisma.sRSItem.findMany({
      where: { userId: req.user!.userId },
    });

    // Map to Record<lessonId, SRSItem> format (like the frontend store)
    const mapped: Record<number, unknown> = {};
    for (const item of items) {
      mapped[item.lessonId] = {
        lessonId: item.lessonId,
        nextReviewAt: item.nextReviewAt.toISOString(),
        intervalIndex: item.intervalIndex,
        lastReviewedAt: item.lastReviewedAt?.toISOString(),
        timesReviewed: item.timesReviewed,
      };
    }

    res.json({ items: mapped });
  } catch (error) {
    logger.error(error, 'Get SRS items error');
    res.status(500).json({ error: 'SRS-Daten konnten nicht geladen werden' });
  }
});

// ── GET /api/srs/due ─────────────────────────────────────────
// Get lesson IDs that are due for review

srsRouter.get('/due', async (req, res) => {
  try {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const dueItems = await prisma.sRSItem.findMany({
      where: {
        userId: req.user!.userId,
        nextReviewAt: { lte: endOfToday },
      },
      orderBy: { lessonId: 'asc' },
    });

    res.json({
      dueCount: dueItems.length,
      lessonIds: dueItems.map((i) => i.lessonId),
    });
  } catch (error) {
    logger.error(error, 'Get due SRS items error');
    res.status(500).json({ error: 'Fällige Wiederholungen konnten nicht geladen werden' });
  }
});

// ── POST /api/srs/add ────────────────────────────────────────
// Add a lesson to the SRS schedule

const addSchema = z.object({
  lessonId: z.number().int().min(0),
});

srsRouter.post('/add', async (req, res) => {
  try {
    const { lessonId } = addSchema.parse(req.body);

    const existing = await prisma.sRSItem.findUnique({
      where: {
        userId_lessonId: {
          userId: req.user!.userId,
          lessonId,
        },
      },
    });

    if (existing) {
      res.json({
        lessonId: existing.lessonId,
        nextReviewAt: existing.nextReviewAt.toISOString(),
        intervalIndex: existing.intervalIndex,
        timesReviewed: existing.timesReviewed,
      });
      return;
    }

    const nextReview = addDays(new Date(), SRS_INTERVALS_DAYS[0]);

    const item = await prisma.sRSItem.create({
      data: {
        userId: req.user!.userId,
        lessonId,
        nextReviewAt: nextReview,
        intervalIndex: 0,
        timesReviewed: 0,
      },
    });

    res.status(201).json({
      lessonId: item.lessonId,
      nextReviewAt: item.nextReviewAt.toISOString(),
      intervalIndex: item.intervalIndex,
      timesReviewed: item.timesReviewed,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Add SRS item error');
    res.status(500).json({ error: 'Lektion konnte nicht hinzugefügt werden' });
  }
});

// ── POST /api/srs/review ─────────────────────────────────────
// Record a review (remembered or not)

const reviewSchema = z.object({
  lessonId: z.number().int().min(0),
  remembered: z.boolean(),
});

srsRouter.post('/review', async (req, res) => {
  try {
    const { lessonId, remembered } = reviewSchema.parse(req.body);

    const existing = await prisma.sRSItem.findUnique({
      where: {
        userId_lessonId: {
          userId: req.user!.userId,
          lessonId,
        },
      },
    });

    if (!existing) {
      res.status(404).json({ error: 'Lektion nicht im SRS gefunden' });
      return;
    }

    let nextIntervalIndex: number;
    if (remembered) {
      nextIntervalIndex = Math.min(
        existing.intervalIndex + 1,
        SRS_INTERVALS_DAYS.length - 1
      );
    } else {
      nextIntervalIndex = 0;
    }

    const nextReview = addDays(new Date(), SRS_INTERVALS_DAYS[nextIntervalIndex]);

    const item = await prisma.sRSItem.update({
      where: { id: existing.id },
      data: {
        nextReviewAt: nextReview,
        intervalIndex: nextIntervalIndex,
        lastReviewedAt: new Date(),
        timesReviewed: existing.timesReviewed + 1,
      },
    });

    res.json({
      lessonId: item.lessonId,
      nextReviewAt: item.nextReviewAt.toISOString(),
      intervalIndex: item.intervalIndex,
      lastReviewedAt: item.lastReviewedAt?.toISOString(),
      timesReviewed: item.timesReviewed,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Record SRS review error');
    res.status(500).json({ error: 'Review konnte nicht gespeichert werden' });
  }
});
