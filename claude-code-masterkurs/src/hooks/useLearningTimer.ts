import { useEffect, useRef, useCallback } from 'react';
import { useUserProgress } from '../store/userProgress';
import { useAnalyticsStore } from '../store/analyticsStore';

export type LearningContext = 'lesson' | 'freelancer' | 'playground' | 'challenge' | 'tools';

interface UseLearningTimerOptions {
  context: LearningContext;
}

const IDLE_TIMEOUT = 2 * 60 * 1000; // 2 minutes
const TICK_INTERVAL = 10 * 1000; // 10 seconds
const FLUSH_THRESHOLD = 60; // 60 seconds accumulated before flush
const MIN_FLUSH_SECONDS = 10; // don't flush less than 10s

const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'] as const;

/**
 * Tracks effective learning time with idle detection (2 min timeout).
 * Flushes accumulated seconds to the userProgress store and logs
 * a learning_time analytics event every FLUSH_THRESHOLD seconds.
 */
export function useLearningTimer({ context }: UseLearningTimerOptions) {
  const addTimeInvested = useUserProgress((s) => s.addTimeInvested);
  const logEvent = useAnalyticsStore((s) => s.logEvent);

  // All mutable state lives in a single ref to avoid stale closures
  const state = useRef({
    accumulatedSeconds: 0,
    isActive: true,
    isVisible: true,
    lastActivityTime: Date.now(),
    timerRunning: false,
  });

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flush accumulated time to store + analytics
  const flush = useCallback(() => {
    const seconds = state.current.accumulatedSeconds;
    if (seconds < MIN_FLUSH_SECONDS) return;

    const minutes = Math.round(seconds / 60);
    if (minutes > 0) {
      addTimeInvested(minutes);
    }
    logEvent('learning_time', {
      context,
      duration: seconds,
    });
    state.current.accumulatedSeconds = 0;
  }, [addTimeInvested, logEvent, context]);

  // Mark user as active, reset idle timer
  const onActivity = useCallback(() => {
    state.current.lastActivityTime = Date.now();

    if (!state.current.isActive) {
      state.current.isActive = true;
    }

    // Reset idle timeout
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => {
      state.current.isActive = false;
    }, IDLE_TIMEOUT);
  }, []);

  // Visibility change handler
  const onVisibilityChange = useCallback(() => {
    if (document.hidden) {
      state.current.isVisible = false;
    } else {
      state.current.isVisible = true;
      // Treat tab return as activity
      onActivity();
    }
  }, [onActivity]);

  useEffect(() => {
    // Initialize
    state.current.isActive = true;
    state.current.isVisible = !document.hidden;
    state.current.lastActivityTime = Date.now();
    state.current.accumulatedSeconds = 0;

    // Start idle timeout
    idleRef.current = setTimeout(() => {
      state.current.isActive = false;
    }, IDLE_TIMEOUT);

    // Register activity listeners
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Tick: every 10s, add to accumulated if active & visible
    tickRef.current = setInterval(() => {
      if (state.current.isActive && state.current.isVisible) {
        state.current.accumulatedSeconds += TICK_INTERVAL / 1000;

        // Flush when threshold reached
        if (state.current.accumulatedSeconds >= FLUSH_THRESHOLD) {
          flush();
        }
      }
    }, TICK_INTERVAL);

    // beforeunload: flush remaining time
    const onBeforeUnload = () => {
      flush();
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      // Cleanup
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', onBeforeUnload);

      if (tickRef.current) clearInterval(tickRef.current);
      if (idleRef.current) clearTimeout(idleRef.current);

      // Flush remaining on unmount
      flush();
    };
  }, [onActivity, onVisibilityChange, flush]);
}
