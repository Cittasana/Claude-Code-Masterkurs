// ── Discord Bot ──────────────────────────────────────────────
// Automated community management bot for the Claude Code
// Masterkurs Discord server.
//
// Features:
// - Welcome messages (Embed) on guildMemberAdd
// - Auto-role assignment (Free Student)
// - Code-snippet auto-reactions
// - FAQ auto-responses
// - Slash commands: /progress, /help
// ─────────────────────────────────────────────────────────────

import {
  Client,
  ChannelType,
  GatewayIntentBits,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type GuildMember,
  type Message,
} from 'discord.js';
import { prisma, logger } from '../index.js';

// ── Configuration ───────────────────────────────────────────

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || '';
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const APP_URL = process.env.FRONTEND_URL || 'https://claude-code-masterkurs.de';

// ── FAQ Database ────────────────────────────────────────────

const FAQ_RESPONSES: Record<string, string> = {
  'wie installiere ich claude code': [
    '**Installation von Claude Code:**',
    '1. Download von https://claude.ai/download',
    '2. Terminal oeffnen: `claude-code --version`',
    `3. Tutorial: ${APP_URL}/lesson/1`,
    '',
    'Probleme? Frag hier im Support-Channel!',
  ].join('\n'),

  'wo finde ich lektion': [
    '**Lektionen findest du hier:**',
    `${APP_URL}/dashboard`,
    '',
    'Oder direkt: /lesson/[nummer]',
  ].join('\n'),

  'wie kann ich mein abo kuendigen': [
    '**Abo kuendigen:**',
    `1. Gehe zu ${APP_URL}/profile`,
    '2. Unter "Abonnement" findest du die Option zum Kuendigen',
    '',
    'Bei Fragen schreib an office@cittasana.de',
  ].join('\n'),
};

// ── Slash Commands Definition ───────────────────────────────

const commands = [
  new SlashCommandBuilder()
    .setName('progress')
    .setDescription('Zeigt deinen Lernfortschritt im Claude Code Masterkurs'),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt Hilfe & Support-Informationen'),
  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Erstellt ein Support-Ticket')
    .addStringOption((option) =>
      option
        .setName('betreff')
        .setDescription('Kurze Beschreibung deines Problems')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('prioritaet')
        .setDescription('Prioritaet des Tickets')
        .setRequired(false)
        .addChoices(
          { name: 'Niedrig', value: 'low' },
          { name: 'Normal', value: 'normal' },
          { name: 'Hoch', value: 'high' },
          { name: 'Dringend', value: 'urgent' },
        )
    ),
];

// ── Bot Client ──────────────────────────────────────────────

let client: Client | null = null;

/**
 * Starts the Discord bot. Called from the Express server startup.
 * Returns silently if not configured.
 */
export async function startDiscordBot(): Promise<void> {
  if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
    logger.warn('Discord Bot nicht konfiguriert – Bot wird nicht gestartet. Bitte DISCORD_BOT_TOKEN und DISCORD_GUILD_ID setzen.');
    return;
  }

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
    ],
  });

  // ── Ready Event ─────────────────────────────────────────
  client.once('ready', async (readyClient) => {
    logger.info(
      { botUser: readyClient.user.tag, guilds: readyClient.guilds.cache.size },
      'Discord Bot is online'
    );

    // Register slash commands
    await registerSlashCommands();
  });

  // ── Member Join Event ───────────────────────────────────
  client.on('guildMemberAdd', handleMemberJoin);

  // ── Message Event ───────────────────────────────────────
  client.on('messageCreate', handleMessage);

  // ── Slash Command Event ─────────────────────────────────
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    await handleSlashCommand(interaction);
  });

  // ── Error Handling ──────────────────────────────────────
  client.on('error', (error) => {
    logger.error(error, 'Discord Bot error');
  });

  // ── Login ───────────────────────────────────────────────
  try {
    await client.login(DISCORD_BOT_TOKEN);
  } catch (error) {
    logger.error(error, 'Discord Bot login failed');
  }
}

/**
 * Gracefully shuts down the Discord bot.
 */
export async function stopDiscordBot(): Promise<void> {
  if (client) {
    client.destroy();
    client = null;
    logger.info('Discord Bot stopped');
  }
}

// ── Event Handlers ──────────────────────────────────────────

/**
 * Handles new member joins with a welcome embed and auto-role.
 */
async function handleMemberJoin(member: GuildMember): Promise<void> {
  try {
    logger.info({ userId: member.id, tag: member.user.tag }, 'New member joined Discord');

    // Send welcome embed
    const welcomeChannel = member.guild.channels.cache.find(
      (ch) => ch.name.includes('willkommen') && ch.isTextBased()
    );

    if (welcomeChannel && welcomeChannel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle(`Willkommen ${member.user.username}!`)
        .setDescription(
          [
            'Schoen, dass du Teil der **Claude Code Masterkurs** Community bist!',
            '',
            '**Deine naechsten Schritte:**',
            '1. Lies die Regeln durch',
            '2. Stelle dich im Allgemein-Channel vor',
            '3. Frage im Hilfe-Channel, wenn du Probleme hast',
            '',
            'Viel Erfolg beim Lernen!',
          ].join('\n')
        )
        .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
        .setFooter({ text: 'Claude Code Masterkurs – Happy Coding!' })
        .setTimestamp();

      await welcomeChannel.send({ embeds: [embed] });
    }

    // Auto-assign Free Student role
    const freeRole = member.guild.roles.cache.find(
      (role) => role.name.includes('Free Student')
    );

    if (freeRole) {
      await member.roles.add(freeRole);
      logger.info({ userId: member.id, role: freeRole.name }, 'Auto-assigned Free Student role');
    }
  } catch (error) {
    logger.error({ error, memberId: member.id }, 'Error handling member join');
  }
}

/**
 * Handles messages for code-snippet reactions and FAQ responses.
 */
async function handleMessage(message: Message): Promise<void> {
  // Ignore bot messages
  if (message.author.bot) return;

  try {
    // Auto-react on code blocks
    if (message.content.includes('```')) {
      await message.react('\uD83D\uDC4D'); // thumbs up
      await message.react('\u2764\uFE0F'); // heart
      await message.react('\uD83D\uDE80'); // rocket

      // Highlight detailed code in code-review channels
      if (
        message.content.length > 200 &&
        message.channel.isTextBased() &&
        'name' in message.channel &&
        typeof message.channel.name === 'string' &&
        message.channel.name.includes('code-review')
      ) {
        await message.react('\u2B50'); // star
      }
    }

    // FAQ auto-responses
    const lowerMessage = message.content.toLowerCase();

    for (const [trigger, response] of Object.entries(FAQ_RESPONSES)) {
      if (lowerMessage.includes(trigger)) {
        await message.reply(response);
        break;
      }
    }
  } catch (error) {
    logger.error({ error, messageId: message.id }, 'Error handling message');
  }
}

/**
 * Handles slash command interactions.
 */
async function handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  try {
    switch (interaction.commandName) {
      case 'progress':
        await handleProgressCommand(interaction);
        break;
      case 'help':
        await handleHelpCommand(interaction);
        break;
      case 'ticket':
        await handleTicketCommand(interaction);
        break;
      default:
        await interaction.reply({
          content: 'Unbekannter Command.',
          ephemeral: true,
        });
    }
  } catch (error) {
    logger.error({ error, command: interaction.commandName }, 'Slash command error');
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'Ein Fehler ist aufgetreten. Bitte versuche es spaeter erneut.',
        ephemeral: true,
      });
    }
  }
}

// ── Slash Command Implementations ───────────────────────────

async function handleProgressCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const discordUserId = interaction.user.id;

  // Find user by Discord ID
  const user = await prisma.user.findUnique({
    where: { discordId: discordUserId },
    include: {
      progress: true,
      subscription: true,
    },
  });

  if (!user) {
    await interaction.reply({
      content: [
        'Dein Account ist nicht verknuepft.',
        `Bitte verbinde Discord auf der Website: ${APP_URL}/dashboard`,
      ].join('\n'),
      ephemeral: true,
    });
    return;
  }

  const progress = user.progress;
  const completedCount = progress?.lessonsCompleted?.length || 0;
  const totalLessons = 47;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  const tier = user.subscription?.isLifetime
    ? 'Lifetime'
    : user.subscription?.status === 'active'
      ? 'Pro'
      : 'Free';

  // Build progress bar
  const filledBlocks = Math.round(percentage / 10);
  const emptyBlocks = 10 - filledBlocks;
  const progressBar = '\u2588'.repeat(filledBlocks) + '\u2591'.repeat(emptyBlocks);

  const embed = new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle('Dein Fortschritt')
    .addFields(
      {
        name: 'Lektionen',
        value: `${completedCount}/${totalLessons}`,
        inline: true,
      },
      {
        name: 'Fortschritt',
        value: `${percentage}%`,
        inline: true,
      },
      {
        name: 'Tier',
        value: tier,
        inline: true,
      },
      {
        name: 'Fortschrittsbalken',
        value: `\`${progressBar}\` ${percentage}%`,
        inline: false,
      },
      {
        name: 'Streak',
        value: `${progress?.streak || 0} Tage`,
        inline: true,
      },
      {
        name: 'Lernzeit',
        value: `${Math.floor((progress?.timeInvested || 0) / 60)}h ${(progress?.timeInvested || 0) % 60}m`,
        inline: true,
      }
    )
    .setFooter({ text: 'Weiter so! Jeder Schritt zaehlt.' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleHelpCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const embed = new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle('Hilfe & Support')
    .setDescription(
      [
        '**Haeufige Fragen:**',
        `- Installation: ${APP_URL}/lesson/1`,
        `- Alle Lektionen: ${APP_URL}/dashboard`,
        '- Fehler? Frag im Hilfe-Channel!',
        '',
        '**Support:**',
        '- Email: office@cittasana.de',
        '- Office Hours: Jeden Freitag 15:00 Uhr',
        '',
        '**Ressourcen:**',
        `- Kurs: ${APP_URL}`,
        `- Docs: ${APP_URL}/docs`,
        '- Discord: Dieser Server!',
        '',
        '**Bot-Commands:**',
        '- `/progress` – Zeigt deinen Lernfortschritt',
        '- `/ticket <betreff>` – Erstellt ein Support-Ticket',
        '- `/help` – Zeigt diese Hilfe',
      ].join('\n')
    )
    .setFooter({ text: 'Claude Code Masterkurs' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleTicketCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const discordUserId = interaction.user.id;
  const subject = interaction.options.getString('betreff', true);
  const priority = interaction.options.getString('prioritaet') || 'normal';

  // Find user by Discord ID
  const user = await prisma.user.findUnique({
    where: { discordId: discordUserId },
    select: { id: true, displayName: true },
  });

  if (!user) {
    await interaction.reply({
      content: [
        'Dein Account ist nicht verknuepft.',
        `Bitte verbinde Discord auf der Website: ${APP_URL}/dashboard`,
      ].join('\n'),
      ephemeral: true,
    });
    return;
  }

  // Create ticket in database
  const ticket = await prisma.supportTicket.create({
    data: {
      userId: user.id,
      subject,
      priority,
    },
  });

  // Try to create a thread in the support-tickets channel
  let threadUrl = '';
  const guild = interaction.guild;
  if (guild) {
    const supportChannel = guild.channels.cache.find(
      (ch) => ch.name.includes('support-tickets') && ch.type === ChannelType.GuildText
    );

    if (supportChannel && supportChannel.type === ChannelType.GuildText) {
      try {
        const thread = await supportChannel.threads.create({
          name: `[${priority.toUpperCase()}] ${subject}`,
          reason: `Support-Ticket von ${user.displayName}`,
        });

        // Update ticket with thread ID
        await prisma.supportTicket.update({
          where: { id: ticket.id },
          data: { discordThreadId: thread.id },
        });

        // Send initial message in thread
        const embed = new EmbedBuilder()
          .setColor(priority === 'urgent' ? 0xe74c3c : priority === 'high' ? 0xe67e22 : 0x3498db)
          .setTitle(`Support-Ticket: ${subject}`)
          .addFields(
            { name: 'Erstellt von', value: user.displayName, inline: true },
            { name: 'Prioritaet', value: priority, inline: true },
            { name: 'Status', value: 'Offen', inline: true },
            { name: 'Ticket-ID', value: ticket.id, inline: false },
          )
          .setFooter({ text: 'Antworten in diesem Thread fuer Support-Kommunikation' })
          .setTimestamp();

        await thread.send({ embeds: [embed] });
        threadUrl = `\nThread: <#${thread.id}>`;
      } catch (error) {
        logger.error({ error, ticketId: ticket.id }, 'Failed to create support thread');
      }
    }
  }

  const embed = new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle('Ticket erstellt!')
    .setDescription(`Dein Support-Ticket wurde erfolgreich erstellt.${threadUrl}`)
    .addFields(
      { name: 'Betreff', value: subject, inline: false },
      { name: 'Prioritaet', value: priority, inline: true },
      { name: 'Ticket-ID', value: ticket.id, inline: true },
    )
    .setFooter({ text: 'Wir melden uns so schnell wie moeglich!' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// ── Slash Command Registration ──────────────────────────────

async function registerSlashCommands(): Promise<void> {
  if (!DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
    logger.warn('Cannot register slash commands: Missing DISCORD_CLIENT_ID or DISCORD_GUILD_ID');
    return;
  }

  try {
    const rest = new REST().setToken(DISCORD_BOT_TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      {
        body: commands.map((cmd) => cmd.toJSON()),
      }
    );

    logger.info(
      { commandCount: commands.length },
      'Discord slash commands registered'
    );
  } catch (error) {
    logger.error(error, 'Failed to register Discord slash commands');
  }
}

// ── Exported Bot Client Accessor ────────────────────────────

/**
 * Returns the Discord bot client (or null if not started).
 * Used by other parts of the server to interact with Discord.
 */
export function getDiscordClient(): Client | null {
  return client;
}
