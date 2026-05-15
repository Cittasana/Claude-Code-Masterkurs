# Codex Track — Curriculum Specification

**Status:** Phase 4 Draft (2026-05-15)
**Track key:** `codex`
**Total lessons:** 36 (12 Beginner / 12 Intermediate / 12 Advanced)
**Primary language:** English (DE via translation pass per Locked Decision #5)
**Estimated total runtime:** ~ 8.75 hours active content (≈ 60 min Beginner + 145 min Intermediate + 320 min Advanced; reading + hands-on)
**Launch wave:** Phase 4a (per Locked Decision #1: Codex → Local-LLM → Claude-Desktop)
**Reviewer:** Cosmo (solo)

## Authoring notes
- This spec drives `masterkurs-lesson-creator --track codex`. Each lesson here becomes 1 lesson module in `claude-code-masterkurs/src/data/lessons-codex.ts` after the lesson-creator + linter pipeline.
- Versioning: every Codex CLI version reference must point to >= 0.130. Anything older = drift.
- All BeyondTrust-CVE references must source from official CVE database, not memory.
- ID scheme: this spec uses track-local IDs `0–35` for readability. Final runtime IDs live in the `2000–2999` range per `lesson-style.md` ID-range convention — the lesson-creator pipeline numbers them at seeding (offset `+2000`).
- Each lesson MUST follow the 7 Pflicht-Sektionen from `lesson-style.md`: Lernziele, Codex-Version, Beispiel-Code, Vergleich zu Claude Code, Übung, Common Mistakes, Quellen.
- Voice: EN-first per Locked Decision #5; direct second-person "you", informal but technically precise. DE pass keeps Du-Form and identical structure.
- Tutor-persona guardrails (`tutor-persona.md`) apply: never name Anthropic's CLI as a recommended subject — neutral reference only. Comparison tables are permitted (and required per lesson-style §4) but must be Codex-positive in framing, not Codex-vs-Claude-bashing.

---

## Beginner (12 Lessons)

> Audience: developers new to Codex CLI but fluent in terminal + git. Goal: install Codex, ship first plan-first task, understand AGENTS.md, internalize cost model.
> Average length: 10 min (range 5–15). Total Beginner runtime ≈ 120 min.

### Lesson 0 — Welcome to Codex CLI: What It Is and Who It's For

- **Level:** 1 (Beginner)
- **Title:** Welcome to Codex CLI: What It Is and Who It's For
- **Learning objectives:**
  - Define what OpenAI Codex CLI is and which GPT-Codex model class powers it
  - Identify the three Codex surfaces (CLI, Cloud Sandbox, JetBrains plugin)
  - Position Codex against other agentic coding tools without vendor-bashing
  - Decide whether the Codex-only, hybrid, or other-track path fits your situation
- **Prerequisites:** none
- **Length target:** 10 min
- **Content focus:** Establishes the track's mental model. Frames Codex as the OpenAI-ecosystem-native agentic CLI and previews the 36-lesson arc. Sets expectations about ChatGPT plan tiers, pricing, and EU availability caveats.
- **Code/Demo emphasis:** Conceptual. One annotated `codex --version` output. No deep code.
- **SRS card themes:**
  - "Codex CLI vs ChatGPT.com — which is which"
  - "Three Codex surfaces (CLI, Cloud, JetBrains)"
  - "GPT-Codex model family naming"
  - "EU vs US availability map (snapshot 2026-05)"

### Lesson 1 — Install Codex CLI and Authenticate

- **Level:** 1 (Beginner)
- **Title:** Install Codex CLI and Authenticate
- **Learning objectives:**
  - Install Codex CLI ≥ 0.130 on macOS, Linux, and WSL2
  - Authenticate via ChatGPT account vs API-key flow and know when to pick which
  - Verify the install with `codex --version` and a no-op smoke command
  - Recover from the three most common install failures (Node version, PATH, OAuth callback)
- **Prerequisites:** 0
- **Length target:** 10 min
- **Content focus:** Hands-on install walkthrough. Side-by-side flow for `npm i -g @openai/codex` and the OAuth login. Explains the difference between ChatGPT-Plan-bound usage and API-key billing.
- **Code/Demo emphasis:** Heavy. Real commands + expected outputs. Troubleshooting block with verbatim error strings.
- **SRS card themes:**
  - "Minimum Node version for Codex 0.130+"
  - "ChatGPT plan auth vs OPENAI_API_KEY auth"
  - "Where Codex stores its config on disk (`~/.codex/`)"
  - "Smoke-test command for fresh installs"

### Lesson 2 — Your First Codex Session: Plan → Apply → Done

- **Level:** 1 (Beginner)
- **Title:** Your First Codex Session: Plan → Apply → Done
- **Learning objectives:**
  - Run `codex` in an existing repo and read the workspace summary it prints
  - Understand the Plan / Edit / Auto approval modes and pick the safe default
  - Approve, reject, and revise a plan before any file is touched
  - Exit cleanly and inspect what Codex actually changed via `git diff`
- **Prerequisites:** 1
- **Length target:** 10 min
- **Content focus:** The first ten minutes inside a Codex session. Demonstrates the plan-first loop using a tiny demo repo (rename a function across 2 files).
- **Code/Demo emphasis:** Heavy. Full transcript of one session with annotations.
- **SRS card themes:**
  - "Plan vs Edit vs Auto — when each is safe"
  - "How Codex prints workspace-write vs read-only sandbox state"
  - "Approve-once vs approve-each"
  - "`/exit` vs Ctrl+D semantics"

### Lesson 3 — AGENTS.md Basics: The Spec File Codex Reads

- **Level:** 1 (Beginner)
- **Title:** AGENTS.md Basics: The Spec File Codex Reads
- **Learning objectives:**
  - Author a minimal `AGENTS.md` for a single-package repo
  - List the four required sections (project goal, conventions, do-not-touch, commands)
  - Explain why AGENTS.md drift causes hallucinated patches
  - Verify Codex picked up your AGENTS.md via the session header
- **Prerequisites:** 2
- **Length target:** 15 min
- **Content focus:** The format basics. Walks through a real AGENTS.md for a Next.js side project, line by line. Compares philosophy (spec-file analog) to other ecosystem conventions without naming the competing tool.
- **Code/Demo emphasis:** Heavy. Full example AGENTS.md plus diff before/after Codex reads it.
- **SRS card themes:**
  - "Four mandatory AGENTS.md sections"
  - "Where Codex looks for AGENTS.md (project root vs nested)"
  - "Drift symptoms: 3 telltale signs"
  - "Single-package vs monorepo placement"

### Lesson 4 — Your First Codex Cloud Sandbox Run

- **Level:** 1 (Beginner)
- **Title:** Your First Codex Cloud Sandbox Run
- **Learning objectives:**
  - Trigger a Codex Cloud Sandbox session from the CLI
  - Distinguish local-sandbox from Cloud-Sandbox execution
  - Read the Cloud-Sandbox cost line and what it bills against
  - Pull artifacts back into your local workspace
- **Prerequisites:** 2
- **Length target:** 10 min
- **Content focus:** Introduces Cloud Sandbox as the "ephemeral remote VM" mode. Use case: run a noisy migration without trashing the laptop's Node environment.
- **Code/Demo emphasis:** Heavy. Full Cloud-Sandbox transcript + cost panel screenshot reference.
- **SRS card themes:**
  - "Local sandbox vs Cloud sandbox — when each wins"
  - "Cloud-Sandbox session timeout"
  - "Where artifacts are written back"
  - "Cost units charged per Cloud-Sandbox minute"

### Lesson 5 — Plan-First Mental Model

- **Level:** 1 (Beginner)
- **Title:** Plan-First Mental Model
- **Learning objectives:**
  - Articulate the plan-first principle in one sentence
  - Spot the three failure modes plan-first prevents (silent overwrites, scope creep, mid-task pivots)
  - Convert an ambiguous prompt into a structured plan request
  - Decide when to skip the plan step (rare — and why)
- **Prerequisites:** 2
- **Length target:** 5 min
- **Content focus:** Short conceptual lesson. The mindset shift from "tell Codex what to do" to "ask Codex what it would do, then approve."
- **Code/Demo emphasis:** Light. One before/after prompt comparison.
- **SRS card themes:**
  - "Plan-first one-line principle"
  - "Three failure modes plan-first prevents"
  - "When skipping the plan is acceptable"
  - "Ambiguous prompt — concrete rewrite pattern"

### Lesson 6 — Basic Prompt Patterns for Codex

- **Level:** 1 (Beginner)
- **Title:** Basic Prompt Patterns for Codex
- **Learning objectives:**
  - Apply the five copy-pasteable prompt patterns (Locate, Explain, Refactor, Test, Document)
  - Add file-path hints to anchor Codex on the right code
  - Specify acceptance criteria inside the prompt
  - Avoid the two prompt antipatterns (kitchen-sink, no-acceptance-criteria)
- **Prerequisites:** 2, 5
- **Length target:** 10 min
- **Content focus:** Bread-and-butter prompts. Each of the five patterns gets a template + a real example.
- **Code/Demo emphasis:** Medium. Five short prompt blocks, each paired with the resulting Codex behavior.
- **SRS card themes:**
  - "Five copy-pasteable prompt patterns"
  - "Why file-path anchors matter"
  - "Acceptance-criteria sentence structure"
  - "Kitchen-sink antipattern signal"
  - "Plan-first phrasing trigger words"

### Lesson 7 — Codex CLI v0.130+ Flag Reference (the ones you'll actually use)

- **Level:** 1 (Beginner)
- **Title:** Codex CLI v0.130+ Flag Reference (the ones you'll actually use)
- **Learning objectives:**
  - Use the eight most common Codex CLI flags from memory
  - Know which flags ship in 0.130 vs older releases (drift guard)
  - Read `codex --help` output efficiently
  - Build a shell alias for your default flag combination
- **Prerequisites:** 1, 2
- **Length target:** 10 min
- **Content focus:** Practical reference. The eight flags: `--model`, `--approval-mode`, `--sandbox`, `--config`, `--cwd`, `--quiet`, `--no-color`, `--workspace`. Each with one-line use case.
- **Code/Demo emphasis:** Medium. Each flag in a one-line example with expected behavior.
- **SRS card themes:**
  - "Eight most-used Codex flags"
  - "Default approval-mode value"
  - "Sandbox flag values: 3 levels"
  - "Aliasing your favorite flag combo in `.zshrc`"

### Lesson 8 — Repo Navigation: Letting Codex Read Your Code

- **Level:** 1 (Beginner)
- **Title:** Repo Navigation: Letting Codex Read Your Code
- **Learning objectives:**
  - Ask Codex to summarize an unfamiliar repo in 60 seconds
  - Guide Codex to the right subtree without dumping the whole project
  - Use file-glob hints to narrow scope
  - Recognize when Codex is over-reading (token waste signal)
- **Prerequisites:** 6
- **Length target:** 10 min
- **Content focus:** How Codex builds its workspace map and how to steer it. Critical for cost control on large repos.
- **Code/Demo emphasis:** Medium. Real "explore this repo" session against a public OSS repo (e.g., `fastify/fastify`).
- **SRS card themes:**
  - "60-second repo-summary prompt"
  - "Glob-hint syntax inside prompts"
  - "Over-reading symptoms"
  - "When `.codexignore` makes sense (and the alternative)"

### Lesson 9 — Reading Code with Codex: Explain, Trace, Map

- **Level:** 1 (Beginner)
- **Title:** Reading Code with Codex: Explain, Trace, Map
- **Learning objectives:**
  - Ask Codex to explain a function in plain English
  - Trace a call graph two levels deep
  - Map external API usage in a module
  - Save read-only transcripts to a markdown scratchpad
- **Prerequisites:** 8
- **Length target:** 10 min
- **Content focus:** Code-comprehension workflows. Useful on day one of a new job.
- **Code/Demo emphasis:** Medium. Three real prompts run against an open-source project.
- **SRS card themes:**
  - "Explain vs Trace vs Map prompt verbs"
  - "Two-level call-graph trick"
  - "Scratchpad markdown pattern"
  - "Read-only-mode flag for safety"

### Lesson 10 — Simple Refactors: Rename and Extract Function

- **Level:** 1 (Beginner)
- **Title:** Simple Refactors: Rename and Extract Function
- **Learning objectives:**
  - Drive a safe rename across a small codebase via Codex
  - Drive an extract-function refactor with explicit signature
  - Verify the refactor via tests before approving the diff
  - Roll back a bad refactor in one command
- **Prerequisites:** 2, 6
- **Length target:** 10 min
- **Content focus:** First useful refactors. The "I needed this on day one" lesson.
- **Code/Demo emphasis:** Heavy. Real refactor end-to-end with `git diff` snapshots.
- **SRS card themes:**
  - "Rename-safe prompt template"
  - "Extract-function signature-first pattern"
  - "Pre-approval test-run trick"
  - "One-command rollback after bad apply"

### Lesson 11 — Cost Awareness and Token Budgets

- **Level:** 1 (Beginner)
- **Title:** Cost Awareness and Token Budgets
- **Learning objectives:**
  - Read the Codex per-session token meter
  - Estimate cost per typical task class (read, refactor, test, debug)
  - Set a per-session soft budget via config
  - Identify the three biggest token sinks and how to dodge them
- **Prerequisites:** 1, 8
- **Length target:** 10 min
- **Content focus:** Money. Closes the Beginner block with the reality check on cost. ChatGPT-plan-bound vs API-key billing nuance.
- **Code/Demo emphasis:** Medium. One annotated session showing the cost meter rising in real time.
- **SRS card themes:**
  - "Typical cost: read vs refactor vs full feature"
  - "Three biggest token sinks"
  - "Soft-budget config key"
  - "Plan-bound usage vs API-key billing — which fits which user"

---

## Intermediate (12 Lessons)

> Audience: developer who completed the Beginner block (or equivalent). Ready to ship medium-complexity work, integrate Codex into daily flows, and adopt JetBrains + Cloud Sandbox.
> Average length: 12 min (range 10–15). Total Intermediate runtime ≈ 145 min.

### Lesson 12 — AGENTS.md Deep-Dive: Multi-Package and Nested Repos

- **Level:** 2 (Intermediate)
- **Title:** AGENTS.md Deep-Dive: Multi-Package and Nested Repos
- **Learning objectives:**
  - Structure AGENTS.md for a monorepo with 3+ packages
  - Write nested AGENTS.md files and understand precedence rules
  - Document cross-package conventions without duplication
  - Validate AGENTS.md format with the linter (when one ships) or a homemade smoke check
- **Prerequisites:** 3
- **Length target:** 15 min
- **Content focus:** The "spec at scale" lesson. Real monorepo example (e.g., a turbo-monorepo with `apps/` + `packages/`).
- **Code/Demo emphasis:** Heavy. Full multi-file AGENTS.md tree.
- **SRS card themes:**
  - "Nested AGENTS.md precedence rule"
  - "Monorepo top-level AGENTS.md skeleton"
  - "Cross-package convention pattern"
  - "Smoke-test command to confirm AGENTS.md loaded"
  - "Drift detection in monorepos"

### Lesson 13 — JetBrains Plugin Setup (IntelliJ, GoLand, PyCharm)

- **Level:** 2 (Intermediate)
- **Title:** JetBrains Plugin Setup (IntelliJ, GoLand, PyCharm)
- **Learning objectives:**
  - Install the Codex JetBrains plugin from the marketplace
  - Authenticate inside the IDE (and reuse CLI auth when possible)
  - Configure the inline chat keybind and the agent-panel layout
  - Recognize which IDE-specific features differ across IntelliJ, GoLand, and PyCharm
- **Prerequisites:** 1
- **Length target:** 15 min
- **Content focus:** Practical IDE setup. Assumes user already knows the CLI. Screenshots referenced in spec — captured during authoring.
- **Code/Demo emphasis:** Medium. Settings excerpts + one inline-chat demo transcript.
- **SRS card themes:**
  - "Plugin install path (Marketplace ID)"
  - "Shared-auth trick: how to reuse CLI token"
  - "Default keybind for inline chat"
  - "IntelliJ vs PyCharm feature deltas"
  - "Plugin version compatibility matrix"

### Lesson 14 — JetBrains Workflows: Inline Chat, Agent Panel, Quick Actions

- **Level:** 2 (Intermediate)
- **Title:** JetBrains Workflows: Inline Chat, Agent Panel, Quick Actions
- **Learning objectives:**
  - Use inline chat to refactor a selection without leaving the editor
  - Drive a multi-file task from the agent panel and review the diff visually
  - Trigger Codex via Quick Actions (Alt+Enter) for context-aware edits
  - Compare JetBrains-Codex flow to CLI-Codex flow honestly — when to switch
- **Prerequisites:** 13
- **Length target:** 15 min
- **Content focus:** Day-to-day patterns inside JetBrains. The "what does the IDE buy me over CLI?" answer.
- **Code/Demo emphasis:** Medium. Three workflow walkthroughs.
- **SRS card themes:**
  - "Inline chat vs agent panel — decision matrix"
  - "Quick Actions trigger keys"
  - "When JetBrains beats CLI"
  - "When CLI beats JetBrains"

### Lesson 15 — Codex Cloud Sandbox Advanced: Env Vars, Secrets, Multi-Turn

- **Level:** 2 (Intermediate)
- **Title:** Codex Cloud Sandbox Advanced: Env Vars, Secrets, Multi-Turn
- **Learning objectives:**
  - Inject env vars into a Cloud Sandbox session without leaking them to logs
  - Use the Cloud-Sandbox secrets store (or its CLI-equivalent flag) for API keys
  - Run a multi-turn Cloud-Sandbox session that survives `codex --resume`
  - Decide when Cloud Sandbox replaces a local Docker dev container
- **Prerequisites:** 4
- **Length target:** 15 min
- **Content focus:** Production-grade Cloud-Sandbox use. Critical for users who don't trust local Node/Python state.
- **Code/Demo emphasis:** Heavy. Full Cloud-Sandbox-with-secrets session.
- **SRS card themes:**
  - "Env-var injection flag/syntax"
  - "Secrets store vs raw env vars — security delta"
  - "Resume-session lifetime"
  - "Cloud Sandbox vs local Docker — decision table"

### Lesson 16 — Multi-File Refactor Patterns

- **Level:** 2 (Intermediate)
- **Title:** Multi-File Refactor Patterns
- **Learning objectives:**
  - Plan a 3–10 file refactor with explicit scope boundaries
  - Use Codex's plan output to validate scope before any edits
  - Recover gracefully when Codex partially applies a refactor
  - Use `git stash` + worktrees defensively during big refactors
- **Prerequisites:** 10, 12
- **Length target:** 15 min
- **Content focus:** The first "real work" lesson. Walks through a TypeScript-to-Zod-schema migration on a small API project.
- **Code/Demo emphasis:** Heavy. Full multi-file diff before/after.
- **SRS card themes:**
  - "Scope-boundary phrasing pattern"
  - "Plan-validation checklist"
  - "Partial-apply recovery steps"
  - "Stash + worktree defensive pattern"
  - "10-file threshold for splitting tasks"

### Lesson 17 — Debugging Workflows with Codex

- **Level:** 2 (Intermediate)
- **Title:** Debugging Workflows with Codex
- **Learning objectives:**
  - Hand Codex a stack trace + repro steps and get a useful hypothesis
  - Use the "explain this failing test" pattern
  - Drive a bisect manually with Codex narrating each step
  - Avoid the "shotgun debug" antipattern (Codex spraying changes hoping one sticks)
- **Prerequisites:** 9, 16
- **Length target:** 10 min
- **Content focus:** Debugging is the highest-leverage Codex use. Three concrete patterns.
- **Code/Demo emphasis:** Medium. One real bug-hunt transcript.
- **SRS card themes:**
  - "Stack-trace + repro prompt template"
  - "Bisect-narration pattern"
  - "Shotgun-debug antipattern signal"
  - "When to stop letting Codex debug and ask a human"

### Lesson 18 — Test Generation Patterns

- **Level:** 2 (Intermediate)
- **Title:** Test Generation Patterns
- **Learning objectives:**
  - Generate unit tests for an existing function with explicit edge-case prompt
  - Generate integration tests with HTTP mocks
  - Use the "test-first" prompt to drive TDD inside Codex
  - Spot Codex-generated tests that look thorough but are actually tautological
- **Prerequisites:** 10
- **Length target:** 15 min
- **Content focus:** Tests that catch bugs vs tests that just pass. Includes a tautology-detection checklist.
- **Code/Demo emphasis:** Heavy. Three generated test files + critique.
- **SRS card themes:**
  - "Edge-case-explicit prompt template"
  - "TDD-in-Codex flow"
  - "Tautological-test smell list"
  - "HTTP-mock prompt pattern"

### Lesson 19 — Code Review via Codex

- **Level:** 2 (Intermediate)
- **Title:** Code Review via Codex
- **Learning objectives:**
  - Drive Codex through a PR diff and produce structured review comments
  - Configure a reusable review checklist via AGENTS.md
  - Distinguish Codex review (style + obvious bugs) from human review (intent + arch)
  - Pipe Codex review output into GitHub PR comments via a small script
- **Prerequisites:** 12
- **Length target:** 10 min
- **Content focus:** Codex as a first-pass reviewer. Honest framing: it's a fast lint+sanity layer, not a substitute for senior review.
- **Code/Demo emphasis:** Medium. One reviewed PR diff with Codex output.
- **SRS card themes:**
  - "Review-checklist AGENTS.md section"
  - "Codex review limits — three categories it misses"
  - "GH-CLI pipe one-liner"
  - "Style + obvious-bug coverage rate"

### Lesson 20 — Documentation Generation

- **Level:** 2 (Intermediate)
- **Title:** Documentation Generation
- **Learning objectives:**
  - Generate accurate JSDoc / docstrings from existing code
  - Generate a usable README from a real codebase
  - Maintain docs over time (the drift problem)
  - Avoid the marketing-blurb antipattern in generated docs
- **Prerequisites:** 9
- **Length target:** 10 min
- **Content focus:** Docs that pull their weight. Calls out the typical Codex tendency to over-pad README intros.
- **Code/Demo emphasis:** Medium. One README-generation diff with critique.
- **SRS card themes:**
  - "JSDoc-from-source prompt"
  - "README skeleton prompt"
  - "Drift-detection cron pattern"
  - "Marketing-blurb smell"

### Lesson 21 — Migration Tasks: Framework Version Bumps

- **Level:** 2 (Intermediate)
- **Title:** Migration Tasks: Framework Version Bumps
- **Learning objectives:**
  - Plan a framework migration (e.g., Express 4 → 5, Next.js 14 → 15) with Codex
  - Feed Codex the official migration guide as a reference document
  - Run codemods + Codex sweeps in the right order
  - Catch the post-migration test regressions Codex misses
- **Prerequisites:** 16
- **Length target:** 15 min
- **Content focus:** A high-value real-world Codex use case. Reference example: small Express 4 → 5 migration.
- **Code/Demo emphasis:** Heavy. Migration session transcript + post-run diff.
- **SRS card themes:**
  - "Migration-guide-as-context prompt"
  - "Codemod vs Codex sweep — order of operations"
  - "Post-migration regression smoke set"
  - "Pre-flight: snapshot strategy"

### Lesson 22 — API Integration Scaffolding

- **Level:** 2 (Intermediate)
- **Title:** API Integration Scaffolding
- **Learning objectives:**
  - Scaffold a typed client from an OpenAPI spec via Codex
  - Add auth, retries, and error mapping in a follow-up turn
  - Generate matching integration tests
  - Avoid the "client wrapper around fetch" antipattern Codex defaults to
- **Prerequisites:** 18
- **Length target:** 15 min
- **Content focus:** Real scaffolding. Uses a public OpenAPI spec (e.g., Stripe minimal subset) for the demo.
- **Code/Demo emphasis:** Heavy. Generated client + tests.
- **SRS card themes:**
  - "OpenAPI-to-client prompt template"
  - "Auth + retry follow-up turn pattern"
  - "Fetch-wrapper smell"
  - "Integration-test mock strategy"

### Lesson 23 — Plan-First for Medium Tasks (3+ Files)

- **Level:** 2 (Intermediate)
- **Title:** Plan-First for Medium Tasks (3+ Files)
- **Learning objectives:**
  - Convert a 2-sentence feature request into a structured plan request
  - Read a Codex plan critically: spot missing files, vague steps, hidden assumptions
  - Iterate the plan in 2–3 turns before any code is written
  - Decide when the plan is "good enough to ship" vs needs a human session
- **Prerequisites:** 5, 16
- **Length target:** 10 min
- **Content focus:** The plan-quality checklist. Closes the Intermediate block by raising the standard.
- **Code/Demo emphasis:** Medium. One real plan + critique annotations.
- **SRS card themes:**
  - "Plan-critique five-point checklist"
  - "Missing-file detection signal"
  - "Vague-step rephrasing pattern"
  - "Plan-iteration upper bound (when to stop)"

---

## Advanced (12 Lessons)

> Audience: experienced Codex user. Goal: hybrid setups, scripting, security, EU compliance, multi-agent, and a capstone.
> Average length: 18 min (range 15–60). Total Advanced runtime ≈ 320 min (including 60-min capstone).

### Lesson 24 — Cost vs Quality: o-Model Selection Strategy

- **Level:** 3 (Advanced)
- **Title:** Cost vs Quality: o-Model Selection Strategy
- **Learning objectives:**
  - Map task classes to GPT-Codex model tiers (cheap reads, mid refactors, top-tier architecture)
  - Read Codex's per-model latency + cost in real time
  - Switch models mid-session via `/model` without losing context
  - Build a per-project default model policy in `~/.codex/config.toml`
- **Prerequisites:** 11, 23
- **Length target:** 15 min
- **Content focus:** Logically a late-intermediate / early-advanced topic, but placed here because cost-quality framing pays off most in the Advanced block. Mirrors Lesson 23/44 in claude-code track.
- **Code/Demo emphasis:** Medium. Cost-table + `config.toml` example.
- **SRS card themes:**
  - "Task class → model tier mapping (4 rows)"
  - "/model switch syntax"
  - "Default-model config.toml key"
  - "Real-cost-meter location"
  - "When the top tier is actually cheaper (long-context refactor)"

### Lesson 25 — Hybrid Workflows: Codex Plus Other Agentic Tools

- **Level:** 3 (Advanced)
- **Title:** Hybrid Workflows: Codex Plus Other Agentic Tools
- **Learning objectives:**
  - Choose Codex vs alternative tooling for each task class without ideology
  - Use Codex for plan + ship, and another tool's strengths where they apply
  - Share AGENTS.md ↔ analogous spec files cleanly (link, don't duplicate)
  - Maintain a hybrid setup without context-bleed between tools
- **Prerequisites:** 24
- **Length target:** 20 min
- **Content focus:** Honest hybrid framing. Per tutor-persona guardrails, never names competing CLI as a recommended subject — frames it as "the other tool you may already use" with a redirect to its dedicated track. Decision matrix style. Cross-link to Lesson 47 in claude-code track for the empirical comparison.
- **Code/Demo emphasis:** Medium. Decision matrix + one hybrid-session schematic.
- **SRS card themes:**
  - "Codex-strong task list"
  - "Hand-off boundary patterns"
  - "Spec-file sharing strategy"
  - "Context-bleed warning signs"
  - "Hybrid cost model (two subscriptions — when worth it)"

### Lesson 26 — Codex CLI Scripting for Batch Operations

- **Level:** 3 (Advanced)
- **Title:** Codex CLI Scripting for Batch Operations
- **Learning objectives:**
  - Run Codex headlessly via `codex --quiet` and stdin/stdout pipes
  - Build a bash/Python wrapper for batch tasks (lint, generate, test)
  - Wire a JSON-output mode (where supported) into downstream tooling
  - Handle failures cleanly across 100+ batched runs
- **Prerequisites:** 7, 24
- **Length target:** 20 min
- **Content focus:** Codex as a Unix tool. Real script that audits 50 files in parallel.
- **Code/Demo emphasis:** Heavy. Full bash + Python wrappers.
- **SRS card themes:**
  - "Headless flag combo for piping"
  - "JSON-output flag/availability"
  - "Failure-retry wrapper pattern"
  - "Parallel-job upper bound (rate limits)"
  - "Logging strategy for batch runs"

### Lesson 27 — AGENTS.md as a Living Architecture Document

- **Level:** 3 (Advanced)
- **Title:** AGENTS.md as a Living Architecture Document
- **Learning objectives:**
  - Promote AGENTS.md from "spec file" to architecture source-of-truth
  - Sync AGENTS.md with ADRs and design docs automatically (Codex-driven)
  - Version AGENTS.md and surface changes in code review
  - Detect AGENTS.md ↔ codebase drift via a periodic Codex audit
- **Prerequisites:** 12
- **Length target:** 15 min
- **Content focus:** The senior-engineer treatment of AGENTS.md. Includes a periodic-audit cron pattern.
- **Code/Demo emphasis:** Medium. ADR ↔ AGENTS.md sync example.
- **SRS card themes:**
  - "AGENTS.md ↔ ADR sync prompt"
  - "Drift-audit cron schedule"
  - "Versioning convention (semver-light)"
  - "Code-review surfacing pattern"

### Lesson 28 — Plan-First for Refactors Spanning 10+ Files

- **Level:** 3 (Advanced)
- **Title:** Plan-First for Refactors Spanning 10+ Files
- **Learning objectives:**
  - Decompose a wide refactor into 3–5 phases, each Codex-safe
  - Use the plan as a PR-checklist artifact (commit it to the repo)
  - Run phases in sequence with explicit hand-off prompts
  - Detect cross-phase regressions early via a per-phase test gate
- **Prerequisites:** 16, 23
- **Length target:** 20 min
- **Content focus:** The "I don't want to babysit Codex through 40 file changes" lesson.
- **Code/Demo emphasis:** Heavy. Real 4-phase refactor plan + per-phase diffs.
- **SRS card themes:**
  - "Phase-decomposition heuristic"
  - "Plan-as-PR-artifact pattern"
  - "Per-phase test-gate setup"
  - "Cross-phase regression signal"

### Lesson 29 — Codex Cloud Sandbox in CI/CD Pipelines

- **Level:** 3 (Advanced)
- **Title:** Codex Cloud Sandbox in CI/CD Pipelines
- **Learning objectives:**
  - Trigger a Codex Cloud Sandbox job from GitHub Actions / GitLab CI
  - Pass repo state + AGENTS.md to the Cloud Sandbox cleanly
  - Stream the result back into a PR comment
  - Stay within ChatGPT-plan or API-key budget by capping per-job spend
- **Prerequisites:** 15, 26
- **Length target:** 20 min
- **Content focus:** Productionizing Cloud Sandbox. Reference workflow file included.
- **Code/Demo emphasis:** Heavy. Complete `.github/workflows/codex.yml` example.
- **SRS card themes:**
  - "GH-Actions step skeleton"
  - "Repo-state pass-through trick"
  - "PR-comment streaming pattern"
  - "Per-job spend cap config key"
  - "Auth in CI: secret-store best practice"

### Lesson 30 — Computer-Use Workarounds for EU Users

- **Level:** 3 (Advanced)
- **Title:** Computer-Use Workarounds for EU Users
- **Learning objectives:**
  - Identify the parts of Codex's Computer-Use feature that are EU-restricted as of 2026-05
  - Substitute with locally-driven browser automation (Playwright + Codex orchestration)
  - Use Cloud Sandbox for headful flows where local restrictions block desktop access
  - Document compliance posture in AGENTS.md so collaborators know the constraints
- **Prerequisites:** 15
- **Length target:** 20 min
- **Content focus:** The Cosmo-specific EU pain point. Documents the alternatives, not the workaround-for-workaround tricks.
- **Code/Demo emphasis:** Heavy. Playwright + Codex orchestration example.
- **SRS card themes:**
  - "EU-restricted Computer-Use surfaces"
  - "Playwright-as-substitute prompt"
  - "Headful-via-Cloud-Sandbox pattern"
  - "AGENTS.md compliance section template"
  - "When EU restrictions change (where to track it)"

### Lesson 31 — Security: BeyondTrust-CVE Recap and Codex Hardening

- **Level:** 3 (Advanced)
- **Title:** Security: BeyondTrust-CVE Recap and Codex Hardening
- **Learning objectives:**
  - Summarize the BeyondTrust CVE that prompted industry-wide CLI-agent scrutiny (source: CVE database, not memory)
  - Audit your Codex setup for the same class of exposure
  - Lock down sandbox mode, approval mode, and shell-exec surfaces
  - Add an AGENTS.md security section that survives future contributors
- **Prerequisites:** 4, 11
- **Length target:** 20 min
- **Content focus:** Hard-content lesson. Strictly factual on the CVE. Hardening checklist tailored to Codex.
- **Code/Demo emphasis:** Medium. Config diffs before/after hardening.
- **SRS card themes:**
  - "BeyondTrust CVE one-line summary"
  - "Codex shell-exec surface area"
  - "Hardened sandbox + approval defaults"
  - "AGENTS.md security-section skeleton"
  - "Audit cron + alert path"

### Lesson 32 — Custom AGENTS.md Templates: SaaS, Monorepo, Data-Pipeline

- **Level:** 3 (Advanced)
- **Title:** Custom AGENTS.md Templates: SaaS, Monorepo, Data-Pipeline
- **Learning objectives:**
  - Pick the right AGENTS.md template per project archetype
  - Customize each template for your stack without bloat
  - Keep the three templates in sync via a shared base
  - Publish templates as a small repo your team can fork
- **Prerequisites:** 27
- **Length target:** 20 min
- **Content focus:** Three full templates, ready to copy. SaaS = Next.js + Stripe + Postgres. Monorepo = Turborepo. Data-pipeline = Python + Airflow/Dagster-class.
- **Code/Demo emphasis:** Heavy. Three complete AGENTS.md files.
- **SRS card themes:**
  - "SaaS template skeleton sections"
  - "Monorepo template skeleton sections"
  - "Data-pipeline template skeleton sections"
  - "Shared-base extraction pattern"
  - "Team-fork distribution model"

### Lesson 33 — Multi-Agent: Two Codex Instances in Parallel via Worktrees

- **Level:** 3 (Advanced)
- **Title:** Multi-Agent: Two Codex Instances in Parallel via Worktrees
- **Learning objectives:**
  - Set up two git worktrees with independent Codex sessions
  - Split a feature into parallel tracks safely (no file overlap)
  - Merge results back without conflicts via a structured rendezvous
  - Recognize when serial work beats parallel (the realistic ceiling)
- **Prerequisites:** 28
- **Length target:** 20 min
- **Content focus:** Pragmatic multi-agent. Two Codex instances, not five. Includes a "when not to" section.
- **Code/Demo emphasis:** Heavy. Full worktree-setup commands + merge transcript.
- **SRS card themes:**
  - "Two-worktree setup command sequence"
  - "File-ownership pre-split checklist"
  - "Rendezvous-merge pattern"
  - "Parallel-overhead break-even point"
  - "Serial-is-better signal"

### Lesson 34 — Recovery: When Codex Stalls or Loops

- **Level:** 3 (Advanced)
- **Title:** Recovery: When Codex Stalls or Loops
- **Learning objectives:**
  - Identify the three Codex-stall signatures (rate limit, context overflow, plan-paralysis)
  - Recover with the right command per signature
  - Save partial work before bailing
  - Build a `codex-doctor` shell function that surfaces stall causes
- **Prerequisites:** 24, 26
- **Length target:** 15 min
- **Content focus:** Hard-won operational knowledge. Each stall mode + the matching escape hatch.
- **Code/Demo emphasis:** Medium. `codex-doctor` script + three real stall transcripts.
- **SRS card themes:**
  - "Three stall signatures"
  - "Rate-limit recovery flag"
  - "Context-overflow `/compact` analog"
  - "Plan-paralysis prompt-rewrite trick"
  - "codex-doctor function structure"

### Lesson 35 — Capstone: Spec → PR with Codex (Multi-Session)

- **Level:** 3 (Advanced)
- **Title:** Capstone: Spec → PR with Codex (Multi-Session)
- **Learning objectives:**
  - Take a real feature spec from zero to a shippable PR using only Codex
  - Apply every pattern from Lessons 0–34 in the right order
  - Document the session for handoff (post-mortem markdown)
  - Self-review the PR against an AGENTS.md-driven checklist before opening
- **Prerequisites:** every prior Codex-track lesson (0–34)
- **Length target:** 60 min (multi-session — recommended 2× 30 min blocks)
- **Content focus:** The big one. A complete feature build: design → AGENTS.md update → plan → multi-file scaffolding → tests → docs → review → PR open. Reference feature: add a "lessons completed" leaderboard endpoint to a small Express+Postgres demo app.
- **Code/Demo emphasis:** Heavy. Full transcript, every step.
- **SRS card themes:**
  - "Capstone phase order (8 phases)"
  - "Post-mortem markdown skeleton"
  - "Self-review checklist anchored to AGENTS.md"
  - "Multi-session resume pattern (`codex --resume` discipline)"
  - "When to break for a human review mid-capstone"
  - "Definition-of-done for the capstone PR"

---

## Curriculum risks + open questions

> Surface these to Cosmo before drafting begins. Each is a known unknown that could shift 1–3 lessons.

1. **JetBrains plugin coverage is patchy.** Codex JetBrains plugin features may have shifted between 0.130 and the current release at draft time. Confirm with current plugin docs before drafting Lessons 13–14 — if features are stripped/renamed, merge L13+L14 and use the freed slot for a deeper Cloud-Sandbox lesson.
2. **`codex --resume` semantics may differ from spec.** Lesson 35 (Capstone) relies on resumable multi-session work. If `--resume` doesn't persist plan state across sessions in current Codex, rework the capstone as a single 60-minute session and explicitly document the resume limitation.
3. **EU Computer-Use restriction scope is moving.** Lesson 30 documents a 2026-05 snapshot. The list of EU-restricted surfaces may have changed by the time drafting starts — verify via the official Codex EU-availability doc, and if the situation is fundamentally different, retitle L30 to "EU compliance posture for Codex" and pivot the body.
4. **BeyondTrust-CVE attribution.** Lesson 31's CVE recap must source from the official CVE database (NIST NVD or MITRE), not from memory. If the CVE referenced in the plan turns out to be in a different agentic CLI (not Codex itself), reframe L31 as "CLI-agent attack surface — what BeyondTrust taught the industry" and keep the hardening checklist intact.
5. **Cost-model lessons (L11, L24) may need a quick recheck.** ChatGPT plan tier limits and API-key pricing have shifted multiple times in 2026. Run a 10-minute pre-draft verification against the OpenAI pricing page; if pricing has moved >15%, update the cost tables and SRS cards before recording.
6. **Hybrid lesson (L25) tone risk.** Per `tutor-persona.md`, the competing CLI must not be named as a recommended subject. The draft must read as "use Codex where it shines; for other classes of work, the platform's other tracks have the right tutor" — not as a head-to-head shootout. Cross-link to claude-code Lesson 47 only; do not duplicate its content.
