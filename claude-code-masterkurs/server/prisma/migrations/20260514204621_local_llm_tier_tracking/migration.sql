-- Local-LLM Tier Tracking (Phase 3 of the Multi-Track Plattform plan)
-- See ~/.claude/plans/abstract-moseying-sutton.md §"Phase 3 — Tutor-Chat + Hardware-Probing"
--
-- Adds 3 nullable columns to the users table so the backend can persist
-- the result of the latest hardware probe (static + benchmark + runtime
-- telemetry) for each user on the local-llm track:
--   • local_llm_tutor_tier        — 'tier-s' | 'tier-m' | 'tier-l' | 'unsupported'
--   • local_llm_last_probe_at     — timestamp of the last probe write
--   • local_llm_last_tok_per_sec  — last observed tokens/sec (benchmark or telemetry)
--
-- Rollback:
--   ALTER TABLE "users"
--     DROP COLUMN "local_llm_tutor_tier",
--     DROP COLUMN "local_llm_last_probe_at",
--     DROP COLUMN "local_llm_last_tok_per_sec";
--
-- Idempotent migration: each statement uses IF NOT EXISTS so this can
-- replay safely after a partial failure.

-- ── User local-LLM tier tracking ───────────────────────────────
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "local_llm_tutor_tier" TEXT,
  ADD COLUMN IF NOT EXISTS "local_llm_last_probe_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "local_llm_last_tok_per_sec" DOUBLE PRECISION;
