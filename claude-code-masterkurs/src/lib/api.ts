// ─────────────────────────────────────────────────────────────
// API Client – Zentraler fetch-Wrapper mit Auth-Header
// ─────────────────────────────────────────────────────────────

// Bereinige die API-URL: Entferne Zeilenumbrüche und ungültige Zeichen,
// die durch fehlerhafte Umgebungsvariablen entstehen können
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE = RAW_API_URL.replace(/[\n\r\s]/g, '').replace(/^[^h]+(https?)/, '$1');

/** Standardisierter API-Fehler */
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/** Token aus dem LocalStorage holen */
function getToken(): string | null {
  try {
    const stored = localStorage.getItem('claude-code-auth');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

/** Generischer fetch-Wrapper mit Auth & Error-Handling */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Leere Antwort (204 No Content)
  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error || `Request failed (${res.status})`,
      data,
    );
  }

  return data as T;
}

// ── Convenience Methods ───────────────────────────────────────

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

// ── Auth API ────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarEmoji: string;
  emailVerified?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    api.post<AuthResponse>('/api/auth/register', { email, password, displayName }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, password }),

  me: () => api.get<{ user: AuthUser }>('/api/auth/me'),

  updateProfile: (data: { displayName?: string; avatarEmoji?: string }) =>
    api.put<{ user: AuthUser }>('/api/auth/profile', data),

  deleteAccount: () => api.delete<{ message: string }>('/api/auth/account'),

  requestPasswordReset: (email: string) =>
    api.post<{ message: string }>('/api/auth/password-reset-request', { email }),

  confirmPasswordReset: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/api/auth/password-reset-confirm', { token, newPassword }),

  verifyEmail: (token: string) =>
    api.post<{ message: string }>('/api/auth/verify-email', { token }),

  resendVerification: () =>
    api.post<{ message: string }>('/api/auth/resend-verification'),
};

// ── Progress API ────────────────────────────────────────────

export const progressApi = {
  get: () => api.get<Record<string, unknown>>('/api/progress'),

  update: (data: Record<string, unknown>) =>
    api.put<Record<string, unknown>>('/api/progress', data),

  saveQuiz: (result: {
    quizId: string;
    lessonId: number;
    score: number;
    attempts: number;
    completed: boolean;
  }) => api.post<Record<string, unknown>>('/api/progress/quiz', result),

  saveProject: (result: {
    projectId: string;
    completed: boolean;
    score: number;
    validationResults: { testName: string; passed: boolean; points: number }[];
  }) => api.post<Record<string, unknown>>('/api/progress/project', result),
};

// ── Forum API ───────────────────────────────────────────────

export const forumApi = {
  getThreads: (params?: { category?: string; page?: number; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.category) search.set('category', params.category);
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return api.get<{ threads: unknown[]; total: number; page: number; limit: number }>(
      `/api/forum/threads${qs ? `?${qs}` : ''}`,
    );
  },

  getThread: (id: string) => api.get<Record<string, unknown>>(`/api/forum/threads/${id}`),

  createThread: (data: { categoryId: string; title: string; body: string }) =>
    api.post<Record<string, unknown>>('/api/forum/threads', data),

  createReply: (threadId: string, body: string) =>
    api.post<Record<string, unknown>>(`/api/forum/threads/${threadId}/replies`, { body }),
};

// ── Leaderboard API ─────────────────────────────────────────

export const leaderboardApi = {
  get: (params?: { sortBy?: string; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.sortBy) search.set('sortBy', params.sortBy);
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return api.get<{ entries: unknown[] }>(`/api/leaderboard${qs ? `?${qs}` : ''}`);
  },
};

// ── Challenges API ──────────────────────────────────────────

export const challengesApi = {
  getResults: () =>
    api.get<{ results: Record<string, unknown> }>('/api/challenges/results'),

  saveResult: (data: {
    challengeId: string;
    completed: boolean;
    score: number;
    maxScore: number;
    timeUsed: number;
  }) => api.post<Record<string, unknown>>('/api/challenges/results', data),
};

// ── Patterns API ────────────────────────────────────────────

export const patternsApi = {
  get: (params?: { category?: string; search?: string; page?: number }) => {
    const search = new URLSearchParams();
    if (params?.category) search.set('category', params.category);
    if (params?.search) search.set('search', params.search);
    if (params?.page) search.set('page', String(params.page));
    const qs = search.toString();
    return api.get<{ patterns: unknown[]; total: number }>(`/api/patterns${qs ? `?${qs}` : ''}`);
  },

  create: (data: {
    title: string;
    description: string;
    category: string;
    snippet: string;
    language?: string;
    tags?: string[];
    useCase?: string;
  }) => api.post<Record<string, unknown>>('/api/patterns', data),
};

// ── SRS API ─────────────────────────────────────────────────

export const srsApi = {
  get: () => api.get<{ items: Record<number, unknown> }>('/api/srs'),

  getDue: () => api.get<{ dueCount: number; lessonIds: number[] }>('/api/srs/due'),

  add: (lessonId: number) => api.post<Record<string, unknown>>('/api/srs/add', { lessonId }),

  review: (lessonId: number, remembered: boolean) =>
    api.post<Record<string, unknown>>('/api/srs/review', { lessonId, remembered }),
};

// ── Analytics API ───────────────────────────────────────────

export const analyticsApi = {
  getEvents: (params?: { since?: string; type?: string; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.since) search.set('since', params.since);
    if (params?.type) search.set('type', params.type);
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return api.get<{ events: unknown[] }>(`/api/analytics/events${qs ? `?${qs}` : ''}`);
  },

  logEvent: (data: {
    type: string;
    metadata?: Record<string, unknown>;
  }) => api.post<Record<string, unknown>>('/api/analytics/events', data),

  logBatch: (events: { type: string; metadata?: Record<string, unknown> }[]) =>
    api.post<{ created: number }>('/api/analytics/events/batch', events),

  getSummary: () => api.get<Record<string, unknown>>('/api/analytics/summary'),
};

// ── Subscription API ────────────────────────────────────────

export interface PromoCodeValidation {
  valid: boolean;
  code?: string;
  description?: string;
  durationMonths?: number;
  error?: string;
}

export interface SubscriptionStatus {
  hasSubscription: boolean;
  status: string;
  isLifetime?: boolean;
  lifetimePurchasedAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  promoCode?: {
    code: string;
    description?: string;
    expiresAt?: string;
  };
}

export interface AccessStatus {
  hasAccess: boolean;
  isLifetime?: boolean;
  status?: string;
}

// ── Free Signup API ────────────────────────────────────────

export const freeSignupApi = {
  signup: (email: string, displayName?: string) =>
    api.post<AuthResponse & { message: string }>('/api/auth/signup/free', { email, displayName }),
};

// ── Lesson Access API ──────────────────────────────────────

export interface LessonAccessResult {
  canAccess: boolean;
  reason: 'free_lesson' | 'subscription_active' | 'requires_subscription';
  tier: string;
  freeLessonLimit: number;
}

export const lessonAccessApi = {
  canAccess: (lessonId: number) =>
    api.get<LessonAccessResult>(`/api/subscription/can-access-lesson/${lessonId}`),
};

export const subscriptionApi = {
  createCheckoutSession: (priceId: string, promoCode?: string) =>
    api.post<{ url: string; sessionId: string }>('/api/subscription/create-checkout-session', {
      priceId,
      promoCode,
    }),

  validatePromoCode: (code: string) =>
    api.post<PromoCodeValidation>('/api/subscription/validate-promo-code', { code }),

  getStatus: () => api.get<SubscriptionStatus>('/api/subscription/status'),

  hasAccess: () => api.get<AccessStatus>('/api/subscription/has-access'),

  verifyCheckout: (sessionId: string) =>
    api.post<{ status: string; activated?: boolean; alreadyActive?: boolean }>(
      '/api/subscription/verify-checkout',
      { sessionId },
    ),

  cancel: () => api.post<{ message: string }>('/api/subscription/cancel'),
};

// ── Discord API ─────────────────────────────────────────────

export interface DiscordStatus {
  connected: boolean;
  discordId: string | null;
  discordUsername: string | null;
  isConfigured: boolean;
}

export const discordApi = {
  /** Returns the Discord connection status for the current user */
  getStatus: () => api.get<DiscordStatus>('/api/discord/status'),

  /** Returns the Discord OAuth URL to initiate the connection flow */
  getAuthUrl: () => api.get<{ url: string }>('/api/discord/auth-url'),

  /** Returns the Discord OAuth URL for login/register (no auth required) */
  getLoginUrl: () => api.get<{ url: string }>('/api/discord/login-url'),

  /** Disconnects the Discord account from the user profile */
  disconnect: () => api.post<{ message: string }>('/api/discord/disconnect'),
};

// ── Tickets API ─────────────────────────────────────────────

export interface SupportTicket {
  id: string;
  userId: string;
  discordThreadId: string | null;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; displayName: string; email: string; avatarEmoji: string };
}

export const ticketsApi = {
  getAll: () => api.get<{ tickets: SupportTicket[] }>('/api/tickets'),

  create: (data: { subject: string; priority?: string }) =>
    api.post<{ ticket: SupportTicket }>('/api/tickets', data),

  updateStatus: (id: string, status: string) =>
    api.patch<{ ticket: SupportTicket }>(`/api/tickets/${id}/status`, { status }),
};

// ── Newsletter API ──────────────────────────────────────────

export interface NewsletterStatus {
  subscribed: boolean;
  status?: string;
  subscribedAt?: string;
}

export const newsletterApi = {
  subscribe: (email: string, displayName?: string, source?: string) =>
    api.post<{ message: string }>('/api/newsletter/subscribe', { email, displayName, source }),

  confirm: (token: string) =>
    api.post<{ message: string }>('/api/newsletter/confirm', { token }),

  unsubscribe: (token: string) =>
    api.post<{ message: string }>('/api/newsletter/unsubscribe', { token }),

  getStatus: () =>
    api.get<NewsletterStatus>('/api/newsletter/status'),
};

// ── Showcase API ───────────────────────────────────────────

export const showcaseApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return api.get<{ entries: unknown[]; total: number }>(
      `/api/showcase${qs ? `?${qs}` : ''}`,
    );
  },

  create: (data: {
    title: string;
    description: string;
    projectId?: string;
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
  }) => api.post<Record<string, unknown>>('/api/showcase', data),
};

// ── Admin API ──────────────────────────────────────────────

export interface AdminDashboardData {
  totalUsers: number;
  activeSubscriptions: number;
  lektionenCount: number;
  toolsCount: number;
  forumCategoriesCount: number;
  officialDocsCount: number;
  featuresCount: number;
  quizzesCount: number;
  challengesCount: number;
  lessonConfigsCount: number;
  projectConfigsCount: number;
  capstoneConfigsCount: number;
  projectTemplatesCount: number;
  playgroundTasksCount: number;
}

export interface AdminLektion {
  id: string;
  titel: string;
  slug: string;
  beschreibung: string | null;
  content: string;
  kategorie: string;
  reihenfolge: number;
  status: string;
  publishedAt: string | null;
  autorId: string;
  createdAt: string;
  updatedAt: string;
  autor?: { displayName: string; email: string };
}

export interface AdminTool {
  id: string;
  name: string;
  slug: string;
  beschreibung: string | null;
  content: string | null;
  kategorie: string;
  icon: string;
  reihenfolge: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchResult {
  title: string;
  url: string;
  excerpt: string;
  source: string;
  relevance: number;
}

export interface ResearchHistoryEntry {
  id: string;
  topic: string;
  quelle: string;
  ergebnis: unknown;
  createdAt: string;
  user?: { displayName: string };
}

// ── Agent Monitoring Types ──────────────────────────────────

export interface AgentRun {
  id: string;
  status: 'running' | 'completed' | 'failed';
  trigger: 'cron' | 'manual';
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  qualityScore: number | null;
  sourcesTotal: number;
  sourcesTier1: number;
  sourcesTier2: number;
  sourcesTier3: number;
  lessonsCreated: number;
  emailsCreated: number;
  socialPostsCreated: number;
  researchTopics: string[];
  summary: string | null;
  errorLog: string | null;
  rawOutput?: string | null;
  createdAt: string;
}

export interface AgentStatus {
  isRunning: boolean;
  currentRun?: AgentRun;
}

// ── Admin User Types ────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  avatarEmoji: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  subscription?: { status: string; isLifetime: boolean } | null;
}

export interface AdminSubscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  status: string;
  isLifetime: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  promoCodeId: string | null;
  createdAt: string;
  user: { id: string; email: string; displayName: string };
  promoCode: { code: string } | null;
}

export interface AdminPromoCode {
  id: string;
  code: string;
  description: string | null;
  durationMonths: number;
  maxUses: number | null;
  timesUsed: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  _count?: { subscriptions: number };
}

export interface AdminForumThread {
  id: string;
  categoryId: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: string;
  lastActivityAt: string;
  pinned: boolean;
  author: { id: string; displayName: string; email: string };
  _count: { replies: number };
}

export interface AdminShowcaseEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  approved: boolean;
  createdAt: string;
  user: { id: string; displayName: string; email: string };
}

export interface AdminPattern {
  id: string;
  title: string;
  description: string;
  category: string;
  snippet: string;
  language: string | null;
  tags: string[];
  useCase: string | null;
  createdAt: string;
  author: { id: string; displayName: string; email: string };
}

export interface AdminAnalyticsOverview {
  totalEvents: number;
  events7d: number;
  events30d: number;
  activeUsers: number;
  eventsByType: { type: string; count: number }[];
  recentEvents: Array<{
    id: string;
    type: string;
    timestamp: string;
    metadata: unknown;
    user: { displayName: string; email: string };
  }>;
}

export interface AdminNewsletterSubscriber {
  id: string;
  email: string;
  displayName: string | null;
  status: string;
  source: string;
  subscribedAt: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
}

export interface AdminNewsletterStats {
  total: number;
  active: number;
  pending: number;
  unsubscribed: number;
}

export interface AdminSubscriptionStats {
  active: number;
  lifetime: number;
  trialing: number;
  canceled: number;
  total: number;
}

// Forum Category Config
export interface AdminForumCategory {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Official Doc
export interface AdminOfficialDoc {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string | null;
  lang: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Feature Reference
export interface AdminFeature {
  id: string;
  featureId: string;
  name: string;
  category: string;
  description: string;
  details: string | null;
  tips: string[];
  example: string;
  documentation: string;
  tags: string[];
  lastUpdate: boolean;
  bannerLabel: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Quiz Config
export interface AdminQuiz {
  id: string;
  quizId: string;
  lessonId: number;
  title: string;
  type: string;
  points: number;
  passingScore: number;
  maxAttempts: number;
  questions: unknown[];
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Challenge Config
export interface AdminChallenge {
  id: string;
  challengeId: string;
  title: string;
  description: string;
  category: string;
  source: string;
  difficulty: string;
  timeLimit: number;
  points: number;
  instruction: string;
  starterCode: string;
  language: string;
  hints: string[];
  validations: unknown[];
  solution: string;
  relatedLessons: number[];
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Lesson Config
export interface AdminLessonConfig {
  id: string;
  lessonId: number;
  level: number;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  content: unknown[];
  track: string;
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Project Config
export interface AdminProjectConfig {
  id: string;
  projectId: string;
  level: number;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  requirements: string[];
  starterCode: string | null;
  hints: string[];
  solution: string | null;
  resources: string[];
  validationMeta: unknown;
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Capstone Config
export interface AdminCapstoneConfig {
  id: string;
  capstoneId: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedHours: number;
  techStack: string[];
  requirements: string[];
  steps: unknown[];
  thumbnailEmoji: string | null;
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Project Template Config
export interface AdminProjectTemplate {
  id: string;
  templateId: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedHours: number;
  techStack: string[];
  features: string[];
  claudeMd: string;
  fileStructure: string | null;
  steps: unknown[];
  githubUrl: string | null;
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Playground Task Config
export interface AdminPlaygroundTask {
  id: string;
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  instruction: string;
  requirements: string[];
  mode: string;
  language: string;
  starterCode: string;
  hints: string[];
  validationMeta: unknown[];
  scenarioMeta: unknown | null;
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const adminApi = {
  getDashboard: () =>
    api.get<{ success: boolean; data: AdminDashboardData }>('/api/admin/dashboard'),

  getLektionen: (params?: { kategorie?: string; status?: string; search?: string }) => {
    const search = new URLSearchParams();
    if (params?.kategorie && params.kategorie !== 'all') search.set('kategorie', params.kategorie);
    if (params?.status && params.status !== 'all') search.set('status', params.status);
    if (params?.search) search.set('search', params.search);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminLektion[]; count: number }>(
      `/api/admin/lektionen${qs ? `?${qs}` : ''}`,
    );
  },

  getLektion: (id: string) =>
    api.get<{ success: boolean; data: AdminLektion }>(`/api/admin/lektionen/${id}`),

  createLektion: (data: {
    titel: string;
    slug: string;
    beschreibung?: string;
    content: string;
    kategorie?: string;
    reihenfolge?: number;
    status?: string;
  }) => api.post<{ success: boolean; data: AdminLektion }>('/api/admin/lektionen', data),

  updateLektion: (id: string, data: Partial<{
    titel: string;
    slug: string;
    beschreibung: string;
    content: string;
    kategorie: string;
    reihenfolge: number;
    status: string;
  }>) => api.put<{ success: boolean; data: AdminLektion }>(`/api/admin/lektionen/${id}`, data),

  deleteLektion: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/lektionen/${id}`),

  getTools: (params?: { kategorie?: string; search?: string }) => {
    const search = new URLSearchParams();
    if (params?.kategorie && params.kategorie !== 'all') search.set('kategorie', params.kategorie);
    if (params?.search) search.set('search', params.search);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminTool[]; count: number }>(
      `/api/admin/tools${qs ? `?${qs}` : ''}`,
    );
  },

  createTool: (data: {
    name: string;
    slug: string;
    beschreibung?: string;
    content?: string;
    kategorie?: string;
    icon?: string;
    reihenfolge?: number;
    status?: string;
  }) => api.post<{ success: boolean; data: AdminTool }>('/api/admin/tools', data),

  deleteTool: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/tools/${id}`),

  triggerResearch: (topic: string, quelle: string) =>
    api.post<{ success: boolean; data: { results: ResearchResult[] } }>(
      '/api/admin/research/trigger',
      { topic, quelle },
    ),

  getResearchHistory: (limit?: number) =>
    api.get<{ success: boolean; data: ResearchHistoryEntry[] }>(
      `/api/admin/research/history${limit ? `?limit=${limit}` : ''}`,
    ),

  // Agent Monitoring
  getAgentRuns: (params?: { limit?: number; status?: string }) => {
    const search = new URLSearchParams();
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.status && params.status !== 'all') search.set('status', params.status);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AgentRun[] }>(
      `/api/admin/agent/runs${qs ? `?${qs}` : ''}`,
    );
  },

  getAgentRun: (id: string) =>
    api.get<{ success: boolean; data: AgentRun }>(`/api/admin/agent/runs/${id}`),

  getAgentStatus: () =>
    api.get<{ success: boolean; data: AgentStatus }>('/api/admin/agent/status'),

  triggerAgent: () =>
    api.post<{ success: boolean; data: { runId: string; message: string } }>(
      '/api/admin/agent/trigger',
    ),

  // Tool Update
  updateTool: (id: string, data: Partial<{
    name: string;
    slug: string;
    beschreibung: string;
    content: string;
    kategorie: string;
    icon: string;
    reihenfolge: number;
    status: string;
  }>) => api.put<{ success: boolean; data: AdminTool }>(`/api/admin/tools/${id}`, data),

  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.search) search.set('search', params.search);
    if (params?.role && params.role !== 'all') search.set('role', params.role);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminUser[]; total: number; page: number; limit: number }>(
      `/api/admin/users${qs ? `?${qs}` : ''}`,
    );
  },

  getUser: (id: string) =>
    api.get<{ success: boolean; data: AdminUser }>(`/api/admin/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    api.put<{ success: boolean; data: AdminUser }>(`/api/admin/users/${id}/role`, { role }),

  deleteUser: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/users/${id}`),

  // Subscriptions
  getSubscriptions: (params?: { status?: string }) => {
    const search = new URLSearchParams();
    if (params?.status && params.status !== 'all') search.set('status', params.status);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminSubscription[] }>(
      `/api/admin/subscriptions${qs ? `?${qs}` : ''}`,
    );
  },

  getSubscriptionStats: () =>
    api.get<{ success: boolean; data: AdminSubscriptionStats }>('/api/admin/subscriptions/stats'),

  // Promo Codes
  getPromoCodes: () =>
    api.get<{ success: boolean; data: AdminPromoCode[] }>('/api/admin/promo-codes'),

  createPromoCode: (data: {
    code: string;
    description?: string;
    durationMonths?: number;
    maxUses?: number | null;
    active?: boolean;
    expiresAt?: string;
  }) => api.post<{ success: boolean; data: AdminPromoCode }>('/api/admin/promo-codes', data),

  updatePromoCode: (id: string, data: Partial<{
    code: string;
    description: string;
    durationMonths: number;
    maxUses: number | null;
    active: boolean;
    expiresAt: string | null;
  }>) => api.put<{ success: boolean; data: AdminPromoCode }>(`/api/admin/promo-codes/${id}`, data),

  deletePromoCode: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/promo-codes/${id}`),

  // Forum
  getForumThreads: () =>
    api.get<{ success: boolean; data: AdminForumThread[] }>('/api/admin/forum/threads'),

  toggleThreadPin: (id: string) =>
    api.put<{ success: boolean; data: AdminForumThread }>(`/api/admin/forum/threads/${id}/pin`),

  deleteForumThread: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/forum/threads/${id}`),

  deleteForumReply: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/forum/replies/${id}`),

  // Showcase
  getShowcaseEntries: () =>
    api.get<{ success: boolean; data: AdminShowcaseEntry[] }>('/api/admin/showcase'),

  toggleShowcaseApproval: (id: string) =>
    api.put<{ success: boolean; data: AdminShowcaseEntry }>(`/api/admin/showcase/${id}/approve`),

  deleteShowcaseEntry: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/showcase/${id}`),

  // Patterns
  getPatterns: () =>
    api.get<{ success: boolean; data: AdminPattern[] }>('/api/admin/patterns'),

  deletePattern: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/patterns/${id}`),

  // Analytics
  getAnalyticsOverview: () =>
    api.get<{ success: boolean; data: AdminAnalyticsOverview }>('/api/admin/analytics/overview'),

  // Newsletter
  getNewsletterSubscribers: (params?: { status?: string }) => {
    const search = new URLSearchParams();
    if (params?.status && params.status !== 'all') search.set('status', params.status);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminNewsletterSubscriber[] }>(
      `/api/admin/newsletter/subscribers${qs ? `?${qs}` : ''}`,
    );
  },

  getNewsletterStats: () =>
    api.get<{ success: boolean; data: AdminNewsletterStats }>('/api/admin/newsletter/stats'),

  deleteNewsletterSubscriber: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/newsletter/subscribers/${id}`),

  // Forum Categories
  getForumCategories: () =>
    api.get<{ success: boolean; data: AdminForumCategory[] }>('/api/admin/forum-categories'),

  createForumCategory: (data: Partial<AdminForumCategory>) =>
    api.post<{ success: boolean; data: AdminForumCategory }>('/api/admin/forum-categories', data),

  updateForumCategory: (id: string, data: Partial<AdminForumCategory>) =>
    api.put<{ success: boolean; data: AdminForumCategory }>(`/api/admin/forum-categories/${id}`, data),

  deleteForumCategory: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/forum-categories/${id}`),

  // Official Docs
  getOfficialDocs: () =>
    api.get<{ success: boolean; data: AdminOfficialDoc[] }>('/api/admin/official-docs'),

  createOfficialDoc: (data: Partial<AdminOfficialDoc>) =>
    api.post<{ success: boolean; data: AdminOfficialDoc }>('/api/admin/official-docs', data),

  updateOfficialDoc: (id: string, data: Partial<AdminOfficialDoc>) =>
    api.put<{ success: boolean; data: AdminOfficialDoc }>(`/api/admin/official-docs/${id}`, data),

  deleteOfficialDoc: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/official-docs/${id}`),

  // Features
  getFeatures: () =>
    api.get<{ success: boolean; data: AdminFeature[] }>('/api/admin/features'),

  createFeature: (data: Partial<AdminFeature>) =>
    api.post<{ success: boolean; data: AdminFeature }>('/api/admin/features', data),

  updateFeature: (id: string, data: Partial<AdminFeature>) =>
    api.put<{ success: boolean; data: AdminFeature }>(`/api/admin/features/${id}`, data),

  deleteFeature: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/features/${id}`),

  // Quizzes
  getQuizzes: (params?: { lessonId?: number }) => {
    const search = new URLSearchParams();
    if (params?.lessonId !== undefined) search.set('lessonId', String(params.lessonId));
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminQuiz[] }>(
      `/api/admin/quizzes${qs ? `?${qs}` : ''}`,
    );
  },

  createQuiz: (data: Partial<AdminQuiz>) =>
    api.post<{ success: boolean; data: AdminQuiz }>('/api/admin/quizzes', data),

  updateQuiz: (id: string, data: Partial<AdminQuiz>) =>
    api.put<{ success: boolean; data: AdminQuiz }>(`/api/admin/quizzes/${id}`, data),

  deleteQuiz: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/quizzes/${id}`),

  // Challenges
  getChallenges: (params?: { source?: string; category?: string }) => {
    const search = new URLSearchParams();
    if (params?.source) search.set('source', params.source);
    if (params?.category) search.set('category', params.category);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminChallenge[] }>(
      `/api/admin/challenges${qs ? `?${qs}` : ''}`,
    );
  },

  createChallenge: (data: Partial<AdminChallenge>) =>
    api.post<{ success: boolean; data: AdminChallenge }>('/api/admin/challenges', data),

  updateChallenge: (id: string, data: Partial<AdminChallenge>) =>
    api.put<{ success: boolean; data: AdminChallenge }>(`/api/admin/challenges/${id}`, data),

  deleteChallenge: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/challenges/${id}`),

  // Lesson Configs
  getLessonConfigs: (params?: { track?: string; level?: number }) => {
    const search = new URLSearchParams();
    if (params?.track) search.set('track', params.track);
    if (params?.level !== undefined) search.set('level', String(params.level));
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminLessonConfig[] }>(
      `/api/admin/lesson-configs${qs ? `?${qs}` : ''}`,
    );
  },

  createLessonConfig: (data: Partial<AdminLessonConfig>) =>
    api.post<{ success: boolean; data: AdminLessonConfig }>('/api/admin/lesson-configs', data),

  updateLessonConfig: (id: string, data: Partial<AdminLessonConfig>) =>
    api.put<{ success: boolean; data: AdminLessonConfig }>(`/api/admin/lesson-configs/${id}`, data),

  deleteLessonConfig: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/lesson-configs/${id}`),

  // Project Configs
  getProjectConfigs: (params?: { level?: number }) => {
    const search = new URLSearchParams();
    if (params?.level !== undefined) search.set('level', String(params.level));
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminProjectConfig[] }>(
      `/api/admin/project-configs${qs ? `?${qs}` : ''}`,
    );
  },

  createProjectConfig: (data: Partial<AdminProjectConfig>) =>
    api.post<{ success: boolean; data: AdminProjectConfig }>('/api/admin/project-configs', data),

  updateProjectConfig: (id: string, data: Partial<AdminProjectConfig>) =>
    api.put<{ success: boolean; data: AdminProjectConfig }>(`/api/admin/project-configs/${id}`, data),

  deleteProjectConfig: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/project-configs/${id}`),

  // Capstone Configs
  getCapstoneConfigs: () =>
    api.get<{ success: boolean; data: AdminCapstoneConfig[] }>('/api/admin/capstone-configs'),

  createCapstoneConfig: (data: Partial<AdminCapstoneConfig>) =>
    api.post<{ success: boolean; data: AdminCapstoneConfig }>('/api/admin/capstone-configs', data),

  updateCapstoneConfig: (id: string, data: Partial<AdminCapstoneConfig>) =>
    api.put<{ success: boolean; data: AdminCapstoneConfig }>(`/api/admin/capstone-configs/${id}`, data),

  deleteCapstoneConfig: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/capstone-configs/${id}`),

  // Project Templates
  getProjectTemplates: () =>
    api.get<{ success: boolean; data: AdminProjectTemplate[] }>('/api/admin/project-templates'),

  createProjectTemplate: (data: Partial<AdminProjectTemplate>) =>
    api.post<{ success: boolean; data: AdminProjectTemplate }>('/api/admin/project-templates', data),

  updateProjectTemplate: (id: string, data: Partial<AdminProjectTemplate>) =>
    api.put<{ success: boolean; data: AdminProjectTemplate }>(`/api/admin/project-templates/${id}`, data),

  deleteProjectTemplate: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/project-templates/${id}`),

  // Playground Tasks
  getPlaygroundTasks: (params?: { projectId?: string }) => {
    const search = new URLSearchParams();
    if (params?.projectId) search.set('projectId', params.projectId);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminPlaygroundTask[] }>(
      `/api/admin/playground-tasks${qs ? `?${qs}` : ''}`,
    );
  },

  createPlaygroundTask: (data: Partial<AdminPlaygroundTask>) =>
    api.post<{ success: boolean; data: AdminPlaygroundTask }>('/api/admin/playground-tasks', data),

  updatePlaygroundTask: (id: string, data: Partial<AdminPlaygroundTask>) =>
    api.put<{ success: boolean; data: AdminPlaygroundTask }>(`/api/admin/playground-tasks/${id}`, data),

  deletePlaygroundTask: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/playground-tasks/${id}`),
};

// ── Content API ────────────────────────────────────────────

export const contentApi = {
  getForumCategories: () =>
    api.get<{ success: boolean; data: AdminForumCategory[] }>('/api/content/forum-categories'),

  getOfficialDocs: () =>
    api.get<{ success: boolean; data: AdminOfficialDoc[] }>('/api/content/official-docs'),

  getFeatures: (params?: { category?: string; search?: string }) => {
    const search = new URLSearchParams();
    if (params?.category) search.set('category', params.category);
    if (params?.search) search.set('search', params.search);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminFeature[] }>(
      `/api/content/features${qs ? `?${qs}` : ''}`,
    );
  },

  getQuizzes: (params?: { lessonId?: number }) => {
    const search = new URLSearchParams();
    if (params?.lessonId !== undefined) search.set('lessonId', String(params.lessonId));
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminQuiz[] }>(
      `/api/content/quizzes${qs ? `?${qs}` : ''}`,
    );
  },

  getChallenges: (params?: { source?: string }) => {
    const search = new URLSearchParams();
    if (params?.source) search.set('source', params.source);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminChallenge[] }>(
      `/api/content/challenges${qs ? `?${qs}` : ''}`,
    );
  },

  getLessons: (params?: { track?: string }) => {
    const search = new URLSearchParams();
    if (params?.track) search.set('track', params.track);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminLessonConfig[] }>(
      `/api/content/lessons${qs ? `?${qs}` : ''}`,
    );
  },

  getLesson: (lessonId: number) =>
    api.get<{ success: boolean; data: AdminLessonConfig }>(`/api/content/lessons/${lessonId}`),

  getProjects: () =>
    api.get<{ success: boolean; data: AdminProjectConfig[] }>('/api/content/projects'),

  getCapstones: () =>
    api.get<{ success: boolean; data: AdminCapstoneConfig[] }>('/api/content/capstones'),

  getProjectTemplates: () =>
    api.get<{ success: boolean; data: AdminProjectTemplate[] }>('/api/content/project-templates'),

  getPlaygroundTasks: (params?: { projectId?: string }) => {
    const search = new URLSearchParams();
    if (params?.projectId) search.set('projectId', params.projectId);
    const qs = search.toString();
    return api.get<{ success: boolean; data: AdminPlaygroundTask[] }>(
      `/api/content/playground-tasks${qs ? `?${qs}` : ''}`,
    );
  },
};

// ── Health Check ────────────────────────────────────────────

export const healthApi = {
  check: () =>
    api.get<{ status: string; database: string }>('/health').catch(() => ({
      status: 'unreachable',
      database: 'unknown',
    })),
};
