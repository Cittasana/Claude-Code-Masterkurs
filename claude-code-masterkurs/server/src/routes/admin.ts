import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { spawn } from 'child_process';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { writeRateLimit } from '../middleware/rateLimit.js';

export const adminRouter = Router();

// ── Agent API Key Middleware ────────────────────────────────────
// Accepts either AGENT_API_KEY as Bearer token OR admin JWT
const AGENT_API_KEY = process.env.AGENT_API_KEY;

async function requireAgentOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ') && AGENT_API_KEY) {
    const token = authHeader.slice(7);
    if (token === AGENT_API_KEY) {
      next();
      return;
    }
  }
  // Fall through to normal admin auth
  requireAuth(req, res, (err?: unknown) => {
    if (err) { next(err); return; }
    requireAdmin(req, res, next);
  });
}

// ── Agent Monitoring Routes (before admin-only middleware) ──────

// POST /api/admin/agent/report - Agent pushes results
adminRouter.post('/agent/report', requireAgentOrAdmin, async (req, res) => {
  try {
    const schema = z.object({
      runId: z.string().optional(),
      status: z.enum(['running', 'completed', 'failed']),
      trigger: z.enum(['cron', 'manual']).default('cron'),
      qualityScore: z.number().min(0).max(100).optional(),
      sourcesTotal: z.number().int().min(0).optional(),
      sourcesTier1: z.number().int().min(0).optional(),
      sourcesTier2: z.number().int().min(0).optional(),
      sourcesTier3: z.number().int().min(0).optional(),
      lessonsCreated: z.number().int().min(0).optional(),
      emailsCreated: z.number().int().min(0).optional(),
      socialPostsCreated: z.number().int().min(0).optional(),
      researchTopics: z.array(z.string()).optional(),
      summary: z.string().optional(),
      errorLog: z.string().optional(),
      rawOutput: z.string().optional(),
    });

    const data = schema.parse(req.body);

    if (data.runId) {
      // Update existing run
      const completedAt = data.status !== 'running' ? new Date() : undefined;
      const existing = await prisma.agentRun.findUnique({ where: { id: data.runId } });
      const durationSeconds = completedAt && existing
        ? Math.round((completedAt.getTime() - existing.startedAt.getTime()) / 1000)
        : undefined;

      const run = await prisma.agentRun.update({
        where: { id: data.runId },
        data: {
          status: data.status,
          completedAt,
          durationSeconds,
          ...(data.qualityScore !== undefined && { qualityScore: data.qualityScore }),
          ...(data.sourcesTotal !== undefined && { sourcesTotal: data.sourcesTotal }),
          ...(data.sourcesTier1 !== undefined && { sourcesTier1: data.sourcesTier1 }),
          ...(data.sourcesTier2 !== undefined && { sourcesTier2: data.sourcesTier2 }),
          ...(data.sourcesTier3 !== undefined && { sourcesTier3: data.sourcesTier3 }),
          ...(data.lessonsCreated !== undefined && { lessonsCreated: data.lessonsCreated }),
          ...(data.emailsCreated !== undefined && { emailsCreated: data.emailsCreated }),
          ...(data.socialPostsCreated !== undefined && { socialPostsCreated: data.socialPostsCreated }),
          ...(data.researchTopics !== undefined && { researchTopics: data.researchTopics }),
          ...(data.summary !== undefined && { summary: data.summary }),
          ...(data.errorLog !== undefined && { errorLog: data.errorLog }),
          ...(data.rawOutput !== undefined && { rawOutput: data.rawOutput }),
        },
      });
      res.json({ success: true, data: run });
    } else {
      // Create new run
      const run = await prisma.agentRun.create({
        data: {
          status: data.status,
          trigger: data.trigger,
          ...(data.qualityScore !== undefined && { qualityScore: data.qualityScore }),
          ...(data.sourcesTotal !== undefined && { sourcesTotal: data.sourcesTotal }),
          ...(data.sourcesTier1 !== undefined && { sourcesTier1: data.sourcesTier1 }),
          ...(data.sourcesTier2 !== undefined && { sourcesTier2: data.sourcesTier2 }),
          ...(data.sourcesTier3 !== undefined && { sourcesTier3: data.sourcesTier3 }),
          ...(data.lessonsCreated !== undefined && { lessonsCreated: data.lessonsCreated }),
          ...(data.emailsCreated !== undefined && { emailsCreated: data.emailsCreated }),
          ...(data.socialPostsCreated !== undefined && { socialPostsCreated: data.socialPostsCreated }),
          ...(data.researchTopics !== undefined && { researchTopics: data.researchTopics }),
          ...(data.summary !== undefined && { summary: data.summary }),
          ...(data.errorLog !== undefined && { errorLog: data.errorLog }),
          ...(data.rawOutput !== undefined && { rawOutput: data.rawOutput }),
        },
      });
      res.status(201).json({ success: true, data: run });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Agent report error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// DELETE /api/admin/agent/runs/:id - Delete an agent run (agent key or admin)
adminRouter.delete('/agent/runs/:id', requireAgentOrAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.agentRun.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    logger.error(error, 'Agent run delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// All admin routes require auth + admin role
adminRouter.use(requireAuth, requireAdmin);

// ── GET /api/admin/agent/runs ────────────────────────────────────
adminRouter.get('/agent/runs', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;

    const runs = await prisma.agentRun.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        status: true,
        trigger: true,
        startedAt: true,
        completedAt: true,
        durationSeconds: true,
        qualityScore: true,
        sourcesTotal: true,
        sourcesTier1: true,
        sourcesTier2: true,
        sourcesTier3: true,
        lessonsCreated: true,
        emailsCreated: true,
        socialPostsCreated: true,
        researchTopics: true,
        summary: true,
        errorLog: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: runs });
  } catch (error) {
    logger.error(error, 'Agent runs list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/agent/runs/:id ───────────────────────────────
adminRouter.get('/agent/runs/:id', async (req, res) => {
  try {
    const run = await prisma.agentRun.findUnique({
      where: { id: req.params.id },
    });

    if (!run) {
      res.status(404).json({ error: 'Agent Run nicht gefunden' });
      return;
    }

    res.json({ success: true, data: run });
  } catch (error) {
    logger.error(error, 'Agent run get error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/agent/status ─────────────────────────────────
adminRouter.get('/agent/status', async (_req, res) => {
  try {
    const currentRun = await prisma.agentRun.findFirst({
      where: { status: 'running' },
      orderBy: { startedAt: 'desc' },
    });

    res.json({
      success: true,
      data: {
        isRunning: !!currentRun,
        currentRun: currentRun || undefined,
      },
    });
  } catch (error) {
    logger.error(error, 'Agent status error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/agent/trigger ───────────────────────────────
adminRouter.post('/agent/trigger', writeRateLimit, async (_req, res) => {
  try {
    // Check if already running
    const existing = await prisma.agentRun.findFirst({
      where: { status: 'running' },
    });

    if (existing) {
      res.status(409).json({
        error: 'Agent läuft bereits',
        data: existing,
      });
      return;
    }

    // Create run record
    const run = await prisma.agentRun.create({
      data: {
        status: 'running',
        trigger: 'manual',
      },
    });

    // Spawn agent-wrapper.sh as detached child process
    const wrapperPath = '/Users/cosmograef/Desktop/Claude Code ausbildung/masterkurs-agent/scripts/agent-wrapper.sh';
    const child = spawn('bash', [wrapperPath, run.id], {
      cwd: '/Users/cosmograef/Desktop/Claude Code ausbildung/masterkurs-agent',
      detached: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        AGENT_RUN_ID: run.id,
        AGENT_TRIGGER: 'manual',
      },
    });
    child.unref();

    res.json({
      success: true,
      data: { runId: run.id, message: 'Agent gestartet' },
    });
  } catch (error) {
    logger.error(error, 'Agent trigger error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

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

// ── GET /api/admin/users ────────────────────────────────────────
adminRouter.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;

    const where: Record<string, unknown> = {};
    if (role && role !== 'all') where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarEmoji: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          subscription: { select: { status: true, isLifetime: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: users, total, page, limit });
  } catch (error) {
    logger.error(error, 'Admin users list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/users/:id ────────────────────────────────────
adminRouter.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarEmoji: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        subscription: true,
        progress: true,
      },
    });
    if (!user) { res.status(404).json({ error: 'User nicht gefunden' }); return; }
    res.json({ success: true, data: user });
  } catch (error) {
    logger.error(error, 'Admin user get error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/users/:id/role ───────────────────────────────
adminRouter.put('/users/:id/role', writeRateLimit, async (req, res) => {
  try {
    const { role } = z.object({ role: z.enum(['user', 'admin']) }).parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { role },
      select: { id: true, email: true, displayName: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin user role update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/users/:id ─────────────────────────────────
adminRouter.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'User gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin user delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/subscriptions ────────────────────────────────
adminRouter.get('/subscriptions', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;

    const subscriptions = await prisma.subscription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, displayName: true } },
        promoCode: { select: { code: true } },
      },
    });
    res.json({ success: true, data: subscriptions });
  } catch (error) {
    logger.error(error, 'Admin subscriptions list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/subscriptions/stats ──────────────────────────
adminRouter.get('/subscriptions/stats', async (req, res) => {
  try {
    const [active, lifetime, trialing, canceled, total] = await Promise.all([
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.subscription.count({ where: { isLifetime: true } }),
      prisma.subscription.count({ where: { status: 'trialing' } }),
      prisma.subscription.count({ where: { status: 'canceled' } }),
      prisma.subscription.count(),
    ]);
    res.json({ success: true, data: { active, lifetime, trialing, canceled, total } });
  } catch (error) {
    logger.error(error, 'Admin subscriptions stats error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/promo-codes ──────────────────────────────────
adminRouter.get('/promo-codes', async (req, res) => {
  try {
    const codes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { subscriptions: true } } },
    });
    res.json({ success: true, data: codes });
  } catch (error) {
    logger.error(error, 'Admin promo codes list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/promo-codes ─────────────────────────────────
adminRouter.post('/promo-codes', writeRateLimit, async (req, res) => {
  try {
    const data = z.object({
      code: z.string().min(1),
      description: z.string().optional(),
      durationMonths: z.number().int().min(1).default(6),
      maxUses: z.number().int().min(1).nullable().default(null),
      active: z.boolean().default(true),
      expiresAt: z.string().datetime().optional(),
    }).parse(req.body);

    const code = await prisma.promoCode.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        durationMonths: data.durationMonths,
        maxUses: data.maxUses,
        active: data.active,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    res.status(201).json({ success: true, data: code });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin promo code create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/promo-codes/:id ──────────────────────────────
adminRouter.put('/promo-codes/:id', writeRateLimit, async (req, res) => {
  try {
    const data = z.object({
      code: z.string().min(1).optional(),
      description: z.string().optional(),
      durationMonths: z.number().int().min(1).optional(),
      maxUses: z.number().int().min(1).nullable().optional(),
      active: z.boolean().optional(),
      expiresAt: z.string().datetime().nullable().optional(),
    }).parse(req.body);

    const code = await prisma.promoCode.update({
      where: { id: req.params.id as string },
      data: {
        ...data,
        ...(data.code && { code: data.code.toUpperCase() }),
        ...(data.expiresAt !== undefined && { expiresAt: data.expiresAt ? new Date(data.expiresAt) : null }),
      },
    });
    res.json({ success: true, data: code });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin promo code update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/promo-codes/:id ───────────────────────────
adminRouter.delete('/promo-codes/:id', async (req, res) => {
  try {
    await prisma.promoCode.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Promo Code gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin promo code delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/forum/threads ────────────────────────────────
adminRouter.get('/forum/threads', async (req, res) => {
  try {
    const threads = await prisma.forumThread.findMany({
      orderBy: { lastActivityAt: 'desc' },
      include: {
        author: { select: { id: true, displayName: true, email: true } },
        _count: { select: { replies: true } },
      },
    });
    res.json({ success: true, data: threads });
  } catch (error) {
    logger.error(error, 'Admin forum threads list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/forum/threads/:id/pin ────────────────────────
adminRouter.put('/forum/threads/:id/pin', writeRateLimit, async (req, res) => {
  try {
    const thread = await prisma.forumThread.findUnique({ where: { id: req.params.id as string } });
    if (!thread) { res.status(404).json({ error: 'Thread nicht gefunden' }); return; }
    const updated = await prisma.forumThread.update({
      where: { id: req.params.id as string },
      data: { pinned: !thread.pinned },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    logger.error(error, 'Admin forum thread pin error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/forum/threads/:id ─────────────────────────
adminRouter.delete('/forum/threads/:id', async (req, res) => {
  try {
    await prisma.forumThread.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Thread gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin forum thread delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/forum/replies/:id ─────────────────────────
adminRouter.delete('/forum/replies/:id', async (req, res) => {
  try {
    await prisma.forumReply.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Reply gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin forum reply delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/showcase ─────────────────────────────────────
adminRouter.get('/showcase', async (req, res) => {
  try {
    const entries = await prisma.showcaseEntry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, displayName: true, email: true } } },
    });
    res.json({ success: true, data: entries });
  } catch (error) {
    logger.error(error, 'Admin showcase list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/showcase/:id/approve ─────────────────────────
adminRouter.put('/showcase/:id/approve', writeRateLimit, async (req, res) => {
  try {
    const entry = await prisma.showcaseEntry.findUnique({ where: { id: req.params.id as string } });
    if (!entry) { res.status(404).json({ error: 'Entry nicht gefunden' }); return; }
    const updated = await prisma.showcaseEntry.update({
      where: { id: req.params.id as string },
      data: { approved: !entry.approved },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    logger.error(error, 'Admin showcase approve error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/showcase/:id ──────────────────────────────
adminRouter.delete('/showcase/:id', async (req, res) => {
  try {
    await prisma.showcaseEntry.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Showcase Entry gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin showcase delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/patterns ─────────────────────────────────────
adminRouter.get('/patterns', async (req, res) => {
  try {
    const patterns = await prisma.communityPattern.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, displayName: true, email: true } } },
    });
    res.json({ success: true, data: patterns });
  } catch (error) {
    logger.error(error, 'Admin patterns list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/patterns/:id ──────────────────────────────
adminRouter.delete('/patterns/:id', async (req, res) => {
  try {
    await prisma.communityPattern.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Pattern gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin pattern delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/analytics/overview ───────────────────────────
adminRouter.get('/analytics/overview', async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalEvents, events7d, events30d, activeUsers, eventsByType] = await Promise.all([
      prisma.analyticsEvent.count(),
      prisma.analyticsEvent.count({ where: { timestamp: { gte: sevenDaysAgo } } }),
      prisma.analyticsEvent.count({ where: { timestamp: { gte: thirtyDaysAgo } } }),
      prisma.analyticsEvent.groupBy({ by: ['userId'], where: { timestamp: { gte: thirtyDaysAgo } } }).then(r => r.length),
      prisma.analyticsEvent.groupBy({ by: ['type'], _count: { type: true }, orderBy: { _count: { type: 'desc' } } }),
    ]);

    const recentEvents = await prisma.analyticsEvent.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' },
      include: { user: { select: { displayName: true, email: true } } },
    });

    res.json({
      success: true,
      data: {
        totalEvents,
        events7d,
        events30d,
        activeUsers,
        eventsByType: eventsByType.map(e => ({ type: e.type, count: e._count.type })),
        recentEvents,
      },
    });
  } catch (error) {
    logger.error(error, 'Admin analytics overview error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/newsletter/subscribers ────────────────────────
adminRouter.get('/newsletter/subscribers', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: subscribers });
  } catch (error) {
    logger.error(error, 'Admin newsletter subscribers list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/admin/newsletter/stats ─────────────────────────────
adminRouter.get('/newsletter/stats', async (req, res) => {
  try {
    const [total, active, pending, unsubscribed] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { status: 'active' } }),
      prisma.newsletterSubscriber.count({ where: { status: 'pending' } }),
      prisma.newsletterSubscriber.count({ where: { status: 'unsubscribed' } }),
    ]);
    res.json({ success: true, data: { total, active, pending, unsubscribed } });
  } catch (error) {
    logger.error(error, 'Admin newsletter stats error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/newsletter/subscribers/:id ────────────────
adminRouter.delete('/newsletter/subscribers/:id', async (req, res) => {
  try {
    await prisma.newsletterSubscriber.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Subscriber entfernt' });
  } catch (error) {
    logger.error(error, 'Admin newsletter subscriber delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});
