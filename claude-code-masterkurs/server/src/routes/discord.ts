import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma, logger } from '../index.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import {
  buildOAuthUrl,
  buildLoginOAuthUrl,
  exchangeCodeForToken,
  getDiscordUser,
  addUserToDiscordServer,
  getTierFromSubscription,
  isDiscordConfigured,
} from '../lib/discord.js';

export const discordRouter = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// In-memory state store for CSRF protection (TTL: 10 minutes)
const oauthStates = new Map<string, { userId: string; mode: string; expiresAt: number }>();

// Cleanup expired states periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of oauthStates) {
    if (value.expiresAt < now) {
      oauthStates.delete(key);
    }
  }
}, 60_000);

// ── GET /api/discord/auth-url ───────────────────────────────
// Returns the Discord OAuth URL for the authenticated user.
// The frontend redirects the user to this URL.

discordRouter.get('/auth-url', requireAuth, async (req, res) => {
  try {
    if (!isDiscordConfigured()) {
      res.status(503).json({ error: 'Discord-Integration ist nicht konfiguriert' });
      return;
    }

    const userId = req.user!.userId;

    // Generate CSRF state token
    const state = crypto.randomBytes(32).toString('hex');
    oauthStates.set(state, {
      userId,
      mode: 'link',
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    const redirectUri = `${APP_URL}/api/discord/callback`;
    const url = buildOAuthUrl(redirectUri, state);

    res.json({ url });
  } catch (error) {
    logger.error(error, 'Discord auth URL generation error');
    res.status(500).json({ error: 'Fehler beim Erstellen der Discord-Verbindung' });
  }
});

// ── GET /api/discord/login-url ───────────────────────────────
// Returns the Discord OAuth URL for login/register (no auth required).

discordRouter.get('/login-url', async (_req, res) => {
  try {
    if (!isDiscordConfigured()) {
      res.status(503).json({ error: 'Discord-Integration ist nicht konfiguriert' });
      return;
    }

    // Generate CSRF state token (no userId for login flow)
    const state = crypto.randomBytes(32).toString('hex');
    oauthStates.set(state, {
      userId: '', // unknown until callback
      mode: 'login',
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const redirectUri = `${APP_URL}/api/discord/callback`;
    const url = buildLoginOAuthUrl(redirectUri, state);

    res.json({ url });
  } catch (error) {
    logger.error(error, 'Discord login URL generation error');
    res.status(500).json({ error: 'Fehler beim Erstellen der Discord-Login-URL' });
  }
});

// ── GET /api/discord/callback ───────────────────────────────
// Discord redirects here after user authorizes.
// Handles both account-linking (mode=link) and login/register (mode=login).

discordRouter.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
      res.redirect(`${FRONTEND_URL}/dashboard?discord=error&reason=missing_params`);
      return;
    }

    // Verify state (CSRF protection)
    const stateData = oauthStates.get(state);
    if (!stateData || stateData.expiresAt < Date.now()) {
      oauthStates.delete(state);
      res.redirect(`${FRONTEND_URL}/dashboard?discord=error&reason=invalid_state`);
      return;
    }

    const mode = stateData.mode || 'link';
    oauthStates.delete(state);

    // Exchange code for access token
    const redirectUri = `${APP_URL}/api/discord/callback`;
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // Fetch Discord user info
    const discordUser = await getDiscordUser(tokenData.access_token);

    // ── Login/Register Mode ────────────────────────────────
    if (mode === 'login') {
      return await handleDiscordLogin(discordUser, tokenData.access_token, res);
    }

    // ── Account Linking Mode ───────────────────────────────
    const userId = stateData.userId;

    // Check if this Discord account is already linked to another user
    const existingLink = await prisma.user.findUnique({
      where: { discordId: discordUser.id },
      select: { id: true },
    });

    if (existingLink && existingLink.id !== userId) {
      res.redirect(`${FRONTEND_URL}/dashboard?discord=error&reason=already_linked`);
      return;
    }

    // Get user's subscription tier
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { isLifetime: true, status: true, stripePriceId: true },
    });

    const tier = getTierFromSubscription(subscription);

    // Add user to Discord server with appropriate role
    try {
      await addUserToDiscordServer(discordUser.id, tokenData.access_token, tier);
    } catch (error) {
      logger.error({ error, discordUserId: discordUser.id, userId }, 'Failed to add user to Discord server');
    }

    // Build Discord username (handle new username system without discriminator)
    const discordUsername = discordUser.discriminator === '0'
      ? discordUser.username
      : `${discordUser.username}#${discordUser.discriminator}`;

    // Save Discord ID to user profile
    await prisma.user.update({
      where: { id: userId },
      data: {
        discordId: discordUser.id,
        discordUsername,
      },
    });

    logger.info(
      { userId, discordId: discordUser.id, discordUsername },
      'Discord account linked'
    );

    res.redirect(`${FRONTEND_URL}/dashboard?discord=connected`);
  } catch (error) {
    logger.error(error, 'Discord OAuth callback error');
    res.redirect(`${FRONTEND_URL}/dashboard?discord=error&reason=auth_failed`);
  }
});

// ── Discord Login/Register Handler ──────────────────────────

async function handleDiscordLogin(
  discordUser: { id: string; username: string; discriminator: string; email?: string },
  accessToken: string,
  res: import('express').Response,
): Promise<void> {
  const discordUsername = discordUser.discriminator === '0'
    ? discordUser.username
    : `${discordUser.username}#${discordUser.discriminator}`;

  // Check if user with this Discord ID exists
  let user = await prisma.user.findUnique({
    where: { discordId: discordUser.id },
    select: { id: true, email: true, displayName: true },
  });

  if (user) {
    // Existing user → login
    const token = signToken({ userId: user.id, email: user.email });
    logger.info({ userId: user.id, discordId: discordUser.id }, 'Discord login successful');
    res.redirect(`${FRONTEND_URL}/dashboard?discord_login=success&token=${token}`);
    return;
  }

  // No user with this Discord ID – check if email is already registered
  const email = discordUser.email;
  if (email) {
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, discordId: true },
    });

    if (existingByEmail) {
      if (existingByEmail.discordId) {
        // Email exists but linked to different Discord → error
        res.redirect(`${FRONTEND_URL}/login?discord=error&reason=email_exists`);
        return;
      }

      // Email exists, not linked → link Discord and login
      await prisma.user.update({
        where: { id: existingByEmail.id },
        data: { discordId: discordUser.id, discordUsername },
      });

      const token = signToken({ userId: existingByEmail.id, email: existingByEmail.email });
      logger.info({ userId: existingByEmail.id, discordId: discordUser.id }, 'Discord linked and logged in');

      // Try to add to Discord server
      try {
        const sub = await prisma.subscription.findUnique({
          where: { userId: existingByEmail.id },
          select: { isLifetime: true, status: true, stripePriceId: true },
        });
        await addUserToDiscordServer(discordUser.id, accessToken, getTierFromSubscription(sub));
      } catch {
        // Non-critical
      }

      res.redirect(`${FRONTEND_URL}/dashboard?discord_login=success&token=${token}`);
      return;
    }
  }

  // No existing user → create new account
  if (!email) {
    res.redirect(`${FRONTEND_URL}/login?discord=error&reason=no_email`);
    return;
  }

  const randomPassword = crypto.randomBytes(32).toString('hex');
  const passwordHash = await bcrypt.hash(randomPassword, 12);

  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      displayName: discordUser.username,
      discordId: discordUser.id,
      discordUsername,
      emailVerified: true, // Discord verified the email
      progress: { create: {} },
    },
    select: { id: true, email: true, displayName: true },
  });

  // Try to add to Discord server
  try {
    await addUserToDiscordServer(discordUser.id, accessToken, 'free');
  } catch {
    // Non-critical
  }

  const token = signToken({ userId: newUser.id, email: newUser.email });
  logger.info({ userId: newUser.id, discordId: discordUser.id }, 'New user registered via Discord');
  res.redirect(`${FRONTEND_URL}/dashboard?discord_login=success&token=${token}`);
}

// ── GET /api/discord/status ─────────────────────────────────
// Returns the current Discord connection status for the user.

discordRouter.get('/status', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        discordId: true,
        discordUsername: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Benutzer nicht gefunden' });
      return;
    }

    res.json({
      connected: !!user.discordId,
      discordId: user.discordId,
      discordUsername: user.discordUsername,
      isConfigured: isDiscordConfigured(),
    });
  } catch (error) {
    logger.error(error, 'Discord status check error');
    res.status(500).json({ error: 'Fehler beim Prüfen des Discord-Status' });
  }
});

// ── POST /api/discord/disconnect ────────────────────────────
// Disconnects the Discord account from the user profile.
// Does NOT remove the user from the Discord server.

discordRouter.post('/disconnect', requireAuth, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        discordId: null,
        discordUsername: null,
      },
    });

    logger.info({ userId: req.user!.userId }, 'Discord account disconnected');
    res.json({ message: 'Discord-Verbindung getrennt' });
  } catch (error) {
    logger.error(error, 'Discord disconnect error');
    res.status(500).json({ error: 'Fehler beim Trennen der Discord-Verbindung' });
  }
});
