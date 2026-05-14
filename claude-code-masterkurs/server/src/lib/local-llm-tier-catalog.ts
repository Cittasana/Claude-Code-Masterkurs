// ─────────────────────────────────────────────────────────────
// Local LLM Tier Catalog — Phase 3
// ─────────────────────────────────────────────────────────────
// Pure-data module classifying user hardware into Tier S / M / L
// for the Local-LLM track. Used by the tutor router to pick the
// right model recommendation and inference advice.
//
// Source of truth: Locked Decision #4 in Phase-3 plan.
// DO NOT mutate the catalog values without re-locking that decision.
//
// No env access at import-time. No side effects.
// All exports have explicit return types (TS strict).

/**
 * Discrete hardware tier for local-LLM workloads.
 * - tier-s/m/l: increasing capability floors
 * - unsupported: hardware below tier-s minimums (no usable local-coding setup)
 * - unknown: input was invalid / not enough signal to classify
 */
export type TierKey = 'tier-s' | 'tier-m' | 'tier-l' | 'unsupported' | 'unknown';

/**
 * Full specification of a single hardware tier including the
 * recommended coding model for that tier.
 */
export interface TierSpec {
  /** Stable tier key (matches TierKey discriminant). */
  key: TierKey;
  /** Human-readable label, German UI string. */
  label: string;
  /** Minimum total system RAM in GB (unified memory on Apple Silicon). */
  minRamGB: number;
  /** Minimum sustained inference throughput in tokens/sec for the recommended model. */
  minTokPerSec: number;
  /** Optional minimum dedicated VRAM in GB. Undefined = no GPU floor (unified memory fine). */
  minVramGB?: number;
  /** Canonical model recommendation for this tier (Ollama tag format). */
  recommendedModel: string;
  /** Approximate on-disk model size in GB (Q4_K_M default quant). */
  modelSizeGB: number;
  /** Short German description shown alongside tier in the UI. */
  description: string;
}

/**
 * Catalog of supported tiers.
 *
 * Values frozen per Locked Decision #4:
 *   - tier-s: 16 GB RAM, 8 tok/s, Qwen2.5-Coder-3B
 *   - tier-m: 24 GB RAM, 12 tok/s, GPU >= M2 / RTX-3060 class, Qwen2.5-Coder-7B
 *   - tier-l: 32 GB RAM, 18 tok/s, GPU >= 12 GB VRAM, Qwen2.5-Coder-14B
 *
 * The 'unsupported' bucket carries placeholder model info for UI rendering only;
 * classifyTier() never recommends a real model below tier-s.
 */
export const TIER_CATALOG: Record<Exclude<TierKey, 'unknown'>, TierSpec> = {
  'tier-s': {
    key: 'tier-s',
    label: 'Tier S (16GB-Klasse)',
    minRamGB: 16,
    minTokPerSec: 8,
    recommendedModel: 'qwen2.5-coder:3b',
    modelSizeGB: 2,
    description:
      'Einstiegsklasse für lokales Coding: MacBook M1/M2/M3 mit 16GB Unified Memory oder Linux-Laptops mit 16GB RAM. Brauchbar für Code-Completion und kurze Edits.',
  },
  'tier-m': {
    key: 'tier-m',
    label: 'Tier M (24GB-Klasse + GPU)',
    minRamGB: 24,
    minTokPerSec: 12,
    minVramGB: 8,
    recommendedModel: 'qwen2.5-coder:7b',
    modelSizeGB: 4.5,
    description:
      'Workstation-Klasse: 24GB+ RAM mit M2/M3 Pro oder dedizierter GPU ab RTX-3060-Niveau. Gut für agentische Coding-Tasks mit mehreren Tool-Calls.',
  },
  'tier-l': {
    key: 'tier-l',
    label: 'Tier L (32GB+ mit starker GPU)',
    minRamGB: 32,
    minTokPerSec: 18,
    minVramGB: 12,
    recommendedModel: 'qwen2.5-coder:14b',
    modelSizeGB: 9,
    description:
      'High-End-Setup: 32GB+ RAM mit GPU ab 12GB VRAM (RTX 4070 Ti / 3090 / Mac Studio M-Pro/Max). Production-tauglich für längere Reasoning-Ketten. Alternativ: Devstral-Small Q4.',
  },
  unsupported: {
    key: 'unsupported',
    label: 'Nicht unterstützt',
    minRamGB: 0,
    minTokPerSec: 0,
    recommendedModel: '—',
    modelSizeGB: 0,
    description:
      'Deine Hardware liegt unter dem Tier-S-Floor (16GB RAM / 8 tok/s). Lokales Coding ist auf diesem Setup nicht brauchbar — empfohlen: Hardware-Upgrade oder Wechsel auf einen Cloud-basierten Track.',
  },
};

/**
 * Runtime input from the hardware-probe step.
 *
 * - totalRamGB: required. System or unified memory in GB.
 * - gpuVramGB: optional. Dedicated GPU VRAM in GB. Undefined = no discrete GPU.
 * - tokensPerSec: optional. Measured throughput from a benchmark probe.
 *   When omitted, classification is RAM/VRAM-only (static probe).
 *   When provided, the tier's minTokPerSec floor must also be satisfied.
 */
export interface ClassifyInput {
  totalRamGB: number;
  gpuVramGB?: number;
  tokensPerSec?: number;
}

/**
 * Classify hardware into a TierKey.
 *
 * Rules (highest-tier-first; first match wins):
 *   1. Invalid input (NaN or <= 0 RAM)             -> 'unknown'
 *   2. Meets all floors of tier-l                  -> 'tier-l'
 *   3. Meets all floors of tier-m                  -> 'tier-m'
 *   4. Meets all floors of tier-s                  -> 'tier-s'
 *   5. Otherwise                                    -> 'unsupported'
 *
 * Floor semantics per tier:
 *   - RAM:        totalRamGB >= tier.minRamGB                (always checked)
 *   - VRAM:       gpuVramGB  >= tier.minVramGB               (only if tier defines minVramGB)
 *   - Throughput: tokensPerSec >= tier.minTokPerSec          (only if input.tokensPerSec defined)
 *
 * If tokensPerSec is omitted, throughput is treated as "not yet measured" rather
 * than failing — callers running a static probe only get a RAM/VRAM-based estimate.
 */
export function classifyTier(input: ClassifyInput): TierKey {
  const { totalRamGB, gpuVramGB, tokensPerSec } = input;

  if (!Number.isFinite(totalRamGB) || totalRamGB <= 0) {
    return 'unknown';
  }

  const meetsFloors = (tier: TierSpec): boolean => {
    if (totalRamGB < tier.minRamGB) return false;
    if (tier.minVramGB !== undefined) {
      if (gpuVramGB === undefined || gpuVramGB < tier.minVramGB) return false;
    }
    if (tokensPerSec !== undefined && tokensPerSec < tier.minTokPerSec) {
      return false;
    }
    return true;
  };

  if (meetsFloors(TIER_CATALOG['tier-l'])) return 'tier-l';
  if (meetsFloors(TIER_CATALOG['tier-m'])) return 'tier-m';
  if (meetsFloors(TIER_CATALOG['tier-s'])) return 'tier-s';
  return 'unsupported';
}

/**
 * Convenience getter: look up the full TierSpec for a TierKey.
 * Returns undefined for 'unknown' (no canonical spec — caller renders fallback UI).
 */
export function getTierSpec(key: TierKey): TierSpec | undefined {
  if (key === 'unknown') return undefined;
  return TIER_CATALOG[key];
}
