import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SRSItem } from '../types';
import { SRS_INTERVALS_DAYS } from '../types';
import { useAnalyticsStore } from './analyticsStore';

interface SRSStore {
  items: Record<number, SRSItem>;
  addLessonToSRS: (lessonId: number) => void;
  getDueLessonIds: () => number[];
  getItem: (lessonId: number) => SRSItem | undefined;
  recordReview: (lessonId: number, remembered: boolean) => void;
  getDueCount: () => number;
}

function getEndOfTodayISO(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function addDays(date: Date, days: number): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

export const useSRSStore = create<SRSStore>()(
  persist(
    (set, get) => ({
      items: {},

      addLessonToSRS: (lessonId: number) =>
        set((state) => {
          if (state.items[lessonId]) return state;
          const next = addDays(new Date(), SRS_INTERVALS_DAYS[0]);
          return {
            items: {
              ...state.items,
              [lessonId]: {
                lessonId,
                nextReviewAt: next.toISOString(),
                intervalIndex: 0,
                timesReviewed: 0,
              },
            },
          };
        }),

      getDueLessonIds: () => {
        const endOfToday = getEndOfTodayISO();
        return Object.values(get().items)
          .filter((item) => item.nextReviewAt <= endOfToday)
          .map((item) => item.lessonId)
          .sort((a, b) => a - b);
      },

      getItem: (lessonId: number) => get().items[lessonId] ?? undefined,

      recordReview: (lessonId: number, remembered: boolean) =>
        set((state) => {
          const item = state.items[lessonId];
          if (!item) return state;
          // Log analytics event
          useAnalyticsStore.getState().logEvent('review_complete', { lessonId });
          const now = new Date().toISOString();
          const intervals = SRS_INTERVALS_DAYS;
          let nextReviewAt: string;
          let intervalIndex: number;
          if (remembered) {
            const nextIdx = Math.min(item.intervalIndex + 1, intervals.length - 1);
            intervalIndex = nextIdx;
            nextReviewAt = addDays(new Date(), intervals[nextIdx]).toISOString();
          } else {
            intervalIndex = 0;
            nextReviewAt = addDays(new Date(), intervals[0]).toISOString();
          }
          return {
            items: {
              ...state.items,
              [lessonId]: {
                ...item,
                nextReviewAt,
                intervalIndex,
                lastReviewedAt: now,
                timesReviewed: item.timesReviewed + 1,
              },
            },
          };
        }),

      getDueCount: () => get().getDueLessonIds().length,
    }),
    { name: 'claude-code-masterkurs-srs' }
  )
);
