import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { newsletterRateLimit } from '../middleware/rateLimit.js';
import { optionalAuth } from '../middleware/auth.js';
import {
  sendNewsletterConfirmationEmail,
  sendNewsletterWelcomeEmail,
  sendNewsletterUnsubscribeEmail,
} from '../lib/email.js';

export const newsletterRouter = Router();

// ── Validation Schemas ───────────────────────────────────────

const subscribeSchema = z.object({
  email: z.string().email('Ungueltige E-Mail-Adresse'),
  displayName: z.string().min(1).max(50).optional(),
  source: z.enum(['website', 'footer', 'signup', 'landing']).optional(),
});

const unsubscribeSchema = z.object({
  token: z.string().min(1, 'Token erforderlich'),
});

const confirmSchema = z.object({
  token: z.string().min(1, 'Token erforderlich'),
});

// ── POST /api/newsletter/subscribe ──────────────────────────
// Public endpoint with rate limiting – Double-Opt-In

newsletterRouter.post('/subscribe', newsletterRateLimit, async (req, res) => {
  try {
    const data = subscribeSchema.parse(req.body);

    // Check if subscriber already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      // If already active, return success (no email enumeration)
      if (existing.status === 'active') {
        res.json({ message: 'Vielen Dank! Falls du noch nicht angemeldet bist, erhaeltst du eine Bestaetigungs-E-Mail.' });
        return;
      }

      // If pending, resend confirmation email
      if (existing.status === 'pending' && existing.confirmToken) {
        sendNewsletterConfirmationEmail(
          existing.email,
          existing.confirmToken,
          existing.displayName || undefined,
        ).catch((err) => {
          logger.error({ error: err, email: data.email }, 'Failed to resend newsletter confirmation');
        });

        res.json({ message: 'Vielen Dank! Falls du noch nicht angemeldet bist, erhaeltst du eine Bestaetigungs-E-Mail.' });
        return;
      }

      // If unsubscribed, re-subscribe with new tokens
      if (existing.status === 'unsubscribed') {
        const confirmToken = crypto.randomBytes(32).toString('hex');
        const unsubscribeToken = crypto.randomBytes(32).toString('hex');

        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            status: 'pending',
            confirmToken,
            unsubscribeToken,
            unsubscribedAt: null,
            displayName: data.displayName || existing.displayName,
            source: data.source || existing.source,
          },
        });

        sendNewsletterConfirmationEmail(
          existing.email,
          confirmToken,
          data.displayName || existing.displayName || undefined,
        ).catch((err) => {
          logger.error({ error: err, email: data.email }, 'Failed to send newsletter confirmation');
        });

        res.json({ message: 'Vielen Dank! Falls du noch nicht angemeldet bist, erhaeltst du eine Bestaetigungs-E-Mail.' });
        return;
      }
    }

    // Create new subscriber
    const confirmToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    await prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        displayName: data.displayName || null,
        source: data.source || 'website',
        status: 'pending',
        confirmToken,
        unsubscribeToken,
      },
    });

    // Send confirmation email (non-blocking)
    sendNewsletterConfirmationEmail(
      data.email,
      confirmToken,
      data.displayName || undefined,
    ).catch((err) => {
      logger.error({ error: err, email: data.email }, 'Failed to send newsletter confirmation');
    });

    logger.info({ email: data.email, source: data.source }, 'Newsletter subscription initiated (pending confirmation)');

    // Always return same message to prevent email enumeration
    res.json({ message: 'Vielen Dank! Falls du noch nicht angemeldet bist, erhaeltst du eine Bestaetigungs-E-Mail.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Newsletter subscribe error');
    res.status(500).json({ error: 'Newsletter-Anmeldung fehlgeschlagen' });
  }
});

// ── POST /api/newsletter/confirm ────────────────────────────
// Confirm double-opt-in via token

newsletterRouter.post('/confirm', newsletterRateLimit, async (req, res) => {
  try {
    const data = confirmSchema.parse(req.body);

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { confirmToken: data.token },
    });

    if (!subscriber) {
      res.status(400).json({ error: 'Ungueltiger oder abgelaufener Bestaetigungs-Link' });
      return;
    }

    if (subscriber.status === 'active') {
      res.json({ message: 'Newsletter-Anmeldung bereits bestaetigt!' });
      return;
    }

    // Activate subscription
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'active',
        confirmedAt: new Date(),
        confirmToken: null, // Invalidate confirm token
      },
    });

    // Send welcome email (non-blocking)
    sendNewsletterWelcomeEmail(
      subscriber.email,
      subscriber.unsubscribeToken,
      subscriber.displayName || undefined,
    ).catch((err) => {
      logger.error({ error: err, email: subscriber.email }, 'Failed to send newsletter welcome email');
    });

    logger.info({ email: subscriber.email }, 'Newsletter subscription confirmed');
    res.json({ message: 'Newsletter-Anmeldung erfolgreich bestaetigt!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Newsletter confirm error');
    res.status(500).json({ error: 'Bestaetigungs-Fehler' });
  }
});

// ── POST /api/newsletter/unsubscribe ────────────────────────
// Unsubscribe via token (no auth required)

newsletterRouter.post('/unsubscribe', newsletterRateLimit, async (req, res) => {
  try {
    const data = unsubscribeSchema.parse(req.body);

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: data.token },
    });

    if (!subscriber) {
      res.status(400).json({ error: 'Ungueltiger Abmelde-Link' });
      return;
    }

    if (subscriber.status === 'unsubscribed') {
      res.json({ message: 'Du bist bereits abgemeldet.' });
      return;
    }

    // Mark as unsubscribed
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      },
    });

    // Send unsubscribe confirmation (non-blocking)
    sendNewsletterUnsubscribeEmail(
      subscriber.email,
      subscriber.displayName || undefined,
    ).catch((err) => {
      logger.error({ error: err, email: subscriber.email }, 'Failed to send newsletter unsubscribe email');
    });

    logger.info({ email: subscriber.email }, 'Newsletter unsubscribed');
    res.json({ message: 'Du wurdest erfolgreich vom Newsletter abgemeldet.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Newsletter unsubscribe error');
    res.status(500).json({ error: 'Abmeldung fehlgeschlagen' });
  }
});

// ── GET /api/newsletter/status ──────────────────────────────
// Optional auth – returns newsletter status for authenticated user

newsletterRouter.get('/status', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      res.json({ subscribed: false });
      return;
    }

    // Look up by user's email
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true },
    });

    if (!user) {
      res.json({ subscribed: false });
      return;
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: user.email },
    });

    if (!subscriber) {
      res.json({ subscribed: false });
      return;
    }

    res.json({
      subscribed: subscriber.status === 'active',
      status: subscriber.status,
      subscribedAt: subscriber.confirmedAt || subscriber.subscribedAt,
    });
  } catch (error) {
    logger.error(error, 'Newsletter status error');
    res.status(500).json({ error: 'Status konnte nicht geladen werden' });
  }
});
