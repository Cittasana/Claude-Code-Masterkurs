import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { writeRateLimit } from '../middleware/rateLimit.js';
import { sanitizeUserInput } from '../lib/sanitize.js';

export const showcaseRouter = Router();

// ── Validation ───────────────────────────────────────────────

const createShowcaseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  projectId: z.string().max(100).optional(),
  githubUrl: z.string().url().max(500).optional(),
  liveUrl: z.string().url().max(500).optional(),
  imageUrl: z.string().url().max(500).optional(),
});

// ── GET /api/showcase ─────────────────────────────────────────
// List all approved showcase entries

showcaseRouter.get('/', optionalAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page) || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit) || '30')));
    const offset = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      prisma.showcaseEntry.findMany({
        where: { approved: true },
        include: {
          user: { select: { id: true, displayName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.showcaseEntry.count({ where: { approved: true } }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = (entries as any[]).map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      projectId: e.projectId,
      githubUrl: e.githubUrl,
      liveUrl: e.liveUrl,
      imageUrl: e.imageUrl,
      approved: e.approved,
      createdAt: e.createdAt.toISOString(),
      author: e.user.displayName,
      authorId: e.user.id,
    }));

    res.json({ entries: mapped, total, page, limit });
  } catch (error) {
    logger.error(error, 'Get showcase entries error');
    res.status(500).json({ error: 'Showcase-Eintraege konnten nicht geladen werden' });
  }
});

// ── POST /api/showcase ────────────────────────────────────────
// Submit a new showcase entry (requires auth, pending moderation)

showcaseRouter.post('/', requireAuth, writeRateLimit, async (req, res) => {
  try {
    const data = createShowcaseSchema.parse(req.body);

    // XSS-Schutz: Benutzereingaben sanitizen
    const safeData = {
      ...data,
      title: sanitizeUserInput(data.title),
      description: sanitizeUserInput(data.description),
    };

    const entry = await prisma.showcaseEntry.create({
      data: {
        ...safeData,
        userId: req.user!.userId,
        approved: false, // Requires moderation
      },
      include: {
        user: { select: { id: true, displayName: true } },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = entry as any;
    res.status(201).json({
      id: e.id,
      title: e.title,
      description: e.description,
      projectId: e.projectId,
      githubUrl: e.githubUrl,
      liveUrl: e.liveUrl,
      imageUrl: e.imageUrl,
      approved: e.approved,
      createdAt: e.createdAt.toISOString(),
      author: e.user.displayName,
      authorId: e.user.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Create showcase entry error');
    res.status(500).json({ error: 'Showcase-Eintrag konnte nicht erstellt werden' });
  }
});
