import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { authRateLimit } from '../middleware/rateLimit.js';
import { sendPasswordResetEmail, sendEmailVerificationEmail, sendFreeWelcomeEmail } from '../lib/email.js';
import { sanitizeUserInput } from '../lib/sanitize.js';
import { notifyNewSignup } from '../lib/discord-webhooks.js';

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

    // XSS-Schutz: displayName sanitizen
    const safeDisplayName = data.displayName
      ? sanitizeUserInput(data.displayName)
      : 'Lernender';

    // Create user + initial progress
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        displayName: safeDisplayName,
        progress: {
          create: {}, // Creates with defaults from schema
        },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarEmoji: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: verificationExpires,
      },
    });

    // Send verification email (non-blocking – don't fail registration if email fails)
    sendEmailVerificationEmail(user.email, verificationToken, user.displayName).catch((err) => {
      logger.error({ error: err, userId: user.id }, 'Failed to send verification email during registration');
    });

    const token = signToken({ userId: user.id, email: user.email });

    // Discord webhook notification (non-blocking)
    notifyNewSignup({ email: user.email, displayName: user.displayName }).catch(() => {});

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
        emailVerified: true,
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
        emailVerified: true,
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

    // XSS-Schutz: Eingaben sanitizen
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(data.displayName && { displayName: sanitizeUserInput(data.displayName) }),
        ...(data.avatarEmoji && { avatarEmoji: sanitizeUserInput(data.avatarEmoji) }),
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

// ── POST /api/auth/password-reset-request ────────────────────
// Request password reset email

const passwordResetRequestSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
});

authRouter.post('/password-reset-request', authRateLimit, async (req, res) => {
  try {
    const data = passwordResetRequestSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, displayName: true },
    });

    // Always return success (don't leak user existence)
    if (!user) {
      logger.warn({ email: data.email }, 'Password reset requested for non-existent user');
      res.json({ message: 'Falls ein Account mit dieser E-Mail existiert, wurde eine E-Mail versendet.' });
      return;
    }

    // Generate secure reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete old reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send email
    await sendPasswordResetEmail(user.email, token, user.displayName);

    logger.info({ userId: user.id }, 'Password reset email sent');
    res.json({ message: 'Falls ein Account mit dieser E-Mail existiert, wurde eine E-Mail versendet.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Password reset request error');
    res.status(500).json({ error: 'Fehler beim Anfordern des Passwort-Resets' });
  }
});

// ── POST /api/auth/password-reset-confirm ────────────────────
// Confirm password reset with token

const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token erforderlich'),
  newPassword: z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben'),
});

authRouter.post('/password-reset-confirm', authRateLimit, async (req, res) => {
  try {
    const data = passwordResetConfirmSchema.parse(req.body);

    // Find valid reset token
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token: data.token },
      include: { user: true },
    });

    if (!resetToken) {
      res.status(400).json({ error: 'Ungültiger oder abgelaufener Reset-Link' });
      return;
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      res.status(400).json({ error: 'Reset-Link ist abgelaufen' });
      return;
    }

    // Check if token was already used
    if (resetToken.usedAt) {
      res.status(400).json({ error: 'Reset-Link wurde bereits verwendet' });
      return;
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(data.newPassword, 12);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    logger.info({ userId: resetToken.userId }, 'Password reset successful');
    res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Password reset confirm error');
    res.status(500).json({ error: 'Fehler beim Zurücksetzen des Passworts' });
  }
});

// ── POST /api/auth/verify-email ──────────────────────────────
// Verify email address with token

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token erforderlich'),
});

authRouter.post('/verify-email', authRateLimit, async (req, res) => {
  try {
    const data = verifyEmailSchema.parse(req.body);

    // Find valid verification token
    const verification = await prisma.emailVerification.findUnique({
      where: { token: data.token },
      include: { user: true },
    });

    if (!verification) {
      res.status(400).json({ error: 'Ungültiger oder abgelaufener Verifizierungs-Link' });
      return;
    }

    // Check if token is expired
    if (verification.expiresAt < new Date()) {
      res.status(400).json({ error: 'Verifizierungs-Link ist abgelaufen. Fordere einen neuen an.' });
      return;
    }

    // Check if token was already used
    if (verification.usedAt) {
      res.status(400).json({ error: 'E-Mail wurde bereits bestätigt' });
      return;
    }

    // Check if email is already verified
    if (verification.user.emailVerified) {
      res.status(400).json({ error: 'E-Mail wurde bereits bestätigt' });
      return;
    }

    // Mark email as verified and token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verification.userId },
        data: { emailVerified: true },
      }),
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
    ]);

    logger.info({ userId: verification.userId }, 'Email verified successfully');
    res.json({ message: 'E-Mail erfolgreich bestätigt!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Email verification error');
    res.status(500).json({ error: 'Fehler bei der E-Mail-Verifizierung' });
  }
});

// ── POST /api/auth/signup/free ───────────────────────────────
// Free tier signup – email only, no password required
// Creates a user with a random password (cannot login with password)
// Sends welcome email with link to free lessons

const freeSignupSchema = z.object({
  email: z.string().email('Ungueltige E-Mail-Adresse'),
  displayName: z.string().min(1).max(50).optional(),
});

authRouter.post('/signup/free', authRateLimit, async (req, res) => {
  try {
    const data = freeSignupSchema.parse(req.body);

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      // Don't leak user existence – just send a success-like response
      // and re-send the welcome email
      sendFreeWelcomeEmail(data.email, existing.displayName).catch((err) => {
        logger.error({ error: err, email: data.email }, 'Failed to re-send free welcome email');
      });

      // Sign a token so the user can start learning immediately
      const token = signToken({ userId: existing.id, email: existing.email });
      res.status(200).json({
        user: {
          id: existing.id,
          email: existing.email,
          displayName: existing.displayName,
          avatarEmoji: existing.avatarEmoji,
          emailVerified: existing.emailVerified,
        },
        token,
        message: 'Willkommen zurueck! Dein Zugang ist aktiv.',
      });
      return;
    }

    // Generate a random password (user signed up via free tier – no password login)
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    // XSS protection
    const safeDisplayName = data.displayName
      ? sanitizeUserInput(data.displayName)
      : 'Lernender';

    // Create user + initial progress
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        displayName: safeDisplayName,
        progress: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarEmoji: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Send free welcome email (non-blocking)
    sendFreeWelcomeEmail(user.email, user.displayName).catch((err) => {
      logger.error({ error: err, userId: user.id }, 'Failed to send free welcome email');
    });

    const token = signToken({ userId: user.id, email: user.email });

    // Discord webhook notification (non-blocking)
    notifyNewSignup({ email: user.email, displayName: user.displayName }).catch(() => {});

    logger.info({ userId: user.id, tier: 'free' }, 'Free tier user registered');
    res.status(201).json({
      user,
      token,
      message: 'Willkommen! Deine 5 kostenlosen Lektionen warten auf dich.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Free signup error');
    res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
  }
});

// ── POST /api/auth/resend-verification ───────────────────────
// Resend email verification (requires auth)

authRouter.post('/resend-verification', requireAuth, authRateLimit, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, displayName: true, emailVerified: true },
    });

    if (!user) {
      res.status(404).json({ error: 'Benutzer nicht gefunden' });
      return;
    }

    if (user.emailVerified) {
      res.status(400).json({ error: 'E-Mail ist bereits bestätigt' });
      return;
    }

    // Delete old verification tokens for this user
    await prisma.emailVerification.deleteMany({
      where: { userId: user.id },
    });

    // Generate new verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send verification email
    await sendEmailVerificationEmail(user.email, token, user.displayName);

    logger.info({ userId: user.id }, 'Verification email resent');
    res.json({ message: 'Verifizierungs-E-Mail wurde erneut gesendet' });
  } catch (error) {
    logger.error(error, 'Resend verification error');
    res.status(500).json({ error: 'Fehler beim erneuten Senden der Verifizierungs-E-Mail' });
  }
});
