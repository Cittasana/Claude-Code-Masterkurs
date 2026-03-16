import { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { createPipedriveContact } from '../lib/pipedrive.js';
import { sendDiscordInviteEmail } from '../lib/email.js';
import { updateDiscordRole, getTierFromSubscription } from '../lib/discord.js';
import { canAccessLesson, FREE_LESSON_LIMIT } from '../lib/lessons-config.js';
import { notifyNewSubscription, notifySubscriptionCanceled } from '../lib/discord-webhooks.js';

export const subscriptionRouter = Router();

// ── Stripe Initialization ────────────────────────────────────
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeKey, { apiVersion: '2026-01-28.clover' });

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be set in production');
}
if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET must be set in production');
}

// ── Validation Schemas ───────────────────────────────────────

const createCheckoutSchema = z.object({
  priceId: z.string(),
  promoCode: z.string().optional(),
});

const validatePromoCodeSchema = z.object({
  code: z.string().min(1, 'Aktionscode erforderlich'),
});

// ── POST /api/subscription/create-checkout-session ──────────
// Erstellt eine Stripe Checkout Session für Abo-Abschluss

subscriptionRouter.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    const data = createCheckoutSchema.parse(req.body);
    const userId = req.user!.userId;

    // User holen oder anlegen
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      res.status(404).json({ error: 'Benutzer nicht gefunden' });
      return;
    }

    // Prüfen ob bereits ein Abo existiert
    if (user.subscription && user.subscription.status === 'active') {
      res.status(400).json({ error: 'Du hast bereits ein aktives Abonnement' });
      return;
    }

    let stripeCustomerId = user.subscription?.stripeCustomerId;

    // Stripe Customer anlegen falls noch nicht vorhanden
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          displayName: user.displayName,
        },
      });
      stripeCustomerId = customer.id;

      // Subscription-Eintrag mit Customer ID erstellen
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeCustomerId,
          status: 'incomplete',
        },
        update: {
          stripeCustomerId,
        },
      });
    }

    // Promo Code validieren (falls angegeben)
    let promoCodeData: { durationMonths: number } | null = null;
    if (data.promoCode) {
      const promoCode = await prisma.promoCode.findUnique({
        where: { code: data.promoCode },
      });

      if (!promoCode || !promoCode.active) {
        res.status(400).json({ error: 'Ungültiger Aktionscode' });
        return;
      }

      if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
        res.status(400).json({ error: 'Aktionscode ist abgelaufen' });
        return;
      }

      if (promoCode.maxUses && promoCode.timesUsed >= promoCode.maxUses) {
        res.status(400).json({ error: 'Aktionscode wurde bereits zu oft verwendet' });
        return;
      }

      promoCodeData = promoCode;
    }

    // Prüfe ob es sich um einen Lifetime-Kauf handelt
    const isLifetime = data.priceId === process.env.STRIPE_PRICE_ID_LIFETIME;

    // Checkout Session Parameter vorbereiten
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: data.priceId,
          quantity: 1,
        },
      ],
      mode: isLifetime ? 'payment' : 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?canceled=true`,
      metadata: {
        userId: user.id,
        promoCode: data.promoCode || '',
      },
    };

    // Subscription-spezifische Daten nur bei recurring payments
    if (!isLifetime) {
      sessionParams.subscription_data = {
        metadata: {
          userId: user.id,
          promoCode: data.promoCode || '',
        },
      };
    }

    // Wenn Promo Code vorhanden: Trial Period setzen (nur bei Subscriptions, nicht bei Lifetime)
    if (promoCodeData && !isLifetime) {
      const trialDays = promoCodeData.durationMonths * 30; // ca. 30 Tage pro Monat
      sessionParams.subscription_data = {
        ...sessionParams.subscription_data,
        trial_period_days: trialDays,
      };
    }

    // Checkout Session erstellen
    const session = await stripe.checkout.sessions.create(sessionParams);

    logger.info({ userId, sessionId: session.id }, 'Checkout session created');
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Create checkout session error');
    res.status(500).json({ error: 'Fehler beim Erstellen der Checkout-Session' });
  }
});

// ── POST /api/subscription/validate-promo-code ──────────────
// Validiert einen Aktionscode vor dem Checkout
// WICHTIG: Kein requireAuth, damit nicht-eingeloggte User Codes validieren können

subscriptionRouter.post('/validate-promo-code', async (req, res) => {
  try {
    const data = validatePromoCodeSchema.parse(req.body);

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: data.code },
    });

    if (!promoCode) {
      res.status(404).json({ 
        valid: false, 
        error: 'Aktionscode nicht gefunden' 
      });
      return;
    }

    if (!promoCode.active) {
      res.status(400).json({ 
        valid: false, 
        error: 'Aktionscode ist nicht mehr aktiv' 
      });
      return;
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      res.status(400).json({ 
        valid: false, 
        error: 'Aktionscode ist abgelaufen' 
      });
      return;
    }

    if (promoCode.maxUses && promoCode.timesUsed >= promoCode.maxUses) {
      res.status(400).json({ 
        valid: false, 
        error: 'Aktionscode wurde bereits zu oft verwendet' 
      });
      return;
    }

    res.json({
      valid: true,
      code: promoCode.code,
      description: promoCode.description,
      durationMonths: promoCode.durationMonths,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Validate promo code error');
    res.status(500).json({ error: 'Fehler beim Validieren des Aktionscodes' });
  }
});

// ── POST /api/subscription/verify-checkout ───────────────────
// Fallback: Verifiziert die Stripe Checkout Session direkt und aktiviert
// das Abo, falls der Webhook nicht durchkam. Wird von der Success-Seite aufgerufen.

subscriptionRouter.post('/verify-checkout', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { sessionId } = req.body as { sessionId?: string };

    if (!sessionId) {
      res.status(400).json({ error: 'sessionId erforderlich' });
      return;
    }

    // Aktuelle Subscription prüfen
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    // Wenn bereits aktiv/lifetime → nichts zu tun
    if (subscription && (subscription.status === 'active' || subscription.status === 'lifetime' || subscription.status === 'trialing')) {
      res.json({ status: subscription.status, alreadyActive: true });
      return;
    }

    // Stripe Session abrufen und verifizieren
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.userId !== userId) {
      res.status(403).json({ error: 'Session gehört nicht zu diesem User' });
      return;
    }

    if (session.payment_status !== 'paid') {
      res.json({ status: 'payment_pending', activated: false });
      return;
    }

    // Zahlung bestätigt → Abo aktivieren (gleiche Logik wie handleCheckoutCompleted)
    const isLifetime = session.mode === 'payment';
    const subscriptionId = session.subscription as string;

    if (isLifetime) {
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: session.customer as string,
          status: 'lifetime',
          isLifetime: true,
          lifetimePurchasedAt: new Date(),
        },
        update: {
          status: 'lifetime',
          isLifetime: true,
          lifetimePurchasedAt: new Date(),
        },
      });
    } else {
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscriptionId,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        update: {
          stripeSubscriptionId: subscriptionId,
          status: 'active',
          ...(subscription && !subscription.currentPeriodStart
            ? {
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              }
            : {}),
        },
      });
    }

    logger.info({ userId, sessionId, isLifetime }, 'Subscription activated via verify-checkout fallback');
    res.json({ status: isLifetime ? 'lifetime' : 'active', activated: true });
  } catch (error) {
    logger.error(error, 'Verify checkout error');
    res.status(500).json({ error: 'Fehler beim Verifizieren' });
  }
});

// ── GET /api/subscription/has-access ─────────────────────────
// Prüft ob User Zugriff hat (aktives Abo ODER Lifetime)

subscriptionRouter.get('/has-access', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      res.json({ hasAccess: false });
      return;
    }

    // Zugriff wenn: Lifetime ODER aktives Abo ODER Trial
    const hasAccess = 
      subscription.isLifetime ||
      subscription.status === 'active' ||
      subscription.status === 'trialing';

    res.json({ 
      hasAccess,
      isLifetime: subscription.isLifetime,
      status: subscription.status,
    });
  } catch (error) {
    logger.error(error, 'Check access error');
    res.status(500).json({ error: 'Fehler beim Prüfen des Zugriffs' });
  }
});

// ── GET /api/subscription/status ─────────────────────────────
// Gibt den aktuellen Abo-Status des Users zurück

subscriptionRouter.get('/status', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        promoCode: true,
      },
    });

    if (!subscription) {
      res.json({ 
        hasSubscription: false,
        status: 'none',
      });
      return;
    }

    res.json({
      hasSubscription: true,
      status: subscription.status,
      isLifetime: subscription.isLifetime,
      lifetimePurchasedAt: subscription.lifetimePurchasedAt,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      promoCode: subscription.promoCode ? {
        code: subscription.promoCode.code,
        description: subscription.promoCode.description,
        expiresAt: subscription.promoExpiresAt,
      } : null,
    });
  } catch (error) {
    logger.error(error, 'Get subscription status error');
    res.status(500).json({ error: 'Fehler beim Laden des Abo-Status' });
  }
});

// ── GET /api/subscription/can-access-lesson/:lessonId ────────
// Prueft ob ein User (oder Gast) eine bestimmte Lektion oeffnen darf
// Verwendet optionalAuth: funktioniert mit und ohne Token

subscriptionRouter.get('/can-access-lesson/:lessonId', optionalAuth, async (req, res) => {
  try {
    const rawParam = req.params.lessonId;
    const lessonId = parseInt(Array.isArray(rawParam) ? rawParam[0] : rawParam, 10);

    if (isNaN(lessonId) || lessonId < 0) {
      res.status(400).json({ error: 'Ungueltige Lektion' });
      return;
    }

    // Guest user (no token)
    if (!req.user) {
      const result = canAccessLesson(lessonId, null);
      res.json({
        ...result,
        freeLessonLimit: FREE_LESSON_LIMIT,
      });
      return;
    }

    // Authenticated user – check subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.userId },
      select: { status: true, isLifetime: true },
    });

    const result = canAccessLesson(lessonId, subscription);
    res.json({
      ...result,
      freeLessonLimit: FREE_LESSON_LIMIT,
    });
  } catch (error) {
    logger.error(error, 'Check lesson access error');
    res.status(500).json({ error: 'Fehler beim Pruefen des Zugriffs' });
  }
});

// ── POST /api/subscription/cancel ────────────────────────────
// Kündigt das Abo zum Ende der aktuellen Periode

subscriptionRouter.post('/cancel', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      res.status(404).json({ error: 'Kein aktives Abonnement gefunden' });
      return;
    }

    // Bei Stripe kündigen
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // In DB aktualisieren
    await prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: true },
    });

    logger.info({ userId, subscriptionId: subscription.stripeSubscriptionId }, 'Subscription canceled');
    res.json({ message: 'Abonnement wurde gekündigt' });
  } catch (error) {
    logger.error(error, 'Cancel subscription error');
    res.status(500).json({ error: 'Fehler beim Kündigen des Abonnements' });
  }
});

// ── POST /api/subscription/webhook ───────────────────────────
// Stripe Webhook Handler für Subscription Events

subscriptionRouter.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig || Array.isArray(sig)) {
    res.status(400).send('Missing signature');
    return;
  }

  let event: Stripe.Event;

  try {
    // Webhook-Event verifizieren
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error({ error: message }, 'Webhook signature verification failed');
    res.status(400).send('Webhook verification failed');
    return;
  }

  // Event-Typ behandeln
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        logger.info({ eventType: event.type }, 'Unhandled webhook event');
    }

    res.json({ received: true });
  } catch (error) {
    logger.error({ error, eventType: event.type }, 'Webhook handler error');
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// ── Webhook Handler Functions ────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const promoCode = session.metadata?.promoCode;

  if (!userId) {
    logger.error({ sessionId: session.id }, 'Missing userId in checkout session metadata');
    return;
  }

  // Prüfen ob Lifetime oder Subscription
  const isLifetime = session.mode === 'payment'; // payment = einmalig, subscription = wiederkehrend
  const subscriptionId = session.subscription as string;

  // Promo Code verarbeiten (nur für Subscriptions, nicht für Lifetime)
  let promoCodeId: string | null = null;
  let promoExpiresAt: Date | null = null;

  if (promoCode && !isLifetime) {
    const promo = await prisma.promoCode.findUnique({
      where: { code: promoCode },
    });

    if (promo) {
      // Promo Code Nutzung erhöhen
      await prisma.promoCode.update({
        where: { id: promo.id },
        data: { timesUsed: { increment: 1 } },
      });

      promoCodeId = promo.id;
      promoExpiresAt = new Date();
      promoExpiresAt.setMonth(promoExpiresAt.getMonth() + promo.durationMonths);

      logger.info({ userId, promoCode, promoCodeId }, 'Promo code applied');
    }
  }

  // User-Daten für Pipedrive holen
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, displayName: true },
  });

  // Subscription in DB erstellen/aktualisieren
  if (isLifetime) {
    // Lifetime Purchase
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId: session.customer as string,
        status: 'lifetime',
        isLifetime: true,
        lifetimePurchasedAt: new Date(),
      },
      update: {
        status: 'lifetime',
        isLifetime: true,
        lifetimePurchasedAt: new Date(),
      },
    });

    logger.info({ userId, sessionId: session.id }, 'Lifetime access purchased');
  } else {
    // Recurring Subscription
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscriptionId,
        status: 'active',
        promoCodeId,
        promoAppliedAt: promoCodeId ? new Date() : null,
        promoExpiresAt,
      },
      update: {
        stripeSubscriptionId: subscriptionId,
        status: 'active',
        promoCodeId,
        promoAppliedAt: promoCodeId ? new Date() : null,
        promoExpiresAt,
      },
    });

    logger.info({ userId, subscriptionId, sessionId: session.id }, 'Subscription checkout completed');
  }

  // ── Pipedrive: Kontakt + Deal anlegen (non-blocking) ──────
  if (user) {
    createPipedriveContact({
      email: user.email,
      displayName: user.displayName,
      isLifetime,
      amountPaid: session.amount_total ?? undefined,
    }).catch((error) => {
      logger.error({ error, userId }, 'Pipedrive-Sync nach Checkout fehlgeschlagen');
    });
  }

  // ── Discord: Invite-Email senden (non-blocking) ──────────
  if (user) {
    const tier = isLifetime ? 'lifetime' : 'pro';
    sendDiscordInviteEmail(user.email, user.displayName, tier).catch((error) => {
      logger.error({ error, userId }, 'Discord Invite-Email nach Checkout fehlgeschlagen');
    });

    // ── Discord: Webhook-Notification (non-blocking) ────────
    notifyNewSubscription(
      { email: user.email, displayName: user.displayName },
      tier,
    ).catch(() => {});
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    logger.error({ subscriptionId: subscription.id }, 'Missing userId in subscription metadata');
    return;
  }

  // In Stripe API 2026+, current_period fields are on SubscriptionItem, not Subscription
  const firstItem = subscription.items.data[0];
  const periodStart = firstItem?.current_period_start;
  const periodEnd = firstItem?.current_period_end;

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: subscription.status,
      stripePriceId: firstItem?.price.id,
      currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
    },
  });

  logger.info({ userId, subscriptionId: subscription.id, status: subscription.status }, 'Subscription updated');

  // ── Discord: Rolle aktualisieren bei Tier-Wechsel (non-blocking) ──
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { discordId: true },
  });

  if (user?.discordId) {
    const sub = await prisma.subscription.findUnique({
      where: { userId },
      select: { isLifetime: true, status: true, stripePriceId: true },
    });

    const tier = getTierFromSubscription(sub);
    updateDiscordRole(user.discordId, tier).catch((error) => {
      logger.error({ error, userId, discordId: user.discordId }, 'Discord Role-Update fehlgeschlagen');
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    logger.error({ subscriptionId: subscription.id }, 'Missing userId in subscription metadata');
    return;
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'canceled',
      stripeSubscriptionId: null,
    },
  });

  logger.info({ userId, subscriptionId: subscription.id }, 'Subscription deleted');

  // ── Discord: Rolle auf Free zurücksetzen (non-blocking) ──
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { discordId: true, email: true, displayName: true },
  });

  if (user?.discordId) {
    updateDiscordRole(user.discordId, 'free').catch((error) => {
      logger.error({ error, userId, discordId: user.discordId }, 'Discord Role-Downgrade fehlgeschlagen');
    });
  }

  // ── Discord: Webhook-Notification (non-blocking) ──
  if (user) {
    notifySubscriptionCanceled({ email: user.email, displayName: user.displayName }).catch(() => {});
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // In Stripe API 2026+, subscription is nested under parent.subscription_details
  const subDetails = invoice.parent?.subscription_details;
  const subscriptionId = subDetails
    ? (typeof subDetails.subscription === 'string'
        ? subDetails.subscription
        : subDetails.subscription?.id ?? null)
    : null;

  if (!subscriptionId) {
    return;
  }

  // Bei erfolgreicher Zahlung Subscription-Status aktualisieren
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'active' },
    });

    logger.info({ subscriptionId, invoiceId: invoice.id }, 'Invoice paid, subscription activated');
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subDetails = invoice.parent?.subscription_details;
  const subscriptionId = subDetails
    ? (typeof subDetails.subscription === 'string'
        ? subDetails.subscription
        : subDetails.subscription?.id ?? null)
    : null;

  if (!subscriptionId) {
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'past_due' },
    });

    logger.warn({ subscriptionId, invoiceId: invoice.id }, 'Invoice payment failed');
  }
}

