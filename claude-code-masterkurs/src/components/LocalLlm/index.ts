/**
 * LocalLlm — Phase 3 Tutor-Chat surface for the Local-LLM track.
 *
 * Exports:
 *   - LocalLlmTutorOnboarding (default + named): 5-step wizard
 *   - LocalLlmTutorHealthBadge (default + named): live status pill
 *   - TierKey: shared type (matches server/src/lib/local-llm-tier-catalog.ts — Lane A)
 *
 * Both components are designed to be code-split via React.lazy() from
 * TutorChatPanel / LessonView (Lane D).
 */

export { LocalLlmTutorOnboarding } from './LocalLlmTutorOnboarding';
export type {
  LocalLlmTutorOnboardingProps,
  TierKey,
} from './LocalLlmTutorOnboarding';
export { default as LocalLlmTutorOnboardingDefault } from './LocalLlmTutorOnboarding';

export { LocalLlmTutorHealthBadge } from './LocalLlmTutorHealthBadge';
export type { LocalLlmTutorHealthBadgeProps } from './LocalLlmTutorHealthBadge';
export { default as LocalLlmTutorHealthBadgeDefault } from './LocalLlmTutorHealthBadge';
// Note: TierKey is also exported from LocalLlmTutorHealthBadge — both definitions
// are intentionally identical and will collapse to a single source post-merge with
// Lane A's server/src/lib/local-llm-tier-catalog.ts.
