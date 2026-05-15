import type { Lesson } from '../types';

// ────────────────────────────────────────────────────────────────
// Codex Track — Lessons (Beginner Batch 1)
//
// ID range: 2000–2999 (per masterkurs-agent/track-configs/codex/lesson-style.md).
// Sprache: EN-first per Locked Decision #5 — Du-Form für DE-Übersetzungs-Pass.
// Persona-Guardrails: never recommend Anthropic's CLI; comparisons are neutral
// and only appear inside compare/contrast sections (see lesson-consistency-lint).
// ────────────────────────────────────────────────────────────────

export const lessons: Lesson[] = [
  // ========================================
  // LEVEL 1: BEGINNER (Lessons 2000–2004)
  // ========================================
  {
    id: 2000,
    level: 1,
    title: 'Welcome to Codex CLI: What It Is and Who It\'s For',
    description:
      'Get a clear mental model of OpenAI Codex CLI — what it is, which surfaces it ships on, and how it fits into your existing toolchain.',
    duration: '10 Minuten',
    track: 'codex',
    objectives: [
      'Define what OpenAI Codex CLI is and which GPT-Codex model class powers it',
      'Identify the three Codex surfaces (CLI, Cloud Sandbox, JetBrains plugin)',
      'Position Codex against other agentic coding tools without vendor-bashing',
      'Decide whether the Codex-only, hybrid, or another track fits your situation',
    ],
    content: [
      {
        type: 'heading',
        content: 'Welcome to Codex CLI',
      },
      {
        type: 'text',
        content:
          'OpenAI Codex CLI is an agentic coding tool that lives in your terminal. You describe a task in natural language, Codex reads your repository, proposes a plan, asks for approval, and then edits files. The point of this first lesson is to give you the mental model you need before you install anything — what Codex is, where it runs, and whether it is the right tool for the work you actually do.',
      },
      {
        type: 'heading',
        content: 'Lernziele',
      },
      {
        type: 'list',
        content: `- Explain what Codex CLI is in one sentence to a colleague
- Name the three Codex surfaces and one scenario each is best at
- Distinguish Codex from non-agentic autocomplete tools without overclaiming
- Make a personal decision: Codex-only, hybrid, or a different track for now`,
      },
      {
        type: 'heading',
        content: 'Codex-Version',
      },
      {
        type: 'yaml',
        content: `cli_version: ">=0.130"
release_channel: stable
release_source: github.com/openai/codex/releases
verified_against: Codex CLI 0.130
note: |
  Every flag and behavior in this track targets Codex CLI 0.130 or newer.
  If you are pinned to an older release, upgrade before continuing.`,
      },
      {
        type: 'heading',
        content: 'The three Codex surfaces',
      },
      {
        type: 'text',
        content:
          'Codex is not a single product. It ships on three surfaces that share the same model class but feel different in practice. Knowing which one to reach for is half the skill.\n\nThe CLI is the terminal binary you install with npm. It runs locally, edits files on your disk, and is the surface this track focuses on. If you live in a terminal already, this is where you will spend most of your time.\n\nCloud Sandbox is an ephemeral remote VM that Codex spins up on demand. You trigger it from the same CLI, but the actual code execution happens in a sandbox OpenAI manages. This is useful when you do not want to trash your local Node or Python environment with a noisy migration, or when you want to run something headless from CI.\n\nThe JetBrains plugin brings Codex into IntelliJ, GoLand, PyCharm and the rest of the JetBrains family. You get inline chat, an agent panel for multi-file tasks, and Quick Actions. It is the right surface when you already drive most of your work from a JetBrains IDE.\n\nAll three speak to the same GPT-Codex model family — the model class OpenAI tunes for code-heavy reasoning. The surface changes the ergonomics, not the underlying intelligence.',
      },
      {
        type: 'heading',
        content: 'Beispiel-Code',
      },
      {
        type: 'text',
        content:
          'You will run this command after installation in Lesson 2001. Look at it now so you know what a healthy Codex install looks like:',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Verify Codex CLI is installed and report its version
codex --version

# Expected output (yours may be a newer patch):
#   codex 0.130.0`,
      },
      {
        type: 'text',
        content:
          'That is the entire first interaction. No login, no project setup — just confirm that the binary is on your PATH and reports a version >= 0.130. Anything older means you are reading docs that describe flags you do not have, which is a common reason beginners get stuck.',
      },
      {
        type: 'heading',
        content: 'Vergleich zu Claude Code',
      },
      {
        type: 'text',
        content:
          'You may already use an agentic CLI from another vendor. The point of this comparison is not to pick a winner — it is to set realistic expectations so the rest of the Codex track lands in context. Both tools are agents: they read your repo, plan changes, and edit files with your approval. The differences are in defaults and ecosystem fit.',
      },
      {
        type: 'code',
        language: 'markdown',
        content: `| Aspect              | Codex CLI                       | Claude Code                |
|---------------------|---------------------------------|----------------------------|
| Vendor / ecosystem  | OpenAI / ChatGPT account         | Anthropic / Console account |
| Default model class | GPT-Codex family                | Claude Sonnet / Opus family |
| Billing models      | ChatGPT plan or OPENAI_API_KEY  | Console API key (or plan)   |
| Spec file           | AGENTS.md                       | CLAUDE.md                   |
| Remote-sandbox mode | Cloud Sandbox (built-in)        | Sandbox (OS-level)          |
| IDE integration     | JetBrains plugin                | IDE plugins + Desktop app   |

Both ship agentic plan-first workflows. Pick by ecosystem alignment,
not feature parity in a single column.`,
      },
      {
        type: 'highlight',
        title: 'Wichtig',
        content:
          'This track teaches you Codex. The other tracks of this masterclass cover their respective tools in depth. If you want a head-to-head shootout, finish at least two tracks first — opinions before that are mostly priors.',
      },
      {
        type: 'heading',
        content: 'Übung',
      },
      {
        type: 'list',
        content: `- Open a note on your laptop. In two sentences, write what you would use Codex CLI for today.
- List the three Codex surfaces from memory. If you can't, scroll back.
- Decide: do you currently want Codex-only, a hybrid setup, or another track first? Note your answer — you'll revisit it after Lesson 2004.`,
      },
      {
        type: 'heading',
        content: 'Common Mistakes',
      },
      {
        type: 'list',
        content: `- Treating Codex like an autocomplete. It is an agent — you give it a goal, not a half-typed line.
- Assuming the JetBrains plugin and CLI are interchangeable. They share a model class, not ergonomics. Pick the surface that fits the task.
- Skipping the version check. Every "this flag doesn't exist" complaint in beginner forums traces back to a Codex CLI older than 0.130.
- Bench-racing Codex vs another agent before you have shipped a real task with either one. Decide on ecosystem fit first.`,
      },
      {
        type: 'heading',
        content: 'Quellen',
      },
      {
        type: 'list',
        content: `- OpenAI Codex repo: https://github.com/openai/codex
- Codex CLI releases (version history): https://github.com/openai/codex/releases
- OpenAI Cookbook (agent patterns): https://github.com/openai/openai-cookbook
- This masterclass — other tracks: open the track switcher to compare scopes`,
      },
    ],
  },

  {
    id: 2001,
    level: 1,
    title: 'Install Codex CLI and Authenticate',
    description:
      'Install Codex CLI on macOS, Linux, or WSL2, log in via your ChatGPT account or an API key, and verify the install with a smoke command.',
    duration: '10 Minuten',
    track: 'codex',
    objectives: [
      'Install Codex CLI >= 0.130 on macOS, Linux, and WSL2',
      'Pick between ChatGPT-account auth and OPENAI_API_KEY auth deliberately',
      'Verify the install with `codex --version` and a no-op smoke command',
      'Recover from the three most common install failures',
    ],
    content: [
      {
        type: 'heading',
        content: 'Install Codex CLI and Authenticate',
      },
      {
        type: 'text',
        content:
          'This is the hands-on setup lesson. By the end you will have a working `codex` binary on your PATH, a credential that can hit the API, and a smoke command that confirms both ends are talking. We assume you already have Node.js and git installed and a terminal you are comfortable in.',
      },
      {
        type: 'heading',
        content: 'Lernziele',
      },
      {
        type: 'list',
        content: `- Run a single npm command to install Codex CLI globally
- Choose ChatGPT-account login or API-key auth and know why
- Confirm the install with a version check and a one-line smoke command
- Diagnose the three common install failures (Node version, PATH, OAuth callback)`,
      },
      {
        type: 'heading',
        content: 'Codex-Version',
      },
      {
        type: 'yaml',
        content: `cli_version: ">=0.130"
package_name: "@openai/codex"
install_channel: npm (global)
config_dir: "~/.codex/"
verified_against: Codex CLI 0.130
upgrade_command: "npm install -g @openai/codex@latest"`,
      },
      {
        type: 'heading',
        content: 'Install (macOS / Linux / WSL2)',
      },
      {
        type: 'text',
        content:
          'Codex CLI is published as an npm package. The same command works on macOS, Linux, and WSL2 because npm hides the platform differences. Run it from any directory — global installs do not care where you are when you install them.',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Check Node version — Codex CLI requires a recent LTS
node --version

# Install Codex CLI globally
npm install -g @openai/codex

# Confirm the binary is on your PATH and the version is >= 0.130
codex --version`,
      },
      {
        type: 'text',
        content:
          'If `node --version` reports something older than your distro\'s current LTS, upgrade Node before you install Codex. The CLI uses recent Node APIs and older runtimes fail at import time with confusing messages.',
      },
      {
        type: 'highlight',
        title: 'Tipp',
        content:
          'Avoid `sudo npm install -g`. On macOS and Linux it is the leading cause of permission warnings later. Use a Node version manager (nvm, fnm, asdf) so npm installs into a directory you own.',
      },
      {
        type: 'heading',
        content: 'Authenticate: ChatGPT account or API key',
      },
      {
        type: 'text',
        content:
          'Codex CLI accepts two credential paths. Pick one — they are not additive in a useful way.\n\nThe ChatGPT-account path uses the same login you use at chatgpt.com. Codex opens a browser, you authorize the CLI, and from then on your Codex usage is metered against your ChatGPT plan limits. This is the right choice if you already pay for ChatGPT Plus or Pro and want to keep one bill.\n\nThe API-key path uses `OPENAI_API_KEY` as an environment variable. Codex calls the API directly, and you are billed per token at the standard API price. This is the right choice if you do not have a ChatGPT plan, if you need a key for CI, or if your team already has API budgets in place.',
      },
      {
        type: 'heading',
        content: 'Beispiel-Code',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Option A — Log in with your ChatGPT account (interactive)
codex login
# Codex opens a browser tab; approve the device.
# Credentials are stored under ~/.codex/.

# Option B — Use an API key for non-interactive setups
export OPENAI_API_KEY="sk-..."

# Smoke test (works after either auth path):
codex --version

# Open a Codex session in your current directory (Ctrl+D to exit)
codex`,
      },
      {
        type: 'text',
        content:
          'Storing the API key in your shell rc file is fine for one machine, but for CI use the platform\'s secrets store instead. Lesson 29 covers the CI variant in detail; for now, exporting it in your current shell is enough to verify the install.',
      },
      {
        type: 'heading',
        content: 'Vergleich zu Claude Code',
      },
      {
        type: 'code',
        language: 'markdown',
        content: `| Step             | Codex CLI                              | Claude Code                       |
|------------------|----------------------------------------|-----------------------------------|
| Install command  | npm install -g @openai/codex            | npm install -g @anthropic-ai/claude-code |
| Default auth     | ChatGPT account (browser OAuth)         | Anthropic Console (browser OAuth) |
| API-key env var  | OPENAI_API_KEY                          | ANTHROPIC_API_KEY                 |
| Config directory | ~/.codex/                               | ~/.claude/                        |
| Smoke command    | codex --version                         | claude --version                  |

Both install through npm; both store config in a dotfolder under your
home directory. Pick the one that matches the account you already pay
for, not the one with the shorter command.`,
      },
      {
        type: 'heading',
        content: 'Übung',
      },
      {
        type: 'list',
        content: `- Run \`npm install -g @openai/codex\` and confirm \`codex --version\` reports >= 0.130.
- Log in via \`codex login\` if you have a ChatGPT plan; otherwise export OPENAI_API_KEY.
- Run \`codex\` inside any small repo, type "exit plan mode" or press Ctrl+D to bail out without changes.
- Open \`~/.codex/\` and look at what was created. Do not edit anything yet.`,
      },
      {
        type: 'heading',
        content: 'Common Mistakes',
      },
      {
        type: 'list',
        content: `- Running \`sudo npm install -g\` and then wondering why later upgrades fail. Use a Node version manager.
- Setting both \`codex login\` and \`OPENAI_API_KEY\` and being surprised when billing lands on the API budget — the env var wins.
- Forgetting that ChatGPT plan auth is rate-limited by plan tier. If you hit a wall mid-session, that's the cap, not a bug.
- Pasting your API key into a shared dotfile that is synced to a public repo. Use a secrets manager or your shell's profile, not a tracked file.
- Pinning Node to an EOL major and then debugging Codex import errors. Upgrade Node first.`,
      },
      {
        type: 'heading',
        content: 'Quellen',
      },
      {
        type: 'list',
        content: `- Codex repo (install instructions): https://github.com/openai/codex
- Codex CLI releases: https://github.com/openai/codex/releases
- OpenAI API authentication overview: https://platform.openai.com/docs/api-reference/authentication
- npm global install troubleshooting: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally`,
      },
    ],
  },

  {
    id: 2002,
    level: 1,
    title: 'Your First Codex Session: Reading the Repo',
    description:
      'Open Codex inside an existing repository, read the workspace summary it prints, and ask it to explain a file without editing anything.',
    duration: '10 Minuten',
    track: 'codex',
    objectives: [
      'Start a Codex session inside an existing repo and read its workspace summary',
      'Understand the difference between Plan, Edit, and Auto approval modes',
      'Approve, reject, or revise a plan before any file is touched',
      'Exit cleanly and inspect what (if anything) Codex changed via `git diff`',
    ],
    content: [
      {
        type: 'heading',
        content: 'Your First Codex Session',
      },
      {
        type: 'text',
        content:
          'Now that Codex is installed and authenticated, let us run it against a real repo. The goal of this lesson is not to ship code — it is to feel what a session looks like from open to close. We will ask Codex to read, not write. That is the safest first interaction.',
      },
      {
        type: 'heading',
        content: 'Lernziele',
      },
      {
        type: 'list',
        content: `- Open Codex in an existing repo and skim the workspace summary
- Pick a safe approval mode for read-only work
- Ask a read-only question and approve the plan it produces
- Exit Codex cleanly and confirm \`git status\` is unchanged`,
      },
      {
        type: 'heading',
        content: 'Codex-Version',
      },
      {
        type: 'yaml',
        content: `cli_version: ">=0.130"
default_approval_mode: plan
session_entry_command: "codex"
exit: "Ctrl+D or /exit"
verified_against: Codex CLI 0.130`,
      },
      {
        type: 'heading',
        content: 'Open the session',
      },
      {
        type: 'text',
        content:
          'Pick a repository you know. Any small one will do — a side project, a clone of a public library, even an empty git repo. Avoid a production codebase for your first session; you want a relaxed environment.',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Move into a repo you know
cd ~/code/my-side-project

# Open Codex inside this directory
codex`,
      },
      {
        type: 'text',
        content:
          'Codex prints a workspace summary on the first turn: the directory it considers the working root, the approval mode it is operating under, and a short reading of the repo structure. Read it. This summary is the agent telling you what it thinks the project is — if it sees the wrong root or misses a package, your prompts will land in the wrong place later.',
      },
      {
        type: 'heading',
        content: 'Approval modes in one paragraph',
      },
      {
        type: 'text',
        content:
          'Codex has three approval modes for file changes. Plan is the safe default: Codex describes what it would do and waits for your approval before any edit. Edit lets Codex apply changes one at a time and asks per file. Auto applies the whole plan in one go after a single approval — useful for batch work where you have read the plan carefully and trust it. For your first session, stay in Plan mode.',
      },
      {
        type: 'heading',
        content: 'Beispiel-Code',
      },
      {
        type: 'text',
        content:
          'Ask a read-only question. The point is to see Codex form a plan, approve it, and read its output without touching disk.',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Inside the Codex session, type:
# "Read README.md and src/index.* if it exists. Summarize what this
#  project does in 4 bullet points. Do not modify any files."

# Codex returns a plan that looks roughly like:
#   1. Read README.md
#   2. Read src/index.ts (or src/index.js)
#   3. Print a 4-bullet summary to the chat
# Approve the plan when prompted.

# When you are done, exit:
/exit`,
      },
      {
        type: 'text',
        content:
          'After exit, confirm Codex truly did not touch your repo:',
      },
      {
        type: 'code',
        language: 'bash',
        content: `git status

# Expected output:
#   nothing to commit, working tree clean

# If git status shows changes you didn't approve, Codex left something
# behind — revert it with:
git restore .`,
      },
      {
        type: 'heading',
        content: 'Vergleich zu Claude Code',
      },
      {
        type: 'code',
        language: 'markdown',
        content: `| Aspect                  | Codex CLI                     | Claude Code               |
|-------------------------|-------------------------------|---------------------------|
| Entry command           | codex                          | claude                    |
| Default mode            | Plan                          | Plan                      |
| File-change approval    | Plan / Edit / Auto             | Plan / accept-edits       |
| Exit                    | /exit or Ctrl+D                | /exit or Ctrl+C twice     |
| Workspace summary       | Printed on first turn          | Printed on first turn     |

Both default to a plan-first loop. Defaults are conservative on
purpose — accept the friction during onboarding.`,
      },
      {
        type: 'heading',
        content: 'Übung',
      },
      {
        type: 'list',
        content: `- Open Codex inside any small repo and read the workspace summary carefully.
- Ask: "List the top 5 files by lines-of-code in this repo. Do not edit anything."
- Approve the plan, read the output, exit.
- Run \`git status\` to confirm nothing was modified. If it shows changes, revert them.`,
      },
      {
        type: 'heading',
        content: 'Common Mistakes',
      },
      {
        type: 'list',
        content: `- Skipping the workspace summary. It is the only signal you get that Codex sees the right project.
- Starting in Auto mode on day one. You will eventually want it for batch work, but not before you can read a plan critically.
- Asking Codex to read your entire repo on a large project. Token cost adds up fast — narrow the scope to specific files.
- Closing the terminal tab instead of exiting Codex. The session may not save state cleanly; use \`/exit\` or Ctrl+D.`,
      },
      {
        type: 'heading',
        content: 'Quellen',
      },
      {
        type: 'list',
        content: `- Codex repo (approval modes documentation): https://github.com/openai/codex
- Codex CLI releases (mode-flag changelog): https://github.com/openai/codex/releases
- Git restore (recovering an unwanted edit): https://git-scm.com/docs/git-restore`,
      },
    ],
  },

  {
    id: 2003,
    level: 1,
    title: 'AGENTS.md Basics',
    description:
      'Write a minimal AGENTS.md so Codex understands your project goals, conventions, do-not-touch areas, and the commands it should run for validation.',
    duration: '15 Minuten',
    track: 'codex',
    objectives: [
      'Author a minimal AGENTS.md for a single-package repo',
      'List the four mandatory sections (goal, conventions, do-not-touch, commands)',
      'Explain why AGENTS.md drift causes hallucinated patches',
      'Verify Codex picked up your AGENTS.md via the session header',
    ],
    content: [
      {
        type: 'heading',
        content: 'AGENTS.md Basics',
      },
      {
        type: 'text',
        content:
          'AGENTS.md is the spec file Codex reads at the start of every session in your repo. It is your handshake with the agent: this is what the project is, this is how we write it, this is what you must not touch, and these are the commands you should run to check your work. Without a good AGENTS.md, Codex falls back to guessing — and a guessing agent is the source of most "Codex made up a function that doesn\'t exist" complaints.',
      },
      {
        type: 'heading',
        content: 'Lernziele',
      },
      {
        type: 'list',
        content: `- Write a four-section AGENTS.md from scratch in under 10 minutes
- Place it in the right location (project root for a single-package repo)
- Verify Codex loaded it by reading the session header
- Recognize the three drift symptoms that mean your AGENTS.md is stale`,
      },
      {
        type: 'heading',
        content: 'Codex-Version',
      },
      {
        type: 'yaml',
        content: `cli_version: ">=0.130"
spec_filename: AGENTS.md
default_location: repo root
nested_support: yes (covered in Lesson 12)
session_header: "Codex prints the AGENTS.md path it loaded on session start"
verified_against: Codex CLI 0.130`,
      },
      {
        type: 'heading',
        content: 'The four mandatory sections',
      },
      {
        type: 'text',
        content:
          'A minimal AGENTS.md has four sections. You can add more later, but skip any of these and Codex will improvise.\n\nProject goal: one paragraph that tells Codex what the project is and who uses it. This anchors every later decision. If the goal says "internal CLI tool for our ops team," Codex will not propose adding a marketing landing page.\n\nConventions: the rules your code follows. Language, style, test framework, naming convention, branch convention. The shorter and more concrete the better — "use TypeScript strict mode" beats "follow modern best practices."\n\nDo-not-touch: the areas Codex must leave alone. Generated files, vendored code, large fixtures. This single section prevents most "Codex reformatted my snapshot fixtures" disasters.\n\nCommands: how Codex verifies its work. The lint command, the test command, the build command. If Codex can run these to self-check before handing back a diff, you will catch broken patches before they leave the agent.',
      },
      {
        type: 'heading',
        content: 'Beispiel-Code',
      },
      {
        type: 'text',
        content:
          'Here is a complete minimal AGENTS.md for a single-package Node project. Drop it at the repo root, commit it, and start Codex.',
      },
      {
        type: 'code',
        language: 'markdown',
        content: `# AGENTS.md

## Project goal
This repo is a small internal CLI ("repo-stats") that prints
lines-of-code metrics per language for a given Git repository.
Users are the internal engineering team. There is no web UI.

## Conventions
- Language: TypeScript with \`strict: true\`
- Style: Prettier defaults, no custom rules
- Tests: Vitest, colocated as \`*.test.ts\` next to source
- Commits: Conventional Commits (\`feat:\`, \`fix:\`, \`chore:\` etc.)
- Node version: 22 LTS (see \`.nvmrc\`)

## Do not touch
- \`dist/\` — generated output, never hand-edited
- \`test/fixtures/large/\` — multi-MB snapshot data
- \`CHANGELOG.md\` — generated from commits via release tooling

## Commands
- Install: \`npm ci\`
- Lint: \`npm run lint\`
- Test: \`npm test\`
- Build: \`npm run build\`
- Single-file test: \`npx vitest run path/to/file.test.ts\`

Run lint and test before handing back any diff.`,
      },
      {
        type: 'text',
        content:
          'Commit this file. Then open a Codex session in the same repo and look at the first lines of the session header. You should see Codex acknowledge that it loaded an AGENTS.md from your project root. If it does not, the file is in the wrong place or the filename is off (it must be exactly `AGENTS.md`, not `agents.md` or `AGENT.md` on case-sensitive filesystems).',
      },
      {
        type: 'heading',
        content: 'Vergleich zu Claude Code',
      },
      {
        type: 'code',
        language: 'markdown',
        content: `| Aspect              | Codex CLI                  | Claude Code            |
|---------------------|----------------------------|------------------------|
| Spec filename       | AGENTS.md                  | CLAUDE.md              |
| Location            | Repo root (nested supported) | Repo root (nested supported) |
| Read at             | Session start              | Session start          |
| Required sections   | Goal, conventions,         | Project context,       |
|                     | do-not-touch, commands     | conventions, workflows |

Both tools rely on a single Markdown spec file to bootstrap the
agent. Names differ; the discipline is identical: write it,
keep it current, treat it as part of the codebase.`,
      },
      {
        type: 'heading',
        content: 'Three drift symptoms',
      },
      {
        type: 'list',
        content: `- Codex proposes patches that reference dependencies your project no longer uses.
- The agent ignores your test-command and runs a generic \`npm test\` instead.
- Codex tries to format files inside your "do not touch" list.

Any of these means your AGENTS.md is older than the code. Re-read it,
update it, and commit before the next big task.`,
      },
      {
        type: 'heading',
        content: 'Übung',
      },
      {
        type: 'list',
        content: `- Open one of your own small repos.
- Write an AGENTS.md with the four sections above. Aim for under 40 lines total.
- Commit it: \`git commit -m "docs: add AGENTS.md for Codex"\`.
- Open Codex in that repo and confirm the session header mentions your AGENTS.md.
- Ask Codex: "What are this repo's coding conventions?" The answer should match what you wrote — if it doesn't, your spec file isn't being read.`,
      },
      {
        type: 'heading',
        content: 'Common Mistakes',
      },
      {
        type: 'list',
        content: `- Filename case. \`agents.md\` works on macOS by accident and fails on Linux CI. Always use \`AGENTS.md\`.
- Writing a marketing pitch in the "Project goal" section. Codex doesn't care that your project is "blazing fast" — write what it is, not how it sounds.
- Listing every file in "Do not touch." Use directories and globs; a 200-line list will be skimmed and partly ignored.
- Forgetting to update AGENTS.md when you change package managers or test frameworks. Codex will keep running \`npm test\` long after you moved to pnpm.
- Stuffing the spec with content meant for human onboarding docs. AGENTS.md is for the agent. Keep your README separate.`,
      },
      {
        type: 'heading',
        content: 'Quellen',
      },
      {
        type: 'list',
        content: `- Codex repo (AGENTS.md format): https://github.com/openai/codex
- OpenAI Cookbook (agent-spec patterns): https://github.com/openai/openai-cookbook
- Conventional Commits spec (used in the example): https://www.conventionalcommits.org/
- Vitest docs (used in the example): https://vitest.dev/`,
      },
    ],
  },

  {
    id: 2004,
    level: 1,
    title: 'Your First Codex Cloud Sandbox Run',
    description:
      'Trigger an ephemeral Cloud Sandbox session from the CLI, run a task in it, and pull results back without touching your local environment.',
    duration: '10 Minuten',
    track: 'codex',
    objectives: [
      'Launch a Codex Cloud Sandbox session from the CLI',
      'Distinguish a local-sandbox run from a Cloud Sandbox run',
      'Read the Cloud Sandbox session output and understand what is billed',
      'Pull artifacts back to your local workspace cleanly',
    ],
    content: [
      {
        type: 'heading',
        content: 'Your First Codex Cloud Sandbox Run',
      },
      {
        type: 'text',
        content:
          'Cloud Sandbox is the second of the three Codex surfaces. It is an ephemeral remote VM that Codex spins up on demand. You drive it from the same CLI, but the actual execution happens in a sandbox OpenAI manages. The right time to reach for it is when you do not want to trash your local Node, Python, or system state — for example, when a task wants to run a noisy migration, install a global package, or test something against a fresh OS.',
      },
      {
        type: 'heading',
        content: 'Lernziele',
      },
      {
        type: 'list',
        content: `- Launch a Cloud Sandbox session from the local CLI
- Tell at a glance whether you are running locally or in the cloud
- Read the session output and locate the cost / usage line
- Bring useful artifacts back into your local workspace`,
      },
      {
        type: 'heading',
        content: 'Codex-Version',
      },
      {
        type: 'yaml',
        content: `cli_version: ">=0.130"
feature: cloud-sandbox
trigger: "/cloud (inside a Codex session) or a documented CLI flag"
session_lifetime: ephemeral (clean VM per session)
billing: ChatGPT plan minutes or API-key usage, per official Codex docs
verified_against: Codex CLI 0.130
note: |
  Flag names and exact triggers for Cloud Sandbox can change between
  releases. Confirm against https://github.com/openai/codex/releases
  before scripting against them.`,
      },
      {
        type: 'heading',
        content: 'Local vs Cloud — when to pick which',
      },
      {
        type: 'text',
        content:
          'Local Codex sessions run in your terminal, edit files on your disk, and use your laptop\'s tools. They are fast, free of network round-trips, and your usual development experience. Cloud Sandbox sessions live on a remote VM. They take a moment to spin up, they bill against your usage, and they leave no trace on your laptop when they end.\n\nUse local for the work you do every day. Use Cloud Sandbox when you specifically want isolation — running a migration script, testing a new package install, generating artifacts you want to download rather than blend with your working tree, or doing anything you would normally containerize. Lesson 15 dives into env vars and secrets; today we just open one and run a small task.',
      },
      {
        type: 'heading',
        content: 'Beispiel-Code',
      },
      {
        type: 'text',
        content:
          'The exact command surface for Cloud Sandbox has shifted between Codex releases. Confirm against `codex --help` and the GitHub release notes, then run something like:',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Inside a Codex session, switch to Cloud Sandbox mode
/cloud

# Codex prints a banner so it is obvious you are no longer local:
#   [Cloud Sandbox] session started — VM ready
#   Billing: charged against your current Codex plan / API usage

# Ask for a small, isolated task. For example:
# "Initialize a fresh Node 22 project, install zod, and print
#  the version that landed in package.json. Do not change the
#  working directory I had before /cloud."

# When done, exit the Cloud Sandbox session:
/exit-cloud

# You are back in your local Codex session. The cloud VM is gone.`,
      },
      {
        type: 'text',
        content:
          'If a command in your version does not match exactly, run `codex --help` and look for any flag or slash command containing "cloud" or "sandbox". The naming has stabilized in 0.130, but earlier releases used different verbs.',
      },
      {
        type: 'heading',
        content: 'Pulling artifacts back',
      },
      {
        type: 'text',
        content:
          'Cloud Sandbox sessions are ephemeral by design — when the session ends, the VM disappears. Anything you want to keep has to come back to your local workspace before exit. The standard pattern is to ask Codex to write the artifact to a known location and to confirm the write before you exit. For small outputs, copy them into your terminal output and save locally. For larger artifacts (test reports, generated code, migration logs), use the artifact-export path documented in the Codex release notes for your version — and assume nothing about the cloud filesystem persists.',
      },
      {
        type: 'heading',
        content: 'Vergleich zu Claude Code',
      },
      {
        type: 'code',
        language: 'markdown',
        content: `| Aspect              | Codex Cloud Sandbox          | Claude Code Sandbox       |
|---------------------|------------------------------|---------------------------|
| Execution location  | Remote VM, ephemeral         | Local OS-level sandbox    |
| Default lifecycle   | Spun up on demand, torn down | Tied to the local session |
| Network access      | Yes, from the cloud VM       | Configurable per session  |
| File persistence    | None after exit              | Local filesystem (scoped) |
| Best for            | Noisy migrations, fresh-env tasks | Risky local changes   |

Different shapes, similar intent: isolate state so you can run
adventurous code without polluting your day-to-day environment.`,
      },
      {
        type: 'heading',
        content: 'Übung',
      },
      {
        type: 'list',
        content: `- Open Codex locally inside any small repo.
- Run \`codex --help\` and find the Cloud Sandbox entry point for your version.
- Switch to Cloud Sandbox and ask: "Print Node and npm versions in this environment."
- Note the session-cost or usage line printed when the sandbox starts.
- Exit the Cloud Sandbox and confirm your local working tree is untouched (\`git status\`).`,
      },
      {
        type: 'heading',
        content: 'Common Mistakes',
      },
      {
        type: 'list',
        content: `- Assuming the Cloud Sandbox has access to your local files. It does not — pass content explicitly or sync via the documented artifact path.
- Forgetting to exit the cloud session and letting it idle. You may be billed for idle minutes — exit explicitly when you're done.
- Storing secrets in the Cloud Sandbox via plain env vars and then sharing the session transcript. Use the secrets store (covered in Lesson 15) for anything sensitive.
- Treating Cloud Sandbox as a free Docker. It is metered. Use it for tasks where isolation matters, not for casual work.
- Running production migrations from Cloud Sandbox without a rollback plan. The ephemeral VM has no rollback — your real database does not.`,
      },
      {
        type: 'heading',
        content: 'Quellen',
      },
      {
        type: 'list',
        content: `- Codex repo (Cloud Sandbox documentation): https://github.com/openai/codex
- Codex CLI releases (Cloud Sandbox changelog): https://github.com/openai/codex/releases
- OpenAI status page (Cloud Sandbox availability): https://status.openai.com/`,
      },
    ],
  },
];
