import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrackKey } from '../types';
import { DEFAULT_TRACK, TRACKS, PUBLIC_TRACK_KEYS } from '../data/tracks';

// ─────────────────────────────────────────────────────────────
// Track Store — which learning track the user is currently
// viewing. Persisted in localStorage so refresh + tab-restore
// stay on the same track.
//
// Phase 1 of the Multi-Track Plattform plan. The store is the
// single source of truth for "which track am I on" — every
// track-aware page (Dashboard, LessonView, ChallengesView, etc.)
// reads `currentTrack` and filters its data accordingly.
//
// `availableTracks` reflects what the user has paid access to.
// Phase 1 hard-codes it to PUBLIC_TRACK_KEYS (everyone can see
// claude-code + freelancer); Phase 5 wires it to
// Subscription.entitledTracks from the API.
// ─────────────────────────────────────────────────────────────

export interface TrackState {
  /** The track the user is currently viewing. */
  currentTrack: TrackKey;
  /** Tracks the user is allowed to switch to. Phase 1: all public tracks. */
  availableTracks: TrackKey[];
}

interface TrackActions {
  /** Switch the current track. No-op if the key isn't in availableTracks. */
  setCurrentTrack: (track: TrackKey) => void;
  /** Replace the availableTracks set (called by Phase 5 entitlement loader). */
  setAvailableTracks: (tracks: TrackKey[]) => void;
}

type TrackStore = TrackState & TrackActions;

export const useTrackStore = create<TrackStore>()(
  persist(
    (set, get) => ({
      currentTrack: DEFAULT_TRACK,
      availableTracks: PUBLIC_TRACK_KEYS,

      setCurrentTrack: (track) => {
        const { availableTracks } = get();
        if (!availableTracks.includes(track)) return;
        set({ currentTrack: track });
      },

      setAvailableTracks: (tracks) => {
        const next = tracks.filter((t) => t in TRACKS);
        const { currentTrack } = get();
        // If the previously-selected track is no longer entitled, fall
        // back to the first available track (or DEFAULT_TRACK if empty).
        const fallback = next.length > 0 ? next[0] : DEFAULT_TRACK;
        set({
          availableTracks: next,
          currentTrack: next.includes(currentTrack) ? currentTrack : fallback,
        });
      },
    }),
    {
      name: 'masterkurs-track',
      // Only persist the user's chosen track, not the entitlement list —
      // entitlements come from the API on every page load and we don't
      // want a stale localStorage value granting access incorrectly.
      partialize: (state) => ({ currentTrack: state.currentTrack }),
    }
  )
);
