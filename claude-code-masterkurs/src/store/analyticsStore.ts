import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analyticsApi } from '../lib/api';

// ── Helpers ─────────────────────────────────────────────────────────

function isLoggedIn(): boolean {
  try {
    const stored = localStorage.getItem('claude-code-auth');
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return !!parsed?.state?.token;
  } catch {
    return false;
  }
}

// ── Types ──────────────────────────────────────────────────────────

export type ActivityType =
  | 'lesson_complete'
  | 'quiz_complete'
  | 'project_complete'
  | 'session_start'
  | 'review_complete';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  timestamp: string; // ISO
  metadata?: {
    lessonId?: number;
    quizId?: string;
    projectId?: string;
    score?: number;
    duration?: number; // minutes
  };
}

/** Day key format: "YYYY-MM-DD" */
export type DailyActivityMap = Record<string, number>;

export interface WeeklyGoal {
  lessonsPerWeek: number;
  quizzesPerWeek: number;
}

// ── Store ──────────────────────────────────────────────────────────

interface AnalyticsStore {
  events: ActivityEvent[];
  weeklyGoal: WeeklyGoal;
  // Actions
  logEvent: (type: ActivityType, metadata?: ActivityEvent['metadata']) => void;
  /** Server-Events laden (wenn eingeloggt) und in den Store übernehmen */
  loadFromServer: () => Promise<void>;
  setWeeklyGoal: (goal: Partial<WeeklyGoal>) => void;
  // Computed helpers
  getActivityMap: () => DailyActivityMap;
  getEventsInRange: (startISO: string, endISO: string) => ActivityEvent[];
  getEventsByType: (type: ActivityType) => ActivityEvent[];
  getWeeklyActivity: (weeks: number) => { weekLabel: string; count: number }[];
  getHourlyDistribution: () => number[];
  getDayOfWeekDistribution: () => number[];
  getQuizScoresOverTime: () => { label: string; score: number }[];
  getLearningVelocity: (weeks: number) => { weekLabel: string; lessons: number; quizzes: number }[];
  getStreakHistory: () => { current: number; longest: number; activeDays: number };
  getInsights: () => string[];
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function weekStart(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday start
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatWeekLabel(d: Date): string {
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`;
}

const WEEKDAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export { WEEKDAYS_DE };

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      events: [],
      weeklyGoal: { lessonsPerWeek: 3, quizzesPerWeek: 2 },

      logEvent: (type, metadata) => {
        const event: ActivityEvent = {
          id: uid(),
          type,
          timestamp: new Date().toISOString(),
          metadata,
        };
        set((state) => ({ events: [...state.events, event] }));
        if (isLoggedIn()) {
          analyticsApi.logEvent({ type, metadata: metadata ?? undefined }).catch(() => {});
        }
      },

      loadFromServer: async () => {
        if (!isLoggedIn()) return;
        try {
          const res = await analyticsApi.getEvents({ limit: 1000 });
          const raw = (res?.events ?? []) as Array<{ id?: string; type: string; timestamp: string; metadata?: ActivityEvent['metadata'] }>;
          const events: ActivityEvent[] = raw.map((e) => ({
            id: e.id ?? uid(),
            type: e.type as ActivityType,
            timestamp: e.timestamp,
            metadata: e.metadata,
          }));
          set({ events });
        } catch {
          // Server nicht erreichbar – lokale Events behalten
        }
      },

      setWeeklyGoal: (goal) =>
        set((state) => ({
          weeklyGoal: { ...state.weeklyGoal, ...goal },
        })),

      // ── Computed ─────────────────────────────────────────────

      getActivityMap: () => {
        const map: DailyActivityMap = {};
        for (const ev of get().events) {
          const key = ev.timestamp.slice(0, 10);
          map[key] = (map[key] || 0) + 1;
        }
        return map;
      },

      getEventsInRange: (startISO, endISO) =>
        get().events.filter((e) => e.timestamp >= startISO && e.timestamp <= endISO),

      getEventsByType: (type) => get().events.filter((e) => e.type === type),

      getWeeklyActivity: (weeks) => {
        const result: { weekLabel: string; count: number }[] = [];
        const now = new Date();
        for (let i = weeks - 1; i >= 0; i--) {
          const ws = weekStart(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
          const we = new Date(ws.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
          const count = get().events.filter(
            (e) => e.timestamp >= ws.toISOString() && e.timestamp <= we.toISOString()
          ).length;
          result.push({ weekLabel: formatWeekLabel(ws), count });
        }
        return result;
      },

      getHourlyDistribution: () => {
        const hours = new Array(24).fill(0);
        for (const ev of get().events) {
          const h = new Date(ev.timestamp).getHours();
          hours[h]++;
        }
        return hours;
      },

      getDayOfWeekDistribution: () => {
        const days = new Array(7).fill(0); // Mon=0 ... Sun=6
        for (const ev of get().events) {
          const d = new Date(ev.timestamp).getDay();
          // Convert: Sun=0..Sat=6 → Mon=0..Sun=6
          const idx = d === 0 ? 6 : d - 1;
          days[idx]++;
        }
        return days;
      },

      getQuizScoresOverTime: () => {
        return get()
          .events.filter((e) => e.type === 'quiz_complete' && e.metadata?.score !== undefined)
          .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
          .map((e, i) => ({
            label: `Quiz ${i + 1}`,
            score: e.metadata!.score!,
          }));
      },

      getLearningVelocity: (weeks) => {
        const result: { weekLabel: string; lessons: number; quizzes: number }[] = [];
        const now = new Date();
        for (let i = weeks - 1; i >= 0; i--) {
          const ws = weekStart(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
          const we = new Date(ws.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
          const inRange = get().events.filter(
            (e) => e.timestamp >= ws.toISOString() && e.timestamp <= we.toISOString()
          );
          result.push({
            weekLabel: formatWeekLabel(ws),
            lessons: inRange.filter((e) => e.type === 'lesson_complete').length,
            quizzes: inRange.filter((e) => e.type === 'quiz_complete').length,
          });
        }
        return result;
      },

      getStreakHistory: () => {
        const events = get().events;
        const uniqueDays = new Set(events.map((e) => e.timestamp.slice(0, 10)));
        const sortedDays = [...uniqueDays].sort();

        let longest = 0;
        let current = 0;
        let streak = 1;

        for (let i = 1; i < sortedDays.length; i++) {
          const prev = new Date(sortedDays[i - 1]);
          const curr = new Date(sortedDays[i]);
          const diff = Math.round(
            (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diff === 1) {
            streak++;
          } else {
            if (streak > longest) longest = streak;
            streak = 1;
          }
        }
        if (streak > longest) longest = streak;

        // Check if today is part of the streak
        const today = dayKey(new Date());
        const yesterday = dayKey(
          new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
        if (uniqueDays.has(today)) {
          current = 1;
          let d = new Date();
          d.setDate(d.getDate() - 1);
          while (uniqueDays.has(dayKey(d))) {
            current++;
            d.setDate(d.getDate() - 1);
          }
        } else if (uniqueDays.has(yesterday)) {
          current = 1;
          let d = new Date();
          d.setDate(d.getDate() - 2);
          while (uniqueDays.has(dayKey(d))) {
            current++;
            d.setDate(d.getDate() - 1);
          }
        }

        return {
          current,
          longest: Math.max(longest, current),
          activeDays: uniqueDays.size,
        };
      },

      getInsights: () => {
        const events = get().events;
        const insights: string[] = [];
        if (events.length === 0) {
          insights.push('Starte deine Lernreise! Schließe Lektionen und Quizzes ab, um detaillierte Analytics zu sehen.');
          return insights;
        }

        // Best day
        const dayMap: Record<string, number> = {};
        for (const e of events) {
          const key = e.timestamp.slice(0, 10);
          dayMap[key] = (dayMap[key] || 0) + 1;
        }
        const bestDay = Object.entries(dayMap).sort(([, a], [, b]) => b - a)[0];
        if (bestDay) {
          const d = new Date(bestDay[0]);
          insights.push(
            `Dein produktivster Tag war ${d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })} mit ${bestDay[1]} Aktivitäten.`
          );
        }

        // Peak hours
        const hours = get().getHourlyDistribution();
        const peakHour = hours.indexOf(Math.max(...hours));
        if (Math.max(...hours) > 0) {
          insights.push(
            `Du lernst am häufigsten um ${peakHour}:00 Uhr. ${peakHour >= 6 && peakHour < 12 ? 'Ein Morgenmensch! 🌅' : peakHour >= 12 && peakHour < 18 ? 'Mittags-Lerner! ☀️' : 'Nachteulen-Modus! 🌙'}`
          );
        }

        // Quiz performance trend
        const quizScores = get().getQuizScoresOverTime();
        if (quizScores.length >= 3) {
          const recent = quizScores.slice(-3).reduce((a, b) => a + b.score, 0) / 3;
          const earlier = quizScores.slice(0, 3).reduce((a, b) => a + b.score, 0) / 3;
          if (recent > earlier) {
            insights.push('📈 Deine Quiz-Scores verbessern sich stetig – toll gemacht!');
          } else if (recent < earlier * 0.8) {
            insights.push('💡 Deine letzten Quiz-Scores sind etwas gesunken. Vielleicht hilft eine Wiederholung?');
          }
        }

        // Weekly consistency
        const weeklyData = get().getWeeklyActivity(4);
        const activeWeeks = weeklyData.filter((w) => w.count > 0).length;
        if (activeWeeks === 4) {
          insights.push('🔥 Du warst 4 Wochen in Folge aktiv – hervorragende Konsistenz!');
        } else if (activeWeeks >= 2) {
          insights.push(`Du warst in ${activeWeeks} der letzten 4 Wochen aktiv. Regelmäßigkeit ist der Schlüssel!`);
        }

        // Streak
        const streakData = get().getStreakHistory();
        if (streakData.longest >= 7) {
          insights.push(`🏆 Dein längster Streak: ${streakData.longest} Tage. Beeindruckend!`);
        }

        // Day of week
        const dow = get().getDayOfWeekDistribution();
        const bestDayIdx = dow.indexOf(Math.max(...dow));
        if (Math.max(...dow) > 0) {
          insights.push(
            `${WEEKDAYS_DE[bestDayIdx]} ist dein aktivster Wochentag.`
          );
        }

        return insights.slice(0, 6);
      },
    }),
    { name: 'claude-code-masterkurs-analytics' }
  )
);
