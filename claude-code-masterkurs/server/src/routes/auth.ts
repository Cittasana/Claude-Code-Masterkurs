import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { authRateLimit } from '../middleware/rateLimit.js';

export const authRouter = Router();

// ── Validation Schemas ───────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben'),
  displayName: z.string().min(1).max(50).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ── POST /api/auth/register ──────────────────────────────────

authRouter.post('/register', authRateLimit, async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      res.status(409).json({ error: 'E-Mail ist bereits registriert' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user + initial progress
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        displayName: data.displayName || 'Lernender',
        progress: {
          create: {}, // Creates with defaults from schema
        },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarEmoji: true,
        createdAt: true,
      },
    });

    const token = signToken({ userId: user.id, email: user.email });

    logger.info({ userId: user.id }, 'User registered');
    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Registration error');
    res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────

authRouter.post('/login', authRateLimit, async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarEmoji: true,
        passwordHash: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'E-Mail oder Passwort falsch' });
      return;
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'E-Mail oder Passwort falsch' });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email });

    const { passwordHash: _, ...safeUser } = user;
    logger.info({ userId: user.id }, 'User logged in');
    res.json({ user: safeUser, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Login error');
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────

authRouter.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarEmoji: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Benutzer nicht gefunden' });
      return;
    }

    res.json({ user });
  } catch (error) {
    logger.error(error, 'Get current user error');
    res.status(500).json({ error: 'Fehler beim Laden des Benutzers' });
  }
});

// ── PUT /api/auth/profile ────────────────────────────────────

const profileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  avatarEmoji: z.string().max(10).optional(),
});

authRouter.put('/profile', requireAuth, async (req, res) => {
  try {
    const data = profileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(data.displayName && { displayName: data.displayName }),
        ...(data.avatarEmoji && { avatarEmoji: data.avatarEmoji }),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarEmoji: true,
      },
    });

    res.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Profile update error');
    res.status(500).json({ error: 'Profil konnte nicht aktualisiert werden' });
  }
});

// ── DELETE /api/auth/account ─────────────────────────────────
// DSGVO Art. 17 - Recht auf Löschung

authRouter.delete('/account', requireAuth, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.user!.userId },
    });

    logger.info({ userId: req.user!.userId }, 'User account deleted (DSGVO)');
    res.json({ message: 'Account erfolgreich gelöscht' });
  } catch (error) {
    logger.error(error, 'Account deletion error');
    res.status(500).json({ error: 'Account konnte nicht gelöscht werden' });
  }
});
