// ─────────────────────────────────────────────────────────────
// Ollama Browser-Bridge (Local-LLM track only)
//
// Phase 3 of the Multi-Track Plattform plan introduces a tutor
// chat that runs against a *local* Ollama daemon for users on
// the `local-llm` track. Prompts (system + history + user
// message) are minted by the server, streamed to the browser
// via SSE event `prompt-ready`, and the browser then calls
// `http://localhost:11434/api/chat` directly. Tokens are shown
// to the user as they arrive. The browser also pings the
// server with telemetry-only metadata (token count, errors) —
// NEVER the prompt content or response content. Privacy boundary
// is the single most important contract here.
//
// CORS: by default Ollama only accepts requests from
// `http://localhost:*`. For akademie.cittasana.de to talk to a
// local Ollama daemon, the user must set
// `OLLAMA_ORIGINS=https://akademie.cittasana.de ollama serve`.
// We detect this failure mode and surface a hint.
// ─────────────────────────────────────────────────────────────

const OLLAMA_BASE_URL =
  (import.meta.env.VITE_OLLAMA_BASE_URL as string | undefined) ||
  'http://localhost:11434';

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaStreamArgs {
  /** System prompt minted by the server (track persona + lesson context). */
  systemPrompt: string;
  /** Conversation history (alternating user/assistant turns). */
  history: OllamaChatMessage[];
  /** The user's new message. */
  userMessage: string;
  /** Ollama model identifier (e.g. "llama3.1:8b", "qwen2.5:7b"). */
  model: string;
  /** Optional AbortSignal so the UI can cancel a stream. */
  signal?: AbortSignal;
}

export type OllamaStreamStatus =
  | { status: 'ok'; totalTokens: number; durationMs: number }
  | {
      status: 'cors-or-down';
      hint: string;
      raw?: string;
    }
  | {
      status: 'http-error';
      httpStatus: number;
      message: string;
    }
  | {
      status: 'aborted';
    }
  | {
      status: 'parse-error';
      message: string;
    };

const CORS_HINT =
  'Ollama-Daemon nicht erreichbar oder CORS-Block. Bitte starte den Daemon mit ' +
  'OLLAMA_ORIGINS=https://akademie.cittasana.de ollama serve (oder ' +
  'OLLAMA_ORIGINS=* für lokales Testing).';

/**
 * Stream a chat completion from the local Ollama daemon.
 *
 * `onToken` is called for every token-shaped delta the daemon emits.
 * Returns a status object describing how the stream ended.
 *
 * **Privacy contract**: this function never sends prompt or response
 * content back to the server. Callers may emit telemetry (token
 * counts, error codes) via a separate channel but must keep the
 * content local.
 */
export async function streamFromOllama(
  args: OllamaStreamArgs,
  onToken: (chunk: string) => void,
): Promise<OllamaStreamStatus> {
  const { systemPrompt, history, userMessage, model, signal } = args;

  // Assemble messages: [system, ...history, user]
  const messages: OllamaChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const startedAt = performance.now();
  let totalTokens = 0;

  let response: Response;
  try {
    response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
      signal,
    });
  } catch (err) {
    // signal abort surfaces as DOMException with name "AbortError"
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { status: 'aborted' };
    }
    // TypeError "Failed to fetch" → CORS or daemon down. The browser
    // can't distinguish between the two at the JS layer (CORS preflight
    // failure looks identical to ECONNREFUSED).
    return { status: 'cors-or-down', hint: CORS_HINT, raw: String(err) };
  }

  if (!response.ok) {
    // 403 with no body / Origin-rejection → also CORS-typed.
    if (response.status === 403) {
      return { status: 'cors-or-down', hint: CORS_HINT };
    }
    return {
      status: 'http-error',
      httpStatus: response.status,
      message: `Ollama HTTP ${response.status}`,
    };
  }

  if (!response.body) {
    return { status: 'parse-error', message: 'Ollama response body is empty.' };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Ollama streams NDJSON: one JSON object per line.
      let newlineIdx = buffer.indexOf('\n');
      while (newlineIdx !== -1) {
        const line = buffer.slice(0, newlineIdx).trim();
        buffer = buffer.slice(newlineIdx + 1);
        if (line) {
          try {
            const parsed = JSON.parse(line) as {
              message?: { content?: string };
              done?: boolean;
            };
            const chunk = parsed.message?.content ?? '';
            if (chunk) {
              totalTokens += 1;
              onToken(chunk);
            }
          } catch {
            // Skip malformed lines silently — daemon sometimes emits
            // partial frames at chunk boundaries.
          }
        }
        newlineIdx = buffer.indexOf('\n');
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { status: 'aborted' };
    }
    return {
      status: 'parse-error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  return {
    status: 'ok',
    totalTokens,
    durationMs: performance.now() - startedAt,
  };
}

/**
 * Lightweight reachability probe — used by onboarding flows to
 * verify the daemon is up before kicking off a full chat stream.
 * Returns true if Ollama responds; false on any failure
 * (CORS, network, HTTP error).
 */
export async function isOllamaReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const ollamaClient = {
  streamFromOllama,
  isOllamaReachable,
  CORS_HINT,
};
