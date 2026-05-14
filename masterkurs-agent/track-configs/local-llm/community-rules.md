# Community Rules — Track: local-llm

> Forum-Moderation und Engagement-Konfiguration für den `local-llm`-Track.
> Heute aktiv im Forum (track-context badge). Forward-kompatibel für Discord, sobald Locked Decision #6 aufgehoben wird.

## Welcome-Message

Hey {{username}}! Willkommen im **Local-LLM Track** — Ollama, LM Studio, GLM-4.7-Coder, Qwen3-Coder, Devstral und Co. auf eigener Hardware. Stell dich kurz vor und sag uns, welches Setup (CPU/GPU/RAM, OS) du fährst — das hilft beim Antworten enorm.

## Allowed Topics

- Ollama, LM Studio, llama.cpp, vLLM Setup & Performance
- Aktuelle Tier-Modelle aus `local-llm-tier-catalog.ts` (GLM-4.7-Coder, Qwen3-Coder, Devstral-2026)
- Quantisierung (Q4/Q5/Q8, GGUF, AWQ), Context-Length-Trade-offs
- Hardware-Empfehlungen (Apple Silicon, NVIDIA, AMD ROCm, CPU-only)
- Lokale Code-Tools die OSS-Modelle nutzen (Continue.dev, Aider, Cline, OpenCode)

## Off-Topic (moderate — Hardware-Diskussion willkommen)

- Reine Anthropic/OpenAI-API-Fragen → `claude-code` oder `codex`-Track
- Pure Hardware-Builds ohne LLM-Bezug → freundlich an `r/LocalLLaMA` verweisen
- Off-Topic-Schwelle: **moderate** (LLM + Hardware-Kontext OK; reine Hardware ohne Code-Use-Case nicht)

## Spam-Patterns (track-spezifisch flaggen)

- `crypto-mining-rig` Affiliate (versteckt sich oft in Hardware-Threads)
- "Uncensored-LLM-Marketplace"-Spam (zweifelhafte Quellen)
- `model-leaked`, `weights-cracked` (urheberrechtlich problematische Quellen)
- GPU-Reseller-Spam ohne Disclosure
- "Run Claude locally" — irreführend (Claude ist nicht OSS) → flag und richtigstellen

## Engagement-Cadence

- **Dienstag 10:00 CET** — "Tier-Tabelle Update" — Founder/Mod postet aktuelle Bench-Vergleiche aus `local-llm-tier-catalog.ts`
- **Donnerstag 10:00 CET** — Hardware Showcase (Member zeigt Setup, tok/s, gewählte Quantisierung)
- **Samstag 12:00 CET** — Weekend-Lab (langes Bench-/Setup-Experiment, Member dokumentiert über das WE)

> Cadence weicht bewusst von Mo/Mi/Fr ab: Local-LLM-Audience ist hardware-getrieben und experimentiert eher am Wochenende.

## Escalation Policy

- **Auto-Action**: `weights-cracked`/`model-leaked`-Patterns → delete + warn (Urheberrecht)
- **Mod-Eskalation**: Hardware-Empfehlungen die unsicher sind (Stromversorgung, Kühlung) — Mod ergänzt Safety-Note
- **Founder-Eskalation**: bei Diskussionen die Tier-Tabelle aktualisieren sollten (`local-llm-tier-catalog.ts` PR)
