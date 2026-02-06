import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChallengeResult } from '../types';

interface ChallengeStore {
  results: Record<string, ChallengeResult>;
  /** Total points earned from challenges */
  totalChallengePoints: number;

  // Actions
  saveResult: (result: ChallengeResult) => void;
  getResult: (challengeId: string) => ChallengeResult | undefined;
  isCompleted: (challengeId: string) => boolean;
  getCompletedCount: () => number;
  getTotalPoints: () => number;
  resetAll: () => void;
}

export const useChallengeStore = create<ChallengeStore>()(
  persist(
    (set, get) => ({
      results: {},
      totalChallengePoints: 0,

      saveResult: (result: ChallengeResult) =>
        set((state) => {
          const existing = state.results[result.challengeId];
          // Keep best score
          const shouldUpdate =
            !existing || result.score > existing.score;
          if (!shouldUpdate) {
            // Just increment attempts on existing
            return {
              results: {
                ...state.results,
                [result.challengeId]: {
                  ...existing,
                  attempts: existing.attempts + 1,
                },
              },
            };
          }
          const oldScore = existing?.score ?? 0;
          return {
            results: {
              ...state.results,
              [result.challengeId]: result,
            },
            totalChallengePoints:
              state.totalChallengePoints - oldScore + result.score,
          };
        }),

      getResult: (challengeId: string) => get().results[challengeId],

      isCompleted: (challengeId: string) =>
        Boolean(get().results[challengeId]?.completed),

      getCompletedCount: () =>
        Object.values(get().results).filter((r) => r.completed).length,

      getTotalPoints: () => get().totalChallengePoints,

      resetAll: () => set({ results: {}, totalChallengePoints: 0 }),
    }),
    {
      name: 'claude-code-masterkurs-challenges',
    }
  )
);
