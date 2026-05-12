import { AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import type { FreshnessWarning } from '../../types';

interface Props {
  /** Open freshness warnings for this lesson. Empty/undefined → show "verified" state if lastVerified is recent. */
  warnings?: FreshnessWarning[];
  /** ISO datetime of last successful audit. */
  lastVerified?: string | null;
  /** ISO datetime of last auto-patch by the agent. */
  lastUpdatedByAgent?: string | null;
}

/** Stale-after threshold for the "verified" pill (days). */
const STALE_AFTER_DAYS = 30;

/**
 * Renders a freshness-warning banner above a lesson when the weekly agent audit
 * found contradictions, OR a subtle "verified" pill when the lesson is recently
 * checked. Falls back to silence if no metadata is present yet.
 */
const FreshnessBanner = ({ warnings = [], lastVerified, lastUpdatedByAgent }: Props) => {
  const hasWarnings = warnings.length > 0;
  const verifiedAt = lastVerified ? new Date(lastVerified) : null;
  const verifiedDaysAgo = verifiedAt
    ? Math.floor((Date.now() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isRecentlyVerified =
    verifiedDaysAgo !== null && verifiedDaysAgo <= STALE_AFTER_DAYS;

  if (hasWarnings) {
    // Highest severity drives the visual treatment.
    const severityRank = { low: 1, medium: 2, high: 3 } as const;
    const topSeverity = warnings.reduce(
      (acc, w) => (severityRank[w.severity] > severityRank[acc] ? w.severity : acc),
      'low' as FreshnessWarning['severity']
    );

    const severityCopy = {
      low: 'Hinweis',
      medium: 'Update verfügbar',
      high: 'Veraltete Information',
    }[topSeverity];

    return (
      <div className="mb-8 shell">
        <div className="inner p-5 sm:p-6">
          <div className="flex gap-4 items-start">
            <div className="shrink-0 w-9 h-9 rounded-full bg-apple-accent/15 border border-apple-accent/30 flex items-center justify-center">
              <AlertTriangle size={16} className="text-apple-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-apple-accent/10 text-apple-accent text-[10px] font-mono uppercase tracking-[0.08em] border border-apple-accent/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-accent animate-pulse" />
                  {severityCopy}
                </span>
                {lastUpdatedByAgent && (
                  <span className="text-[10px] text-apple-muted font-mono uppercase tracking-[0.08em]">
                    Auto-patched · {new Date(lastUpdatedByAgent).toLocaleDateString('de-DE')}
                  </span>
                )}
              </div>
              <h2 className="text-base font-medium text-apple-text mb-3 tracking-tight">
                Diese Lektion enthält Punkte, die der wöchentliche Audit als überholt markiert hat.
              </h2>
              <ul className="space-y-2.5">
                {warnings.map((w, i) => (
                  <li key={i} className="text-sm text-apple-textSecondary leading-relaxed flex gap-2">
                    <span className="text-apple-accent mt-0.5">›</span>
                    <span>
                      {w.reason}
                      {w.source && (
                        <>
                          {' '}
                          <a
                            href={w.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-apple-accent/80 hover:text-apple-accent underline underline-offset-2 text-xs"
                          >
                            Quelle
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-apple-muted font-mono mt-4 tracking-[0.04em]">
                Erkannt am {new Date(warnings[0].addedAt).toLocaleDateString('de-DE')} · Wöchentlicher Freshness-Audit
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isRecentlyVerified && verifiedAt) {
    return (
      <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-apple-success/10 border border-apple-success/20 text-apple-success">
        <CheckCircle2 size={12} />
        <span className="text-[10px] font-mono uppercase tracking-[0.08em]">
          Verifiziert · {verifiedAt.toLocaleDateString('de-DE')}
        </span>
        {lastUpdatedByAgent && (
          <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-apple-muted flex items-center gap-1">
            <Sparkles size={10} />
            Auto-patched
          </span>
        )}
      </div>
    );
  }

  return null;
};

export default FreshnessBanner;
