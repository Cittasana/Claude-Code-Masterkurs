import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { writeRateLimit } from '../middleware/rateLimit.js';

export const patternsRouter = Router();

// ── Validation ───────────────────────────────────────────────

const VALID_CATEGORIES = [
  'Prompts',
  'CLAUDE.md',
  'Workflows',
  'MCP',
  'Skills',
  'Sonstige',
] as const;

const createPatternSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  category: z.enum(VALID_CATEGORIES),
  snippet: z.string().min(1).max(10000),
  language: z.string().max(50).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  useCase: z.string().max(500).optional(),
});

// ── GET /api/patterns ────────────────────────────────────────
// List all community patterns, optionally filtered by category

patternsRouter.get('/', optionalAuth, async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 30));
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [patterns, total] = await Promise.all([
      prisma.communityPattern.findMany({
        where,
        include: {
          author: { select: { id: true, displayName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.communityPattern.count({ where }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = (patterns as any[]).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      author: p.author.displayName,
      authorId: p.author.id,
      snippet: p.snippet,
      language: p.language,
      tags: p.tags,
      useCase: p.useCase,
      createdAt: p.createdAt.toISOString(),
    }));

    res.json({ patterns: mapped, total, page, limit });
  } catch (error) {
    logger.error(error, 'Get patterns error');
    res.status(500).json({ error: 'Patterns konnten nicht geladen werden' });
  }
});

// ── POST /api/patterns ───────────────────────────────────────
// Create a new community pattern

patternsRouter.post('/', requireAuth, writeRateLimit, async (req, res) => {
  try {
    const data = createPatternSchema.parse(req.body);

    const pattern = await prisma.communityPattern.create({
      data: {
        ...data,
        authorId: req.user!.userId,
      },
      include: {
        author: { select: { id: true, displayName: true } },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = pattern as any;
    res.status(201).json({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      author: p.author.displayName,
      authorId: p.author.id,
      snippet: p.snippet,
      language: p.language,
      tags: p.tags,
      useCase: p.useCase,
      createdAt: p.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Create pattern error');
    res.status(500).json({ error: 'Pattern konnte nicht erstellt werden' });
  }
});
