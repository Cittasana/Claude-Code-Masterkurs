import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

export const progressRouter = Router();

// All progress routes require authentication
progressRouter.use(requireAuth);

// ── GET /api/progress ────────────────────────────────────────
// Returns the full user progress (lessons, quizzes, projects, skills, etc.)

progressRouter.get('/', async (req, res) => {
  try {
    const progress = await prisma.userProgress.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!progress) {
      res.status(404).json({ error: 'Fortschritt nicht gefunden' });
      return;
    }

    // Also fetch quiz and project results
    const [quizResults, projectResults] = await Promise.all([
      prisma.quizResult.findMany({ where: { userId: req.user!.userId } }),
      prisma.projectResult.findMany({ where: { userId: req.user!.userId } }),
    ]);

    res.json({
      ...progress,
      quizzesCompleted: quizResults,
      projectsCompleted: projectResults,
      skillProgress: {
        installation: progress.skillInstallation,
        claudeMd: progress.skillClaudeMd,
        mcpIntegration: progress.skillMcpIntegration,
        customAgents: progress.skillCustomAgents,
        productionReady: progress.skillProductionReady,
      },
    });
  } catch (error) {
    logger.error(error, 'Get progress error');
    res.status(500).json({ error: 'Fortschritt konnte nicht geladen werden' });
  }
});

// ── PUT /api/progress ────────────────────────────────────────
// Updates the user progress (partial update)

const progressUpdateSchema = z.object({
  lessonsCompleted: z.array(z.number()).optional(),
  currentLesson: z.number().optional(),
  totalPoints: z.number().optional(),
  streak: z.number().optional(),
  timeInvested: z.number().optional(),
  videosWatched: z.record(z.boolean()).optional(),
  skillProgress: z
    .object({
      installation: z.number().optional(),
      claudeMd: z.number().optional(),
      mcpIntegration: z.number().optional(),
      customAgents: z.number().optional(),
      productionReady: z.number().optional(),
    })
    .optional(),
});

progressRouter.put('/', async (req, res) => {
  try {
    const data = progressUpdateSchema.parse(req.body);

    const updateData: Record<string, unknown> = {};

    if (data.lessonsCompleted !== undefined)
      updateData.lessonsCompleted = data.lessonsCompleted;
    if (data.currentLesson !== undefined)
      updateData.currentLesson = data.currentLesson;
    if (data.totalPoints !== undefined)
      updateData.totalPoints = data.totalPoints;
    if (data.streak !== undefined) updateData.streak = data.streak;
    if (data.timeInvested !== undefined)
      updateData.timeInvested = data.timeInvested;
    if (data.videosWatched !== undefined)
      updateData.videosWatched = data.videosWatched;
    if (data.skillProgress) {
      if (data.skillProgress.installation !== undefined)
        updateData.skillInstallation = data.skillProgress.installation;
      if (data.skillProgress.claudeMd !== undefined)
        updateData.skillClaudeMd = data.skillProgress.claudeMd;
      if (data.skillProgress.mcpIntegration !== undefined)
        updateData.skillMcpIntegration = data.skillProgress.mcpIntegration;
      if (data.skillProgress.customAgents !== undefined)
        updateData.skillCustomAgents = data.skillProgress.customAgents;
      if (data.skillProgress.productionReady !== undefined)
        updateData.skillProductionReady = data.skillProgress.productionReady;
    }

    updateData.lastSessionDate = new Date();

    const progress = await prisma.userProgress.update({
      where: { userId: req.user!.userId },
      data: updateData,
    });

    res.json(progress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Update progress error');
    res
      .status(500)
      .json({ error: 'Fortschritt konnte nicht gespeichert werden' });
  }
});

// ── POST /api/progress/quiz ──────────────────────────────────
// Save or update a quiz result

const quizResultSchema = z.object({
  quizId: z.string(),
  lessonId: z.number(),
  score: z.number(),
  attempts: z.number(),
  completed: z.boolean(),
});

progressRouter.post('/quiz', async (req, res) => {
  try {
    const data = quizResultSchema.parse(req.body);

    const result = await prisma.quizResult.upsert({
      where: {
        userId_quizId: {
          userId: req.user!.userId,
          quizId: data.quizId,
        },
      },
      update: {
        score: data.score,
        attempts: data.attempts,
        completed: data.completed,
        timestamp: new Date(),
      },
      create: {
        userId: req.user!.userId,
        ...data,
      },
    });

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Save quiz result error');
    res.status(500).json({ error: 'Quiz-Ergebnis konnte nicht gespeichert werden' });
  }
});

// ── POST /api/progress/project ───────────────────────────────
// Save or update a project result

const projectResultSchema = z.object({
  projectId: z.string(),
  completed: z.boolean(),
  score: z.number(),
  validationResults: z.array(
    z.object({
      testName: z.string(),
      passed: z.boolean(),
      points: z.number(),
    })
  ),
});

progressRouter.post('/project', async (req, res) => {
  try {
    const data = projectResultSchema.parse(req.body);

    const result = await prisma.projectResult.upsert({
      where: {
        userId_projectId: {
          userId: req.user!.userId,
          projectId: data.projectId,
        },
      },
      update: {
        completed: data.completed,
        score: data.score,
        validationResults: data.validationResults,
        timestamp: new Date(),
      },
      create: {
        userId: req.user!.userId,
        ...data,
      },
    });

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Save project result error');
    res.status(500).json({ error: 'Projekt-Ergebnis konnte nicht gespeichert werden' });
  }
});
