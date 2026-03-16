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
import { subscriptionRouter } from './routes/subscription.js';
import { discordRouter } from './routes/discord.js';
import { newsletterRouter } from './routes/newsletter.js';
import { showcaseRouter } from './routes/showcase.js';
import { adminRouter } from './routes/admin.js';
import { contentRouter } from './routes/content.js';
import { ticketsRouter } from './routes/tickets.js';
import { globalRateLimit } from './middleware/rateLimit.js';
import { initSentry, Sentry } from './lib/sentry.js';
import { startDiscordBot, stopDiscordBot } from './lib/discord-bot.js';

// ── Logger ───────────────────────────────────────────────────
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

// ── Sentry (Error Tracking) ─────────────────────────────────
initSentry();

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

// Trust proxy - Required for Railway/Vercel (behind reverse proxy)
app.set('trust proxy', 1);

// ── Global Middleware ────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", 'https://discord.com'],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    // HSTS: Erzwingt HTTPS für 1 Jahr
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    // Verhindert Clickjacking
    frameguard: { action: 'deny' },
    // Referrer-Policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // Permissions Policy (ehem. Feature-Policy)
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  })
);

// Stripe Webhook benötigt raw body - muss VOR express.json() stehen
app.use(
  '/api/subscription/webhook',
  express.raw({ type: 'application/json' })
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
      sentry: process.env.SENTRY_DSN ? 'enabled' : 'disabled',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
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
app.use('/api/subscription', subscriptionRouter);
app.use('/api/discord', discordRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/showcase', showcaseRouter);
app.use('/api/admin', adminRouter);
app.use('/api/content', contentRouter);
app.use('/api/tickets', ticketsRouter);

// ── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Sentry Error Handler (muss VOR dem eigenen Error Handler stehen) ─
Sentry.setupExpressErrorHandler(app);

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

    // Start Discord Bot (non-blocking – bot failure should not prevent server startup)
    startDiscordBot().catch((error) => {
      logger.error(error, 'Discord Bot startup failed (non-critical)');
    });
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
}

// ── Graceful Shutdown ────────────────────────────────────────
async function shutdown() {
  logger.info('Shutting down...');
  await stopDiscordBot();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

main();
