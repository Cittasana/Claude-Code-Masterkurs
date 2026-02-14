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

  /** Disconnects the Discord account from the user profile */
  disconnect: () => api.post<{ message: string }>('/api/discord/disconnect'),
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
};

// ── Health Check ────────────────────────────────────────────

export const healthApi = {
  check: () =>
    api.get<{ status: string; database: string }>('/health').catch(() => ({
      status: 'unreachable',
      database: 'unknown',
    })),
};
