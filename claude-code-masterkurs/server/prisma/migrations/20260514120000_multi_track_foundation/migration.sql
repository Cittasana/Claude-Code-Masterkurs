-- Multi-Track Foundation (Phase 0 of the Multi-Track Plattform plan)
-- See ~/.claude/plans/abstract-moseying-sutton.md §"Phase 0 — Schema + Track Registry"
--
-- Adds:
--   • AgentRun.track             — tracks which track a research/freshness run targets
--   • Subscription.entitled_tracks + tutor_tier — multi-track entitlement + tutor model tier
--   • LessonConfig.track default change 'main' → 'claude-code' (data + schema)
--   • TutorSession + TutorMessage — in-app tutor chat persistence
--   • WebhookEvent                — Stripe/Discord webhook idempotency log
--
-- Idempotent migration: each statement uses IF NOT EXISTS / WHERE guards
-- so this can replay safely after a partial failure.

-- ── AgentRun.track ──────────────────────────────────────────────
ALTER TABLE "agent_runs"
  ADD COLUMN IF NOT EXISTS "track" TEXT NOT NULL DEFAULT 'claude-code';

CREATE INDEX IF NOT EXISTS "agent_runs_track_idx" ON "agent_runs"("track");

-- ── Subscription multi-track entitlements ───────────────────────
ALTER TABLE "subscriptions"
  ADD COLUMN IF NOT EXISTS "entitled_tracks" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "subscriptions"
  ADD COLUMN IF NOT EXISTS "tutor_tier" TEXT NOT NULL DEFAULT 'standard';

-- ── LessonConfig.track: default change + backfill ───────────────
-- Backfill BEFORE changing the default so future inserts already get
-- 'claude-code' and existing rows still on 'main' are normalized.
UPDATE "lesson_configs" SET "track" = 'claude-code' WHERE "track" = 'main';

ALTER TABLE "lesson_configs" ALTER COLUMN "track" SET DEFAULT 'claude-code';

-- ── TutorSession ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "tutor_sessions" (
  "id"         TEXT NOT NULL,
  "user_id"    TEXT NOT NULL,
  "track"      TEXT NOT NULL,
  "lesson_id"  INTEGER,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "tutor_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "tutor_sessions_user_id_created_at_idx"
  ON "tutor_sessions"("user_id", "created_at");

CREATE INDEX IF NOT EXISTS "tutor_sessions_track_idx"
  ON "tutor_sessions"("track");

ALTER TABLE "tutor_sessions"
  ADD CONSTRAINT "tutor_sessions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── TutorMessage ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "tutor_messages" (
  "id"          TEXT NOT NULL,
  "session_id"  TEXT NOT NULL,
  "role"        TEXT NOT NULL,
  "content"     TEXT NOT NULL,
  "token_count" INTEGER,
  "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "tutor_messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "tutor_messages_session_id_created_at_idx"
  ON "tutor_messages"("session_id", "created_at");

ALTER TABLE "tutor_messages"
  ADD CONSTRAINT "tutor_messages_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "tutor_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── WebhookEvent ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "webhook_events" (
  "id"                 TEXT NOT NULL,
  "source"             TEXT NOT NULL,
  "external_event_id"  TEXT NOT NULL,
  "payload"            JSONB NOT NULL,
  "processed_at"       TIMESTAMP(3),
  "created_at"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "webhook_events_external_event_id_key"
  ON "webhook_events"("external_event_id");

CREATE INDEX IF NOT EXISTS "webhook_events_source_processed_at_idx"
  ON "webhook_events"("source", "processed_at");
