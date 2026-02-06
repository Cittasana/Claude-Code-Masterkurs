import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';

import { authRouter } from './routes/auth.js';
import { progressRouter } from './routes/progress.js';
import { forumRouter } from './routes/forum.js';
import { leaderboardRouter } from './routes/leaderboard.js';
import { challengesRouter } from './routes/challenges.js';
import { patternsRouter } from './routes/patterns.js';
import { srsRouter } from './routes/srs.js';
import { analyticsRouter } from './routes/analytics.js';
import { globalRateLimit } from './middleware/rateLimit.js';

// ── Logger ───────────────────────────────────────────────────
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

// ── Prisma ───────────────────────────────────────────────────
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV !== 'production'
      ? ['query', 'warn', 'error']
      : ['warn', 'error'],
});

// ── Express App ──────────────────────────────────────────────
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// ── Global Middleware ────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(globalRateLimit);

// ── Health Check ─────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);
app.use('/api/forum', forumRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/patterns', patternsRouter);
app.use('/api/srs', srsRouter);
app.use('/api/analytics', analyticsRouter);

// ── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global Error Handler ─────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error(err, 'Unhandled error');
    res.status(500).json({
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
    });
  }
);

// ── Startup ──────────────────────────────────────────────────
async function main() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on http://0.0.0.0:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
}

// ── Graceful Shutdown ────────────────────────────────────────
async function shutdown() {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

main();
