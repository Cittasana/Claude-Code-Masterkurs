import { Router } from 'express';
import crypto from 'crypto';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import {
  buildOAuthUrl,
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
const oauthStates = new Map<string, { userId: string; expiresAt: number }>();

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

// ── GET /api/discord/callback ───────────────────────────────
// Discord redirects here after user authorizes.
// Exchanges the code, fetches Discord user, links account,
// and adds user to the server.

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

    const userId = stateData.userId;
    oauthStates.delete(state);

    // Exchange code for access token
    const redirectUri = `${APP_URL}/api/discord/callback`;
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // Fetch Discord user info
    const discordUser = await getDiscordUser(tokenData.access_token);

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
      // Continue - linking the account is still valuable even if server join fails
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
