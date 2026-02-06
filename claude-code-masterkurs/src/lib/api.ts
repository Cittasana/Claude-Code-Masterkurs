// ─────────────────────────────────────────────────────────────
// API Client – Zentraler fetch-Wrapper mit Auth-Header
// ─────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

// ── Health Check ────────────────────────────────────────────

export const healthApi = {
  check: () =>
    api.get<{ status: string; database: string }>('/health').catch(() => ({
      status: 'unreachable',
      database: 'unknown',
    })),
};
