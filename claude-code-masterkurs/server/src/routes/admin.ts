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
    // Auto-expire runs stuck in 'running' for more than 30 minutes
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    await prisma.agentRun.updateMany({
      where: { status: 'running', startedAt: { lt: thirtyMinAgo } },
      data: { status: 'failed', errorLog: 'Auto-expired: run exceeded 30 minute timeout' },
    });

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
    const wrapperPath = process.env.AGENT_WRAPPER_PATH || '/Users/cosmograef/Desktop/Claude Code ausbildung/masterkurs-agent/scripts/agent-wrapper.sh';
    const agentCwd = process.env.AGENT_CWD || '/Users/cosmograef/Desktop/Claude Code ausbildung/masterkurs-agent';
    try {
      const child = spawn('bash', [wrapperPath, run.id], {
        cwd: agentCwd,
        detached: true,
        stdio: 'ignore',
        env: {
          ...process.env,
          AGENT_RUN_ID: run.id,
          AGENT_TRIGGER: 'manual',
        },
      });
      child.on('error', (err) => {
        logger.warn({ err }, 'Agent spawn failed (bash or script not available)');
      });
      child.unref();
    } catch (err) {
      logger.warn({ err }, 'Agent spawn failed');
    }

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
    const [
      totalUsers, activeSubscriptions, lektionenCount, toolsCount,
      forumCategoriesCount, officialDocsCount, featuresCount, quizzesCount,
      challengesCount, lessonConfigsCount, projectConfigsCount, capstoneConfigsCount,
      projectTemplatesCount, playgroundTasksCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.lektion.count(),
      prisma.tool.count(),
      prisma.forumCategoryConfig.count(),
      prisma.officialDoc.count(),
      prisma.featureRef.count(),
      prisma.quizConfig.count(),
      prisma.challengeConfig.count(),
      prisma.lessonConfig.count(),
      prisma.projectConfig.count(),
      prisma.capstoneConfig.count(),
      prisma.projectTemplateConfig.count(),
      prisma.playgroundTaskConfig.count(),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeSubscriptions,
        lektionenCount,
        toolsCount,
        forumCategoriesCount,
        officialDocsCount,
        featuresCount,
        quizzesCount,
        challengesCount,
        lessonConfigsCount,
        projectConfigsCount,
        capstoneConfigsCount,
        projectTemplatesCount,
        playgroundTasksCount,
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

// ══════════════════════════════════════════════════════════════════
// ── Content Config CRUD Endpoints ────────────────────────────────
// ══════════════════════════════════════════════════════════════════

// ── Forum Category Config Schemas ───────────────────────────────

const forumCategorySchema = z.object({
  categoryId: z.string().min(1, 'categoryId ist erforderlich'),
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  icon: z.string().default(''),
  sortOrder: z.number().int().min(0).default(0),
});

// ── GET /api/admin/forum-categories ─────────────────────────────
adminRouter.get('/forum-categories', async (req, res) => {
  try {
    const { search } = req.query;
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const categories = await prisma.forumCategoryConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: categories, count: categories.length });
  } catch (error) {
    logger.error(error, 'Admin forum-categories list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/forum-categories ────────────────────────────
adminRouter.post('/forum-categories', writeRateLimit, async (req, res) => {
  try {
    const data = forumCategorySchema.parse(req.body);
    const category = await prisma.forumCategoryConfig.create({ data });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin forum-category create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/forum-categories/:id ─────────────────────────
adminRouter.put('/forum-categories/:id', writeRateLimit, async (req, res) => {
  try {
    const data = forumCategorySchema.partial().parse(req.body);
    const category = await prisma.forumCategoryConfig.update({
      where: { id: req.params.id as string },
      data,
    });
    res.json({ success: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin forum-category update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/forum-categories/:id ───────────────────────
adminRouter.delete('/forum-categories/:id', async (req, res) => {
  try {
    await prisma.forumCategoryConfig.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Forum-Kategorie gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin forum-category delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Official Docs Schema ────────────────────────────────────────

const officialDocSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  url: z.string().url('Gueltige URL erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  description: z.string().optional(),
  lang: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

// ── GET /api/admin/official-docs ────────────────────────────────
adminRouter.get('/official-docs', async (req, res) => {
  try {
    const { search } = req.query;
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const docs = await prisma.officialDoc.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: docs, count: docs.length });
  } catch (error) {
    logger.error(error, 'Admin official-docs list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/official-docs ───────────────────────────────
adminRouter.post('/official-docs', writeRateLimit, async (req, res) => {
  try {
    const data = officialDocSchema.parse(req.body);
    const doc = await prisma.officialDoc.create({ data });
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin official-doc create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/official-docs/:id ────────────────────────────
adminRouter.put('/official-docs/:id', writeRateLimit, async (req, res) => {
  try {
    const data = officialDocSchema.partial().parse(req.body);
    const doc = await prisma.officialDoc.update({
      where: { id: req.params.id as string },
      data,
    });
    res.json({ success: true, data: doc });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin official-doc update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/official-docs/:id ──────────────────────────
adminRouter.delete('/official-docs/:id', async (req, res) => {
  try {
    await prisma.officialDoc.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Offizielle Doku gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin official-doc delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Features Schema ─────────────────────────────────────────────

const featureSchema = z.object({
  featureId: z.string().min(1, 'featureId ist erforderlich'),
  name: z.string().min(1, 'Name ist erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  details: z.string().optional(),
  tips: z.any().default([]),
  example: z.string().min(1, 'Beispiel ist erforderlich'),
  documentation: z.string().min(1, 'Dokumentation ist erforderlich'),
  tags: z.any().default([]),
  lastUpdate: z.boolean().default(false),
  bannerLabel: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

// ── GET /api/admin/features ─────────────────────────────────────
adminRouter.get('/features', async (req, res) => {
  try {
    const { category, search } = req.query;
    const where: Record<string, unknown> = {};
    if (category && category !== 'all') where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const features = await prisma.featureRef.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: features, count: features.length });
  } catch (error) {
    logger.error(error, 'Admin features list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/features ────────────────────────────────────
adminRouter.post('/features', writeRateLimit, async (req, res) => {
  try {
    const data = featureSchema.parse(req.body);
    const feature = await prisma.featureRef.create({ data });
    res.status(201).json({ success: true, data: feature });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin feature create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/features/:id ─────────────────────────────────
adminRouter.put('/features/:id', writeRateLimit, async (req, res) => {
  try {
    const data = featureSchema.partial().parse(req.body);
    const feature = await prisma.featureRef.update({
      where: { id: req.params.id as string },
      data,
    });
    res.json({ success: true, data: feature });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin feature update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/features/:id ──────────────────────────────
adminRouter.delete('/features/:id', async (req, res) => {
  try {
    await prisma.featureRef.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Feature gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin feature delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Quizzes Schema ──────────────────────────────────────────────

const quizSchema = z.object({
  quizId: z.string().min(1, 'quizId ist erforderlich'),
  lessonId: z.number().int().min(0, 'lessonId ist erforderlich'),
  title: z.string().min(1, 'Titel ist erforderlich'),
  type: z.string().min(1, 'Typ ist erforderlich'),
  points: z.number().int().min(0).default(5),
  passingScore: z.number().int().min(0).default(80),
  maxAttempts: z.number().int().min(1).default(3),
  questions: z.any(),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

// ── GET /api/admin/quizzes ──────────────────────────────────────
adminRouter.get('/quizzes', async (req, res) => {
  try {
    const { lessonId, status, search } = req.query;
    const where: Record<string, unknown> = {};
    if (lessonId) where.lessonId = parseInt(lessonId as string, 10);
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const quizzes = await prisma.quizConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: quizzes, count: quizzes.length });
  } catch (error) {
    logger.error(error, 'Admin quizzes list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/quizzes ─────────────────────────────────────
adminRouter.post('/quizzes', writeRateLimit, async (req, res) => {
  try {
    const data = quizSchema.parse(req.body);
    const quiz = await prisma.quizConfig.create({ data: data as any });
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin quiz create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/quizzes/:id ──────────────────────────────────
adminRouter.put('/quizzes/:id', writeRateLimit, async (req, res) => {
  try {
    const data = quizSchema.partial().parse(req.body);
    const { status: quizStatus, ...rest } = data;
    const quiz = await prisma.quizConfig.update({
      where: { id: req.params.id as string },
      data: {
        ...rest,
        ...(quizStatus !== undefined && { status: quizStatus }),
      } as any,
    });
    res.json({ success: true, data: quiz });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin quiz update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/quizzes/:id ───────────────────────────────
adminRouter.delete('/quizzes/:id', async (req, res) => {
  try {
    await prisma.quizConfig.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Quiz gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin quiz delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Challenges Schema ───────────────────────────────────────────

const challengeSchema = z.object({
  challengeId: z.string().min(1, 'challengeId ist erforderlich'),
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  source: z.string().default('claude-code'),
  difficulty: z.string().min(1, 'Schwierigkeit ist erforderlich'),
  timeLimit: z.number().int().min(0).default(0),
  points: z.number().int().min(0).default(100),
  instruction: z.string().min(1, 'Anleitung ist erforderlich'),
  starterCode: z.string().min(1, 'Starter-Code ist erforderlich'),
  language: z.string().default('typescript'),
  hints: z.any().default([]),
  validations: z.any().default([]),
  solution: z.string().min(1, 'Lösung ist erforderlich'),
  relatedLessons: z.any().default([]),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

// ── GET /api/admin/challenges ───────────────────────────────────
adminRouter.get('/challenges', async (req, res) => {
  try {
    const { category, source, status, search } = req.query;
    const where: Record<string, unknown> = {};
    if (category && category !== 'all') where.category = category;
    if (source && source !== 'all') where.source = source;
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const challenges = await prisma.challengeConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: challenges, count: challenges.length });
  } catch (error) {
    logger.error(error, 'Admin challenges list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/challenges ──────────────────────────────────
adminRouter.post('/challenges', writeRateLimit, async (req, res) => {
  try {
    const data = challengeSchema.parse(req.body);
    const challenge = await prisma.challengeConfig.create({ data });
    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin challenge create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/challenges/:id ───────────────────────────────
adminRouter.put('/challenges/:id', writeRateLimit, async (req, res) => {
  try {
    const data = challengeSchema.partial().parse(req.body);
    const { status: challengeStatus, ...rest } = data;
    const challenge = await prisma.challengeConfig.update({
      where: { id: req.params.id as string },
      data: {
        ...rest,
        ...(challengeStatus !== undefined && { status: challengeStatus }),
      },
    });
    res.json({ success: true, data: challenge });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin challenge update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/challenges/:id ────────────────────────────
adminRouter.delete('/challenges/:id', async (req, res) => {
  try {
    await prisma.challengeConfig.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Challenge gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin challenge delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Lesson Configs Schema ───────────────────────────────────────

const lessonConfigSchema = z.object({
  lessonId: z.number().int().min(0, 'lessonId ist erforderlich'),
  level: z.number().int().min(1).default(1),
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  duration: z.string().min(1, 'Dauer ist erforderlich'),
  objectives: z.any().default([]),
  content: z.any(),
  track: z.string().default('main'),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

// ── GET /api/admin/lesson-configs ───────────────────────────────
adminRouter.get('/lesson-configs', async (req, res) => {
  try {
    const { track, status, search } = req.query;
    const where: Record<string, unknown> = {};
    if (track && track !== 'all') where.track = track;
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const lessons = await prisma.lessonConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: lessons, count: lessons.length });
  } catch (error) {
    logger.error(error, 'Admin lesson-configs list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/lesson-configs ──────────────────────────────
adminRouter.post('/lesson-configs', writeRateLimit, async (req, res) => {
  try {
    const data = lessonConfigSchema.parse(req.body);
    const lesson = await prisma.lessonConfig.create({ data: data as any });
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin lesson-config create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/lesson-configs/:id ───────────────────────────
adminRouter.put('/lesson-configs/:id', writeRateLimit, async (req, res) => {
  try {
    const data = lessonConfigSchema.partial().parse(req.body);
    const { status: lessonStatus, ...rest } = data;
    const lesson = await prisma.lessonConfig.update({
      where: { id: req.params.id as string },
      data: {
        ...rest,
        ...(lessonStatus !== undefined && { status: lessonStatus }),
      } as any,
    });
    res.json({ success: true, data: lesson });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin lesson-config update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/lesson-configs/:id ─────────────────────────
adminRouter.delete('/lesson-configs/:id', async (req, res) => {
  try {
    await prisma.lessonConfig.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Lesson-Config gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin lesson-config delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Project Configs Schema ──────────────────────────────────────

const projectConfigSchema = z.object({
  projectId: z.string().min(1, 'projectId ist erforderlich'),
  level: z.number().int().min(1).default(1),
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  difficulty: z.string().min(1, 'Schwierigkeit ist erforderlich'),
  duration: z.string().min(1, 'Dauer ist erforderlich'),
  requirements: z.any().default([]),
  starterCode: z.string().optional(),
  hints: z.any().default([]),
  solution: z.string().optional(),
  resources: z.any().default([]),
  validationMeta: z.any().default({}),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

// ── GET /api/admin/project-configs ──────────────────────────────
adminRouter.get('/project-configs', async (req, res) => {
  try {
    const { status, search } = req.query;
    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const projects = await prisma.projectConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: projects, count: projects.length });
  } catch (error) {
    logger.error(error, 'Admin project-configs list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/project-configs ─────────────────────────────
adminRouter.post('/project-configs', writeRateLimit, async (req, res) => {
  try {
    const data = projectConfigSchema.parse(req.body);
    const project = await prisma.projectConfig.create({ data });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin project-config create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/project-configs/:id ──────────────────────────
adminRouter.put('/project-configs/:id', writeRateLimit, async (req, res) => {
  try {
    const data = projectConfigSchema.partial().parse(req.body);
    const { status: projectStatus, ...rest } = data;
    const project = await prisma.projectConfig.update({
      where: { id: req.params.id as string },
      data: {
        ...rest,
        ...(projectStatus !== undefined && { status: projectStatus }),
      },
    });
    res.json({ success: true, data: project });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin project-config update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/project-configs/:id ────────────────────────
adminRouter.delete('/project-configs/:id', async (req, res) => {
  try {
    await prisma.projectConfig.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Projekt-Config gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin project-config delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Capstone Configs Schema ─────────────────────────────────────

const capstoneConfigSchema = z.object({
  capstoneId: z.string().min(1, 'capstoneId ist erforderlich'),
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  difficulty: z.number().int().min(1).default(1),
  estimatedHours: z.number().int().min(1).default(4),
  techStack: z.any().default([]),
  requirements: z.any().default([]),
  steps: z.any().default([]),
  thumbnailEmoji: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

// ── GET /api/admin/capstone-configs ─────────────────────────────
adminRouter.get('/capstone-configs', async (req, res) => {
  try {
    const { status, search } = req.query;
    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const capstones = await prisma.capstoneConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: capstones, count: capstones.length });
  } catch (error) {
    logger.error(error, 'Admin capstone-configs list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/capstone-configs ────────────────────────────
adminRouter.post('/capstone-configs', writeRateLimit, async (req, res) => {
  try {
    const data = capstoneConfigSchema.parse(req.body);
    const capstone = await prisma.capstoneConfig.create({ data });
    res.status(201).json({ success: true, data: capstone });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin capstone-config create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/capstone-configs/:id ─────────────────────────
adminRouter.put('/capstone-configs/:id', writeRateLimit, async (req, res) => {
  try {
    const data = capstoneConfigSchema.partial().parse(req.body);
    const { status: capstoneStatus, ...rest } = data;
    const capstone = await prisma.capstoneConfig.update({
      where: { id: req.params.id as string },
      data: {
        ...rest,
        ...(capstoneStatus !== undefined && { status: capstoneStatus }),
      },
    });
    res.json({ success: true, data: capstone });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin capstone-config update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/capstone-configs/:id ───────────────────────
adminRouter.delete('/capstone-configs/:id', async (req, res) => {
  try {
    await prisma.capstoneConfig.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Capstone-Config gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin capstone-config delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Project Templates Schema ────────────────────────────────────

const projectTemplateSchema = z.object({
  templateId: z.string().min(1, 'templateId ist erforderlich'),
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  difficulty: z.number().int().min(1).default(1),
  estimatedHours: z.number().int().min(1).default(4),
  techStack: z.any().default([]),
  features: z.any().default([]),
  claudeMd: z.string().min(1, 'claudeMd ist erforderlich'),
  fileStructure: z.string().optional(),
  steps: z.any().default([]),
  githubUrl: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

// ── GET /api/admin/project-templates ────────────────────────────
adminRouter.get('/project-templates', async (req, res) => {
  try {
    const { status, search } = req.query;
    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const templates = await prisma.projectTemplateConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: templates, count: templates.length });
  } catch (error) {
    logger.error(error, 'Admin project-templates list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/project-templates ───────────────────────────
adminRouter.post('/project-templates', writeRateLimit, async (req, res) => {
  try {
    const data = projectTemplateSchema.parse(req.body);
    const template = await prisma.projectTemplateConfig.create({ data });
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin project-template create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/project-templates/:id ────────────────────────
adminRouter.put('/project-templates/:id', writeRateLimit, async (req, res) => {
  try {
    const data = projectTemplateSchema.partial().parse(req.body);
    const { status: templateStatus, ...rest } = data;
    const template = await prisma.projectTemplateConfig.update({
      where: { id: req.params.id as string },
      data: {
        ...rest,
        ...(templateStatus !== undefined && { status: templateStatus }),
      },
    });
    res.json({ success: true, data: template });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin project-template update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/project-templates/:id ──────────────────────
adminRouter.delete('/project-templates/:id', async (req, res) => {
  try {
    await prisma.projectTemplateConfig.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Projekt-Template gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin project-template delete error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── Playground Tasks Schema ─────────────────────────────────────

const playgroundTaskSchema = z.object({
  taskId: z.string().min(1, 'taskId ist erforderlich'),
  projectId: z.string().min(1, 'projectId ist erforderlich'),
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  instruction: z.string().min(1, 'Anleitung ist erforderlich'),
  requirements: z.any().default([]),
  mode: z.string().default('editor'),
  language: z.string().default('typescript'),
  starterCode: z.string().min(1, 'Starter-Code ist erforderlich'),
  hints: z.any().default([]),
  validationMeta: z.any().default([]),
  scenarioMeta: z.any().optional(),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

// ── GET /api/admin/playground-tasks ─────────────────────────────
adminRouter.get('/playground-tasks', async (req, res) => {
  try {
    const { projectId, status, search } = req.query;
    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const tasks = await prisma.playgroundTaskConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (error) {
    logger.error(error, 'Admin playground-tasks list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── POST /api/admin/playground-tasks ────────────────────────────
adminRouter.post('/playground-tasks', writeRateLimit, async (req, res) => {
  try {
    const data = playgroundTaskSchema.parse(req.body);
    const task = await prisma.playgroundTaskConfig.create({ data });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin playground-task create error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── PUT /api/admin/playground-tasks/:id ─────────────────────────
adminRouter.put('/playground-tasks/:id', writeRateLimit, async (req, res) => {
  try {
    const data = playgroundTaskSchema.partial().parse(req.body);
    const { status: taskStatus, ...rest } = data;
    const task = await prisma.playgroundTaskConfig.update({
      where: { id: req.params.id as string },
      data: {
        ...rest,
        ...(taskStatus !== undefined && { status: taskStatus }),
      },
    });
    res.json({ success: true, data: task });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: error.errors[0].message }); return; }
    logger.error(error, 'Admin playground-task update error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── DELETE /api/admin/playground-tasks/:id ───────────────────────
adminRouter.delete('/playground-tasks/:id', async (req, res) => {
  try {
    await prisma.playgroundTaskConfig.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Playground-Task gelöscht' });
  } catch (error) {
    logger.error(error, 'Admin playground-task delete error');
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
