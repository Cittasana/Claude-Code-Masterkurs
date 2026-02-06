import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LeaderboardEntry, LeaderboardBadge, LeaderboardTimeframe, LeaderboardSortBy } from '../types';
import { LEADERBOARD_BADGES } from '../types';
import { seedLeaderboardEntries } from '../data/leaderboardSeed';

interface LeaderboardStore {
  entries: LeaderboardEntry[];
  currentUserProfile: {
    displayName: string;
    avatarEmoji: string;
  };
  /** Initialise with seed data (once) */
  initialised: boolean;
  init: () => void;
  /** Set current user display name & avatar */
  updateProfile: (name: string, emoji: string) => void;
  /** Sync the current user's real progress into the leaderboard */
  syncCurrentUser: (progress: {
    totalPoints: number;
    lessonsCompleted: number;
    quizzesCompleted: number;
    projectsCompleted: number;
    streak: number;
  }) => void;
  /** Get entries sorted for a specific view */
  getSorted: (timeframe: LeaderboardTimeframe, sortBy: LeaderboardSortBy) => LeaderboardEntry[];
  /** Get current user's rank (1-indexed) */
  getCurrentUserRank: (timeframe: LeaderboardTimeframe, sortBy: LeaderboardSortBy) => number;
}

function computeLevel(lessonsCompleted: number): 1 | 2 | 3 {
  if (lessonsCompleted >= 12) return 3;
  if (lessonsCompleted >= 6) return 2;
  return 1;
}

function computeBadges(entry: LeaderboardEntry): LeaderboardBadge[] {
  const badges: LeaderboardBadge[] = [];
  const all = LEADERBOARD_BADGES;
  const addBadge = (id: string) => {
    const badge = all.find(b => b.id === id);
    if (badge) badges.push(badge);
  };
  if (entry.lessonsCompleted >= 1) addBadge('first-lesson');
  if (entry.quizzesCompleted >= 10) addBadge('quiz-master');
  if (entry.streak >= 7) addBadge('streak-7');
  if (entry.streak >= 30) addBadge('streak-30');
  if (entry.projectsCompleted >= 3) addBadge('project-pro');
  if (entry.lessonsCompleted >= 19) addBadge('all-lessons');
  if (entry.level === 3) addBadge('level-3');
  return badges;
}

function sortEntries(entries: LeaderboardEntry[], timeframe: LeaderboardTimeframe, sortBy: LeaderboardSortBy): LeaderboardEntry[] {
  const sorted = [...entries];
  sorted.sort((a, b) => {
    if (timeframe === 'week') return b.weeklyPoints - a.weeklyPoints || b.totalPoints - a.totalPoints;
    if (timeframe === 'month') return b.monthlyPoints - a.monthlyPoints || b.totalPoints - a.totalPoints;
    switch (sortBy) {
      case 'lessons': return b.lessonsCompleted - a.lessonsCompleted || b.totalPoints - a.totalPoints;
      case 'quizzes': return b.quizzesCompleted - a.quizzesCompleted || b.totalPoints - a.totalPoints;
      case 'streak': return b.streak - a.streak || b.totalPoints - a.totalPoints;
      default: return b.totalPoints - a.totalPoints;
    }
  });
  return sorted;
}

const CURRENT_USER_ID = '__current_user__';

export const useLeaderboardStore = create<LeaderboardStore>()(
  persist(
    (set, get) => ({
      entries: [],
      currentUserProfile: {
        displayName: 'Du',
        avatarEmoji: '🧑‍💻',
      },
      initialised: false,

      init: () => {
        if (get().initialised) return;
        const seeds = seedLeaderboardEntries();
        // Add current user placeholder
        const currentUser: LeaderboardEntry = {
          id: CURRENT_USER_ID,
          displayName: get().currentUserProfile.displayName,
          avatarEmoji: get().currentUserProfile.avatarEmoji,
          totalPoints: 0,
          lessonsCompleted: 0,
          quizzesCompleted: 0,
          projectsCompleted: 0,
          streak: 0,
          level: 1,
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          isCurrentUser: true,
          weeklyPoints: 0,
          monthlyPoints: 0,
          badges: [],
        };
        set({ entries: [...seeds, currentUser], initialised: true });
      },

      updateProfile: (name: string, emoji: string) => {
        set((state) => ({
          currentUserProfile: { displayName: name, avatarEmoji: emoji },
          entries: state.entries.map((e) =>
            e.id === CURRENT_USER_ID
              ? { ...e, displayName: name, avatarEmoji: emoji }
              : e
          ),
        }));
      },

      syncCurrentUser: (progress) => {
        set((state) => {
          const existing = state.entries.find((e) => e.id === CURRENT_USER_ID);
          if (!existing) return state;

          const level = computeLevel(progress.lessonsCompleted);
          const updated: LeaderboardEntry = {
            ...existing,
            displayName: state.currentUserProfile.displayName,
            avatarEmoji: state.currentUserProfile.avatarEmoji,
            totalPoints: progress.totalPoints,
            lessonsCompleted: progress.lessonsCompleted,
            quizzesCompleted: progress.quizzesCompleted,
            projectsCompleted: progress.projectsCompleted,
            streak: progress.streak,
            level,
            lastActiveAt: new Date().toISOString(),
            weeklyPoints: progress.totalPoints, // simplified: in a real app this would track weekly delta
            monthlyPoints: progress.totalPoints,
            badges: [],
          };
          updated.badges = computeBadges(updated);

          return {
            entries: state.entries.map((e) =>
              e.id === CURRENT_USER_ID ? updated : e
            ),
          };
        });
      },

      getSorted: (timeframe, sortBy) => {
        return sortEntries(get().entries, timeframe, sortBy);
      },

      getCurrentUserRank: (timeframe, sortBy) => {
        const sorted = sortEntries(get().entries, timeframe, sortBy);
        const idx = sorted.findIndex((e) => e.id === CURRENT_USER_ID);
        return idx >= 0 ? idx + 1 : sorted.length;
      },
    }),
    {
      name: 'claude-code-masterkurs-leaderboard',
    }
  )
);
