import { useState, useEffect, useCallback } from 'react';
import {
  Bot,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Mail,
  Share2,
  FileText,
  BarChart3,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AgentRun, AgentStatus } from '../../lib/api';

// ── Helpers ─────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '-';
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function qualityColor(score: number | null): string {
  if (score === null) return 'text-gray-400';
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

function qualityBg(score: number | null): string {
  if (score === null) return 'bg-gray-50';
  if (score >= 80) return 'bg-green-50';
  if (score >= 50) return 'bg-yellow-50';
  return 'bg-red-50';
}

function statusBadge(status: string) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <XCircle className="h-3 w-3" />
          Failed
        </span>
      );
    case 'running':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">
          <Loader2 className="h-3 w-3 animate-spin" />
          Running
        </span>
      );
    default:
      return (
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
          {status}
        </span>
      );
  }
}

function triggerBadge(trigger: string) {
  return trigger === 'manual' ? (
    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
      Manual
    </span>
  ) : (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
      Cron
    </span>
  );
}

// ── Quality Score Bar ───────────────────────────────────────

function QualityBar({ runs }: { runs: AgentRun[] }) {
  const scored = runs.filter((r) => r.qualityScore !== null).slice(0, 10).reverse();
  if (scored.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">Noch keine Quality-Daten</p>;
  }
  const max = Math.max(...scored.map((r) => r.qualityScore ?? 0), 100);

  return (
    <div className="flex items-end gap-2" style={{ height: 120 }}>
      {scored.map((run) => {
        const score = run.qualityScore ?? 0;
        const height = Math.max((score / max) * 100, 4);
        return (
          <div key={run.id} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-600">{score.toFixed(0)}</span>
            <div
              className={`w-full rounded-t ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ height: `${height}%`, minHeight: 4 }}
            />
            <span className="text-[10px] text-gray-400">
              {new Date(run.startedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Sources Stacked Bar ─────────────────────────────────────

function SourcesBar({ runs }: { runs: AgentRun[] }) {
  const withSources = runs.filter((r) => r.sourcesTotal > 0).slice(0, 10).reverse();
  if (withSources.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">Noch keine Quellen-Daten</p>;
  }
  const maxTotal = Math.max(...withSources.map((r) => r.sourcesTotal));

  return (
    <div className="flex items-end gap-2" style={{ height: 120 }}>
      {withSources.map((run) => {
        const total = run.sourcesTotal || 1;
        const height = Math.max((total / maxTotal) * 100, 8);
        const t1Pct = (run.sourcesTier1 / total) * 100;
        const t2Pct = (run.sourcesTier2 / total) * 100;
        return (
          <div key={run.id} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-600">{total}</span>
            <div
              className="flex w-full flex-col overflow-hidden rounded-t"
              style={{ height: `${height}%`, minHeight: 8 }}
            >
              <div className="bg-blue-500" style={{ height: `${t1Pct}%` }} />
              <div className="bg-purple-400" style={{ height: `${t2Pct}%` }} />
              <div className="flex-1 bg-gray-300" />
            </div>
            <span className="text-[10px] text-gray-400">
              {new Date(run.startedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Detail Modal ────────────────────────────────────────────

function RunDetailModal({ run, onClose }: { run: AgentRun; onClose: () => void }) {
  const [full, setFull] = useState<AgentRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAgentRun(run.id)
      .then((res) => setFull(res.data))
      .catch(() => setFull(run))
      .finally(() => setLoading(false));
  }, [run]);

  const data = full || run;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Run Details</h2>
            {statusBadge(data.status)}
            {triggerBadge(data.trigger)}
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-gray-500">Gestartet</p>
                <p className="font-medium">{formatDate(data.startedAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Dauer</p>
                <p className="font-medium">{formatDuration(data.durationSeconds)}</p>
              </div>
              <div>
                <p className="text-gray-500">Quality Score</p>
                <p className={`font-bold ${qualityColor(data.qualityScore)}`}>
                  {data.qualityScore !== null ? data.qualityScore.toFixed(1) : '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Quellen</p>
                <p className="font-medium">{data.sourcesTotal} gesamt</p>
              </div>
            </div>

            {/* Content Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{data.lessonsCreated}</p>
                <p className="text-xs text-blue-600">Lektionen</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 text-center">
                <p className="text-2xl font-bold text-purple-700">{data.emailsCreated}</p>
                <p className="text-xs text-purple-600">Emails</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{data.socialPostsCreated}</p>
                <p className="text-xs text-green-600">Social Posts</p>
              </div>
            </div>

            {/* Sources Breakdown */}
            {data.sourcesTotal > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Quellen-Verteilung</p>
                <div className="flex gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded bg-blue-500" /> Tier 1: {data.sourcesTier1}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded bg-purple-400" /> Tier 2: {data.sourcesTier2}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded bg-gray-300" /> Tier 3: {data.sourcesTier3}
                  </span>
                </div>
              </div>
            )}

            {/* Research Topics */}
            {data.researchTopics.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Research Topics</p>
                <div className="flex flex-wrap gap-2">
                  {data.researchTopics.map((topic, i) => (
                    <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {data.summary && (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Zusammenfassung</p>
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {data.summary}
                </div>
              </div>
            )}

            {/* Error Log */}
            {data.errorLog && (
              <div>
                <p className="mb-2 text-sm font-semibold text-red-700">Fehler-Log</p>
                <pre className="max-h-60 overflow-auto rounded-lg bg-red-50 p-4 text-xs text-red-800">
                  {data.errorLog}
                </pre>
              </div>
            )}

            {/* Raw Output */}
            {data.rawOutput && (
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-gray-500 hover:text-gray-700">
                  Raw Output anzeigen
                </summary>
                <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-200">
                  {data.rawOutput}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────

export function AdminAgentMonitorPage() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [status, setStatus] = useState<AgentStatus>({ isRunning: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(null);
  const [showAllRuns, setShowAllRuns] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [runsRes, statusRes] = await Promise.all([
        adminApi.getAgentRuns({ limit: 50 }),
        adminApi.getAgentStatus(),
      ]);
      setRuns(runsRes.data);
      setStatus(statusRes.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh while agent is running
  useEffect(() => {
    if (!status.isRunning) return;
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [status.isRunning, loadData]);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await adminApi.triggerAgent();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Starten');
    } finally {
      setTriggering(false);
    }
  };

  const lastCompleted = runs.find((r) => r.status === 'completed');
  const avgQuality =
    runs.filter((r) => r.qualityScore !== null).length > 0
      ? runs.filter((r) => r.qualityScore !== null).reduce((sum, r) => sum + (r.qualityScore ?? 0), 0) /
        runs.filter((r) => r.qualityScore !== null).length
      : null;
  const totalContent = runs.reduce(
    (acc, r) => ({
      lessons: acc.lessons + r.lessonsCreated,
      emails: acc.emails + r.emailsCreated,
      social: acc.social + r.socialPostsCreated,
    }),
    { lessons: 0, emails: 0, social: 0 },
  );
  const totalSources = runs.reduce((sum, r) => sum + r.sourcesTotal, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && runs.length === 0) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Fehler</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const visibleRuns = showAllRuns ? runs : runs.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Agent Monitor</h1>
              {status.isRunning ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                  Agent aktiv
                </span>
              ) : lastCompleted ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Bereit
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  Kein Run
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">Wöchentlicher Masterkurs-Agent Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="rounded-lg border border-gray-200 p-2.5 text-gray-600 transition-colors hover:bg-gray-50"
            title="Aktualisieren"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleTrigger}
            disabled={status.isRunning || triggering}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {triggering || status.isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Agent läuft...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Agent jetzt starten
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Letzter Run</p>
              <p className="mt-2 text-lg font-bold text-gray-900">
                {lastCompleted ? formatDate(lastCompleted.startedAt) : '-'}
              </p>
              {lastCompleted?.durationSeconds && (
                <p className="mt-1 text-xs text-gray-500">
                  Dauer: {formatDuration(lastCompleted.durationSeconds)}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-6 shadow-sm ${qualityBg(avgQuality)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Quality Score</p>
              <p className={`mt-2 text-3xl font-bold ${qualityColor(avgQuality)}`}>
                {avgQuality !== null ? avgQuality.toFixed(1) : '-'}
              </p>
            </div>
            <div className="rounded-lg bg-white/60 p-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Content erstellt</p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                {totalContent.lessons + totalContent.emails + totalContent.social}
              </p>
              <div className="mt-1 flex gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-0.5">
                  <BookOpen className="h-3 w-3" /> {totalContent.lessons}
                </span>
                <span className="flex items-center gap-0.5">
                  <Mail className="h-3 w-3" /> {totalContent.emails}
                </span>
                <span className="flex items-center gap-0.5">
                  <Share2 className="h-3 w-3" /> {totalContent.social}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quellen gesamt</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{totalSources}</p>
              {runs.length > 0 && (
                <div className="mt-1 flex gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-0.5">
                    <span className="inline-block h-2 w-2 rounded bg-blue-500" /> T1: {runs.reduce((s, r) => s + r.sourcesTier1, 0)}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="inline-block h-2 w-2 rounded bg-purple-400" /> T2: {runs.reduce((s, r) => s + r.sourcesTier2, 0)}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="inline-block h-2 w-2 rounded bg-gray-300" /> T3: {runs.reduce((s, r) => s + r.sourcesTier3, 0)}
                  </span>
                </div>
              )}
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-gray-900">Quality Score Trend (letzte 10 Runs)</h3>
          <QualityBar runs={runs} />
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-gray-900">Quellen-Verteilung (letzte 10 Runs)</h3>
          <SourcesBar runs={runs} />
          <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded bg-blue-500" /> Tier 1 (Official)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded bg-purple-400" /> Tier 2 (Code)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded bg-gray-300" /> Tier 3 (Blog)
            </span>
          </div>
        </div>
      </div>

      {/* Run History Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">Run-Historie</h3>
        </div>

        {runs.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Bot className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Runs vorhanden</h3>
            <p className="text-sm text-gray-600">Starte den Agent, um den ersten Run zu erzeugen</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-3">Datum</th>
                    <th className="px-6 py-3">Trigger</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Dauer</th>
                    <th className="px-6 py-3">Quality</th>
                    <th className="px-6 py-3">Content</th>
                    <th className="px-6 py-3">Quellen</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleRuns.map((run) => (
                    <tr
                      key={run.id}
                      onClick={() => setSelectedRun(run)}
                      className="cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {formatDate(run.startedAt)}
                      </td>
                      <td className="px-6 py-4">{triggerBadge(run.trigger)}</td>
                      <td className="px-6 py-4">{statusBadge(run.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDuration(run.durationSeconds)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${qualityColor(run.qualityScore)}`}>
                          {run.qualityScore !== null ? run.qualityScore.toFixed(1) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 text-xs text-gray-600">
                          {run.lessonsCreated > 0 && (
                            <span className="flex items-center gap-0.5">
                              <BookOpen className="h-3 w-3" />
                              {run.lessonsCreated}
                            </span>
                          )}
                          {run.emailsCreated > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Mail className="h-3 w-3" />
                              {run.emailsCreated}
                            </span>
                          )}
                          {run.socialPostsCreated > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Share2 className="h-3 w-3" />
                              {run.socialPostsCreated}
                            </span>
                          )}
                          {run.lessonsCreated + run.emailsCreated + run.socialPostsCreated === 0 && (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{run.sourcesTotal || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {runs.length > 10 && (
              <div className="border-t px-6 py-3 text-center">
                <button
                  onClick={() => setShowAllRuns(!showAllRuns)}
                  className="flex w-full items-center justify-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {showAllRuns ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Weniger anzeigen
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Alle {runs.length} Runs anzeigen
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRun && <RunDetailModal run={selectedRun} onClose={() => setSelectedRun(null)} />}
    </div>
  );
}
