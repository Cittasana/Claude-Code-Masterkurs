import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { subscriptionApi } from '../lib/api';

const CACHE_KEY = 'claude-code-premium-access';
const CACHE_TTL = 5 * 60 * 1000; // 5 Minuten
const MAX_RETRIES = 2;
const RETRY_DELAY = 1500; // ms

interface CachedAccess {
  hasAccess: boolean;
  timestamp: number;
}

function getCached(): boolean | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedAccess = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cached.hasAccess;
  } catch {
    return null;
  }
}

function setCache(hasAccess: boolean) {
  try {
    const entry: CachedAccess = { hasAccess, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // sessionStorage voll oder blockiert – ignorieren
  }
}

async function fetchWithRetry(retries = MAX_RETRIES): Promise<boolean> {
  try {
    const result = await subscriptionApi.hasAccess();
    setCache(result.hasAccess);
    return result.hasAccess;
  } catch {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return fetchWithRetry(retries - 1);
    }
    // Alle Retries fehlgeschlagen → Cache als Fallback
    const cached = getCached();
    if (cached !== null) return cached;
    // Letzter Fallback: false
    return false;
  }
}

/**
 * Hook für Premium-Zugriffsprüfung mit Retry + SessionStorage-Cache.
 * Verhindert, dass Netzwerk-Fehler oder Token-Timeouts
 * zahlende User aussperren.
 */
export function useSubscriptionAccess(): boolean {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Sofort aus Cache laden falls vorhanden
  const [hasPremium, setHasPremium] = useState<boolean>(() => {
    if (!isAuthenticated) return false;
    return getCached() ?? false;
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setHasPremium(false);
      return;
    }

    // Sofort Cache anzeigen, dann im Hintergrund neu prüfen
    const cached = getCached();
    if (cached !== null) {
      setHasPremium(cached);
    }

    let cancelled = false;
    fetchWithRetry().then((access) => {
      if (!cancelled) setHasPremium(access);
    });

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  return hasPremium;
}
