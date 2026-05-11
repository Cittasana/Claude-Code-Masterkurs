#!/usr/bin/env node
/**
 * Discord Auto-Posting Bot
 *
 * Automatically posts research updates and new content to Discord
 *
 * Features:
 * - Posts new research reports to #announcements
 * - Posts new lessons to #updates
 * - Posts weekly challenges to #weekly-challenge
 *
 * Usage:
 *   node scripts/discord-auto-post.js
 *   node scripts/discord-auto-post.js --dry-run
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

// Config
const DISCORD_WEBHOOK_ANNOUNCEMENTS = process.env.DISCORD_WEBHOOK_ANNOUNCEMENTS;
const DISCORD_WEBHOOK_UPDATES = process.env.DISCORD_WEBHOOK_UPDATES;
const DISCORD_WEBHOOK_CHALLENGES = process.env.DISCORD_WEBHOOK_CHALLENGES;
const COURSE_URL = process.env.COURSE_URL || 'https://claude-code-masterkurs.de';

// CLI Args
const isDryRun = process.argv.includes('--dry-run');

console.log('🤖 Discord Auto-Posting Bot');
console.log('===========================\n');

if (isDryRun) {
  console.log('🔍 DRY-RUN Mode (no messages will be sent)\n');
}

/**
 * Send Discord Webhook
 */
function sendWebhook(webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload))
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 204 || res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Discord API error: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

/**
 * Parse markdown frontmatter
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  });

  return frontmatter;
}

/**
 * Get last posted timestamp
 */
function getLastPostedTimestamp() {
  const logPath = path.join(__dirname, '../.discord-last-post.json');

  if (fs.existsSync(logPath)) {
    return JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  }

  return {};
}

/**
 * Update last posted timestamp
 */
function updateLastPostedTimestamp(type, timestamp) {
  const logPath = path.join(__dirname, '../.discord-last-post.json');
  const log = getLastPostedTimestamp();

  log[type] = timestamp;
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

/**
 * Post Research Updates
 */
async function postResearchUpdates() {
  console.log('🔬 Checking Research Reports...');

  const researchDir = path.join(__dirname, '../research');
  if (!fs.existsSync(researchDir)) {
    console.log('⚠️  No research/ directory found\n');
    return;
  }

  const reports = fs.readdirSync(researchDir)
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      name: file,
      path: path.join(researchDir, file),
      mtime: fs.statSync(path.join(researchDir, file)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime); // Newest first

  if (reports.length === 0) {
    console.log('   No reports found\n');
    return;
  }

  const lastPosted = getLastPostedTimestamp();
  const latestReport = reports[0];

  // Check if already posted
  if (lastPosted.research && lastPosted.research >= latestReport.mtime) {
    console.log(`   ✅ Latest report already posted (${latestReport.name})\n`);
    return;
  }

  // Read report
  const content = fs.readFileSync(latestReport.path, 'utf-8');

  // Extract key info (simple regex parsing)
  const titleMatch = content.match(/# Weekly Research Report - (.+)/);
  const majorUpdatesMatch = content.match(/## MAJOR UPDATES[\s\S]*?### 1\. (.+?)\n/);
  const relevanzMatch = content.match(/\*\*Relevanz für Masterkurs\*\*: (\d+)\/10/);

  const reportDate = titleMatch ? titleMatch[1] : 'Latest';
  const majorUpdate = majorUpdatesMatch ? majorUpdatesMatch[1] : 'Claude Code Updates';
  const relevanz = relevanzMatch ? parseInt(relevanzMatch[1]) : 5;

  // Only post if high relevance
  if (relevanz < 7) {
    console.log(`   ⚠️  Relevanz too low (${relevanz}/10), skipping post\n`);
    updateLastPostedTimestamp('research', latestReport.mtime);
    return;
  }

  console.log(`   📣 Posting: ${reportDate} (Relevanz: ${relevanz}/10)`);

  const payload = {
    content: '@everyone',
    embeds: [{
      title: '🚀 Claude Code Weekly Update',
      description: `**${majorUpdate}**\n\nWir haben neue Updates für den Masterkurs!\n\n📊 Relevanz: ${relevanz}/10\n📅 Report: ${reportDate}`,
      color: relevanz >= 8 ? 0x00ff00 : 0xffaa00, // Green for high, Orange for medium
      fields: [
        {
          name: '📚 Was gibt\'s neues?',
          value: 'Check den vollen Report für Details!'
        },
        {
          name: '🔗 Links',
          value: `[Zum Kurs](${COURSE_URL})`
        }
      ],
      footer: {
        text: 'Automatisch generiert vom Masterkurs Agent 🤖'
      },
      timestamp: new Date().toISOString()
    }]
  };

  if (isDryRun) {
    console.log('   [DRY-RUN] Would send:', JSON.stringify(payload, null, 2));
  } else {
    try {
      await sendWebhook(DISCORD_WEBHOOK_ANNOUNCEMENTS, payload);
      updateLastPostedTimestamp('research', latestReport.mtime);
      console.log('   ✅ Posted to Discord');
    } catch (error) {
      console.error('   ❌ Error:', error.message);
    }
  }

  console.log('');
}

/**
 * Post New Lessons
 */
async function postNewLessons() {
  console.log('📚 Checking New Lessons...');

  const lessonsDir = path.join(__dirname, '../lessons');
  if (!fs.existsSync(lessonsDir)) {
    console.log('⚠️  No lessons/ directory found\n');
    return;
  }

  const lessons = fs.readdirSync(lessonsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => ({
      name: dirent.name,
      path: path.join(lessonsDir, dirent.name),
      mtime: fs.statSync(path.join(lessonsDir, dirent.name)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (lessons.length === 0) {
    console.log('   No lessons found\n');
    return;
  }

  const lastPosted = getLastPostedTimestamp();

  for (const lesson of lessons) {
    // Check if already posted
    if (lastPosted[`lesson_${lesson.name}`]) {
      continue; // Already posted
    }

    // Read lesson.md
    const lessonMdPath = path.join(lesson.path, 'lesson.md');
    if (!fs.existsSync(lessonMdPath)) continue;

    const content = fs.readFileSync(lessonMdPath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    // Extract info
    const match = lesson.name.match(/^(\d+)-(.+)$/);
    const lessonNumber = match ? match[1] : '?';
    const lessonTitle = frontmatter.title || (match ? match[2].replace(/-/g, ' ') : lesson.name);
    const level = frontmatter.level || 'Intermediate';
    const duration = frontmatter.duration || '30 Min';

    console.log(`   📖 Lesson ${lessonNumber}: ${lessonTitle}`);

    const payload = {
      embeds: [{
        title: `📚 Neue Lektion: ${lessonTitle}`,
        description: `Level ${level} • ${duration}\n\nEine neue Lektion ist verfügbar!`,
        color: 0x5865f2, // Discord Blurple
        fields: [
          {
            name: '🎯 Level',
            value: level,
            inline: true
          },
          {
            name: '⏱️ Dauer',
            value: duration,
            inline: true
          },
          {
            name: '🔗 Link',
            value: `[Jetzt lernen](${COURSE_URL}/lessons/${lessonNumber})`
          }
        ],
        footer: {
          text: 'Masterkurs Agent 🤖'
        },
        timestamp: new Date().toISOString()
      }]
    };

    if (isDryRun) {
      console.log('      [DRY-RUN] Would send:', JSON.stringify(payload, null, 2));
    } else {
      try {
        await sendWebhook(DISCORD_WEBHOOK_UPDATES, payload);
        updateLastPostedTimestamp(`lesson_${lesson.name}`, Date.now());
        console.log('      ✅ Posted to Discord');
      } catch (error) {
        console.error('      ❌ Error:', error.message);
      }
    }

    // Only post one new lesson at a time
    break;
  }

  console.log('');
}

/**
 * Main
 */
async function main() {
  if (!DISCORD_WEBHOOK_ANNOUNCEMENTS || !DISCORD_WEBHOOK_UPDATES) {
    console.error('❌ Discord webhooks not configured in .env');
    console.error('   Set: DISCORD_WEBHOOK_ANNOUNCEMENTS, DISCORD_WEBHOOK_UPDATES');
    process.exit(1);
  }

  try {
    await postResearchUpdates();
    await postNewLessons();

    console.log('✅ Discord auto-posting complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
