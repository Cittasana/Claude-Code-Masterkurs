// ── Discord API Integration ──────────────────────────────────
// Helper functions for Discord OAuth, role management, and
// server member operations.
// ─────────────────────────────────────────────────────────────

import { logger } from '../index.js';

// ── Configuration ───────────────────────────────────────────

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || '';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

// ── Types ───────────────────────────────────────────────────

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  email?: string;
}

// ── Role Mapping ────────────────────────────────────────────

/**
 * Returns the Discord role ID for a given subscription tier.
 * Falls back to the free role if tier is unknown.
 */
export function getRoleIdForTier(tier: string): string {
  const roleMap: Record<string, string | undefined> = {
    free: process.env.DISCORD_ROLE_FREE,
    starter: process.env.DISCORD_ROLE_STARTER,
    pro: process.env.DISCORD_ROLE_PRO,
    lifetime: process.env.DISCORD_ROLE_LIFETIME,
  };

  return roleMap[tier.toLowerCase()] || roleMap.free || '';
}

/**
 * Determines the subscription tier from subscription data.
 */
export function getTierFromSubscription(subscription: {
  isLifetime: boolean;
  status: string;
  stripePriceId?: string | null;
} | null): string {
  if (!subscription) return 'free';
  if (subscription.isLifetime) return 'lifetime';
  if (subscription.status !== 'active' && subscription.status !== 'trialing') return 'free';

  // Map price IDs to tiers (Pro = yearly or monthly with active sub)
  const priceId = subscription.stripePriceId;
  if (!priceId) return 'starter';

  // Price IDs are configured in env - check against them
  if (priceId === process.env.STRIPE_PRICE_ID_LIFETIME) return 'lifetime';

  // Default paid tier is "pro" for any active subscription
  return 'pro';
}

// ── OAuth Token Exchange ────────────────────────────────────

/**
 * Exchanges an OAuth2 authorization code for access tokens.
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<DiscordTokenResponse> {
  const response = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      scope: 'identify email guilds.join',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error({ status: response.status, body: errorBody }, 'Discord token exchange failed');
    throw new Error(`Discord token exchange failed: ${response.status}`);
  }

  return response.json() as Promise<DiscordTokenResponse>;
}

// ── Get Discord User Info ───────────────────────────────────

/**
 * Fetches the authenticated Discord user's profile.
 */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error({ status: response.status, body: errorBody }, 'Failed to fetch Discord user');
    throw new Error(`Failed to fetch Discord user: ${response.status}`);
  }

  return response.json() as Promise<DiscordUser>;
}

// ── Add User to Guild ───────────────────────────────────────

/**
 * Adds a user to the Discord server with the appropriate role.
 * If the user is already a member, updates their roles instead.
 */
export async function addUserToDiscordServer(
  discordUserId: string,
  accessToken: string,
  tier: string
): Promise<void> {
  const roleId = getRoleIdForTier(tier);
  const roles = roleId ? [roleId] : [];

  const response = await fetch(
    `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        roles,
      }),
    }
  );

  // 201 = added, 204 = already a member
  if (response.status === 201) {
    logger.info({ discordUserId, tier }, 'User added to Discord server');
  } else if (response.status === 204) {
    // User already in server - update roles
    logger.info({ discordUserId, tier }, 'User already in Discord server, updating roles');
    await updateDiscordRole(discordUserId, tier);
  } else {
    const errorBody = await response.text();
    logger.error(
      { status: response.status, body: errorBody, discordUserId },
      'Failed to add user to Discord server'
    );
    throw new Error(`Failed to add user to Discord server: ${response.status}`);
  }
}

// ── Update User Role ────────────────────────────────────────

/**
 * Updates a Discord member's role based on their subscription tier.
 * Removes all tier-related roles first, then adds the new one.
 */
export async function updateDiscordRole(
  discordUserId: string,
  newTier: string
): Promise<void> {
  if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
    logger.warn('Discord not configured - skipping role update');
    return;
  }

  // All tier role IDs to remove first
  const allTierRoles = [
    process.env.DISCORD_ROLE_FREE,
    process.env.DISCORD_ROLE_STARTER,
    process.env.DISCORD_ROLE_PRO,
    process.env.DISCORD_ROLE_LIFETIME,
  ].filter(Boolean) as string[];

  // Remove old roles
  for (const roleId of allTierRoles) {
    try {
      await fetch(
        `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
        }
      );
    } catch {
      // Ignore errors when removing roles (role might not be assigned)
    }
  }

  // Add new role
  const newRoleId = getRoleIdForTier(newTier);
  if (newRoleId) {
    const response = await fetch(
      `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}/roles/${newRoleId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (!response.ok && response.status !== 204) {
      const errorBody = await response.text();
      logger.error(
        { status: response.status, body: errorBody, discordUserId, newTier },
        'Failed to assign Discord role'
      );
    } else {
      logger.info({ discordUserId, newTier, roleId: newRoleId }, 'Discord role updated');
    }
  }
}

// ── Build OAuth URL ─────────────────────────────────────────

/**
 * Builds the Discord OAuth2 authorization URL.
 */
export function buildOAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify email guilds.join',
    state,
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

// ── Configuration Check ─────────────────────────────────────

/**
 * Checks if Discord integration is properly configured.
 */
export function isDiscordConfigured(): boolean {
  return !!(DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET && DISCORD_BOT_TOKEN && DISCORD_GUILD_ID);
}
