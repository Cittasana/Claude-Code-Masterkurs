import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, QuizResult, ProjectResult } from '../types';
import { useAnalyticsStore } from './analyticsStore';
import { progressApi, ApiError } from '../lib/api';

interface UserProgressStore extends UserProgress {
  // Actions
  completeLesson: (lessonId: number) => void;
  completeQuiz: (result: QuizResult) => void;
  completeProject: (result: ProjectResult) => void;
  setCurrentLesson: (lessonId: number) => void;
  incrementStreak: () => void;
  addTimeInvested: (minutes: number) => void;
  updateSkillProgress: (skill: keyof UserProgress['skillProgress'], value: number) => void;
  resetProgress: () => void;
  getQuizResult: (quizId: string) => QuizResult | undefined;
  getProjectResult: (projectId: string) => ProjectResult | undefined;
  /** Video Content Integration: mark in-lesson video as watched */
  markVideoWatched: (lessonId: number, blockIndex: number) => void;
  isVideoWatched: (lessonId: number, blockIndex: number) => boolean;
  /** Fortschritt vom Server laden (wenn eingeloggt) */
  syncFromServer: () => Promise<void>;
  /** Fortschritt zum Server pushen (wenn eingeloggt) */
  syncToServer: () => Promise<void>;
}

/** Prüft ob der User eingeloggt ist (liest Token aus dem Auth-Store) */
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

/** Sync zum Server im Hintergrund (Fire-and-Forget) */
function syncInBackground(data: Record<string, unknown>) {
  if (!isLoggedIn()) return;
  progressApi.update(data).catch(() => {
    // Silently fail – LocalStorage ist der primäre Speicher
  });
}

const initialState: UserProgress = {
  lessonsCompleted: [],
  quizzesCompleted: [],
  projectsCompleted: [],
  currentLesson: 0,
  totalPoints: 0,
  streak: 0,
  lastSessionDate: new Date().toISOString(),
  timeInvested: 0,
  skillProgress: {
    installation: 0,
    claudeMd: 0,
    mcpIntegration: 0,
    customAgents: 0,
    productionReady: 0,
  },
};

export const useUserProgress = create<UserProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeLesson: (lessonId: number) =>
        set((state) => {
          if (state.lessonsCompleted.includes(lessonId)) {
            return state;
          }
          // Log analytics event
          useAnalyticsStore.getState().logEvent('lesson_complete', { lessonId });
          const newLessons = [...state.lessonsCompleted, lessonId].sort((a, b) => a - b);
          // Sync zum Server
          syncInBackground({ lessonsCompleted: newLessons });
          return {
            lessonsCompleted: newLessons,
          };
        }),

      completeQuiz: (result: QuizResult) =>
        set((state) => {
          const existingIndex = state.quizzesCompleted.findIndex(
            (q) => q.quizId === result.quizId
          );

          let newQuizzes;
          let oldScore = 0;
          if (existingIndex >= 0) {
            oldScore = state.quizzesCompleted[existingIndex].score;
            newQuizzes = [...state.quizzesCompleted];
            newQuizzes[existingIndex] = result;
          } else {
            newQuizzes = [...state.quizzesCompleted, result];
          }

          // Log analytics event
          useAnalyticsStore.getState().logEvent('quiz_complete', {
            quizId: result.quizId,
            lessonId: result.lessonId,
            score: result.score,
          });

          const newPoints = state.totalPoints - oldScore + result.score;

          // Sync Quiz-Ergebnis zum Server
          if (isLoggedIn()) {
            progressApi.saveQuiz({
              quizId: result.quizId,
              lessonId: result.lessonId,
              score: result.score,
              attempts: result.attempts,
              completed: result.completed,
            }).catch(() => {});
            syncInBackground({ totalPoints: newPoints });
          }

          return {
            quizzesCompleted: newQuizzes,
            totalPoints: newPoints,
          };
        }),

      completeProject: (result: ProjectResult) =>
        set((state) => {
          const existingIndex = state.projectsCompleted.findIndex(
            (p) => p.projectId === result.projectId
          );

          let newProjects;
          let oldScore = 0;
          if (existingIndex >= 0) {
            oldScore = state.projectsCompleted[existingIndex].score;
            newProjects = [...state.projectsCompleted];
            newProjects[existingIndex] = result;
          } else {
            newProjects = [...state.projectsCompleted, result];
          }

          // Log analytics event
          useAnalyticsStore.getState().logEvent('project_complete', {
            projectId: result.projectId,
            score: result.score,
          });

          const newPoints = state.totalPoints - oldScore + result.score;

          // Sync Projekt-Ergebnis zum Server
          if (isLoggedIn()) {
            progressApi.saveProject({
              projectId: result.projectId,
              completed: result.completed,
              score: result.score,
              validationResults: result.validationResults,
            }).catch(() => {});
            syncInBackground({ totalPoints: newPoints });
          }

          return {
            projectsCompleted: newProjects,
            totalPoints: newPoints,
          };
        }),

      setCurrentLesson: (lessonId: number) =>
        set({
          currentLesson: lessonId,
        }),

      incrementStreak: () =>
        set((state) => {
          const lastSession = new Date(state.lastSessionDate);
          const today = new Date();
          // Use calendar day comparison instead of raw timestamp diff
          const lastDay = new Date(lastSession.getFullYear(), lastSession.getMonth(), lastSession.getDate());
          const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const daysDiff = Math.round((todayDay.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

          let newStreak = state.streak;
          if (state.streak === 0) {
            // First visit ever
            newStreak = 1;
          } else if (daysDiff === 1) {
            newStreak = state.streak + 1;
          } else if (daysDiff > 1) {
            newStreak = 1;
          }

          return {
            streak: newStreak,
            lastSessionDate: today.toISOString(),
          };
        }),

      addTimeInvested: (minutes: number) =>
        set((state) => {
          const newTime = state.timeInvested + minutes;
          syncInBackground({ timeInvested: newTime });
          return { timeInvested: newTime };
        }),

      updateSkillProgress: (skill, value) =>
        set((state) => ({
          skillProgress: {
            ...state.skillProgress,
            [skill]: value,
          },
        })),

      resetProgress: () => set({ ...initialState, lastSessionDate: new Date().toISOString() }),

      getQuizResult: (quizId: string) => {
        return get().quizzesCompleted.find((q) => q.quizId === quizId);
      },

      getProjectResult: (projectId: string) => {
        return get().projectsCompleted.find((p) => p.projectId === projectId);
      },

      markVideoWatched: (lessonId: number, blockIndex: number) =>
        set((state) => {
          const key = `${lessonId}-${blockIndex}`;
          const current = state.videosWatched ?? {};
          if (current[key]) return state;
          return { videosWatched: { ...current, [key]: true } };
        }),

      isVideoWatched: (lessonId: number, blockIndex: number) => {
        const key = `${lessonId}-${blockIndex}`;
        return Boolean(get().videosWatched?.[key]);
      },

      syncFromServer: async () => {
        if (!isLoggedIn()) return;
        try {
          const data = await progressApi.get();
          if (!data) return;
          const state = get();

          // Quiz- und Projekt-Ergebnisse vom Server mappen (timestamp als ISO-String)
          const serverQuizzes: QuizResult[] = (data.quizzesCompleted as Array<Record<string, unknown>> || []).map(
            (q) => ({
              quizId: String(q.quizId),
              lessonId: Number(q.lessonId),
              score: Number(q.score),
              attempts: Number(q.attempts),
              completed: Boolean(q.completed),
              timestamp: typeof q.timestamp === 'string' ? q.timestamp : (q.timestamp ? new Date(q.timestamp as string | Date).toISOString() : new Date().toISOString()),
            })
          );
          const serverProjects: ProjectResult[] = (data.projectsCompleted as Array<Record<string, unknown>> || []).map(
            (p) => ({
              projectId: String(p.projectId),
              completed: Boolean(p.completed),
              score: Number(p.score),
              timestamp: typeof p.timestamp === 'string' ? p.timestamp : (p.timestamp ? new Date(p.timestamp as string | Date).toISOString() : new Date().toISOString()),
              validationResults: Array.isArray(p.validationResults)
                ? (p.validationResults as { testName: string; passed: boolean; points: number }[])
                : [],
            })
          );

          // MERGE-Strategie: Behalte den BESSEREN Wert (lokal ODER Server)
          const serverLessons = (data.lessonsCompleted as number[]) || [];
          // Vereinige lokale + Server-Lektionen (de-dupliziert)
          const mergedLessons = [...new Set([...state.lessonsCompleted, ...serverLessons])].sort((a, b) => a - b);

          // Quizzes: Merge nach quizId, behalte höheren Score
          const quizMap = new Map<string, QuizResult>();
          for (const q of state.quizzesCompleted) quizMap.set(q.quizId, q);
          for (const q of serverQuizzes) {
            const existing = quizMap.get(q.quizId);
            if (!existing || q.score > existing.score) quizMap.set(q.quizId, q);
          }
          const mergedQuizzes = [...quizMap.values()];

          // Projekte: Merge nach projectId, behalte höheren Score
          const projMap = new Map<string, ProjectResult>();
          for (const p of state.projectsCompleted) projMap.set(p.projectId, p);
          for (const p of serverProjects) {
            const existing = projMap.get(p.projectId);
            if (!existing || p.score > existing.score) projMap.set(p.projectId, p);
          }
          const mergedProjects = [...projMap.values()];

          set({
            lessonsCompleted: mergedLessons,
            quizzesCompleted: mergedQuizzes,
            projectsCompleted: mergedProjects,
            currentLesson: Math.max(state.currentLesson, (data.currentLesson as number) || 0),
            totalPoints: Math.max(state.totalPoints, (data.totalPoints as number) || 0),
            streak: Math.max(state.streak, (data.streak as number) || 0),
            lastSessionDate: (data.lastSessionDate as string) ?? state.lastSessionDate,
            timeInvested: Math.max(state.timeInvested, (data.timeInvested as number) || 0),
            skillProgress: (data.skillProgress as typeof state.skillProgress) ?? state.skillProgress,
            videosWatched: { ...(state.videosWatched || {}), ...((data.videosWatched as typeof state.videosWatched) || {}) },
          });

          // Merged-Daten zurück zum Server pushen (damit Server auch aktuell ist)
          syncInBackground({
            lessonsCompleted: mergedLessons,
            totalPoints: Math.max(state.totalPoints, (data.totalPoints as number) || 0),
            streak: Math.max(state.streak, (data.streak as number) || 0),
            timeInvested: Math.max(state.timeInvested, (data.timeInvested as number) || 0),
          });
        } catch (err) {
          if (err instanceof ApiError && err.status === 404) return; // Noch kein Fortschritt auf dem Server
          // Server nicht erreichbar – LocalStorage-Daten behalten
        }
      },

      syncToServer: async () => {
        if (!isLoggedIn()) return;
        const state = get();
        try {
          await progressApi.update({
            lessonsCompleted: state.lessonsCompleted,
            currentLesson: state.currentLesson,
            totalPoints: state.totalPoints,
            streak: state.streak,
            timeInvested: state.timeInvested,
            skillProgress: state.skillProgress,
          });
        } catch {
          // Silently fail
        }
      },
    }),
    {
      name: 'claude-code-masterkurs-progress',
    }
  )
);
