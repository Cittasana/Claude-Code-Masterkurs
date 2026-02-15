import { Router } from 'express';
import { prisma, logger } from '../index.js';

export const contentRouter = Router();

// ── GET /api/content/forum-categories ───────────────────────────
contentRouter.get('/forum-categories', async (_req, res) => {
  try {
    const categories = await prisma.forumCategoryConfig.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    logger.error(error, 'Content forum-categories list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/official-docs ──────────────────────────────
contentRouter.get('/official-docs', async (_req, res) => {
  try {
    const docs = await prisma.officialDoc.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: docs });
  } catch (error) {
    logger.error(error, 'Content official-docs list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/features ───────────────────────────────────
contentRouter.get('/features', async (req, res) => {
  try {
    const { category, search } = req.query;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
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
    res.json({ success: true, data: features });
  } catch (error) {
    logger.error(error, 'Content features list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/quizzes ────────────────────────────────────
contentRouter.get('/quizzes', async (req, res) => {
  try {
    const { lessonId } = req.query;

    const where: Record<string, unknown> = { status: 'published' };
    if (lessonId) where.lessonId = parseInt(lessonId as string, 10);

    const quizzes = await prisma.quizConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: quizzes });
  } catch (error) {
    logger.error(error, 'Content quizzes list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/challenges ─────────────────────────────────
contentRouter.get('/challenges', async (req, res) => {
  try {
    const { source } = req.query;

    const where: Record<string, unknown> = { status: 'published' };
    if (source) where.source = source;

    const challenges = await prisma.challengeConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: challenges });
  } catch (error) {
    logger.error(error, 'Content challenges list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/lessons ────────────────────────────────────
contentRouter.get('/lessons', async (req, res) => {
  try {
    const { track } = req.query;

    const where: Record<string, unknown> = { status: 'published' };
    if (track) where.track = track;

    const lessons = await prisma.lessonConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: lessons });
  } catch (error) {
    logger.error(error, 'Content lessons list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/lessons/:lessonId ──────────────────────────
contentRouter.get('/lessons/:lessonId', async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    if (isNaN(lessonId)) {
      res.status(400).json({ error: 'Ungueltige Lesson-ID' });
      return;
    }

    const lesson = await prisma.lessonConfig.findUnique({
      where: { lessonId },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lektion nicht gefunden' });
      return;
    }

    res.json({ success: true, data: lesson });
  } catch (error) {
    logger.error(error, 'Content lesson get error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/projects ───────────────────────────────────
contentRouter.get('/projects', async (_req, res) => {
  try {
    const projects = await prisma.projectConfig.findMany({
      where: { status: 'published' },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    logger.error(error, 'Content projects list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/capstones ──────────────────────────────────
contentRouter.get('/capstones', async (_req, res) => {
  try {
    const capstones = await prisma.capstoneConfig.findMany({
      where: { status: 'published' },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: capstones });
  } catch (error) {
    logger.error(error, 'Content capstones list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/project-templates ──────────────────────────
contentRouter.get('/project-templates', async (_req, res) => {
  try {
    const templates = await prisma.projectTemplateConfig.findMany({
      where: { status: 'published' },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: templates });
  } catch (error) {
    logger.error(error, 'Content project-templates list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// ── GET /api/content/playground-tasks ───────────────────────────
contentRouter.get('/playground-tasks', async (req, res) => {
  try {
    const { projectId } = req.query;

    const where: Record<string, unknown> = { status: 'published' };
    if (projectId) where.projectId = projectId;

    const tasks = await prisma.playgroundTaskConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    logger.error(error, 'Content playground-tasks list error');
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});
