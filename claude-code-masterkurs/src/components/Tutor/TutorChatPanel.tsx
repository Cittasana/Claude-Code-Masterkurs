import {
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  type FormEvent,
} from 'react';
import { Send, MessageSquare, AlertTriangle, Loader2, X } from 'lucide-react';
import {
  LocalLlmTutorHealthBadge,
  type TierKey as LocalLlmTierKey,
} from '../LocalLlm';

const LocalLlmTutorOnboarding = lazy(() =>
  import('../LocalLlm').then((m) => ({ default: m.LocalLlmTutorOnboarding })),
);

const LOCAL_LLM_TIER_STORAGE_KEY = 'claude-code-masterkurs.local-llm-tier';

interface PersistedLocalLlmTier {
  tier: LocalLlmTierKey;
  recommendedModel: string;
  tokensPerSec: number;
}

function loadPersistedLocalLlmTier(): PersistedLocalLlmTier | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_LLM_TIER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedLocalLlmTier) : null;
  } catch {
    return null;
  }
}

function persistLocalLlmTier(value: PersistedLocalLlmTier | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (value) {
      window.localStorage.setItem(LOCAL_LLM_TIER_STORAGE_KEY, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(LOCAL_LLM_TIER_STORAGE_KEY);
    }
  } catch {
    /* ignore quota / disabled storage */
  }
}
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import { useTrackStore } from '../../store/useTrackStore';
import {
  streamFromOllama,
  type OllamaChatMessage,
} from '../../lib/ollama-client';

// ─────────────────────────────────────────────────────────────
// TutorChatPanel
//
// Sidebar chat for the per-track AI tutor. Talks to
// POST /api/tutor/chat (Lane B). For most tracks the server
// streams the assistant response directly. For the local-llm
// track the server emits a `prompt-ready` event with the
// assembled prompt, and the BROWSER calls localhost:11434
// (Ollama) directly, then pings the server with telemetry
// only (token count + errors — never content).
//
// We intentionally do NOT use @ai-sdk/react / useChat. Native
// fetch + ReadableStream keeps the dependency surface small.
// ─────────────────────────────────────────────────────────────

interface TutorChatPanelProps {
  /** Numeric lesson id (matches Lesson.id). Optional — global tutor without lesson context still works. */
  lessonId?: number;
  /** Optional className for the outer panel container. */
  className?: string;
}

interface ChatMessage {
  /** Stable id for React keys. */
  id: string;
  role: 'user' | 'assistant';
  /** Mutable while streaming, frozen on `done`. */
  content: string;
  /** Set to true after the SSE `done` event for this message. */
  done: boolean;
  /** Error message if streaming failed. */
  error?: string;
}

type ConnState = 'idle' | 'sending' | 'streaming' | 'done' | 'error';

interface RateLimitWarning {
  used: number;
  cap: number;
  percent: number;
}

interface PromptReadyPayload {
  systemPrompt: string;
  history: OllamaChatMessage[];
  userMessage: string;
  model: string;
}

const API_BASE = (
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000'
)
  .replace(/[\n\r\s]/g, '')
  .replace(/^[^h]+(https?)/, '$1');

const TELEMETRY_INTERVAL_MS = 5_000;

/** Parse SSE frame: `event: name\ndata: {json}\n\n`. */
interface SseEvent {
  event: string;
  data: string;
}

function parseSseBuffer(buffer: string): { events: SseEvent[]; rest: string } {
  const events: SseEvent[] = [];
  let rest = buffer;
  let sepIdx = rest.indexOf('\n\n');
  while (sepIdx !== -1) {
    const block = rest.slice(0, sepIdx);
    rest = rest.slice(sepIdx + 2);
    let event = 'message';
    const dataLines: string[] = [];
    for (const rawLine of block.split('\n')) {
      const line = rawLine.replace(/\r$/, '');
      if (!line || line.startsWith(':')) continue;
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }
    if (dataLines.length > 0) {
      events.push({ event, data: dataLines.join('\n') });
    }
    sepIdx = rest.indexOf('\n\n');
  }
  return { events, rest };
}

/**
 * Minimal markdown → safe HTML.
 *
 * Handles fenced code blocks, inline code, **bold**, and newlines.
 * We deliberately do NOT pull in a full markdown lib. If Cosmo
 * needs richer rendering later, swap in marked / remark here.
 *
 * Code blocks are emitted as `<pre data-lang="…"><code>…</code></pre>`
 * so Prism can highlight them after the message is `done`.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMessageMarkdown(text: string): string {
  // Split out fenced code blocks first so inline formatting doesn't
  // touch them.
  const parts: string[] = [];
  const fenceRe = /```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = fenceRe.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(renderInline(text.slice(lastIdx, m.index)));
    }
    const lang = (m[1] || 'text').trim();
    const code = escapeHtml(m[2]);
    parts.push(
      `<pre class="lesson-code-block bg-apple-bg/80 border border-apple-border/40 rounded-apple p-3 overflow-x-auto text-[12.5px] leading-relaxed font-mono my-3" data-lang="${escapeHtml(
        lang,
      )}"><code class="language-${escapeHtml(lang)}">${code}</code></pre>`,
    );
    lastIdx = fenceRe.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push(renderInline(text.slice(lastIdx)));
  }
  return parts.join('');
}

function renderInline(text: string): string {
  const escaped = escapeHtml(text);
  // Inline code: `text` (must come before bold so backticks don't get bolded)
  let out = escaped.replace(
    /`([^`]+?)`/g,
    '<code class="px-1 py-0.5 rounded bg-apple-surface/60 border border-apple-border/40 text-apple-accent font-mono text-[12.5px]">$1</code>',
  );
  // **bold**
  out = out.replace(
    /\*\*([^*]+?)\*\*/g,
    '<strong class="font-semibold text-apple-text">$1</strong>',
  );
  // newline → <br/>
  out = out.replace(/\n/g, '<br/>');
  return out;
}

/** Highlight every `<pre><code class="language-…">` inside `root` via Prism. */
function highlightPrismIn(root: HTMLElement | null): void {
  if (!root) return;
  const blocks = root.querySelectorAll('pre code[class*="language-"]');
  blocks.forEach((codeEl) => {
    const langMatch = codeEl.className.match(/language-([\w+-]+)/);
    const lang = langMatch?.[1] || 'text';
    const grammar = Prism.languages[lang] || Prism.languages.javascript;
    const raw = codeEl.textContent || '';
    codeEl.innerHTML = Prism.highlight(raw, grammar, lang);
  });
}

const TutorChatPanel = ({ lessonId, className = '' }: TutorChatPanelProps) => {
  const currentTrack = useTrackStore((s) => s.currentTrack);

  // ── Panel open/closed (collapsed on mobile, expanded on desktop) ─
  const [isOpen, setIsOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : false,
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [connState, setConnState] = useState<ConnState>('idle');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  /** Toast-style banner for non-fatal tier degradations (Lane E health badge
   *  fires `onDegrade` when the live tok/s drops below the stored tier's
   *  floor). Auto-dismisses after 6s so it behaves like a warning toast
   *  instead of permanently occupying the panel. */
  const [degradeBanner, setDegradeBanner] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitWarning | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const ollamaAbortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  // requestAnimationFrame-driven debounced re-render during token streams
  // (we mutate a ref-buffer for each token, then flush at most ~20× per sec).
  const streamBufferRef = useRef<string>('');
  const streamingMsgIdRef = useRef<string | null>(null);
  const rafScheduledRef = useRef<boolean>(false);

  // Local-llm onboarding state — persists tier + recommended model + benchmark
  // result in localStorage so the wizard runs once per device.
  const [localLlmTier, setLocalLlmTier] = useState<PersistedLocalLlmTier | null>(
    () => loadPersistedLocalLlmTier(),
  );
  const [liveTokensPerSec, setLiveTokensPerSec] = useState<number | undefined>(undefined);

  const localLlmOnboardingReady =
    localLlmTier !== null && localLlmTier.tier !== 'unsupported' && localLlmTier.tier !== 'unknown';
  const showOnboardingSlot =
    currentTrack === 'local-llm' && !localLlmOnboardingReady;

  // ── Cleanup pending streams on unmount ─────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      ollamaAbortRef.current?.abort();
    };
  }, []);

  // Auto-scroll on new tokens.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Auto-dismiss the degrade banner after 6s so it behaves like a toast.
  useEffect(() => {
    if (!degradeBanner) return;
    const t = setTimeout(() => setDegradeBanner(null), 6_000);
    return () => clearTimeout(t);
  }, [degradeBanner]);

  // Highlight code blocks after every assistant message reaches `done`.
  useEffect(() => {
    if (connState === 'done') {
      highlightPrismIn(transcriptRef.current);
    }
  }, [connState, messages]);

  const flushStreamingChunk = useCallback(() => {
    rafScheduledRef.current = false;
    const id = streamingMsgIdRef.current;
    const buffered = streamBufferRef.current;
    if (!id || !buffered) return;
    streamBufferRef.current = '';
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content: m.content + buffered } : m)),
    );
  }, []);

  const appendToken = useCallback(
    (chunk: string) => {
      streamBufferRef.current += chunk;
      if (!rafScheduledRef.current) {
        rafScheduledRef.current = true;
        requestAnimationFrame(flushStreamingChunk);
      }
    },
    [flushStreamingChunk],
  );

  const finalizeAssistant = useCallback((errorMessage?: string) => {
    // Flush any pending buffer before finalizing.
    if (streamBufferRef.current && streamingMsgIdRef.current) {
      const id = streamingMsgIdRef.current;
      const buffered = streamBufferRef.current;
      streamBufferRef.current = '';
      rafScheduledRef.current = false;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, content: m.content + buffered, done: true, error: errorMessage }
            : m,
        ),
      );
    } else if (streamingMsgIdRef.current) {
      const id = streamingMsgIdRef.current;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, done: true, error: errorMessage } : m)),
      );
    }
    streamingMsgIdRef.current = null;
  }, []);

  /** Build the OllamaChatMessage history from current visible messages. */
  const buildHistorySnapshot = useCallback((): OllamaChatMessage[] => {
    return messages
      .filter((m) => m.done && !m.error)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
  }, [messages]);

  /** Post telemetry-only (no prompt/response content) to the server. */
  const sendTelemetry = useCallback(
    async (payload: {
      sessionId: string | null;
      lessonId?: number;
      tokenCount: number;
      tokensPerSec?: number;
      errorCode?: string;
    }) => {
      try {
        const token = (() => {
          try {
            const stored = localStorage.getItem('claude-code-auth');
            if (!stored) return null;
            const parsed = JSON.parse(stored);
            return parsed?.state?.token ?? null;
          } catch {
            return null;
          }
        })();
        await fetch(`${API_BASE}/api/tutor/probe/telemetry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          // NEVER send prompt or response content. Telemetry only.
          body: JSON.stringify(payload),
        });
      } catch {
        // Telemetry failures are non-fatal.
      }
    },
    [],
  );

  /** Drive the local Ollama bridge given a `prompt-ready` payload. */
  const runOllamaBridge = useCallback(
    async (payload: PromptReadyPayload) => {
      ollamaAbortRef.current?.abort();
      const ctl = new AbortController();
      ollamaAbortRef.current = ctl;

      const startedAt = performance.now();
      let tokensSoFar = 0;
      let lastTelemetryAt = startedAt;

      const result = await streamFromOllama(
        {
          systemPrompt: payload.systemPrompt,
          history: payload.history,
          userMessage: payload.userMessage,
          model: payload.model,
          signal: ctl.signal,
        },
        (chunk) => {
          tokensSoFar += 1;
          appendToken(chunk);
          const now = performance.now();
          if (now - lastTelemetryAt > TELEMETRY_INTERVAL_MS) {
            lastTelemetryAt = now;
            const tokensPerSec =
              tokensSoFar / Math.max(1, (now - startedAt) / 1000);
            void sendTelemetry({
              sessionId,
              lessonId,
              tokenCount: tokensSoFar,
              tokensPerSec,
            });
          }
        },
      );

      if (result.status === 'ok') {
        const tokensPerSec =
          tokensSoFar / Math.max(1, result.durationMs / 1000);
        void sendTelemetry({
          sessionId,
          lessonId,
          tokenCount: tokensSoFar,
          tokensPerSec,
        });
        finalizeAssistant();
        setConnState('done');
      } else if (result.status === 'aborted') {
        finalizeAssistant('Abgebrochen.');
        setConnState('idle');
      } else if (result.status === 'cors-or-down') {
        void sendTelemetry({
          sessionId,
          lessonId,
          tokenCount: tokensSoFar,
          errorCode: 'ollama-cors-or-down',
        });
        finalizeAssistant(result.hint);
        setErrorBanner(result.hint);
        setConnState('error');
      } else if (result.status === 'http-error') {
        void sendTelemetry({
          sessionId,
          lessonId,
          tokenCount: tokensSoFar,
          errorCode: `ollama-http-${result.httpStatus}`,
        });
        finalizeAssistant(result.message);
        setErrorBanner(result.message);
        setConnState('error');
      } else {
        void sendTelemetry({
          sessionId,
          lessonId,
          tokenCount: tokensSoFar,
          errorCode: 'ollama-parse-error',
        });
        finalizeAssistant(result.message);
        setErrorBanner(result.message);
        setConnState('error');
      }
    },
    [appendToken, finalizeAssistant, lessonId, sendTelemetry, sessionId],
  );

  // ── Send message ───────────────────────────────────────────
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || connState === 'sending' || connState === 'streaming') return;

      setErrorBanner(null);

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: 'user',
        content: trimmed,
        done: true,
      };
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: 'assistant',
        content: '',
        done: false,
      };
      streamingMsgIdRef.current = assistantMsg.id;
      streamBufferRef.current = '';

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput('');
      setConnState('sending');

      const ctl = new AbortController();
      abortRef.current?.abort();
      abortRef.current = ctl;

      // Pull JWT for auth (mirrors the api.ts wrapper convention).
      const token = (() => {
        try {
          const stored = localStorage.getItem('claude-code-auth');
          if (!stored) return null;
          const parsed = JSON.parse(stored);
          return parsed?.state?.token ?? null;
        } catch {
          return null;
        }
      })();

      let response: Response;
      try {
        response = await fetch(`${API_BASE}/api/tutor/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            track: currentTrack,
            lessonId,
            message: trimmed,
            sessionId,
          }),
          signal: ctl.signal,
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          finalizeAssistant('Abgebrochen.');
          setConnState('idle');
          return;
        }
        const msg =
          'Verbindung zum Tutor fehlgeschlagen. Backend nicht erreichbar?';
        finalizeAssistant(msg);
        setErrorBanner(msg);
        setConnState('error');
        return;
      }

      if (!response.ok || !response.body) {
        const msg = `Tutor antwortet nicht (HTTP ${response.status}).`;
        finalizeAssistant(msg);
        setErrorBanner(msg);
        setConnState('error');
        return;
      }

      setConnState('streaming');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const { events, rest } = parseSseBuffer(buffer);
          buffer = rest;

          for (const evt of events) {
            if (evt.event === 'token') {
              try {
                const parsed = JSON.parse(evt.data) as { value: string };
                if (parsed.value) appendToken(parsed.value);
              } catch {
                // ignore malformed
              }
            } else if (evt.event === 'done') {
              try {
                const parsed = JSON.parse(evt.data) as {
                  sessionId?: string;
                  totalTokens?: number;
                };
                if (parsed.sessionId) setSessionId(parsed.sessionId);
              } catch {
                // ignore
              }
              finalizeAssistant();
              setConnState('done');
            } else if (evt.event === 'error') {
              try {
                const parsed = JSON.parse(evt.data) as {
                  code: string;
                  message: string;
                  hint?: string;
                };
                const banner = parsed.hint
                  ? `${parsed.message} — ${parsed.hint}`
                  : parsed.message;
                finalizeAssistant(banner);
                setErrorBanner(banner);
                setConnState('error');
              } catch {
                finalizeAssistant('Tutor-Stream brach mit Fehler ab.');
                setErrorBanner('Tutor-Stream brach mit Fehler ab.');
                setConnState('error');
              }
            } else if (evt.event === 'rate-limit-warning') {
              try {
                const parsed = JSON.parse(evt.data) as RateLimitWarning;
                setRateLimit(parsed);
              } catch {
                // ignore
              }
            } else if (evt.event === 'prompt-ready') {
              // Local-llm bridge: server hands us the full prompt,
              // we drive Ollama ourselves.
              try {
                const parsed = JSON.parse(evt.data) as PromptReadyPayload;
                // Server has fulfilled its side — close the SSE stream.
                // But we don't break out of the loop here because the
                // server may still emit `done` or `error` afterward
                // (e.g. rate-limit accounting). We just kick off Ollama.
                const histSnapshot = buildHistorySnapshot();
                // Use server-supplied history if present, else local snapshot.
                const history =
                  parsed.history && parsed.history.length > 0
                    ? parsed.history
                    : histSnapshot;
                void runOllamaBridge({
                  systemPrompt: parsed.systemPrompt,
                  history,
                  userMessage: parsed.userMessage,
                  model: parsed.model,
                });
              } catch {
                const msg = 'Prompt-Payload ungültig — lokaler Tutor nicht startbar.';
                finalizeAssistant(msg);
                setErrorBanner(msg);
                setConnState('error');
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          finalizeAssistant('Abgebrochen.');
          setConnState('idle');
          return;
        }
        const msg = err instanceof Error ? err.message : 'Stream-Fehler';
        finalizeAssistant(msg);
        setErrorBanner(msg);
        setConnState('error');
      }
    },
    [
      appendToken,
      buildHistorySnapshot,
      connState,
      currentTrack,
      finalizeAssistant,
      lessonId,
      runOllamaBridge,
      sessionId,
    ],
  );

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      void send(input);
    },
    [input, send],
  );

  const onAbort = useCallback(() => {
    abortRef.current?.abort();
    ollamaAbortRef.current?.abort();
    finalizeAssistant('Abgebrochen.');
    setConnState('idle');
  }, [finalizeAssistant]);

  // ── Collapsed-mode toggle button ───────────────────────────
  if (!isOpen) {
    return (
      <div className={`flex justify-end ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded="false"
          aria-controls="tutor-chat-panel"
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-apple-accent text-white shadow-lg hover:bg-apple-accentHover transition-all xl:static xl:bottom-auto xl:right-auto xl:rounded-apple xl:shadow-none"
        >
          <MessageSquare size={16} />
          <span className="text-sm font-mono uppercase tracking-wide">Tutor</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      id="tutor-chat-panel"
      className={`flex flex-col rounded-apple-lg bg-apple-surface/60 border border-apple-border/50 backdrop-blur-sm overflow-hidden ${className}`}
      aria-label="Tutor-Chat"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-apple-border/40 bg-apple-bg/40">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-apple-accent" />
          <span className="text-xs font-mono uppercase tracking-widest text-apple-textSecondary">
            KI-Tutor
          </span>
          <span className="text-[10px] font-mono text-apple-muted px-2 py-0.5 rounded-full border border-apple-border/40">
            {currentTrack}
          </span>
          {currentTrack === 'local-llm' && localLlmTier && (
            <LocalLlmTutorHealthBadge
              tier={localLlmTier.tier}
              tokensPerSec={liveTokensPerSec ?? localLlmTier.tokensPerSec}
              onDegrade={({ message }) => setDegradeBanner(message)}
              compact
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Tutor schließen"
          aria-expanded="true"
          aria-controls="tutor-chat-panel"
          className="text-apple-muted hover:text-apple-text transition-colors p-1 rounded"
        >
          <X size={14} />
        </button>
      </header>

      {/* Tier-downgrade toast (auto-dismisses after 6s).
          Warning-toned, NOT error-toned — degradation is informational, not a crash. */}
      {degradeBanner && (
        <div
          data-testid="local-llm-degrade-toast"
          className="px-4 py-2 bg-apple-warning/10 border-b border-apple-warning/30 flex items-start gap-2"
          role="status"
          aria-live="polite"
        >
          <AlertTriangle size={13} className="text-apple-warning mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-apple-warning leading-snug flex-1">
            {degradeBanner}
          </p>
          <button
            type="button"
            onClick={() => setDegradeBanner(null)}
            aria-label="Toast schließen"
            className="text-apple-warning hover:text-apple-text transition-colors -mt-0.5"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Rate-limit warning */}
      {rateLimit && rateLimit.percent >= 80 && (
        <div className="px-4 py-2 bg-apple-warning/10 border-b border-apple-warning/30 flex items-start gap-2">
          <AlertTriangle size={13} className="text-apple-warning mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-apple-warning leading-snug">
            Tutor-Limit: {rateLimit.used}/{rateLimit.cap} verbraucht
            ({Math.round(rateLimit.percent)}%).
          </p>
        </div>
      )}

      {/* Error banner */}
      {errorBanner && (
        <div className="px-4 py-2 bg-apple-error/10 border-b border-apple-error/30 flex items-start gap-2">
          <AlertTriangle size={13} className="text-apple-error mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-apple-error leading-snug">{errorBanner}</p>
        </div>
      )}

      {/* Local-LLM onboarding wizard (Lane E) — lazy-loaded so other tracks pay no cost */}
      {showOnboardingSlot && (
        <div
          data-testid="local-llm-onboarding-slot"
          className="border-b border-apple-border/40"
        >
          <Suspense
            fallback={
              <div className="px-4 py-3 flex items-center gap-2 text-apple-muted">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-[12px]">Onboarding lädt …</span>
              </div>
            }
          >
            <LocalLlmTutorOnboarding
              onComplete={(result) => {
                const persisted: PersistedLocalLlmTier = {
                  tier: result.tier,
                  recommendedModel: result.recommendedModel,
                  tokensPerSec: result.tokensPerSec,
                };
                persistLocalLlmTier(persisted);
                setLocalLlmTier(persisted);
                setLiveTokensPerSec(result.tokensPerSec);
              }}
            />
          </Suspense>
        </div>
      )}

      {/* Transcript */}
      <div
        ref={transcriptRef}
        className="flex-1 min-h-[280px] max-h-[60vh] overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 text-apple-muted">
            <MessageSquare size={24} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Stell mir eine Frage zu dieser Lektion oder dem Track.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-apple px-3 py-2 ${
                  m.role === 'user'
                    ? 'bg-apple-accent/15 border border-apple-accent/30 text-apple-text'
                    : 'bg-apple-bg/60 border border-apple-border/40 text-apple-text'
                }`}
              >
                <div
                  className="text-[13.5px] leading-relaxed prose-tutor"
                  dangerouslySetInnerHTML={{
                    __html: renderMessageMarkdown(m.content || ''),
                  }}
                />
                {!m.done && m.role === 'assistant' && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-apple-muted">
                    <Loader2 size={11} className="animate-spin" />
                    <span className="text-[10px] font-mono uppercase tracking-wide">
                      streaming
                    </span>
                  </div>
                )}
                {m.error && (
                  <p className="mt-1.5 text-[11px] text-apple-error font-mono">
                    {m.error}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={onSubmit}
        className="flex items-end gap-2 px-3 py-3 border-t border-apple-border/40 bg-apple-bg/30"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          rows={1}
          placeholder={
            showOnboardingSlot
              ? 'Onboarding abschließen, um den lokalen Tutor zu nutzen …'
              : 'Frage stellen — Enter zum Senden, Shift+Enter für Zeilenumbruch'
          }
          disabled={showOnboardingSlot || connState === 'streaming' || connState === 'sending'}
          className="flex-1 resize-none bg-apple-bg/60 border border-apple-border/50 rounded-apple px-3 py-2 text-sm text-apple-text placeholder:text-apple-muted focus:outline-none focus:ring-2 focus:ring-apple-accent/50 focus:border-apple-accent disabled:opacity-50 disabled:cursor-not-allowed font-mono"
          aria-label="Nachricht an Tutor"
        />
        {connState === 'streaming' || connState === 'sending' ? (
          <button
            type="button"
            onClick={onAbort}
            className="px-3 py-2 rounded-apple bg-apple-error/15 text-apple-error border border-apple-error/30 hover:bg-apple-error/25 transition-all min-h-[40px] inline-flex items-center gap-1.5"
            aria-label="Stream abbrechen"
          >
            <X size={14} />
            <span className="text-xs font-mono">Stop</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || showOnboardingSlot}
            className="px-3 py-2 rounded-apple bg-apple-accent text-white hover:bg-apple-accentHover transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] inline-flex items-center gap-1.5"
            aria-label="Frage senden"
          >
            <Send size={14} />
            <span className="text-xs font-mono">Senden</span>
          </button>
        )}
      </form>
    </aside>
  );
};

export default TutorChatPanel;
