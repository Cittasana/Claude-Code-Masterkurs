/**
 * LocalLlmTutorHealthBadge — compact pill UI showing live tutor health.
 *
 * Pure display component. Polling/telemetry is owned by the caller
 * (TutorChatPanel in Lane D). When the caller detects a `downgrade` action
 * from /api/tutor/probe/telemetry, it should pass the new `tier` and call
 * `onDegrade` so the badge can surface a toast-friendly message via
 * `degradeMessage` (the parent renders the toast).
 *
 * Wired post-merge in TutorChatPanel via:
 *   <LocalLlmTutorHealthBadge tier={tier} tokensPerSec={tps} onDegrade={notifyToast} />
 */

import { useEffect, useRef } from 'react';
import { Activity, Zap, AlertTriangle, ShieldOff } from 'lucide-react';
import { cn } from '../../lib/utils';

// duplicate of server/src/lib/local-llm-tier-catalog.ts (Lane A) — single source of truth post-merge
export type TierKey = 'tier-s' | 'tier-m' | 'tier-l' | 'unsupported' | 'unknown';

export interface LocalLlmTutorHealthBadgeProps {
  /** Current tier as decided by latest telemetry / probe. */
  tier: TierKey;
  /** Live tokens/sec; if omitted, the metric portion is hidden. */
  tokensPerSec?: number;
  /**
   * Invoked once whenever the tier is detected as degraded relative to the
   * previously rendered tier (M → S, L → M/S, * → unsupported). The parent
   * is expected to surface a toast.
   */
  onDegrade?: (info: { previous: TierKey; current: TierKey; message: string }) => void;
  /** Compact mode hides the tok/s number; useful on mobile. */
  compact?: boolean;
  className?: string;
}

// Order used for degradation comparison (higher index = stronger).
const TIER_RANK: Record<TierKey, number> = {
  unsupported: 0,
  unknown: 1,
  'tier-s': 2,
  'tier-m': 3,
  'tier-l': 4,
};

const TIER_SHORT: Record<TierKey, string> = {
  'tier-s': 'S',
  'tier-m': 'M',
  'tier-l': 'L',
  unsupported: '—',
  unknown: '?',
};

const TIER_LABEL: Record<TierKey, string> = {
  'tier-s': 'Tier S',
  'tier-m': 'Tier M',
  'tier-l': 'Tier L',
  unsupported: 'Nicht unterstützt',
  unknown: 'Status unbekannt',
};

/**
 * Threshold curve per tier — used purely for color tone of the pill.
 * Numbers chosen to align with server catalog tier-floors.
 */
function colorForTier(tier: TierKey, tokensPerSec?: number): 'success' | 'warning' | 'error' {
  if (tier === 'unsupported') return 'error';
  if (tier === 'unknown') return 'warning';
  if (typeof tokensPerSec !== 'number') return 'success';

  const floor =
    tier === 'tier-l' ? 25 : tier === 'tier-m' ? 15 : 8; /* tier-s */
  const warnAt = floor * 1.15;
  if (tokensPerSec < floor) return 'error';
  if (tokensPerSec < warnAt) return 'warning';
  return 'success';
}

function buildDegradeMessage(previous: TierKey, current: TierKey): string {
  if (current === 'unsupported') {
    return 'Live-Tutor pausiert — Hardware-Auslastung zu hoch. Lektionen laufen normal weiter.';
  }
  return `Tutor-Tier wurde von ${TIER_LABEL[previous]} auf ${TIER_LABEL[current]} reduziert.`;
}

const LocalLlmTutorHealthBadge = ({
  tier,
  tokensPerSec,
  onDegrade,
  compact = false,
  className,
}: LocalLlmTutorHealthBadgeProps) => {
  const previousTierRef = useRef<TierKey>(tier);

  // Detect downgrades by comparing rank to previous render.
  useEffect(() => {
    const prev = previousTierRef.current;
    if (prev !== tier && TIER_RANK[tier] < TIER_RANK[prev]) {
      onDegrade?.({
        previous: prev,
        current: tier,
        message: buildDegradeMessage(prev, tier),
      });
    }
    previousTierRef.current = tier;
  }, [tier, onDegrade]);

  const tone = colorForTier(tier, tokensPerSec);
  const Icon =
    tier === 'unsupported' ? ShieldOff : tone === 'warning' ? AlertTriangle : tone === 'error' ? AlertTriangle : Activity;

  const toneClasses = {
    success: 'bg-apple-success/10 border-apple-success/30 text-apple-success',
    warning: 'bg-apple-warning/10 border-apple-warning/30 text-apple-warning',
    error: 'bg-apple-error/10 border-apple-error/30 text-apple-error',
  }[tone];

  const ariaLabel = (() => {
    const base = `Tutor-Status: ${TIER_LABEL[tier]}`;
    if (typeof tokensPerSec === 'number') {
      return `${base}, ${tokensPerSec.toFixed(1)} Tokens pro Sekunde`;
    }
    return base;
  })();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono',
        toneClasses,
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Icon size={12} aria-hidden="true" />
      <span className="font-semibold">{TIER_SHORT[tier]}</span>
      {typeof tokensPerSec === 'number' && !compact && (
        <>
          <span className="opacity-40" aria-hidden="true">
            ·
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Zap size={10} aria-hidden="true" />
            {tokensPerSec.toFixed(1)}
            <span className="opacity-60">tok/s</span>
          </span>
        </>
      )}
    </span>
  );
};

export { LocalLlmTutorHealthBadge };
export default LocalLlmTutorHealthBadge;
