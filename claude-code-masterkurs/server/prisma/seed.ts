import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// Seed Data - Populates the database with initial data
// Run with: npx tsx prisma/seed.ts
// ─────────────────────────────────────────────────────────────

interface SeedUser {
  id: string;
  email: string;
  displayName: string;
  avatarEmoji: string;
  totalPoints: number;
  lessonsCompleted: number[];
  quizzesCount: number;
  projectsCount: number;
  streak: number;
  daysAgo: number; // When they joined
}

const SEED_USERS: SeedUser[] = [
  { id: 'user-alex',  email: 'alex@demo.local',  displayName: 'AlexDev',      avatarEmoji: '🚀', totalPoints: 2850, lessonsCompleted: Array.from({length: 19}, (_, i) => i), quizzesCount: 18, projectsCount: 8, streak: 42, daysAgo: 90 },
  { id: 'user-maria', email: 'maria@demo.local', displayName: 'MariaCode',    avatarEmoji: '💜', totalPoints: 2540, lessonsCompleted: Array.from({length: 18}, (_, i) => i), quizzesCount: 17, projectsCount: 7, streak: 28, daysAgo: 75 },
  { id: 'user-jan',   email: 'jan@demo.local',   displayName: 'JanHacker',    avatarEmoji: '⚡', totalPoints: 2180, lessonsCompleted: Array.from({length: 16}, (_, i) => i), quizzesCount: 15, projectsCount: 6, streak: 14, daysAgo: 60 },
  { id: 'user-lena',  email: 'lena@demo.local',  displayName: 'LenaAI',       avatarEmoji: '🌟', totalPoints: 1920, lessonsCompleted: Array.from({length: 14}, (_, i) => i), quizzesCount: 13, projectsCount: 5, streak: 21, daysAgo: 55 },
  { id: 'user-tom',   email: 'tom@demo.local',   displayName: 'TomBuilder',   avatarEmoji: '🔧', totalPoints: 1650, lessonsCompleted: Array.from({length: 12}, (_, i) => i), quizzesCount: 11, projectsCount: 4, streak: 9,  daysAgo: 45 },
  { id: 'user-sarah', email: 'sarah@demo.local', displayName: 'SarahPrompt',  avatarEmoji: '✨', totalPoints: 1380, lessonsCompleted: Array.from({length: 10}, (_, i) => i), quizzesCount: 10, projectsCount: 3, streak: 15, daysAgo: 40 },
  { id: 'user-max',   email: 'max@demo.local',   displayName: 'MaxTerminal',  avatarEmoji: '💻', totalPoints: 1120, lessonsCompleted: Array.from({length: 9},  (_, i) => i), quizzesCount: 8,  projectsCount: 3, streak: 5,  daysAgo: 35 },
  { id: 'user-nina',  email: 'nina@demo.local',  displayName: 'NinaAgent',    avatarEmoji: '🤖', totalPoints: 890,  lessonsCompleted: Array.from({length: 8},  (_, i) => i), quizzesCount: 7,  projectsCount: 2, streak: 11, daysAgo: 30 },
  { id: 'user-felix', email: 'felix@demo.local', displayName: 'FelixCLI',     avatarEmoji: '🎯', totalPoints: 720,  lessonsCompleted: Array.from({length: 7},  (_, i) => i), quizzesCount: 6,  projectsCount: 2, streak: 3,  daysAgo: 25 },
  { id: 'user-lisa',  email: 'lisa@demo.local',   displayName: 'LisaMCP',      avatarEmoji: '🔮', totalPoints: 580,  lessonsCompleted: Array.from({length: 6},  (_, i) => i), quizzesCount: 5,  projectsCount: 1, streak: 8,  daysAgo: 20 },
  { id: 'user-david', email: 'david@demo.local', displayName: 'DavidFlow',    avatarEmoji: '🌊', totalPoints: 450,  lessonsCompleted: Array.from({length: 5},  (_, i) => i), quizzesCount: 4,  projectsCount: 1, streak: 4,  daysAgo: 18 },
  { id: 'user-emma',  email: 'emma@demo.local',  displayName: 'EmmaSkill',    avatarEmoji: '🎨', totalPoints: 350,  lessonsCompleted: Array.from({length: 4},  (_, i) => i), quizzesCount: 3,  projectsCount: 0, streak: 6,  daysAgo: 14 },
  { id: 'user-paul',  email: 'paul@demo.local',  displayName: 'PaulConfig',   avatarEmoji: '⚙️', totalPoints: 240,  lessonsCompleted: Array.from({length: 3},  (_, i) => i), quizzesCount: 2,  projectsCount: 0, streak: 2,  daysAgo: 10 },
  { id: 'user-anna',  email: 'anna@demo.local',  displayName: 'AnnaStart',    avatarEmoji: '🌱', totalPoints: 120,  lessonsCompleted: Array.from({length: 2},  (_, i) => i), quizzesCount: 1,  projectsCount: 0, streak: 1,  daysAgo: 5 },
  { id: 'user-lukas', email: 'lukas@demo.local', displayName: 'LukasNew',     avatarEmoji: '👋', totalPoints: 50,   lessonsCompleted: [0],                                   quizzesCount: 0,  projectsCount: 0, streak: 1,  daysAgo: 2 },
];

// Forum seed threads (matching existing frontend seed data)
const SEED_THREADS = [
  {
    id: 'seed-1',
    categoryId: 'allgemein',
    title: 'Willkommen im Community Forum!',
    body: 'Hier könnt ihr euch austauschen, Fragen stellen und Tipps teilen. Viel Spaß beim Lernen!',
    authorId: 'user-alex',
    pinned: true,
    daysAgo: 2,
  },
  {
    id: 'seed-2',
    categoryId: 'lektionen',
    title: 'Lektion 6 – MCP Server: Wo finde ich gute Beispiele?',
    body: 'Hat jemand Empfehlungen für MCP-Server zum Ausprobieren neben den offiziellen?',
    authorId: 'user-maria',
    daysAgo: 0.2,
  },
  {
    id: 'seed-3',
    categoryId: 'projekte',
    title: 'Projekt 1.2 CLAUDE.md Generator – Validierung',
    body: 'Bei der Validierung hakt es bei „Überschriften prüfen". Welches Format erwartet der Check?',
    authorId: 'user-jan',
    daysAgo: 0.5,
  },
  {
    id: 'seed-4',
    categoryId: 'tipps',
    title: 'CLAUDE.md: Kurze Abschnitte = bessere Antworten',
    body: 'Ich habe gemerkt: Viele kleine, klare Abschnitte in CLAUDE.md führen zu präziseren Antworten als ein langer Fließtext.',
    authorId: 'user-lena',
    daysAgo: 1,
  },
];

const SEED_REPLIES = [
  { id: 'reply-1', threadId: 'seed-1', body: 'Danke, freue mich auf den Austausch!', authorId: 'user-maria', daysAgo: 1.5 },
  { id: 'reply-2', threadId: 'seed-1', body: 'Super Idee mit dem Forum. 👍', authorId: 'user-lena', daysAgo: 1 },
  { id: 'reply-3', threadId: 'seed-2', body: 'Schau mal in die Cursor-Docs unter MCP – da gibt es eine Liste. Oder im Kurs unter Lektion 6 die verlinkten Ressourcen.', authorId: 'user-alex', daysAgo: 0.1 },
  { id: 'reply-4', threadId: 'seed-4', body: 'Kann ich so bestätigen. Außerdem: @-Erwähnungen für Kontext nutzen.', authorId: 'user-tom', daysAgo: 0.2 },
  { id: 'reply-5', threadId: 'seed-4', body: 'Guter Tipp, danke!', authorId: 'user-sarah', daysAgo: 0.08 },
];

function daysAgoDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  console.log('🌱 Seeding database...\n');

  // All seed users share the same demo password
  const passwordHash = await bcrypt.hash('demo1234', 12);

  // ── Users + Progress ───────────────────────────────────────
  for (const u of SEED_USERS) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        passwordHash,
        displayName: u.displayName,
        avatarEmoji: u.avatarEmoji,
        createdAt: daysAgoDate(u.daysAgo),
        progress: {
          create: {
            lessonsCompleted: u.lessonsCompleted,
            totalPoints: u.totalPoints,
            streak: u.streak,
            lastSessionDate: daysAgoDate(Math.max(0, u.daysAgo - u.streak)),
            currentLesson: u.lessonsCompleted.length,
          },
        },
      },
    });

    // Create quiz results
    for (let i = 0; i < u.quizzesCount; i++) {
      await prisma.quizResult.upsert({
        where: {
          userId_quizId: { userId: u.id, quizId: `quiz-${i}` },
        },
        update: {},
        create: {
          userId: u.id,
          quizId: `quiz-${i}`,
          lessonId: i,
          score: Math.round(70 + Math.random() * 30), // 70-100
          attempts: Math.ceil(Math.random() * 3),
          completed: true,
        },
      });
    }

    // Create project results
    const projectIds = ['p1.1', 'p1.2', 'p1.3', 'p2.1', 'p2.2', 'p2.3', 'p3.1', 'p3.2', 'p3.3'];
    for (let i = 0; i < u.projectsCount && i < projectIds.length; i++) {
      await prisma.projectResult.upsert({
        where: {
          userId_projectId: { userId: u.id, projectId: projectIds[i] },
        },
        update: {},
        create: {
          userId: u.id,
          projectId: projectIds[i],
          completed: true,
          score: Math.round(60 + Math.random() * 40),
          validationResults: [],
        },
      });
    }

    console.log(`  ✅ ${u.displayName} (${u.email})`);
  }

  // ── Forum Threads ──────────────────────────────────────────
  console.log('\n📝 Seeding forum threads...');
  for (const t of SEED_THREADS) {
    await prisma.forumThread.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        categoryId: t.categoryId,
        title: t.title,
        body: t.body,
        authorId: t.authorId,
        pinned: t.pinned || false,
        createdAt: daysAgoDate(t.daysAgo),
        lastActivityAt: daysAgoDate(t.daysAgo),
      },
    });
    console.log(`  ✅ Thread: ${t.title.slice(0, 50)}...`);
  }

  // ── Forum Replies ──────────────────────────────────────────
  console.log('\n💬 Seeding forum replies...');
  for (const r of SEED_REPLIES) {
    await prisma.forumReply.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        threadId: r.threadId,
        body: r.body,
        authorId: r.authorId,
        createdAt: daysAgoDate(r.daysAgo),
      },
    });

    // Update thread's lastActivityAt
    const thread = SEED_THREADS.find((t) => t.id === r.threadId);
    if (thread && r.daysAgo < thread.daysAgo) {
      await prisma.forumThread.update({
        where: { id: r.threadId },
        data: { lastActivityAt: daysAgoDate(r.daysAgo) },
      });
    }
  }
  console.log(`  ✅ ${SEED_REPLIES.length} Replies`);

  console.log('\n✅ Seed complete!');
  console.log(`   ${SEED_USERS.length} Users + Progress`);
  console.log(`   ${SEED_THREADS.length} Forum Threads`);
  console.log(`   ${SEED_REPLIES.length} Forum Replies`);
  console.log('\n   Demo-Login: beliebige-email@demo.local / demo1234');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
