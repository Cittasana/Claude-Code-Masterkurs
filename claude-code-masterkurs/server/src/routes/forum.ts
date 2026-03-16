import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { writeRateLimit } from '../middleware/rateLimit.js';
import { sanitizeUserInput } from '../lib/sanitize.js';
import { notifyNewForumPost } from '../lib/discord-webhooks.js';

export const forumRouter = Router();

// ── Validation ───────────────────────────────────────────────

const VALID_CATEGORIES = [
  'allgemein',
  'lektionen',
  'projekte',
  'tipps',
  'feedback',
] as const;

const createThreadSchema = z.object({
  categoryId: z.enum(VALID_CATEGORIES),
  title: z.string().min(3, 'Titel zu kurz').max(200),
  body: z.string().min(10, 'Inhalt zu kurz').max(10000),
});

const createReplySchema = z.object({
  body: z.string().min(1, 'Antwort darf nicht leer sein').max(5000),
});

// ── Helper: req.params.id sicher als string ──────────────────
function paramId(req: { params: Record<string, unknown> }): string {
  return String(req.params.id ?? '');
}

// ── GET /api/forum/threads ───────────────────────────────────
// List threads, optionally filtered by category

forumRouter.get('/threads', optionalAuth, async (req, res) => {
  try {
    const categoryId = req.query.category as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const where = categoryId ? { categoryId } : {};

    const [threads, total] = await Promise.all([
      prisma.forumThread.findMany({
        where,
        include: {
          author: { select: { id: true, displayName: true, avatarEmoji: true } },
          _count: { select: { replies: true } },
        },
        orderBy: [{ pinned: 'desc' }, { lastActivityAt: 'desc' }],
        skip: offset,
        take: limit,
      }),
      prisma.forumThread.count({ where }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = threads.map((t: any) => ({
      id: t.id,
      categoryId: t.categoryId,
      title: t.title,
      body: t.body,
      author: t.author.displayName,
      authorId: t.author.id,
      avatarEmoji: t.author.avatarEmoji,
      createdAt: t.createdAt.toISOString(),
      replyCount: t._count.replies,
      lastActivityAt: t.lastActivityAt.toISOString(),
      pinned: t.pinned,
    }));

    res.json({ threads: mapped, total, page, limit });
  } catch (error) {
    logger.error(error, 'Get forum threads error');
    res.status(500).json({ error: 'Threads konnten nicht geladen werden' });
  }
});

// ── GET /api/forum/threads/:id ───────────────────────────────
// Get a single thread with its replies

forumRouter.get('/threads/:id', optionalAuth, async (req, res) => {
  try {
    const id = paramId(req);

    const thread = await prisma.forumThread.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, displayName: true, avatarEmoji: true } },
        replies: {
          include: {
            author: { select: { id: true, displayName: true, avatarEmoji: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!thread) {
      res.status(404).json({ error: 'Thread nicht gefunden' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = thread as any;

    res.json({
      id: t.id,
      categoryId: t.categoryId,
      title: t.title,
      body: t.body,
      author: t.author.displayName,
      authorId: t.author.id,
      avatarEmoji: t.author.avatarEmoji,
      createdAt: t.createdAt.toISOString(),
      replyCount: t.replies.length,
      lastActivityAt: t.lastActivityAt.toISOString(),
      pinned: t.pinned,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replies: t.replies.map((r: any) => ({
        id: r.id,
        threadId: r.threadId,
        body: r.body,
        author: r.author.displayName,
        authorId: r.author.id,
        avatarEmoji: r.author.avatarEmoji,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    logger.error(error, 'Get forum thread error');
    res.status(500).json({ error: 'Thread konnte nicht geladen werden' });
  }
});

// ── POST /api/forum/threads ──────────────────────────────────
// Create a new thread

forumRouter.post('/threads', requireAuth, writeRateLimit, async (req, res) => {
  try {
    const data = createThreadSchema.parse(req.body);

    // XSS-Schutz: Benutzereingaben sanitizen
    const safeTitle = sanitizeUserInput(data.title);
    const safeBody = sanitizeUserInput(data.body);

    const thread = await prisma.forumThread.create({
      data: {
        categoryId: data.categoryId,
        title: safeTitle,
        body: safeBody,
        authorId: req.user!.userId,
      },
      include: {
        author: { select: { id: true, displayName: true, avatarEmoji: true } },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = thread as any;

    // Discord webhook notification (non-blocking)
    notifyNewForumPost({
      title: t.title,
      categoryId: t.categoryId,
      author: t.author.displayName,
    }).catch(() => {});

    res.status(201).json({
      id: t.id,
      categoryId: t.categoryId,
      title: t.title,
      body: t.body,
      author: t.author.displayName,
      authorId: t.author.id,
      createdAt: t.createdAt.toISOString(),
      replyCount: 0,
      lastActivityAt: t.lastActivityAt.toISOString(),
      pinned: t.pinned,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Create forum thread error');
    res.status(500).json({ error: 'Thread konnte nicht erstellt werden' });
  }
});

// ── POST /api/forum/threads/:id/replies ──────────────────────
// Add a reply to a thread

forumRouter.post(
  '/threads/:id/replies',
  requireAuth,
  writeRateLimit,
  async (req, res) => {
    try {
      const id = paramId(req);
      const data = createReplySchema.parse(req.body);

      // XSS-Schutz: Benutzereingaben sanitizen
      const safeBody = sanitizeUserInput(data.body);

      // Verify thread exists
      const thread = await prisma.forumThread.findUnique({
        where: { id },
      });
      if (!thread) {
        res.status(404).json({ error: 'Thread nicht gefunden' });
        return;
      }

      const reply = await prisma.forumReply.create({
        data: {
          threadId: id,
          body: safeBody,
          authorId: req.user!.userId,
        },
        include: {
          author: {
            select: { id: true, displayName: true, avatarEmoji: true },
          },
        },
      });

      // Update thread's lastActivityAt
      await prisma.forumThread.update({
        where: { id },
        data: { lastActivityAt: new Date() },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = reply as any;

      res.status(201).json({
        id: r.id,
        threadId: r.threadId,
        body: r.body,
        author: r.author.displayName,
        authorId: r.author.id,
        avatarEmoji: r.author.avatarEmoji,
        createdAt: r.createdAt.toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      logger.error(error, 'Create forum reply error');
      res.status(500).json({ error: 'Antwort konnte nicht erstellt werden' });
    }
  }
);
