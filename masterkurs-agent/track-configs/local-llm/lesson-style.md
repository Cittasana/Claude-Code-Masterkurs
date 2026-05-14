# Track-Style: local-llm

## Track-Positionierung
Der **local-llm**-Track zeigt, wie man Coding-Agenten ohne Cloud-Provider betreibt: Ollama, llama.cpp, LM Studio, lokale MCP-Server, on-device-RAG. Zielgruppe: Privacy-bewusste Entwickler, regulierte Branchen (Health/Finance), Hobby-Tinkerer mit guter GPU.

## Lesson-ID-Range
- **Range**: `3000` – `3999`
- **Aktueller Stand**: 0 belegt (Track ist neu)
- **Konvention**: Erste Lesson startet bei `3000`. Nächste freie ID = `MAX(existing_id) + 1` innerhalb der Range.

## Tonalität
- **Anrede**: DE Du-Form (uniform über alle Tracks)
- **Stil**: Technisch, hardware-realistisch (kein "läuft auf jedem MacBook" wenn es nicht stimmt)
- **VRAM- und Quantisierungs-bewusst**: Modell-Größen und RAM/VRAM-Anforderungen immer mitnennen

## Pflicht-Sektionen (local-llm Lessons)
1. **Lernziele** – 3–5 konkrete Fähigkeiten
2. **Hardware-Anforderungen** – Mindest-RAM, VRAM, OS, GPU
3. **Modell-Wahl** – Welches Modell + Quantisierung (Q4_K_M, Q8_0, etc.) + Quelle (Hugging Face / Ollama Library)
4. **Beispiel-Code** – Lauffähiger Befehl (`ollama run …`, `llama-server …`, etc.)
5. **Performance-Erwartung** – Konkrete tokens/sec auf Referenz-Hardware
6. **Übung** – Hands-on Aufgabe
7. **Privacy-Note** – Was bleibt lokal, was nicht (z.B. Modell-Download über HF Hub)
8. **Quellen** – Ollama / llama.cpp Docs + Community-Benchmarks

## Style-Beispiele

**Lesson-Opener**:
```markdown
# Lektion 3000: Ollama Setup — Llama 3.3 70B lokal als Coding-Agent

Ollama ist die einfachste Brücke zwischen Hugging-Face-GGUF und einem lokalen Inference-Server. In dieser Lektion bringst du Llama 3.3 70B (Q4_K_M, ~40 GB VRAM) auf einer RTX 4090 oder einem M3 Max zum Laufen — und nutzt es als Backend für ein OpenAI-kompatibles MCP-Setup.
```

**Hardware-Hinweis-Convention**:
```markdown
**Hardware-Anforderungen**:
- **Modell**: Llama 3.3 70B Q4_K_M (~40 GB on-disk)
- **VRAM**: 48 GB für volle GPU-Inference (RTX 6000 Ada / M3 Max 128 GB Unified)
- **Fallback**: Q3_K_S Quantisierung läuft auf 24 GB (RTX 4090) — ~30% Quality-Drop
- **CPU-Only**: Funktioniert, aber <2 tokens/sec → unbrauchbar für interaktive Sessions
```
