#!/usr/bin/env node
/**
 * Masterkurs Agent → Notion Sync
 *
 * Syncs generated content to Notion databases:
 * - Lessons → "Lektionen" DB
 * - Emails → "Email-Kampagnen" DB
 * - Social Posts → "Content-Kalender" DB
 *
 * Usage:
 *   node scripts/sync-to-notion.js
 *   node scripts/sync-to-notion.js --type lessons
 *   node scripts/sync-to-notion.js --dry-run
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
require('dotenv').config();

// Config
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_LEKTIONEN_DB = process.env.NOTION_LEKTIONEN_DB_ID;
const NOTION_EMAILS_DB = process.env.NOTION_EMAILS_DB_ID;
const NOTION_SOCIAL_DB = process.env.NOTION_SOCIAL_DB_ID;

const notion = new Client({ auth: NOTION_API_KEY });

// CLI Args
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const contentType = args.find(arg => arg.startsWith('--type='))?.split('=')[1];

console.log('🔄 Masterkurs Agent → Notion Sync');
console.log('==================================\n');

if (isDryRun) {
  console.log('🔍 DRY-RUN Mode (no changes will be made)\n');
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
 * Sync Lessons to Notion
 */
async function syncLessons() {
  console.log('📚 Syncing Lessons...');

  const lessonsDir = path.join(__dirname, '../lessons');
  if (!fs.existsSync(lessonsDir)) {
    console.log('⚠️  No lessons/ directory found');
    return;
  }

  const lessonFolders = fs.readdirSync(lessonsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${lessonFolders.length} lesson(s)\n`);

  for (const folderName of lessonFolders) {
    const lessonPath = path.join(lessonsDir, folderName, 'lesson.md');

    if (!fs.existsSync(lessonPath)) {
      console.log(`⚠️  Skipping ${folderName} (no lesson.md)`);
      continue;
    }

    const content = fs.readFileSync(lessonPath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const lessonBody = content.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Extract lesson number and title from folder name
    const match = folderName.match(/^(\d+)-(.+)$/);
    const lessonNumber = match ? match[1] : '?';
    const lessonTitle = frontmatter.title || (match ? match[2].replace(/-/g, ' ') : folderName);

    console.log(`📝 Lesson ${lessonNumber}: ${lessonTitle}`);

    if (isDryRun) {
      console.log(`   [DRY-RUN] Would create/update in Notion`);
      continue;
    }

    try {
      // Check if already exists
      const existing = await notion.databases.query({
        database_id: NOTION_LEKTIONEN_DB,
        filter: {
          property: 'Nummer',
          number: {
            equals: parseInt(lessonNumber)
          }
        }
      });

      if (existing.results.length > 0) {
        console.log(`   ✅ Already in Notion (ID: ${existing.results[0].id})`);
        continue;
      }

      // Create new page
      await notion.pages.create({
        parent: { database_id: NOTION_LEKTIONEN_DB },
        properties: {
          'Titel': {
            title: [{ text: { content: lessonTitle } }]
          },
          'Nummer': {
            number: parseInt(lessonNumber)
          },
          'Level': {
            select: { name: frontmatter.level || 'Intermediate' }
          },
          'Dauer': {
            rich_text: [{ text: { content: frontmatter.duration || '30 Min' } }]
          },
          'Status': {
            select: { name: 'Draft - Review Needed' }
          },
          'Created By': {
            select: { name: 'Agent' }
          }
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{
                type: 'text',
                text: { content: lessonBody.slice(0, 2000) } // Notion limit
              }]
            }
          }
        ]
      });

      console.log(`   ✅ Created in Notion`);
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('');
}

/**
 * Sync Emails to Notion
 */
async function syncEmails() {
  console.log('📧 Syncing Email Campaigns...');

  const emailsDir = path.join(__dirname, '../email-campaigns');
  if (!fs.existsSync(emailsDir)) {
    console.log('⚠️  No email-campaigns/ directory found');
    return;
  }

  const campaigns = fs.readdirSync(emailsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${campaigns.length} campaign(s)\n`);

  for (const campaignName of campaigns) {
    const emailsFolder = path.join(emailsDir, campaignName, 'emails');

    if (!fs.existsSync(emailsFolder)) continue;

    const emailFiles = fs.readdirSync(emailsFolder)
      .filter(file => file.endsWith('.md'));

    console.log(`📬 Campaign: ${campaignName} (${emailFiles.length} emails)`);

    for (const emailFile of emailFiles) {
      const emailPath = path.join(emailsFolder, emailFile);
      const content = fs.readFileSync(emailPath, 'utf-8');
      const frontmatter = parseFrontmatter(content);

      const emailName = emailFile.replace('.md', '');

      console.log(`   → ${emailName}`);

      if (isDryRun) {
        console.log(`      [DRY-RUN] Would create in Notion`);
        continue;
      }

      try {
        await notion.pages.create({
          parent: { database_id: NOTION_EMAILS_DB },
          properties: {
            'Name': {
              title: [{ text: { content: `${campaignName} - ${emailName}` } }]
            },
            'Campaign': {
              select: { name: campaignName }
            },
            'Subject Line A': {
              rich_text: [{ text: { content: frontmatter.subject_line_a || '' } }]
            },
            'Subject Line B': {
              rich_text: [{ text: { content: frontmatter.subject_line_b || '' } }]
            },
            'Send Delay': {
              rich_text: [{ text: { content: frontmatter.send_delay || '0 hours' } }]
            },
            'Status': {
              select: { name: 'Draft' }
            }
          }
        });

        console.log(`      ✅ Created in Notion`);
      } catch (error) {
        console.error(`      ❌ Error: ${error.message}`);
      }
    }
  }

  console.log('');
}

/**
 * Sync Social Media Posts to Notion
 */
async function syncSocial() {
  console.log('📱 Syncing Social Media Posts...');

  const socialDir = path.join(__dirname, '../social-media');
  if (!fs.existsSync(socialDir)) {
    console.log('⚠️  No social-media/ directory found');
    return;
  }

  const months = fs.readdirSync(socialDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let totalPosts = 0;

  for (const monthFolder of months) {
    const postsDir = path.join(socialDir, monthFolder, 'posts');

    if (!fs.existsSync(postsDir)) continue;

    // Recursively find all .md files
    const findPosts = (dir) => {
      let posts = [];
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          posts = posts.concat(findPosts(fullPath));
        } else if (item.name.endsWith('.md')) {
          posts.push(fullPath);
        }
      }

      return posts;
    };

    const postFiles = findPosts(postsDir);
    totalPosts += postFiles.length;

    console.log(`📅 ${monthFolder}: ${postFiles.length} post(s)`);

    for (const postPath of postFiles) {
      const content = fs.readFileSync(postPath, 'utf-8');
      const frontmatter = parseFrontmatter(content);
      const postContent = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();

      const fileName = path.basename(postPath, '.md');

      if (isDryRun) {
        console.log(`   [DRY-RUN] ${fileName}`);
        continue;
      }

      try {
        await notion.pages.create({
          parent: { database_id: NOTION_SOCIAL_DB },
          properties: {
            'Title': {
              title: [{ text: { content: fileName } }]
            },
            'Platform': {
              select: { name: frontmatter.platform || 'LinkedIn' }
            },
            'Type': {
              select: { name: frontmatter.type || 'Educational' }
            },
            'Publish Date': {
              date: { start: frontmatter.date || new Date().toISOString().split('T')[0] }
            },
            'Status': {
              select: { name: 'Draft' }
            },
            'Content': {
              rich_text: [{ text: { content: postContent.slice(0, 2000) } }]
            }
          }
        });

        console.log(`   ✅ ${fileName}`);
      } catch (error) {
        console.error(`   ❌ ${fileName}: ${error.message}`);
      }
    }
  }

  console.log(`\nTotal: ${totalPosts} post(s)\n`);
}

/**
 * Main
 */
async function main() {
  if (!NOTION_API_KEY) {
    console.error('❌ NOTION_API_KEY not set in .env');
    process.exit(1);
  }

  try {
    if (!contentType || contentType === 'lessons') {
      await syncLessons();
    }

    if (!contentType || contentType === 'emails') {
      await syncEmails();
    }

    if (!contentType || contentType === 'social') {
      await syncSocial();
    }

    console.log('✅ Sync complete!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

main();
