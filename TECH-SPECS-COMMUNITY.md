# 🛠️ Technische Spezifikationen: Community-Features

**Zweck**: Detaillierte technische Dokumentation für Discord-Integration & Community-Features
**Für**: Developer, Claude Code/Teams für Implementierung

---

## 🎯 Feature-Übersicht

### Ziel:
Integriere Discord als Community-Plattform für Claude Code Masterkurs Students

### Kern-Features:
1. Discord-Server mit strukturierten Channels
2. Auto-Invite-System für zahlende Kunden
3. Widget auf Website (Dashboard + Landing-Pages)
4. Discord-Bot für Automation
5. Rollen-System für Tier-basierte Permissions

---

## 📋 Discord-Server-Setup

### Server-Struktur

```
🏴‍☠️ CLAUDE CODE MASTERKURS
│
├── 📢 WILLKOMMEN
│   ├── #👋-willkommen
│   ├── #📜-regeln
│   └── #🎯-start-hier
│
├── 💬 COMMUNITY
│   ├── #💭-allgemein
│   ├── #🆘-hilfe-support
│   ├── #💡-projekt-showcase
│   └── #🎉-erfolge (Achievement-Posts)
│
├── 📚 LEKTIONEN-DISKUSSION
│   ├── #🟢-anfänger (Lektionen 1-9)
│   ├── #🟡-fortgeschritten (Lektionen 10-18)
│   └── #🔴-experte (Lektionen 19-27)
│
├── 🛠️ PROJEKTE & CODE
│   ├── #🚀-projekt-ideen
│   ├── #👨‍💻-code-review
│   ├── #🏆-fertige-projekte
│   └── #🐛-debugging-hilfe
│
├── 🎤 LIVE & EVENTS
│   ├── #📅-event-ankündigungen
│   ├── #🔴-office-hours (Voice)
│   └── #📺-workshop-recordings
│
├── 🎓 RESSOURCEN
│   ├── #📖-tutorials-links
│   ├── #🔧-tools-empfehlungen
│   └── #📰-news-updates
│
└── 🔒 PREMIUM (nur für Paid)
    ├── #💎-premium-lounge
    ├── #📞-1on1-coaching (Scheduling)
    └── #🎁-exclusive-content
```

### Rollen-System

```javascript
const ROLES = {
  // Auto-assigned basierend auf Subscription Tier
  FREE: {
    name: '🆓 Free Student',
    color: '#95A5A6', // Grau
    permissions: [
      'VIEW_CHANNEL', // Willkommen, Community, Lektionen 1-5
      'SEND_MESSAGES',
      'READ_MESSAGE_HISTORY'
    ],
    channels: [
      'willkommen', 'regeln', 'start-hier',
      'allgemein', 'hilfe-support',
      'anfänger' // Nur #anfänger, nicht fortgeschritten/experte
    ]
  },

  STARTER: {
    name: '🌟 Starter Student',
    color: '#3498DB', // Blau
    permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
    channels: [
      ...FREE.channels,
      'fortgeschritten', // Zugang zu mehr Channels
      'projekt-ideen',
      'code-review'
    ]
  },

  PRO: {
    name: '🔥 Pro Student',
    color: '#E67E22', // Orange
    permissions: [
      'VIEW_CHANNEL',
      'SEND_MESSAGES',
      'ATTACH_FILES',
      'EMBED_LINKS',
      'USE_EXTERNAL_EMOJIS'
    ],
    channels: [
      ...STARTER.channels,
      'experte',
      'premium-lounge',
      '1on1-coaching',
      'exclusive-content'
    ]
  },

  LIFETIME: {
    name: '💎 Lifetime Member',
    color: '#9B59B6', // Lila
    permissions: [...PRO.permissions, 'MENTION_EVERYONE'],
    channels: [...PRO.channels],
    badge: '👑' // Special Badge
  },

  MODERATOR: {
    name: '🛡️ Moderator',
    color: '#2ECC71', // Grün
    permissions: [
      ...PRO.permissions,
      'MANAGE_MESSAGES',
      'KICK_MEMBERS',
      'BAN_MEMBERS',
      'MUTE_MEMBERS'
    ]
  },

  FOUNDER: {
    name: '🎓 Cosmo (Founder)',
    color: '#E74C3C', // Rot
    permissions: ['ADMINISTRATOR']
  }
};
```

---

## 🔐 Discord OAuth Integration

### 1. Discord Application Setup

```bash
# Schritte in Discord Developer Portal:

1. Gehe zu: https://discord.com/developers/applications
2. "New Application" → Name: "Claude Code Masterkurs"
3. OAuth2 → Add Redirect URLs:
   - https://claude-code-masterkurs.de/auth/discord/callback
   - http://localhost:3000/auth/discord/callback (für Dev)

4. Bot Tab:
   - "Add Bot"
   - Username: "Claude Code Assistant"
   - Icon: Upload Logo
   - Permissions: Administrator (für Start)
   - Token: Kopieren & als Env-Variable speichern

5. OAuth2 → URL Generator:
   - Scopes: bot, identify, email, guilds.join
   - Bot Permissions: Administrator
   - Generated URL kopieren
```

### 2. Backend: Env-Variablen

```bash
# .env
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here # Rechtsklick auf Server → "Copy ID"

# Rollen-IDs (nach Erstellung im Discord)
DISCORD_ROLE_FREE=role_id_here
DISCORD_ROLE_STARTER=role_id_here
DISCORD_ROLE_PRO=role_id_here
DISCORD_ROLE_LIFETIME=role_id_here
```

### 3. OAuth Flow (Node.js/Express)

```javascript
// routes/discord-auth.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Schritt 1: Redirect zu Discord OAuth
router.get('/auth/discord', (req, res) => {
  const redirectUri = encodeURIComponent(
    `${process.env.APP_URL}/auth/discord/callback`
  );

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email%20guilds.join`;

  res.redirect(discordAuthUrl);
});

// Schritt 2: Callback nach erfolgreicher Auth
router.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.APP_URL}/auth/discord/callback`,
        scope: 'identify email guilds.join'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info from Discord
    const userResponse = await axios.get(
      'https://discord.com/api/users/@me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const discordUser = userResponse.data;

    // Get user from database
    const user = await getUserByEmail(discordUser.email);

    if (!user) {
      return res.status(404).send('User not found. Please sign up first.');
    }

    // Add user to Discord server
    await addUserToDiscordServer(
      discordUser.id,
      access_token,
      user.subscriptionTier
    );

    // Save Discord ID to user profile
    await updateUser(user.id, {
      discordId: discordUser.id,
      discordUsername: `${discordUser.username}#${discordUser.discriminator}`
    });

    res.redirect('/dashboard?discord=connected');
  } catch (error) {
    console.error('Discord OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

// Helper: Add user to server with correct role
async function addUserToDiscordServer(discordUserId, accessToken, tier) {
  const roleId = getRoleIdForTier(tier);

  await axios.put(
    `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUserId}`,
    {
      access_token: accessToken,
      roles: [roleId]
    },
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

function getRoleIdForTier(tier) {
  const roleMap = {
    free: process.env.DISCORD_ROLE_FREE,
    starter: process.env.DISCORD_ROLE_STARTER,
    pro: process.env.DISCORD_ROLE_PRO,
    lifetime: process.env.DISCORD_ROLE_LIFETIME
  };
  return roleMap[tier] || roleMap.free;
}

module.exports = router;
```

---

## 🤖 Discord Bot (Automation)

### Bot-Features:
1. Willkommens-Nachrichten
2. Auto-Role-Assignment basierend auf Tier
3. Code-Snippet-Reactions
4. FAQ-Auto-Responses
5. Daily Digest (Zusammenfassung neuer Posts)

### Bot-Code (discord.js)

```javascript
// bot/index.js
const Discord = require('discord.js');
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.MessageContent
  ]
});

// === EVENT: Member Join ===
client.on('guildMemberAdd', async (member) => {
  console.log(`New member joined: ${member.user.tag}`);

  // Willkommens-Nachricht im #willkommen Channel
  const welcomeChannel = member.guild.channels.cache.find(
    (ch) => ch.name === '👋-willkommen'
  );

  if (welcomeChannel) {
    const embed = new Discord.EmbedBuilder()
      .setColor('#3498DB')
      .setTitle(`🎉 Willkommen ${member.user.username}!`)
      .setDescription(`
        Schön, dass du Teil der Claude Code Masterkurs Community bist!

        **Deine nächsten Schritte:**
        1️⃣ Lies die <#CHANNEL_ID_REGELN> durch
        2️⃣ Stelle dich in <#CHANNEL_ID_ALLGEMEIN> vor
        3️⃣ Frage in <#CHANNEL_ID_HILFE>, wenn du Probleme hast

        Viel Erfolg beim Lernen! 🚀
      `)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: 'Happy Coding!' })
      .setTimestamp();

    welcomeChannel.send({ embeds: [embed] });
  }

  // Auto-Role: "Student" für alle neuen Members
  const studentRole = member.guild.roles.cache.find(
    (role) => role.name === '🆓 Free Student'
  );

  if (studentRole) {
    await member.roles.add(studentRole);
  }
});

// === EVENT: Message mit Code-Snippet ===
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Auto-React auf Code-Blocks
  if (message.content.includes('```')) {
    await message.react('👍');
    await message.react('❤️');
    await message.react('🚀');
  }

  // FAQ Auto-Responses
  const faq = {
    'wie installiere ich claude code': `
      **Installation von Claude Code:**
      1. Download von https://claude.ai/download
      2. Terminal öffnen: \`claude-code --version\`
      3. Tutorial: https://claude-code-masterkurs.de/lessons/1

      Probleme? Frag in <#CHANNEL_ID_HILFE>!
    `,
    'wo finde ich lektion': `
      📚 **Lektionen findest du hier:**
      https://claude-code-masterkurs.de/dashboard

      Oder direkt: /lessons/[nummer]
    `
  };

  const lowerMessage = message.content.toLowerCase();

  for (const [trigger, response] of Object.entries(faq)) {
    if (lowerMessage.includes(trigger)) {
      await message.reply(response);
      break;
    }
  }

  // Highlight besonders hilfreiche Messages
  if (
    message.content.length > 200 &&
    message.content.includes('```') &&
    message.channel.name.includes('code-review')
  ) {
    await message.react('⭐'); // Mod kann dann "Best Answer" markieren
  }
});

// === EVENT: Role Update (wenn Tier sich ändert) ===
// Triggered via Webhook von Backend
async function updateUserRole(discordUserId, newTier) {
  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
  const member = await guild.members.fetch(discordUserId);

  // Remove alte Roles
  const rolesToRemove = [
    process.env.DISCORD_ROLE_FREE,
    process.env.DISCORD_ROLE_STARTER,
    process.env.DISCORD_ROLE_PRO
  ].filter(Boolean);

  await member.roles.remove(rolesToRemove);

  // Add neue Role
  const newRoleId = getRoleIdForTier(newTier);
  await member.roles.add(newRoleId);

  // Notification in #premium-lounge wenn Upgrade zu Pro/Lifetime
  if (newTier === 'pro' || newTier === 'lifetime') {
    const premiumChannel = guild.channels.cache.find(
      (ch) => ch.name === '💎-premium-lounge'
    );

    if (premiumChannel) {
      premiumChannel.send(`
        🎉 Willkommen ${member} im Premium-Bereich!
        Genieße exklusive Inhalte und direkten Support! 💎
      `);
    }
  }
}

// === SLASH COMMANDS (optional) ===
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'progress') {
    // User kann eigenen Fortschritt abfragen
    const userId = interaction.user.id;
    const user = await getUserByDiscordId(userId);

    if (!user) {
      return interaction.reply({
        content: 'Account nicht verknüpft. Bitte verbinde Discord auf der Website.',
        ephemeral: true
      });
    }

    const progress = await getUserProgress(user.id);

    const embed = new Discord.EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle(`📊 Dein Fortschritt`)
      .addFields(
        { name: 'Lektionen', value: `${progress.completed}/${progress.total}`, inline: true },
        { name: 'Completion', value: `${progress.percentage}%`, inline: true },
        { name: 'Tier', value: user.subscriptionTier, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (interaction.commandName === 'help') {
    // Quick-Help Command
    const embed = new Discord.EmbedBuilder()
      .setColor('#3498DB')
      .setTitle('🆘 Hilfe & Support')
      .setDescription(`
        **Häufige Fragen:**
        • Installation: [Link]
        • Tutorial: [Link]
        • Fehler? → <#CHANNEL_ID_HILFE>

        **Support:**
        • Email: office@cittasana.de
        • Office Hours: Jeden Freitag 15:00 Uhr

        **Ressourcen:**
        • Docs: https://claude-code-masterkurs.de/docs
        • Discord: Dieser Server
        • YouTube: [Link]
      `);

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

// Bot Login
client.login(process.env.DISCORD_BOT_TOKEN);

console.log('Discord Bot is running...');
```

---

## 🌐 Website-Integration

### 1. Discord-Widget (Dashboard)

```html
<!-- In Dashboard-Template einfügen -->
<div class="discord-section">
  <h2>💬 Join unsere Community</h2>
  <p>Tausche dich mit anderen Studenten aus und erhalte Hilfe!</p>

  <!-- Discord Widget -->
  <iframe
    src="https://discord.com/widget?id=YOUR_SERVER_ID&theme=dark"
    width="350"
    height="500"
    allowtransparency="true"
    frameborder="0"
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
  </iframe>

  <!-- Connect-Button (für nicht-verknüpfte User) -->
  <a href="/auth/discord" class="btn btn-discord">
    <svg><!-- Discord Icon --></svg>
    Mit Discord verbinden
  </a>

  <!-- Status (für verknüpfte User) -->
  <div class="discord-status" v-if="user.discordId">
    ✅ Verbunden als: {{ user.discordUsername }}
    <a href="/settings/disconnect-discord">Trennen</a>
  </div>
</div>

<style>
.btn-discord {
  background: #5865F2;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-discord:hover {
  background: #4752C4;
}

.discord-section {
  background: #2C2F33;
  padding: 24px;
  border-radius: 12px;
  margin: 24px 0;
}
</style>
```

### 2. Onboarding-Flow (nach Stripe Checkout)

```javascript
// Webhook: Nach erfolgreicher Zahlung
app.post('/webhook/stripe', async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // User aus DB holen
    const user = await getUserByStripeCustomerId(customerId);

    // Subscription-Tier ermitteln
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const tier = getSubscriptionTier(subscription.items.data[0].price.id);

    // User updaten
    await updateUser(user.id, {
      subscriptionTier: tier,
      subscriptionId: subscriptionId,
      subscriptionStatus: 'active'
    });

    // Discord-Invite-Email senden
    await sendDiscordInviteEmail(user.email, user.name, tier);

    res.json({ received: true });
  }
});

async function sendDiscordInviteEmail(email, name, tier) {
  const discordInviteLink = 'https://discord.gg/YOUR_INVITE_CODE';

  await sendEmail({
    to: email,
    subject: '🎉 Willkommen! Tritt unserer Discord-Community bei',
    html: `
      <h1>Willkommen ${name}!</h1>

      <p>Glückwunsch zum Kauf des <strong>${tier}</strong> Plans! 🚀</p>

      <p><strong>Tritt jetzt unserer exklusiven Discord-Community bei:</strong></p>

      <a href="${discordInviteLink}"
         style="background: #5865F2; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 16px 0;">
        Jetzt beitreten
      </a>

      <p>Nach dem Beitritt:</p>
      <ol>
        <li>Verbinde Discord mit deinem Account: <a href="https://claude-code-masterkurs.de/auth/discord">Hier klicken</a></li>
        <li>Du erhältst automatisch die <strong>${tier}</strong> Rolle</li>
        <li>Zugang zu allen Premium-Channels</li>
      </ol>

      <p>Wir sehen uns im Discord!</p>
      <p>Cosmo</p>
    `
  });
}
```

---

## 📊 Analytics & Tracking

### Discord-Metriken tracken:

```javascript
// Analytics-Events für Discord-Aktivität

// 1. Member-Join
analytics.track({
  userId: user.id,
  event: 'Discord Member Joined',
  properties: {
    tier: user.subscriptionTier,
    discordId: discordUser.id,
    timestamp: new Date()
  }
});

// 2. Message-Activity (täglich aggregiert)
cron.schedule('0 0 * * *', async () => {
  const stats = await getDiscordDailyStats();

  analytics.track({
    event: 'Discord Daily Stats',
    properties: {
      totalMessages: stats.messageCount,
      activeUsers: stats.uniqueUsers,
      topChannels: stats.topChannels,
      date: new Date().toISOString().split('T')[0]
    }
  });
});

// 3. Retention (Wöchentlich)
cron.schedule('0 0 * * 0', async () => {
  const retention = await calculateDiscordRetention();

  analytics.track({
    event: 'Discord Weekly Retention',
    properties: {
      weeklyActiveUsers: retention.wau,
      retention7Day: retention.day7,
      retention30Day: retention.day30
    }
  });
});
```

### Wichtige KPIs:
- **Member Growth**: Neue Members pro Woche
- **Active Users**: DAU (Daily) / WAU (Weekly)
- **Message Volume**: Messages pro Tag/Woche
- **Engagement Rate**: % aktiver User von Total Members
- **Top Contributors**: User mit meisten hilfreichen Messages
- **Response Time**: Ø Zeit bis erste Antwort in #hilfe

---

## 🧪 Testing-Checklist

### Pre-Launch Tests:

- [ ] **Discord OAuth Flow**:
  - [ ] User kann sich mit Discord verbinden
  - [ ] Access Token wird korrekt gespeichert
  - [ ] User wird zu Server hinzugefügt
  - [ ] Korrekte Role wird assigned

- [ ] **Role Permissions**:
  - [ ] Free: Kann nur public Channels sehen
  - [ ] Starter: Zugang zu mehr Channels
  - [ ] Pro/Lifetime: Zugang zu #premium-lounge

- [ ] **Bot Funktionen**:
  - [ ] Willkommens-Message bei Join
  - [ ] Auto-Reactions auf Code-Snippets
  - [ ] FAQ-Responses funktionieren
  - [ ] /progress Command zeigt richtigen Fortschritt
  - [ ] /help Command funktioniert

- [ ] **Website-Integration**:
  - [ ] Discord Widget wird korrekt angezeigt
  - [ ] Connect-Button funktioniert
  - [ ] Status wird nach Verbindung aktualisiert

- [ ] **Email-Automation**:
  - [ ] Invite-Email wird nach Checkout versandt
  - [ ] Email enthält korrekten Invite-Link
  - [ ] Email ist branded & professionell

- [ ] **Subscription-Changes**:
  - [ ] Upgrade: Role wird updated
  - [ ] Downgrade: Role wird entfernt
  - [ ] Churn: User verliert Zugang zu Premium

---

## 🚀 Launch-Plan

### Phase 1: Soft Launch (Woche 1)
- [ ] Discord Server aufsetzen
- [ ] 10 Beta-Tester einladen
- [ ] Feedback sammeln
- [ ] Bugs fixen

### Phase 2: Invitation-Only (Woche 2)
- [ ] Bestehende Students einladen
- [ ] Community-Regeln verfeinern
- [ ] Bot-Commands testen

### Phase 3: Public Launch (Woche 3)
- [ ] Announcement auf Website
- [ ] Social-Media-Campaign
- [ ] Email an alle User
- [ ] Widget auf Dashboard aktivieren

---

## 📝 Maintenance & Moderation

### Täglich:
- Spam-Monitoring
- User-Reports bearbeiten
- FAQ-Antworten geben

### Wöchentlich:
- Community-Highlight-Post
- Neue #projekt-showcase Features
- Bot-Performance-Check

### Monatlich:
- Analytics-Review
- Community-Survey
- Moderator-Meeting

---

**Status**: Ready for Implementation
**Letzte Aktualisierung**: 11. Februar 2026
