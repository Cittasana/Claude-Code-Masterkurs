// ── Multi-Track Foundation (Phase 0b) ─────────────────────────────
// One TrackKey per learning track. Add a new value here, then register
// it in src/data/tracks.ts and add a Stripe product mapping in
// src/lib/stripe.ts before exposing it in the UI.
export type TrackKey =
  | 'claude-code'
  | 'claude-desktop'
  | 'codex'
  | 'local-llm'
  | 'freelancer';

// Lesson Types
export interface Lesson {
  id: number;
  level: 1 | 2 | 3;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  content: LessonContent[];
  /**
   * Which learning track this lesson belongs to. Optional during the
   * Phase 0/1 transition — code defaults to 'claude-code' when missing
   * (the legacy single-track value). Made required after Phase 1 ships.
   */
  track?: TrackKey;
  /** ISO datetime of last successful freshness audit (no issues). */
  lastVerified?: string | null;
  /** Open freshness warnings from the agent's weekly audit. */
  freshnessWarnings?: FreshnessWarning[];
  /** ISO datetime of most recent auto-patch from the agent. */
  lastUpdatedByAgent?: string | null;
}

export interface FreshnessWarning {
  /** Short human-readable explanation of what's stale. */
  reason: string;
  /** Source URL or research-report path that surfaced the staleness. */
  source: string;
  /** How impactful the staleness is. */
  severity: 'low' | 'medium' | 'high';
  /** ISO datetime when the warning was first detected. */
  addedAt: string;
}

export interface LessonContent {
  type: 'text' | 'code' | 'highlight' | 'list' | 'yaml' | 'heading' | 'video';
  content: string;
  language?: string;
  title?: string;
  /** Video: 'youtube' | 'vimeo' | 'local' */
  provider?: 'youtube' | 'vimeo' | 'local';
  /** Video: ID from URL (e.g. YouTube: dQw4w9WgXcQ, Vimeo: 123456789) */
  videoId?: string;
}

// Quiz Types
export type QuizType =
  | 'multiple-choice'
  | 'checklist'
  | 'code-selection'
  | 'command-matching'
  | 'code-completion'
  | 'free-text'
  | 'true-false';

export interface Quiz {
  id: string;
  lessonId: number;
  title: string;
  type: QuizType;
  points: number;
  questions: Question[];
  passingScore: number;
  maxAttempts: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'checkbox' | 'radio' | 'text' | 'code' | 'matching';
  options?: QuizOption[];
  correctAnswer?: string | string[] | number;
  hints?: string[];
  explanation: string;
  placeholder?: string;
  codeTemplate?: string;
  matchingPairs?: { left: string; right: string }[];
}

export interface QuizOption {
  id: string;
  label: string;
  value: string;
  isCorrect?: boolean;
}

// Project Types
export interface Project {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  description: string;
  difficulty: 'Anfänger' | 'Fortgeschritten' | 'Expert';
  duration: string;
  requirements: string[];
  starterCode?: string;
  hints?: string[];
  solution?: string;
  validation: ProjectValidation;
  resources?: string[];
}

export interface ProjectValidation {
  tests: ValidationTest[];
  minScore: number;
}

export interface ValidationTest {
  name: string;
  description: string;
  check: () => boolean | Promise<boolean>;
  points: number;
}

// User Progress Types
/** Key: "lessonId-blockIndex", value: true when watched */
export type VideosWatched = Record<string, boolean>;

export interface UserProgress {
  lessonsCompleted: number[];
  quizzesCompleted: QuizResult[];
  projectsCompleted: ProjectResult[];
  currentLesson: number;
  totalPoints: number;
  streak: number;
  lastSessionDate: string;
  timeInvested: number; // in minutes
  skillProgress: SkillProgress;
  /** Video Content Integration: which in-lesson videos were marked as watched */
  videosWatched?: VideosWatched;
}

export interface QuizResult {
  quizId: string;
  lessonId: number;
  score: number;
  attempts: number;
  completed: boolean;
  timestamp: string;
}

export interface ProjectResult {
  projectId: string;
  completed: boolean;
  score: number;
  timestamp: string;
  validationResults: {
    testName: string;
    passed: boolean;
    points: number;
  }[];
}

export interface SkillProgress {
  installation: number;
  claudeMd: number;
  mcpIntegration: number;
  customAgents: number;
  productionReady: number;
}

// Dashboard Types
export interface DashboardStats {
  overallProgress: number;
  levelBreakdown: {
    level1: number;
    level2: number;
    level3: number;
  };
  quizPerformance: {
    totalCompleted: number;
    averageScore: number;
    bestQuiz: string;
    needsReview: string[];
  };
  projectStatus: {
    completed: number;
    inProgress: number;
    available: number;
  };
  learningStats: {
    timeInvested: number;
    streak: number;
    lastSession: string;
    avgSessionTime: number;
  };
  certificationProgress: number;
}

// Playground Types
export interface PlaygroundTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  instruction: string;
  /** Numbered list of concrete requirements displayed above the CLI */
  requirements?: string[];
  mode: 'editor' | 'terminal';
  language: string;
  starterCode: string;
  validations: PlaygroundValidation[];
  hints: string[];
  // Terminal mode fields
  scenario?: TerminalScenario;
}

export interface PlaygroundValidation {
  id: string;
  name: string;
  description: string;
  check: (code: string) => { passed: boolean; error?: string };
  points: number;
}

// Terminal Simulation Types
export interface TerminalScenario {
  welcomeMessage: string;
  steps: TerminalStep[];
}

export interface TerminalStep {
  id: string;
  prompt: string;
  expectedCommands: string[];
  acceptPattern?: RegExp;
  response: string;
  errorResponse: string;
  hint: string;
  points: number;
}

// Spaced Repetition System (SRS)
export const SRS_INTERVALS_DAYS = [1, 3, 7, 14] as const;

export interface SRSItem {
  lessonId: number;
  nextReviewAt: string; // ISO date
  intervalIndex: number; // 0..3 → SRS_INTERVALS_DAYS
  lastReviewedAt?: string;
  timesReviewed: number;
}

// Feature Reference Types
export interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  details?: string;
  tips?: string[];
  example: string;
  documentation: string;
  tags: string[];
  /** Wenn true: Feature als „Neuestes Update“ anzeigen (Banner + Badge). Bei neuem Update auf false setzen. */
  lastUpdate?: boolean;
  /** Optional: Anzeigename im „Neueste Updates“-Banner (z. B. „Fast Mode“ für /fast, „Checkpointing“ für /rewind). */
  bannerLabel?: string;
}

// Community Patterns Library Types
export interface CommunityPattern {
  id: string;
  title: string;
  description: string;
  category: 'Prompts' | 'CLAUDE.md' | 'Workflows' | 'MCP' | 'Skills' | 'Sonstige';
  author: string;
  snippet: string;
  language?: string;
  tags: string[];
  useCase?: string;
  /** Wenn true: Pattern als „Neuestes Update“ anzeigen (Banner + Badge). Bei neuem Update auf false setzen. */
  lastUpdate?: boolean;
  /** Optional: Anzeigename im „Neueste Patterns“-Banner. */
  bannerLabel?: string;
}

// Live Coding Challenge Types
export type ChallengeDifficulty = 'Anfänger' | 'Fortgeschritten' | 'Expert';
export type ChallengeCategory =
  | 'CLAUDE.md'
  | 'Prompt Engineering'
  | 'Prompts & Patterns'
  | 'MCP Konfiguration'
  | 'MCP'
  | 'Hooks & Automation'
  | 'Hooks'
  | 'CLI Befehle'
  | 'Agent Design'
  | 'Agents'
  | 'Slash Commands'
  | 'Plugins'
  | 'Skills'
  | 'Konfiguration'
  | 'Context Management'
  | 'CI/CD'
  | 'Grundlagen'
  // Live Coding (Algorithmen & Code) – separat von Projekten
  | 'Algorithmen'
  | 'Datenstrukturen'
  | 'Rekursion & DP'
  | 'Strings & Arrays'
  | 'Graphen & BFS/DFS';

/** Quelle der Challenge: Claude-Code-Kurs vs. reine Live-Coding-Algorithmen */
export type ChallengeSource = 'claude-code' | 'live-coding';

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  /** Quelle: claude-code = Kurs-Challenges, live-coding = Algorithmen (separat von Projekten) */
  source?: ChallengeSource;
  difficulty: ChallengeDifficulty;
  /** Time limit in seconds; 0 = no limit */
  timeLimit: number;
  points: number;
  /** The instruction/task text shown to the user */
  instruction: string;
  /** Starter code the user begins with */
  starterCode: string;
  /** Language for syntax highlighting */
  language: string;
  /** Hints that can be revealed one by one */
  hints: string[];
  /** Validation checks against user code */
  validations: ChallengeValidation[];
  /** Model solution shown after completion */
  solution?: string;
  /** Related lesson ids */
  relatedLessons?: number[];
}

export interface ChallengeValidation {
  id?: string;
  name?: string;
  /** Alternative label used by newer entries (interchangeable with `name`) */
  testName?: string;
  /** Regex or string that must be present in the user code */
  pattern: string;
  /** Whether the pattern is a regex (true) or plain includes check (false) */
  isRegex?: boolean;
  /** Error message shown when validation fails */
  errorMessage?: string;
  points: number;
}

export interface ChallengeResult {
  challengeId: string;
  completed: boolean;
  score: number;
  maxScore: number;
  timeUsed: number; // seconds
  attempts: number;
  completedAt?: string; // ISO
}

// Community Forum Types
export type ForumCategoryId = 'allgemein' | 'lektionen' | 'projekte' | 'tipps' | 'feedback';

export interface ForumCategory {
  id: ForumCategoryId;
  title: string;
  description: string;
  icon?: string;
}

export interface ForumThread {
  id: string;
  categoryId: ForumCategoryId;
  title: string;
  body: string;
  author: string;
  authorId: string;
  createdAt: string; // ISO
  replyCount: number;
  lastActivityAt: string; // ISO
  pinned?: boolean;
}

export interface ForumReply {
  id: string;
  threadId: string;
  body: string;
  author: string;
  authorId: string;
  createdAt: string;
}

// Leaderboard Types
export type LeaderboardTimeframe = 'all' | 'week' | 'month';
export type LeaderboardSortBy = 'points' | 'lessons' | 'quizzes' | 'streak';

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  avatarEmoji: string;
  totalPoints: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  projectsCompleted: number;
  streak: number;
  level: 1 | 2 | 3;
  joinedAt: string; // ISO
  lastActiveAt: string; // ISO
  isCurrentUser?: boolean;
  /** Weekly points for time-filtered view */
  weeklyPoints: number;
  /** Monthly points for time-filtered view */
  monthlyPoints: number;
  badges: LeaderboardBadge[];
}

export interface LeaderboardBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const LEADERBOARD_BADGES: LeaderboardBadge[] = [
  { id: 'first-lesson', name: 'Erste Lektion', icon: '📖', description: 'Erste Lektion abgeschlossen' },
  { id: 'quiz-master', name: 'Quiz-Meister', icon: '🧠', description: '10+ Quizzes bestanden' },
  { id: 'streak-7', name: '7-Tage-Streak', icon: '🔥', description: '7 Tage in Folge gelernt' },
  { id: 'streak-30', name: '30-Tage-Streak', icon: '💎', description: '30 Tage in Folge gelernt' },
  { id: 'project-pro', name: 'Projekt-Profi', icon: '🛠️', description: '3+ Projekte abgeschlossen' },
  { id: 'all-lessons', name: 'Alle Lektionen', icon: '🎓', description: 'Alle Lektionen abgeschlossen' },
  { id: 'level-3', name: 'Expert', icon: '⭐', description: 'Level 3 erreicht' },
  { id: 'top-scorer', name: 'Top Scorer', icon: '🏆', description: 'Top 3 im Leaderboard' },
  { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Unter den ersten 10 Nutzern' },
  { id: 'perfectionist', name: 'Perfektionist', icon: '💯', description: 'Ein Quiz mit 100% bestanden' },
];
