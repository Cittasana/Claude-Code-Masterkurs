/**
 * LocalLlmTutorOnboarding — 5-step wizard for setting up the Local-LLM tutor.
 *
 * Steps:
 *   1. Static Probe          — navigator.deviceMemory + hardwareConcurrency
 *   2. Ollama Install Check  — fetch http://localhost:11434/api/version
 *   3. CORS Setup            — OLLAMA_ORIGINS instructions + verify call
 *   4. Model Pull            — Tier-recommended model + /api/tags verify
 *   5. Benchmark             — 256-token roundtrip → tokens/sec → tier
 *
 * Wired post-merge into TutorChatPanel/LessonView by Lane D via:
 *   const LocalLlmTutorOnboarding = React.lazy(
 *     () => import('@/components/LocalLlm').then(m => ({ default: m.LocalLlmTutorOnboarding }))
 *   );
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Cpu,
  HardDrive,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  RefreshCcw,
  Download,
  Gauge,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { cn } from '../../lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// duplicate of server/src/lib/local-llm-tier-catalog.ts (Lane A) — single source of truth post-merge
export type TierKey = 'tier-s' | 'tier-m' | 'tier-l' | 'unsupported' | 'unknown';

interface StaticProbeResponse {
  tier: TierKey;
  reason?: string;
}

interface BenchmarkResponse {
  tier: TierKey;
  recommendedModel: string;
}

interface OllamaVersionResponse {
  version?: string;
}

interface OllamaTagsResponse {
  models?: Array<{ name: string; size?: number }>;
}

interface OllamaGenerateResponse {
  response?: string;
  done?: boolean;
  total_duration?: number; // nanoseconds
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number; // nanoseconds — used for tokens/sec
}

type StepId = 'probe' | 'ollama' | 'cors' | 'model' | 'benchmark';

interface StepDef {
  id: StepId;
  label: string;
  icon: typeof Cpu;
}

const STEPS: StepDef[] = [
  { id: 'probe', label: 'Hardware', icon: Cpu },
  { id: 'ollama', label: 'Ollama', icon: HardDrive },
  { id: 'cors', label: 'CORS', icon: ShieldCheck },
  { id: 'model', label: 'Modell', icon: Download },
  { id: 'benchmark', label: 'Benchmark', icon: Gauge },
];

export interface LocalLlmTutorOnboardingProps {
  /** Optional callback when the wizard finishes successfully with a final tier. */
  onComplete?: (result: { tier: TierKey; recommendedModel: string; tokensPerSec: number }) => void;
  /** Optional callback when user dismisses / closes the wizard. */
  onDismiss?: () => void;
  /** Origin to verify in CORS step; defaults to current location origin. */
  expectedOrigin?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier model recommendation (mirrors server catalog defaults)
// ─────────────────────────────────────────────────────────────────────────────

function modelForTier(tier: TierKey): { name: string; sizeGb: number; eta: string } {
  switch (tier) {
    case 'tier-s':
      return { name: 'qwen2.5-coder:3b', sizeGb: 2, eta: '~2-4 Min.' };
    case 'tier-m':
      return { name: 'qwen2.5-coder:7b', sizeGb: 4.5, eta: '~5-10 Min.' };
    case 'tier-l':
      return { name: 'qwen2.5-coder:14b', sizeGb: 9, eta: '~10-20 Min.' };
    case 'unsupported':
      return { name: 'qwen2.5-coder:3b', sizeGb: 2, eta: '~2-4 Min.' };
    default:
      return { name: 'qwen2.5-coder:7b', sizeGb: 4.5, eta: '~5-10 Min.' };
  }
}

function tierLabel(tier: TierKey): string {
  switch (tier) {
    case 'tier-s':
      return 'Tier S (klein)';
    case 'tier-m':
      return 'Tier M (mittel)';
    case 'tier-l':
      return 'Tier L (groß)';
    case 'unsupported':
      return 'Nicht unterstützt';
    default:
      return 'Unbekannt';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const LocalLlmTutorOnboarding = ({
  onComplete,
  onDismiss,
  expectedOrigin,
}: LocalLlmTutorOnboardingProps) => {
  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = STEPS[stepIdx];

  // Static probe state
  const [deviceMemory, setDeviceMemory] = useState<number | null>(null);
  const [hardwareConcurrency, setHardwareConcurrency] = useState<number | null>(null);
  const [probeTier, setProbeTier] = useState<TierKey>('unknown');
  const [probeReason, setProbeReason] = useState<string | undefined>();
  const [probeBusy, setProbeBusy] = useState(false);
  const [probeError, setProbeError] = useState<string | null>(null);

  // Ollama state
  const [ollamaVersion, setOllamaVersion] = useState<string | null>(null);
  const [ollamaChecking, setOllamaChecking] = useState(false);
  const [ollamaError, setOllamaError] = useState<string | null>(null);

  // CORS state
  const [corsVerified, setCorsVerified] = useState(false);
  const [corsChecking, setCorsChecking] = useState(false);
  const [corsError, setCorsError] = useState<string | null>(null);

  // Model state
  const [modelInstalled, setModelInstalled] = useState(false);
  const [modelChecking, setModelChecking] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // Benchmark state
  const [benchRunning, setBenchRunning] = useState(false);
  const [benchError, setBenchError] = useState<string | null>(null);
  const [benchTokensPerSec, setBenchTokensPerSec] = useState<number | null>(null);
  const [benchTtfbMs, setBenchTtfbMs] = useState<number | null>(null);
  const [finalTier, setFinalTier] = useState<TierKey | null>(null);
  const [finalModel, setFinalModel] = useState<string | null>(null);

  // Detect static hardware values on mount
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    setDeviceMemory(typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null);
    setHardwareConcurrency(
      typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null,
    );
  }, []);

  const origin = expectedOrigin ?? (typeof window !== 'undefined' ? window.location.origin : '');

  const recommended = useMemo(() => modelForTier(probeTier), [probeTier]);

  // ─── Step actions ─────────────────────────────────────────────────────────

  const runStaticProbe = useCallback(async () => {
    setProbeBusy(true);
    setProbeError(null);
    try {
      const res = await api.post<StaticProbeResponse>('/api/tutor/probe/static', {
        deviceMemoryGb: deviceMemory,
        hardwareConcurrency,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      });
      setProbeTier(res.tier);
      setProbeReason(res.reason);
      setStepIdx(1);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Unbekannter Fehler';
      setProbeError(msg);
    } finally {
      setProbeBusy(false);
    }
  }, [deviceMemory, hardwareConcurrency]);

  const checkOllama = useCallback(async () => {
    setOllamaChecking(true);
    setOllamaError(null);
    try {
      const res = await fetch('http://localhost:11434/api/version');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as OllamaVersionResponse;
      setOllamaVersion(data.version ?? 'unbekannt');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setOllamaError(msg);
      setOllamaVersion(null);
    } finally {
      setOllamaChecking(false);
    }
  }, []);

  // Auto-check Ollama when entering step 2
  useEffect(() => {
    if (currentStep.id === 'ollama' && !ollamaVersion && !ollamaChecking && !ollamaError) {
      void checkOllama();
    }
  }, [currentStep.id, ollamaVersion, ollamaChecking, ollamaError, checkOllama]);

  const verifyCors = useCallback(async () => {
    setCorsChecking(true);
    setCorsError(null);
    try {
      // Browser will block this if Ollama doesn't return matching CORS headers
      const res = await fetch('http://localhost:11434/api/version', {
        headers: { Origin: origin },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCorsVerified(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setCorsError(
        `CORS-Verifikation fehlgeschlagen: ${msg}. Stelle sicher, dass OLLAMA_ORIGINS gesetzt ist und Ollama neu gestartet wurde.`,
      );
      setCorsVerified(false);
    } finally {
      setCorsChecking(false);
    }
  }, [origin]);

  const verifyModelInstalled = useCallback(async () => {
    setModelChecking(true);
    setModelError(null);
    try {
      const res = await fetch('http://localhost:11434/api/tags');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as OllamaTagsResponse;
      const found = (data.models ?? []).some(
        (m) => m.name === recommended.name || m.name.startsWith(`${recommended.name}:`),
      );
      if (!found) {
        throw new Error(
          `Modell "${recommended.name}" wurde nicht gefunden. Bitte zuerst per "ollama pull" installieren.`,
        );
      }
      setModelInstalled(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setModelError(msg);
      setModelInstalled(false);
    } finally {
      setModelChecking(false);
    }
  }, [recommended.name]);

  const runBenchmark = useCallback(async () => {
    setBenchRunning(true);
    setBenchError(null);
    setBenchTokensPerSec(null);
    setBenchTtfbMs(null);
    setFinalTier(null);
    setFinalModel(null);
    try {
      const startMs = performance.now();
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: recommended.name,
          prompt:
            'Schreibe eine Python-Funktion, die die ersten 10 Fibonacci-Zahlen ausgibt. Erkläre den Code in zwei Sätzen.',
          stream: false,
          options: { num_predict: 256 },
        }),
      });
      const endMs = performance.now();
      if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
      const data = (await res.json()) as OllamaGenerateResponse;

      const evalCount = data.eval_count ?? 0;
      const evalDurationNs = data.eval_duration ?? 0;
      const tokensPerSec =
        evalDurationNs > 0 && evalCount > 0
          ? (evalCount / evalDurationNs) * 1_000_000_000
          : evalCount > 0
            ? (evalCount / (endMs - startMs)) * 1000
            : 0;
      const ttfbMs =
        typeof data.load_duration === 'number' ? data.load_duration / 1_000_000 : endMs - startMs;

      setBenchTokensPerSec(tokensPerSec);
      setBenchTtfbMs(ttfbMs);

      const benchRes = await api.post<BenchmarkResponse>('/api/tutor/probe/benchmark', {
        tokensPerSec,
        timeToFirstTokenMs: ttfbMs,
        // Pass the user's reported deviceMemory so the server can refresh
        // its tier classification with a fresh RAM signal if needed.
        ...(typeof deviceMemory === 'number' ? { totalRamGB: deviceMemory } : {}),
        model: recommended.name,
        evalCount,
      });
      setFinalTier(benchRes.tier);
      setFinalModel(benchRes.recommendedModel);
      onComplete?.({
        tier: benchRes.tier,
        recommendedModel: benchRes.recommendedModel,
        tokensPerSec,
      });
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Unbekannter Fehler';
      setBenchError(msg);
    } finally {
      setBenchRunning(false);
    }
  }, [recommended.name, onComplete]);

  // ─── Navigation gating ────────────────────────────────────────────────────

  const canAdvance = (() => {
    switch (currentStep.id) {
      case 'probe':
        return probeTier !== 'unknown';
      case 'ollama':
        return !!ollamaVersion;
      case 'cors':
        return corsVerified;
      case 'model':
        return modelInstalled;
      case 'benchmark':
        return finalTier !== null;
      default:
        return false;
    }
  })();

  const goNext = () => {
    if (stepIdx < STEPS.length - 1) setStepIdx((i) => i + 1);
  };
  const goBack = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  // ─── Render helpers ───────────────────────────────────────────────────────

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be unavailable — silently ignore */
    }
  };

  return (
    <div
      className="rounded-apple-lg bg-apple-surface border border-apple-border overflow-hidden max-w-3xl mx-auto"
      role="region"
      aria-label="Local-LLM Tutor Onboarding"
    >
      {/* Header */}
      <div className="px-6 sm:px-10 py-6 border-b border-apple-border bg-gradient-to-br from-apple-accent/10 to-transparent">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-apple-text">
              Local-LLM-Tutor einrichten
            </h2>
            <p className="text-sm text-apple-textSecondary mt-1">
              In 5 Schritten zum lokalen KI-Tutor auf deiner Hardware
            </p>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-apple-muted hover:text-apple-text transition-colors text-sm"
              aria-label="Onboarding schließen"
            >
              Abbrechen
            </button>
          )}
        </div>

        {/* Step indicator */}
        <ol className="mt-5 flex items-center gap-2" aria-label="Fortschritt">
          {STEPS.map((s, i) => {
            const isActive = i === stepIdx;
            const isDone = i < stepIdx;
            const Icon = s.icon;
            return (
              <li key={s.id} className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-apple text-xs font-mono border transition-colors',
                    isActive && 'bg-apple-accent/15 border-apple-accent/40 text-apple-accent',
                    isDone && 'bg-apple-success/10 border-apple-success/30 text-apple-success',
                    !isActive && !isDone && 'bg-apple-bg/60 border-apple-border text-apple-muted',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <Icon size={14} aria-hidden="true" />
                  <span className="truncate">
                    {i + 1}. {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-apple-border hidden sm:block" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Body */}
      <div className="px-6 sm:px-10 py-8 space-y-6">
        {currentStep.id === 'probe' && (
          <StepProbe
            deviceMemory={deviceMemory}
            hardwareConcurrency={hardwareConcurrency}
            probeTier={probeTier}
            probeReason={probeReason}
            busy={probeBusy}
            error={probeError}
            onRun={runStaticProbe}
          />
        )}
        {currentStep.id === 'ollama' && (
          <StepOllama
            version={ollamaVersion}
            checking={ollamaChecking}
            error={ollamaError}
            onRecheck={checkOllama}
            onCopy={copyToClipboard}
          />
        )}
        {currentStep.id === 'cors' && (
          <StepCors
            origin={origin}
            verified={corsVerified}
            checking={corsChecking}
            error={corsError}
            onVerify={verifyCors}
            onCopy={copyToClipboard}
          />
        )}
        {currentStep.id === 'model' && (
          <StepModel
            modelName={recommended.name}
            sizeGb={recommended.sizeGb}
            eta={recommended.eta}
            installed={modelInstalled}
            checking={modelChecking}
            error={modelError}
            onVerify={verifyModelInstalled}
            onCopy={copyToClipboard}
          />
        )}
        {currentStep.id === 'benchmark' && (
          <StepBenchmark
            modelName={finalModel ?? recommended.name}
            running={benchRunning}
            tokensPerSec={benchTokensPerSec}
            ttfbMs={benchTtfbMs}
            finalTier={finalTier}
            error={benchError}
            onRun={runBenchmark}
          />
        )}
      </div>

      {/* Footer nav */}
      <div className="px-6 sm:px-10 py-4 border-t border-apple-border flex items-center justify-between bg-apple-bg/40">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIdx === 0}
          className="inline-flex items-center gap-2 text-sm text-apple-textSecondary hover:text-apple-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Vorheriger Schritt"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Zurück
        </button>
        <span className="text-xs text-apple-muted font-mono">
          Schritt {stepIdx + 1} / {STEPS.length}
        </span>
        {stepIdx < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-apple bg-apple-accent text-white text-sm font-medium hover:bg-apple-accentHover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Nächster Schritt"
          >
            Weiter
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onDismiss}
            disabled={!finalTier}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-apple bg-apple-success text-white text-sm font-medium hover:bg-apple-success/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Onboarding abschließen"
          >
            Fertig
            <CheckCircle2 size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Step components
// ─────────────────────────────────────────────────────────────────────────────

interface StepProbeProps {
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  probeTier: TierKey;
  probeReason?: string;
  busy: boolean;
  error: string | null;
  onRun: () => void;
}

const StepProbe = ({
  deviceMemory,
  hardwareConcurrency,
  probeTier,
  probeReason,
  busy,
  error,
  onRun,
}: StepProbeProps) => {
  const lowMemory = deviceMemory !== null && deviceMemory < 8;
  const memoryUnknown = deviceMemory === null;
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-apple-text">Hardware-Check</h3>
        <p className="text-sm text-apple-textSecondary mt-1">
          Wir lesen dein RAM und deine CPU-Kerne aus dem Browser aus, um einen ersten Tier-Vorschlag
          zu machen.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DataRow
          icon={HardDrive}
          label="Arbeitsspeicher"
          value={
            memoryUnknown
              ? 'Nicht ermittelbar (z. B. Safari)'
              : `≈ ${deviceMemory} GB`
          }
          tone={memoryUnknown ? 'muted' : lowMemory ? 'warning' : 'success'}
        />
        <DataRow
          icon={Cpu}
          label="CPU-Kerne"
          value={hardwareConcurrency !== null ? `${hardwareConcurrency} logische Kerne` : 'Unbekannt'}
          tone={hardwareConcurrency !== null && hardwareConcurrency >= 4 ? 'success' : 'muted'}
        />
      </div>

      {lowMemory && (
        <Callout tone="warning" icon={AlertTriangle}>
          Dein erkannter Arbeitsspeicher liegt unter 8&nbsp;GB. Der Live-Tutor kann instabil laufen.
          Du kannst trotzdem fortfahren — wir messen im Benchmark die echte Performance.
        </Callout>
      )}
      {memoryUnknown && (
        <Callout tone="info" icon={AlertTriangle}>
          Dein Browser meldet keinen RAM (z.&nbsp;B. Safari). Wir bestimmen den Tier rein am Ende
          per Benchmark.
        </Callout>
      )}
      {probeTier !== 'unknown' && (
        <Callout tone="success" icon={CheckCircle2}>
          Vorläufiger Tier: <strong>{tierLabel(probeTier)}</strong>
          {probeReason && <span className="text-apple-muted ml-1">— {probeReason}</span>}
        </Callout>
      )}
      {error && (
        <Callout tone="error" icon={XCircle}>
          {error}
        </Callout>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRun}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-apple bg-apple-accent text-white text-sm font-medium hover:bg-apple-accentHover disabled:opacity-50 transition-colors"
          aria-label={lowMemory ? 'Trotzdem fortfahren' : 'Hardware-Check ausführen'}
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Cpu size={16} aria-hidden="true" />}
          {lowMemory ? 'Trotzdem fortfahren' : 'Check ausführen'}
        </button>
      </div>
    </div>
  );
};

interface StepOllamaProps {
  version: string | null;
  checking: boolean;
  error: string | null;
  onRecheck: () => void;
  onCopy: (text: string) => void;
}

const StepOllama = ({ version, checking, error, onRecheck, onCopy }: StepOllamaProps) => {
  const installCmd = 'brew install ollama   # oder Download: https://ollama.com/download';
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-apple-text">Ollama-Installation prüfen</h3>
        <p className="text-sm text-apple-textSecondary mt-1">
          Wir versuchen, den lokalen Ollama-Dienst auf <code className="font-mono">localhost:11434</code> zu erreichen.
        </p>
      </header>

      {checking && (
        <Callout tone="info" icon={Loader2}>
          Prüfe Ollama-Dienst…
        </Callout>
      )}
      {!checking && version && (
        <Callout tone="success" icon={CheckCircle2}>
          Ollama gefunden. Version: <strong className="font-mono">{version}</strong>
        </Callout>
      )}
      {!checking && !version && error && (
        <>
          <Callout tone="error" icon={XCircle}>
            Ollama nicht erreichbar. Mögliche Ursachen: Ollama läuft nicht oder blockiert CORS.
          </Callout>
          <div className="space-y-3">
            <p className="text-sm text-apple-text font-medium">Installation (macOS):</p>
            <CommandBlock command={installCmd} onCopy={() => onCopy(installCmd)} />
            <p className="text-xs text-apple-muted">
              Nach der Installation: <code className="font-mono">ollama serve</code> in einem Terminal
              starten und unten erneut prüfen.
            </p>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={onRecheck}
        disabled={checking}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-apple bg-apple-elevated border border-apple-border text-apple-text text-sm font-medium hover:bg-apple-hover disabled:opacity-50 transition-colors"
        aria-label="Ollama-Verbindung erneut prüfen"
      >
        {checking ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCcw size={16} aria-hidden="true" />
        )}
        Erneut prüfen
      </button>
    </div>
  );
};

interface StepCorsProps {
  origin: string;
  verified: boolean;
  checking: boolean;
  error: string | null;
  onVerify: () => void;
  onCopy: (text: string) => void;
}

const StepCors = ({ origin, verified, checking, error, onVerify, onCopy }: StepCorsProps) => {
  const serveCmd = `OLLAMA_ORIGINS="https://akademie.cittasana.de,http://localhost:5173" ollama serve`;
  const persistCmd = `launchctl setenv OLLAMA_ORIGINS "https://akademie.cittasana.de,http://localhost:5173"`;
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-apple-text">CORS für die Akademie freischalten</h3>
        <p className="text-sm text-apple-textSecondary mt-1">
          Damit dein Browser ({origin}) mit Ollama sprechen darf, muss Ollama die Akademie als
          erlaubten Origin kennen.
        </p>
      </header>

      <div className="space-y-3">
        <p className="text-sm text-apple-text font-medium">Variante A — einmalig (nur für diese Session):</p>
        <CommandBlock command={serveCmd} onCopy={() => onCopy(serveCmd)} />
        <p className="text-xs text-apple-muted">
          Stoppe vorher laufende Ollama-Instanzen und starte den Dienst mit obigem Befehl neu.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-apple-text font-medium">Variante B — persistent (macOS, launchctl):</p>
        <CommandBlock command={persistCmd} onCopy={() => onCopy(persistCmd)} />
        <p className="text-xs text-apple-muted">
          Danach Ollama beenden (Menüleiste → Quit Ollama) und erneut starten. Die Variable bleibt
          bis zum nächsten Logout erhalten.
        </p>
      </div>

      {verified && (
        <Callout tone="success" icon={CheckCircle2}>
          CORS bestätigt — der Browser kann auf Ollama zugreifen.
        </Callout>
      )}
      {error && (
        <Callout tone="error" icon={XCircle}>
          {error}
        </Callout>
      )}

      <button
        type="button"
        onClick={onVerify}
        disabled={checking}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-apple bg-apple-accent text-white text-sm font-medium hover:bg-apple-accentHover disabled:opacity-50 transition-colors"
        aria-label="CORS-Setup verifizieren"
      >
        {checking ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <ShieldCheck size={16} aria-hidden="true" />
        )}
        CORS verifizieren
      </button>
    </div>
  );
};

interface StepModelProps {
  modelName: string;
  sizeGb: number;
  eta: string;
  installed: boolean;
  checking: boolean;
  error: string | null;
  onVerify: () => void;
  onCopy: (text: string) => void;
}

const StepModel = ({
  modelName,
  sizeGb,
  eta,
  installed,
  checking,
  error,
  onVerify,
  onCopy,
}: StepModelProps) => {
  const pullCmd = `ollama pull ${modelName}`;
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-apple-text">Modell installieren</h3>
        <p className="text-sm text-apple-textSecondary mt-1">
          Basierend auf deinem Hardware-Check empfehlen wir:
        </p>
      </header>

      <div className="rounded-apple bg-apple-bg/60 border border-apple-border px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-apple-text text-base">{modelName}</p>
          <p className="text-xs text-apple-muted mt-1">
            ≈ {sizeGb} GB Download · Dauer: {eta}
          </p>
        </div>
        <Download size={20} className="text-apple-accent" aria-hidden="true" />
      </div>

      <div className="space-y-3">
        <p className="text-sm text-apple-text font-medium">Im Terminal ausführen:</p>
        <CommandBlock command={pullCmd} onCopy={() => onCopy(pullCmd)} />
      </div>

      {installed && (
        <Callout tone="success" icon={CheckCircle2}>
          Modell <strong className="font-mono">{modelName}</strong> ist installiert.
        </Callout>
      )}
      {error && (
        <Callout tone="error" icon={XCircle}>
          {error}
        </Callout>
      )}

      <button
        type="button"
        onClick={onVerify}
        disabled={checking}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-apple bg-apple-accent text-white text-sm font-medium hover:bg-apple-accentHover disabled:opacity-50 transition-colors"
        aria-label="Modell-Installation überprüfen"
      >
        {checking ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <CheckCircle2 size={16} aria-hidden="true" />
        )}
        Modell bereit
      </button>
    </div>
  );
};

interface StepBenchmarkProps {
  modelName: string;
  running: boolean;
  tokensPerSec: number | null;
  ttfbMs: number | null;
  finalTier: TierKey | null;
  error: string | null;
  onRun: () => void;
}

const StepBenchmark = ({
  modelName,
  running,
  tokensPerSec,
  ttfbMs,
  finalTier,
  error,
  onRun,
}: StepBenchmarkProps) => {
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-apple-text">Performance-Benchmark</h3>
        <p className="text-sm text-apple-textSecondary mt-1">
          Wir senden einen Test-Prompt an dein Modell und messen Tokens pro Sekunde sowie die
          Reaktionszeit.
        </p>
      </header>

      <div className="rounded-apple bg-apple-bg/60 border border-apple-border px-5 py-4">
        <p className="text-xs text-apple-muted">Test-Modell</p>
        <p className="font-mono text-apple-text text-base mt-0.5">{modelName}</p>
      </div>

      {running && (
        <Callout tone="info" icon={Loader2}>
          Benchmark läuft — das kann je nach Tier 5-60 Sekunden dauern…
        </Callout>
      )}

      {(tokensPerSec !== null || ttfbMs !== null) && !running && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DataRow
            icon={Gauge}
            label="Tokens / Sekunde"
            value={tokensPerSec !== null ? tokensPerSec.toFixed(1) : '—'}
            tone={tokensPerSec !== null && tokensPerSec >= 10 ? 'success' : 'warning'}
          />
          <DataRow
            icon={Terminal}
            label="Ladezeit (TTFB)"
            value={ttfbMs !== null ? `${Math.round(ttfbMs)} ms` : '—'}
            tone="muted"
          />
        </div>
      )}

      {finalTier && finalTier !== 'unsupported' && (
        <Callout tone="success" icon={CheckCircle2}>
          <strong>Du bist bereit für den Local-LLM-Tutor.</strong> Finaler Tier:{' '}
          <strong>{tierLabel(finalTier)}</strong>
        </Callout>
      )}
      {finalTier === 'unsupported' && (
        <div className="space-y-3">
          <Callout tone="warning" icon={AlertTriangle}>
            <strong>Hardware reicht nicht für den Live-Tutor.</strong> Lektionen, Übungen und
            Playground funktionieren weiterhin.
          </Callout>
          <div className="rounded-apple bg-apple-bg/60 border border-apple-border px-5 py-4 text-xs text-apple-textSecondary">
            <p className="font-medium text-apple-text mb-2">Mindestanforderungen Live-Tutor</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Tier S: 8 GB RAM, ≥ 4 Kerne, ≥ 8 Tok/s</li>
              <li>Tier M: 16 GB RAM, ≥ 8 Kerne, ≥ 15 Tok/s</li>
              <li>Tier L: 32 GB RAM, GPU empfohlen, ≥ 25 Tok/s</li>
            </ul>
          </div>
        </div>
      )}
      {error && (
        <Callout tone="error" icon={XCircle}>
          {error}
        </Callout>
      )}

      <button
        type="button"
        onClick={onRun}
        disabled={running}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-apple bg-apple-accent text-white text-sm font-medium hover:bg-apple-accentHover disabled:opacity-50 transition-colors"
        aria-label="Benchmark starten"
      >
        {running ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Gauge size={16} aria-hidden="true" />
        )}
        {finalTier ? 'Benchmark erneut ausführen' : 'Benchmark starten'}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared little pieces
// ─────────────────────────────────────────────────────────────────────────────

interface DataRowProps {
  icon: typeof Cpu;
  label: string;
  value: string;
  tone: 'success' | 'warning' | 'error' | 'muted';
}

const DataRow = ({ icon: Icon, label, value, tone }: DataRowProps) => {
  const toneClass = {
    success: 'text-apple-success',
    warning: 'text-apple-warning',
    error: 'text-apple-error',
    muted: 'text-apple-muted',
  }[tone];
  return (
    <div className="rounded-apple bg-apple-bg/60 border border-apple-border px-4 py-3 flex items-center gap-3">
      <Icon size={18} className={toneClass} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs text-apple-muted">{label}</p>
        <p className="text-sm text-apple-text font-medium truncate">{value}</p>
      </div>
    </div>
  );
};

interface CalloutProps {
  tone: 'info' | 'success' | 'warning' | 'error';
  icon: typeof CheckCircle2;
  children: React.ReactNode;
}

const Callout = ({ tone, icon: Icon, children }: CalloutProps) => {
  const styles = {
    info: 'bg-apple-info/10 border-apple-info/30 text-apple-text',
    success: 'bg-apple-success/10 border-apple-success/30 text-apple-text',
    warning: 'bg-apple-warning/10 border-apple-warning/30 text-apple-text',
    error: 'bg-apple-error/10 border-apple-error/30 text-apple-text',
  }[tone];
  const iconClass = {
    info: 'text-apple-info',
    success: 'text-apple-success',
    warning: 'text-apple-warning',
    error: 'text-apple-error',
  }[tone];
  return (
    <div
      className={cn('rounded-apple border px-4 py-3 flex gap-3 text-sm', styles)}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <Icon
        size={18}
        className={cn('flex-shrink-0 mt-0.5', iconClass, tone === 'info' && 'animate-spin')}
        aria-hidden="true"
      />
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  );
};

interface CommandBlockProps {
  command: string;
  onCopy: () => void;
}

const CommandBlock = ({ command, onCopy }: CommandBlockProps) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-apple bg-apple-bg border border-apple-border overflow-hidden">
      <div className="flex items-stretch">
        <pre
          className="flex-1 px-4 py-3 font-mono text-xs sm:text-sm text-apple-text overflow-x-auto whitespace-pre"
          aria-label="Befehl"
        >
          {command}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="px-3 border-l border-apple-border bg-apple-elevated hover:bg-apple-hover text-apple-text text-xs font-medium transition-colors flex items-center gap-1.5"
          aria-label={copied ? 'Befehl wurde kopiert' : 'Befehl in die Zwischenablage kopieren'}
        >
          {copied ? <CheckCircle2 size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Kopiert' : 'Kopieren'}
        </button>
      </div>
    </div>
  );
};

export { LocalLlmTutorOnboarding };
export default LocalLlmTutorOnboarding;
