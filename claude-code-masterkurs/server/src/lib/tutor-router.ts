// ─────────────────────────────────────────────────────────────────────────────
// Tutor Router
// -----------------------------------------------------------------------------
// Routes a tutor message to the appropriate backend:
//   * `local-llm` track  → emits a `prompt-ready` SSE event so the browser
//                          talks to its own localhost:11434 Ollama instance.
//                          The server NEVER opens an outbound socket to a
//                          user machine — that is the privacy/security
//                          boundary explicitly required by the plan.
//   * other tracks       → streams tokens from Anthropic.
//                          `standard` tier → claude-sonnet-4-6
//                          `pro`      tier → claude-opus-4-7
//
// The Anthropic client is created lazily on first use to avoid running env
// validation / network setup at module-import time (Cosmo's hard rule).
//
// Persona loading: tutor-persona.md files live in masterkurs-agent/track-configs/
// and are created by Lane A. We graceful-degrade to a default persona string
// if the file is missing — never crash on startup.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Re-export TierKey from Lane A's catalog (canonical source of truth).
export type { TierKey } from './local-llm-tier-catalog.js';

// ── Public Types ──────────────────────────────────────────────────────────

export type TrackKey =
  | 'claude-code'
  | 'claude-desktop'
  | 'codex'
  | 'local-llm';

export type TutorTier = 'standard' | 'pro';

export interface TutorHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TutorRouteInput {
  track: TrackKey;
  tier: TutorTier;
  lessonId?: number | null;
  userMessage: string;
  history: TutorHistoryMessage[];
  /** For local-llm track: which Ollama model the browser should run.
   *  Resolved by the route handler from User.localLlmTutorTier → TIER_CATALOG. */
  localLlmModel?: string;
}

/** Generic SSE event the route emits. The caller (`/api/tutor/chat`)
 *  serialises these to the response stream. */
export type TutorStreamEvent =
  | { type: 'token'; value: string }
  | {
      type: 'prompt-ready';
      systemPrompt: string;
      history: TutorHistoryMessage[];
      userMessage: string;
      /** Ollama model identifier the browser must use. */
      model: string;
    }
  | { type: 'done'; totalTokens: number; assistantContent: string }
  | { type: 'error'; code: string; message: string; hint?: string };

// ── Persona loading ──────────────────────────────────────────────────────

const personaCache = new Map<TrackKey, string>();

const DEFAULT_PERSONA = (track: TrackKey): string =>
  `Du bist ein freundlicher, präziser Tutor für den ${track}-Track des Claude Code Masterkurses. Antworte auf Deutsch. Erkläre Konzepte schrittweise, gib konkrete Code-Beispiele und verweise — wenn sinnvoll — auf die Lektionen des Kurses.`;

async function loadPersona(track: TrackKey): Promise<string> {
  const cached = personaCache.get(track);
  if (cached) return cached;

  // server/src/lib/tutor-router.ts → ../../../../masterkurs-agent/track-configs/<track>/tutor-persona.md
  const here = fileURLToPath(new URL('.', import.meta.url));
  const path = resolve(
    here,
    `../../../../masterkurs-agent/track-configs/${track}/tutor-persona.md`
  );

  try {
    const text = await readFile(path, 'utf8');
    personaCache.set(track, text);
    return text;
  } catch {
    // graceful degrade — Lane A may not have shipped the persona file yet
    const fallback = DEFAULT_PERSONA(track);
    personaCache.set(track, fallback);
    return fallback;
  }
}

// ── Lazy Anthropic client (no module-import side-effects) ────────────────

let _anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set — tutor cannot route to cloud models. ' +
        'Set the env var or use the local-llm track.'
    );
  }
  _anthropic = new Anthropic({ apiKey });
  return _anthropic;
}

// ── Model selection ──────────────────────────────────────────────────────

function modelForTier(tier: TutorTier): string {
  // Per spec — tutor-tier mapping. Adjust here if model IDs rotate.
  return tier === 'pro' ? 'claude-opus-4-7' : 'claude-sonnet-4-6';
}

// ── System prompt assembly ───────────────────────────────────────────────

function buildSystemPrompt(persona: string, lessonId?: number | null): string {
  if (lessonId != null) {
    return `${persona}\n\n[Kontext] Aktuelle Lektion: Lektion ${lessonId}.`;
  }
  return persona;
}

// ── Public: route() — produces an AsyncGenerator of SSE events ───────────

export async function* route(
  input: TutorRouteInput
): AsyncGenerator<TutorStreamEvent, void, unknown> {
  const persona = await loadPersona(input.track);
  const systemPrompt = buildSystemPrompt(persona, input.lessonId);

  // ── local-llm: emit prompt-ready and let the browser do the inference.
  //   Server NEVER opens a socket to the user's Ollama instance — this is
  //   the explicit privacy boundary in the multi-track plan.
  if (input.track === 'local-llm') {
    // Fallback model if the caller didn't resolve one from the user's tier
    // (e.g. user hasn't completed the onboarding wizard yet). Tier-S default
    // is the smallest viable model and matches Lane A's catalog.
    const model = input.localLlmModel ?? 'qwen2.5-coder:3b';
    yield {
      type: 'prompt-ready',
      systemPrompt,
      history: input.history,
      userMessage: input.userMessage,
      model,
    };
    // The assistant turn is persisted by the client via a follow-up
    // POST (out of scope for this route function — see /api/tutor/chat).
    yield { type: 'done', totalTokens: 0, assistantContent: '' };
    return;
  }

  // ── cloud (Anthropic) path
  let client: Anthropic;
  try {
    client = getAnthropic();
  } catch (err) {
    yield {
      type: 'error',
      code: 'no_api_key',
      message:
        err instanceof Error ? err.message : 'Anthropic API key fehlt.',
      hint: 'Setze ANTHROPIC_API_KEY oder verwende den local-llm Track.',
    };
    return;
  }

  const model = modelForTier(input.tier);

  const messages = [
    ...input.history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: input.userMessage },
  ];

  let assistantText = '';
  let totalTokens = 0;

  try {
    const stream = client.messages.stream({
      model,
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          // Prompt-caching: persona + lesson-frontmatter rarely change
          // within a session, so cache the system block.
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        const value = event.delta.text;
        assistantText += value;
        yield { type: 'token', value };
      } else if (event.type === 'message_delta') {
        // Final usage info arrives on the message_delta event.
        const usage = event.usage;
        if (usage) {
          totalTokens =
            (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0);
        }
      }
    }

    yield { type: 'done', totalTokens, assistantContent: assistantText };
  } catch (err) {
    yield {
      type: 'error',
      code: 'upstream_error',
      message:
        err instanceof Error ? err.message : 'Unbekannter Fehler vom Anthropic-Stream.',
    };
  }
}
