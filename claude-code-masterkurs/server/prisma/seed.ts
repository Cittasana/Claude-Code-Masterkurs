import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// ── Static content data imports ─────────────────────────────────
import { forumCategories } from '../../src/data/forumCategories.js';
import {
  officialDocsOverview,
  officialDocsCore,
  officialDocsExtend,
  officialDocsOutsideTerminal,
} from '../../src/data/officialDocs.js';
import { features } from '../../src/data/features.js';
import { quizzes } from '../../src/data/quizzes.js';
import { challenges } from '../../src/data/challenges.js';
import { liveCodingChallenges } from '../../src/data/liveCodingChallenges.js';
import { lessons } from '../../src/data/lessons.js';
import { freelancerModules } from '../../src/data/freelancerTrack.js';
import { projects } from '../../src/data/projects.js';
import { capstoneProjects } from '../../src/data/capstoneProjects.js';
import { projectTemplates } from '../../src/data/projectTemplates.js';
import { playgroundTasks } from '../../src/data/playgroundTasks.js';

const prisma = new PrismaClient();

/** Convert RegExp instances to their string source for JSON storage. */
function regexToString(v: unknown): unknown {
  if (v instanceof RegExp) return v.source;
  if (Array.isArray(v)) return v.map(regexToString);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      out[k] = regexToString(val);
    }
    return out;
  }
  return v;
}

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
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: Seeding is not allowed in production environment!');
    process.exit(1);
  }

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

  // ── Promo Codes ────────────────────────────────────────────
  console.log('\n🎟️  Seeding promo codes...');
  
  const promoCodes = [
    {
      code: 'WELCOME2024',
      description: 'Willkommensangebot - 6 Monate kostenlos',
      durationMonths: 6,
      maxUses: 100,
      active: true,
    },
    {
      code: 'EARLYBIRD',
      description: 'Early Bird Special - 12 Monate kostenlos',
      durationMonths: 12,
      maxUses: 50,
      active: true,
    },
    {
      code: 'TEST2024',
      description: 'Test-Code für Entwicklung',
      durationMonths: 6,
      maxUses: null, // Unbegrenzt
      active: true,
    },
  ];

  for (const promo of promoCodes) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: {},
      create: promo,
    });
    console.log(`  ✅ Promo Code: ${promo.code} (${promo.durationMonths} Monate)`);
  }

  // ════════════════════════════════════════════════════════════
  // CONTENT CONFIGS – Static data from src/data/
  // ════════════════════════════════════════════════════════════

  // ── Forum Category Configs ─────────────────────────────────
  console.log('\n📂 Seeding content configs...');
  console.log('  Forum Categories...');
  for (let i = 0; i < forumCategories.length; i++) {
    const fc = forumCategories[i];
    await prisma.forumCategoryConfig.upsert({
      where: { categoryId: fc.id },
      update: {
        title: fc.title,
        description: fc.description,
        icon: fc.icon,
        sortOrder: i,
      },
      create: {
        categoryId: fc.id,
        title: fc.title,
        description: fc.description,
        icon: fc.icon,
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${forumCategories.length} forum categories`);

  // ── Official Docs ──────────────────────────────────────────
  console.log('  Official Docs...');
  const docSections: { category: string; docs: typeof officialDocsOverview }[] = [
    { category: 'overview', docs: officialDocsOverview },
    { category: 'core', docs: officialDocsCore },
    { category: 'extend', docs: officialDocsExtend },
    { category: 'outsideTerminal', docs: officialDocsOutsideTerminal },
  ];
  let docOrder = 0;
  for (const section of docSections) {
    for (const doc of section.docs) {
      await prisma.officialDoc.upsert({
        where: { id: `doc-${section.category}-${docOrder}` },
        update: {
          title: doc.title,
          url: doc.url,
          category: section.category,
          description: doc.description,
          lang: doc.lang ?? null,
          sortOrder: docOrder,
        },
        create: {
          id: `doc-${section.category}-${docOrder}`,
          title: doc.title,
          url: doc.url,
          category: section.category,
          description: doc.description,
          lang: doc.lang ?? null,
          sortOrder: docOrder,
        },
      });
      docOrder++;
    }
  }
  console.log(`    ✓ ${docOrder} official docs`);

  // ── Features ───────────────────────────────────────────────
  console.log('  Features...');
  for (let i = 0; i < features.length; i++) {
    const f = features[i];
    await prisma.featureRef.upsert({
      where: { featureId: f.id },
      update: {
        name: f.name,
        category: f.category,
        description: f.description,
        details: f.details ?? null,
        tips: f.tips ?? [],
        example: f.example,
        documentation: f.documentation,
        tags: f.tags ?? [],
        lastUpdate: (f as Record<string, unknown>).lastUpdate === true,
        bannerLabel: ((f as Record<string, unknown>).bannerLabel as string) ?? null,
        sortOrder: i,
      },
      create: {
        featureId: f.id,
        name: f.name,
        category: f.category,
        description: f.description,
        details: f.details ?? null,
        tips: f.tips ?? [],
        example: f.example,
        documentation: f.documentation,
        tags: f.tags ?? [],
        lastUpdate: (f as Record<string, unknown>).lastUpdate === true,
        bannerLabel: ((f as Record<string, unknown>).bannerLabel as string) ?? null,
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${features.length} features`);

  // ── Quizzes ────────────────────────────────────────────────
  console.log('  Quizzes...');
  for (let i = 0; i < quizzes.length; i++) {
    const q = quizzes[i];
    await prisma.quizConfig.upsert({
      where: { quizId: q.id },
      update: {
        lessonId: q.lessonId,
        title: q.title,
        type: q.type,
        points: q.points,
        passingScore: q.passingScore,
        maxAttempts: q.maxAttempts,
        questions: q.questions as unknown as Record<string, unknown>[],
        sortOrder: i,
      },
      create: {
        quizId: q.id,
        lessonId: q.lessonId,
        title: q.title,
        type: q.type,
        points: q.points,
        passingScore: q.passingScore,
        maxAttempts: q.maxAttempts,
        questions: q.questions as unknown as Record<string, unknown>[],
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${quizzes.length} quizzes`);

  // ── Challenges (claude-code + live-coding) ─────────────────
  console.log('  Challenges...');
  const allChallenges = [...challenges, ...liveCodingChallenges];
  for (let i = 0; i < allChallenges.length; i++) {
    const c = allChallenges[i];
    await prisma.challengeConfig.upsert({
      where: { challengeId: c.id },
      update: {
        title: c.title,
        description: c.description,
        category: c.category,
        source: c.source ?? 'claude-code',
        difficulty: c.difficulty,
        timeLimit: c.timeLimit ?? 0,
        points: c.points,
        instruction: c.instruction,
        starterCode: c.starterCode,
        language: c.language,
        hints: c.hints ?? [],
        validations: regexToString(c.validations ?? []) as object[],
        solution: c.solution,
        relatedLessons: c.relatedLessons ?? [],
        sortOrder: i,
      },
      create: {
        challengeId: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        source: c.source ?? 'claude-code',
        difficulty: c.difficulty,
        timeLimit: c.timeLimit ?? 0,
        points: c.points,
        instruction: c.instruction,
        starterCode: c.starterCode,
        language: c.language,
        hints: c.hints ?? [],
        validations: regexToString(c.validations ?? []) as object[],
        solution: c.solution,
        relatedLessons: c.relatedLessons ?? [],
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${allChallenges.length} challenges (${challenges.length} claude-code + ${liveCodingChallenges.length} live-coding)`);

  // ── Lessons (main track + freelancer track) ────────────────
  console.log('  Lessons...');
  const allLessons: { lesson: (typeof lessons)[number]; track: string }[] = [
    ...lessons.map((l) => ({ lesson: l, track: 'main' })),
    ...freelancerModules.map((l) => ({ lesson: l, track: 'freelancer' })),
  ];
  for (let i = 0; i < allLessons.length; i++) {
    const { lesson: l, track } = allLessons[i];
    await prisma.lessonConfig.upsert({
      where: { lessonId: l.id },
      update: {
        level: l.level,
        title: l.title,
        description: l.description,
        duration: l.duration,
        objectives: l.objectives ?? [],
        content: l.content as unknown as object,
        track,
        sortOrder: i,
      },
      create: {
        lessonId: l.id,
        level: l.level,
        title: l.title,
        description: l.description,
        duration: l.duration,
        objectives: l.objectives ?? [],
        content: l.content as unknown as object,
        track,
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${allLessons.length} lessons (${lessons.length} main + ${freelancerModules.length} freelancer)`);

  // ── Projects ───────────────────────────────────────────────
  console.log('  Projects...');
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const validationMeta = {
      tests: (p.validation?.tests ?? []).map((t) => ({
        name: t.name,
        description: t.description,
        points: t.points,
      })),
      minScore: p.validation?.minScore ?? 0,
    };
    await prisma.projectConfig.upsert({
      where: { projectId: p.id },
      update: {
        level: p.level,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        duration: p.duration,
        requirements: p.requirements ?? [],
        starterCode: p.starterCode ?? null,
        hints: p.hints ?? [],
        solution: p.solution ?? null,
        resources: p.resources ?? [],
        validationMeta: validationMeta as object,
        sortOrder: i,
      },
      create: {
        projectId: p.id,
        level: p.level,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        duration: p.duration,
        requirements: p.requirements ?? [],
        starterCode: p.starterCode ?? null,
        hints: p.hints ?? [],
        solution: p.solution ?? null,
        resources: p.resources ?? [],
        validationMeta: validationMeta as object,
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${projects.length} projects`);

  // ── Capstone Projects ──────────────────────────────────────
  console.log('  Capstone Projects...');
  for (let i = 0; i < capstoneProjects.length; i++) {
    const cp = capstoneProjects[i];
    await prisma.capstoneConfig.upsert({
      where: { capstoneId: cp.id },
      update: {
        title: cp.title,
        description: cp.description,
        difficulty: cp.difficulty,
        estimatedHours: cp.estimatedHours,
        techStack: cp.techStack ?? [],
        requirements: cp.requirements ?? [],
        steps: cp.steps as unknown as object[],
        thumbnailEmoji: cp.thumbnailEmoji ?? null,
        sortOrder: i,
      },
      create: {
        capstoneId: cp.id,
        title: cp.title,
        description: cp.description,
        difficulty: cp.difficulty,
        estimatedHours: cp.estimatedHours,
        techStack: cp.techStack ?? [],
        requirements: cp.requirements ?? [],
        steps: cp.steps as unknown as object[],
        thumbnailEmoji: cp.thumbnailEmoji ?? null,
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${capstoneProjects.length} capstone projects`);

  // ── Project Templates ──────────────────────────────────────
  console.log('  Project Templates...');
  for (let i = 0; i < projectTemplates.length; i++) {
    const t = projectTemplates[i];
    await prisma.projectTemplateConfig.upsert({
      where: { templateId: t.id },
      update: {
        title: t.title,
        description: t.description,
        difficulty: t.difficulty,
        estimatedHours: t.estimatedHours,
        techStack: t.techStack ?? [],
        features: t.features ?? [],
        claudeMd: t.claudeMd,
        fileStructure: t.fileStructure ?? null,
        steps: t.steps as unknown as object[],
        githubUrl: t.githubUrl ?? null,
        sortOrder: i,
      },
      create: {
        templateId: t.id,
        title: t.title,
        description: t.description,
        difficulty: t.difficulty,
        estimatedHours: t.estimatedHours,
        techStack: t.techStack ?? [],
        features: t.features ?? [],
        claudeMd: t.claudeMd,
        fileStructure: t.fileStructure ?? null,
        steps: t.steps as unknown as object[],
        githubUrl: t.githubUrl ?? null,
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${projectTemplates.length} project templates`);

  // ── Playground Tasks ──────────────────────────────────────
  console.log('  Playground Tasks...');
  for (let i = 0; i < playgroundTasks.length; i++) {
    const pt = playgroundTasks[i];
    const scenarioMeta = pt.scenario
      ? regexToString({
          welcomeMessage: pt.scenario.welcomeMessage,
          steps: pt.scenario.steps.map((s) => ({
            id: s.id,
            prompt: s.prompt,
            expectedCommands: s.expectedCommands,
            acceptPattern: s.acceptPattern,
            response: s.response,
            errorResponse: s.errorResponse,
            hint: s.hint,
            points: s.points,
          })),
        })
      : null;

    await prisma.playgroundTaskConfig.upsert({
      where: { taskId: pt.id },
      update: {
        projectId: pt.projectId,
        title: pt.title,
        description: pt.description,
        instruction: pt.instruction,
        requirements: pt.requirements ?? [],
        mode: pt.mode,
        language: pt.language,
        starterCode: pt.starterCode ?? '',
        hints: pt.hints ?? [],
        validationMeta: regexToString(pt.validations ?? []) as object[],
        scenarioMeta: scenarioMeta as object | null,
        sortOrder: i,
      },
      create: {
        taskId: pt.id,
        projectId: pt.projectId,
        title: pt.title,
        description: pt.description,
        instruction: pt.instruction,
        requirements: pt.requirements ?? [],
        mode: pt.mode,
        language: pt.language,
        starterCode: pt.starterCode ?? '',
        hints: pt.hints ?? [],
        validationMeta: regexToString(pt.validations ?? []) as object[],
        scenarioMeta: scenarioMeta as object | null,
        sortOrder: i,
      },
    });
  }
  console.log(`    ✓ ${playgroundTasks.length} playground tasks`);

  // ════════════════════════════════════════════════════════════

  console.log('\n✅ Seed complete!');
  console.log(`   ${SEED_USERS.length} Users + Progress`);
  console.log(`   ${SEED_THREADS.length} Forum Threads`);
  console.log(`   ${SEED_REPLIES.length} Forum Replies`);
  console.log(`   ${promoCodes.length} Promo Codes`);
  console.log(`   ${forumCategories.length} Forum Category Configs`);
  console.log(`   ${docOrder} Official Docs`);
  console.log(`   ${features.length} Features`);
  console.log(`   ${quizzes.length} Quizzes`);
  console.log(`   ${allChallenges.length} Challenges`);
  console.log(`   ${allLessons.length} Lessons`);
  console.log(`   ${projects.length} Projects`);
  console.log(`   ${capstoneProjects.length} Capstone Projects`);
  console.log(`   ${projectTemplates.length} Project Templates`);
  console.log(`   ${playgroundTasks.length} Playground Tasks`);
  console.log('\n   Demo-Login: beliebige-email@demo.local / demo1234');
  console.log('   Test Promo-Codes: WELCOME2024, EARLYBIRD, TEST2024');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
