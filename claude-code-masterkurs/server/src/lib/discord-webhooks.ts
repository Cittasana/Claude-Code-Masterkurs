// ── Discord Webhook Notifications ────────────────────────────
// Sends rich embed notifications to Discord channels via webhooks.
// ─────────────────────────────────────────────────────────────

import { logger } from '../index.js';

// ── Configuration ───────────────────────────────────────────

const WEBHOOK_NOTIFICATIONS = process.env.DISCORD_WEBHOOK_NOTIFICATIONS || '';
const WEBHOOK_SUPPORT = process.env.DISCORD_WEBHOOK_SUPPORT || '';

// ── Types ───────────────────────────────────────────────────

interface DiscordEmbed {
  title: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string };
  timestamp?: string;
}

// ── Generic Webhook Sender ──────────────────────────────────

async function sendWebhook(
  webhookUrl: string,
  embed: DiscordEmbed,
): Promise<void> {
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{ ...embed, timestamp: embed.timestamp || new Date().toISOString() }],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error({ status: response.status, body }, 'Discord webhook failed');
    }
  } catch (error) {
    logger.error({ error }, 'Discord webhook request error');
  }
}

// ── Event-Specific Notifications ────────────────────────────

export async function notifyNewSignup(user: {
  email: string;
  displayName: string;
}): Promise<void> {
  await sendWebhook(WEBHOOK_NOTIFICATIONS, {
    title: 'Neuer Free-Signup',
    description: `**${user.displayName}** hat sich registriert!`,
    color: 0x2ecc71, // green
    fields: [
      { name: 'E-Mail', value: user.email, inline: true },
    ],
    footer: { text: 'Claude Code Masterkurs' },
  });
}

export async function notifyNewSubscription(
  user: { email: string; displayName: string },
  tier: string,
): Promise<void> {
  const tierColors: Record<string, number> = {
    starter: 0x3498db,
    pro: 0x9b59b6,
    lifetime: 0xf1c40f,
  };

  await sendWebhook(WEBHOOK_NOTIFICATIONS, {
    title: 'Neues Abonnement!',
    description: `**${user.displayName}** hat ein **${tier.toUpperCase()}** Abo abgeschlossen!`,
    color: tierColors[tier.toLowerCase()] || 0x3498db,
    fields: [
      { name: 'E-Mail', value: user.email, inline: true },
      { name: 'Tier', value: tier, inline: true },
    ],
    footer: { text: 'Claude Code Masterkurs' },
  });
}

export async function notifySubscriptionCanceled(user: {
  email: string;
  displayName: string;
}): Promise<void> {
  await sendWebhook(WEBHOOK_NOTIFICATIONS, {
    title: 'Abo gekuendigt',
    description: `**${user.displayName}** hat das Abo gekuendigt.`,
    color: 0xe74c3c, // red
    fields: [
      { name: 'E-Mail', value: user.email, inline: true },
    ],
    footer: { text: 'Claude Code Masterkurs' },
  });
}

export async function notifyNewForumPost(thread: {
  title: string;
  categoryId: string;
  author: string;
}): Promise<void> {
  const APP_URL = process.env.FRONTEND_URL || 'https://claude-code-masterkurs.de';

  await sendWebhook(WEBHOOK_NOTIFICATIONS, {
    title: 'Neuer Forum-Post',
    description: `**${thread.author}** hat einen neuen Thread erstellt`,
    color: 0x3498db, // blue
    fields: [
      { name: 'Titel', value: thread.title, inline: false },
      { name: 'Kategorie', value: thread.categoryId, inline: true },
      { name: 'Link', value: `${APP_URL}/forum`, inline: true },
    ],
    footer: { text: 'Claude Code Masterkurs Forum' },
  });
}

export async function notifyNewSupportTicket(ticket: {
  subject: string;
  userName: string;
  priority: string;
}): Promise<void> {
  const priorityColors: Record<string, number> = {
    low: 0x95a5a6,
    normal: 0x3498db,
    high: 0xe67e22,
    urgent: 0xe74c3c,
  };

  await sendWebhook(WEBHOOK_SUPPORT, {
    title: 'Neues Support-Ticket',
    description: `**${ticket.userName}** hat ein Ticket erstellt`,
    color: priorityColors[ticket.priority] || 0x3498db,
    fields: [
      { name: 'Betreff', value: ticket.subject, inline: false },
      { name: 'Prioritaet', value: ticket.priority, inline: true },
    ],
    footer: { text: 'Support-System' },
  });
}
