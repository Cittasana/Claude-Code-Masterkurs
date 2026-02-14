import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { writeRateLimit } from '../middleware/rateLimit.js';

export const adminRouter = Router();

// All admin routes require auth + admin role
adminRouter.use(requireAuth, requireAdmin);

// ── Validation Schemas ──────────────────────────────────────────

const lektionSchema = z.object({
  titel: z.string().min(1, 'Titel ist erforderlich'),
  slug: z.string().min(1, 'Slug ist erforderlich'),
  beschreibung: z.string().optional(),
  content: z.string().min(1, 'Content ist erforderlich'),
  kategorie: z.enum(['basics', 'fortgeschritten', 'experten', 'tools']).default('basics'),
  reihenfolge: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('draft'),
});

const toolSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  slug: z.string().min(1, 'Slug ist erforderlich'),
  beschreibung: z.string().optional(),
  content: z.string().optional(),
  kategorie: z.enum(['anfaenger', 'fortgeschritten', 'experten', 'mcp']).default('anfaenger'),
  icon: z.string().default('Terminal'),
  reihenfolge: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

const researchSchema = z.object({
  topic: z.string().min(1, 'Topic ist erforderlich'),
  quelle: z.enum(['web', 'github', 'stackoverflow', 'docs']),
});

// ── GET /api/admin/dashboard ────────────────────────────────────

adminRouter.get('/dashboard', async (_req, res) => {
  try {
    const [totalUsers, activeSubscriptions, lektionenCount, toolsCount] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.lektion.count(),
      prisma.tool.count(),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeSubscriptions,
        lektionenCount,
        toolsCount,
      },
    });
  } catch (error) {
    logger.error(error, 'Admin dashboard error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/lektionen ────────────────────────────────────

adminRouter.get('/lektionen', async (req, res) => {
  try {
    const { kategorie, status, search } = req.query;

    const where: Record<string, unknown> = {};
    if (kategorie && kategorie !== 'all') where.kategorie = kategorie;
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { titel: { contains: search as string, mode: 'insensitive' } },
        { beschreibung: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const lektionen = await prisma.lektion.findMany({
      where,
      orderBy: { reihenfolge: 'asc' },
      include: {
        autor: { select: { displayName: true, email: true } },
      },
    });

    res.json({ success: true, data: lektionen, count: lektionen.length });
  } catch (error) {
    logger.error(error, 'Admin lektionen list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/lektionen ───────────────────────────────────

adminRouter.post('/lektionen', writeRateLimit, async (req, res) => {
  try {
    const data = lektionSchema.parse(req.body);

    const lektion = await prisma.lektion.create({
      data: {
        ...data,
        autorId: req.user!.userId,
        publishedAt: data.status === 'published' ? new Date() : null,
      },
    });

    res.status(201).json({ success: true, data: lektion });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Admin lektion create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/lektionen/:id ────────────────────────────────

adminRouter.get('/lektionen/:id', async (req, res) => {
  try {
    const lektion = await prisma.lektion.findUnique({
      where: { id: req.params.id as string },
      include: {
        autor: { select: { displayName: true, email: true } },
      },
    });

    if (!lektion) {
      res.status(404).json({ error: 'Lektion nicht gefunden' });
      return;
    }

    res.json({ success: true, data: lektion });
  } catch (error) {
    logger.error(error, 'Admin lektion get error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/lektionen/:id ────────────────────────────────

adminRouter.put('/lektionen/:id', writeRateLimit, async (req, res) => {
  try {
    const data = lektionSchema.partial().parse(req.body);
    const { status: lektionStatus, ...rest } = data;

    const lektion = await prisma.lektion.update({
      where: { id: req.params.id as string },
      data: {
        ...rest,
        ...(lektionStatus !== undefined && { status: lektionStatus }),
        publishedAt: lektionStatus === 'published' ? new Date() : undefined,
      },
    });

    res.json({ success: true, data: lektion });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Admin lektion update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/lektionen/:id ─────────────────────────────

adminRouter.delete('/lektionen/:id', async (req, res) => {
  try {
    await prisma.lektion.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Lektion gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin lektion delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/tools ────────────────────────────────────────

adminRouter.get('/tools', async (req, res) => {
  try {
    const { kategorie, search } = req.query;

    const where: Record<string, unknown> = {};
    if (kategorie && kategorie !== 'all') where.kategorie = kategorie;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { beschreibung: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const tools = await prisma.tool.findMany({
      where,
      orderBy: { reihenfolge: 'asc' },
    });

    res.json({ success: true, data: tools, count: tools.length });
  } catch (error) {
    logger.error(error, 'Admin tools list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/tools ───────────────────────────────────────

adminRouter.post('/tools', writeRateLimit, async (req, res) => {
  try {
    const data = toolSchema.parse(req.body);
    const tool = await prisma.tool.create({ data });
    res.status(201).json({ success: true, data: tool });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Admin tool create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/tools/:id ────────────────────────────────────

adminRouter.put('/tools/:id', writeRateLimit, async (req, res) => {
  try {
    const data = toolSchema.partial().parse(req.body);
    const { status: toolStatus, ...toolRest } = data;
    const tool = await prisma.tool.update({
      where: { id: req.params.id as string },
      data: {
        ...toolRest,
        ...(toolStatus !== undefined && { status: toolStatus }),
      },
    });
    res.json({ success: true, data: tool });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Admin tool update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/tools/:id ─────────────────────────────────

adminRouter.delete('/tools/:id', async (req, res) => {
  try {
    await prisma.tool.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Tool gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin tool delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/research/trigger ────────────────────────────

adminRouter.post('/research/trigger', writeRateLimit, async (req, res) => {
  try {
    const data = researchSchema.parse(req.body);

    // Mock research results - in production integrate with search APIs
    const results = [
      {
        title: `Understanding ${data.topic}`,
        url: `https://example.com/${encodeURIComponent(data.topic)}`,
        excerpt: `Comprehensive guide about ${data.topic}...`,
        source: data.quelle,
        relevance: 95,
      },
    ];

    const history = await prisma.researchHistory.create({
      data: {
        topic: data.topic,
        quelle: data.quelle,
        ergebnis: results,
        userId: req.user!.userId,
      },
    });

    res.json({
      success: true,
      data: { ...history, results },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Admin research trigger error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/research/history ─────────────────────────────

adminRouter.get('/research/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const history = await prisma.researchHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { displayName: true } },
      },
    });

    res.json({ success: true, data: history });
  } catch (error) {
    logger.error(error, 'Admin research history error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});
