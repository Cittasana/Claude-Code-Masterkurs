import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

export const challengesRouter = Router();

// All challenge routes require authentication
challengesRouter.use(requireAuth);

// ── GET /api/challenges/results ──────────────────────────────
// Get all challenge results for the current user

challengesRouter.get('/results', async (req, res) => {
  try {
    const results = await prisma.challengeResult.findMany({
      where: { userId: req.user!.userId },
    });

    // Map to Record<challengeId, ChallengeResult> format (like the frontend store)
    const mapped: Record<string, unknown> = {};
    for (const r of results) {
      mapped[r.challengeId] = {
        challengeId: r.challengeId,
        completed: r.completed,
        score: r.score,
        maxScore: r.maxScore,
        timeUsed: r.timeUsed,
        attempts: r.attempts,
        completedAt: r.completedAt?.toISOString(),
      };
    }

    res.json({ results: mapped });
  } catch (error) {
    logger.error(error, 'Get challenge results error');
    res.status(500).json({ error: 'Ergebnisse konnten nicht geladen werden' });
  }
});

// ── POST /api/challenges/results ─────────────────────────────
// Save or update a challenge result (keeps best score)

const challengeResultSchema = z.object({
  challengeId: z.string(),
  completed: z.boolean(),
  score: z.number().min(0),
  maxScore: z.number().min(0),
  timeUsed: z.number().min(0),
});

challengesRouter.post('/results', async (req, res) => {
  try {
    const data = challengeResultSchema.parse(req.body);

    // Check if existing result has a better score
    const existing = await prisma.challengeResult.findUnique({
      where: {
        userId_challengeId: {
          userId: req.user!.userId,
          challengeId: data.challengeId,
        },
      },
    });

    let result;
    if (existing && existing.score >= data.score) {
      // Only increment attempts, keep better score
      result = await prisma.challengeResult.update({
        where: { id: existing.id },
        data: { attempts: existing.attempts + 1 },
      });
    } else {
      // Upsert with new best score
      result = await prisma.challengeResult.upsert({
        where: {
          userId_challengeId: {
            userId: req.user!.userId,
            challengeId: data.challengeId,
          },
        },
        update: {
          completed: data.completed,
          score: data.score,
          maxScore: data.maxScore,
          timeUsed: data.timeUsed,
          attempts: existing ? existing.attempts + 1 : 1,
          completedAt: data.completed ? new Date() : undefined,
        },
        create: {
          userId: req.user!.userId,
          challengeId: data.challengeId,
          completed: data.completed,
          score: data.score,
          maxScore: data.maxScore,
          timeUsed: data.timeUsed,
          attempts: 1,
          completedAt: data.completed ? new Date() : undefined,
        },
      });
    }

    res.json({
      challengeId: result.challengeId,
      completed: result.completed,
      score: result.score,
      maxScore: result.maxScore,
      timeUsed: result.timeUsed,
      attempts: result.attempts,
      completedAt: result.completedAt?.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Save challenge result error');
    res.status(500).json({ error: 'Ergebnis konnte nicht gespeichert werden' });
  }
});
