---
name: masterkurs-community-mod
description: |
  Forum/Discord/Slack Community-Management pro Track: Regeln, Moderation-Workflows, Engagement-Strategie.
  Heute operiert dieser Skill auf dem Forum (mit track-context Badge per Phase 1 W2c). Discord ist initial deferred (Locked Decision #6 im Multi-Track-Plan: "Discord aus initial-6-Phasen-Scope raus. Forum + Email-Sequenzen tragen den Community-Layer."). Die Track-Parametrisierung ist forward-kompatibel und wird ohne Schema-Änderung greifen, sobald Discord ausgerollt wird.
  Nutze wenn User "Community setup", "Forum moderieren", "Discord moderieren", "Engagement-Strategie", "freelancer community guidelines", "codex moderation rules", "local-llm community", "claude-desktop forum rules" erwähnt.
arguments:
  - name: --track
    description: Track-Key — bestimmt aus welcher track-configs/<key>/community-rules.md die Welcome-Message, Off-Topic-Schwelle, Spam-Patterns und Cadence geladen werden.
    type: string
    required: false
    default: claude-code
    accepted_values: [claude-code, claude-desktop, codex, local-llm, freelancer]
trigger_phrases:
  - "community setup"
  - "forum moderieren"
  - "discord moderieren"
  - "engagement-strategie"
  - "freelancer community guidelines"
  - "codex moderation rules"
  - "local-llm community"
  - "claude-desktop forum rules"
  - "community rules <track>"
compatibility:
  required_tools: [Read, Write, mcp__3aa8d81d-6572-4220-b566-57c5cbf089df__*]
---

# Masterkurs Community Moderator (Multi-Track)

Track-bewusstes Forum-/Community-Management & Engagement-Strategien.

## Deferred-Discord-Kontext (WICHTIG zuerst lesen)

Per **Locked Decision #6** im Multi-Track-Plan (`~/.claude/plans/abstract-moseying-sutton.md`):

> "Discord: Aus initial-6-Phasen-Scope raus. Forum + Email-Sequenzen tragen den Community-Layer; Discord wenn Bedarf konkret wird. `masterkurs-community-mod`-Skill bleibt im Codebase aber unangetastet in Phase 2."

Phase 2 hat den Skill jetzt **parametrisiert** (nicht implementiert): Track-Argument + Per-Track-Rule-Sources sind aktiv, Output-Pfade sind track-namespaced, und sämtliche Welcome/Engagement/Spam-Definitionen sind aus dem hardcodierten Block raus in `track-configs/<track>/community-rules.md`. Das macht die Skill-Logik **heute fürs Forum nutzbar** (forum-context per Phase 1 W2c) und **morgen für Discord wiederverwendbar**, sobald die Locked Decision aufgehoben wird — ohne Skill-Refactor.

**Heute (aktiv):** Forum mit track-context Badge. Welcome-DMs als Auto-Reply auf erste Forum-Posts; Engagement-Cadence als geplante Forum-Posts; Spam-Detection auf Forum-Threads.
**Später (deferred bis Bedarf):** Discord-Server (gemeinsam, mit Track-Kanälen empfohlen — siehe Plan §"Out-of-Scope"); Slack-Alternative bei Enterprise-Bedarf.

## Input

- **Track** (`--track <key>`, default `claude-code`): einer von `claude-code | claude-desktop | codex | local-llm | freelancer`
- **Surface** (heute): Forum (track-gebadgt). Discord/Slack-Surfaces sind Forward-Compat-Pfade.
- **Größe**: 10-50 / 50-200 / 200+ Members (skaliert Mod-Strategien siehe unten)
- **Problem**: Spam / Inaktivität / Off-Topic / Konflikte (track-spezifisch geflaggt — siehe Per-Track Rules)

## Per-Track Rule Sources (Single Source of Truth)

Track-spezifische Regeln werden zur Laufzeit aus diesen Dateien geladen — **niemals hardcoden**:

```
masterkurs-agent/track-configs/<track>/community-rules.md
```

Jede dieser Dateien definiert pro Track:

1. **Welcome-Message** — track-spezifischer Tonfall (claude-code: CLI-Power-User; freelancer: Business-Mindset; codex: EN-first; local-llm: Hardware-aware; claude-desktop: GUI-Workflow)
2. **Allowed Topics** — was thematisch in den Track gehört
3. **Off-Topic-Schwelle** — `strict` (claude-code), `moderate` (claude-desktop, codex, local-llm), `flexible` (freelancer)
4. **Spam-Patterns** — track-spezifische Keywords/Heuristiken die geflaggt werden
5. **Engagement-Cadence** — Wochentage + Uhrzeiten + Prompt-Format (Mo/Mi/Fr default für claude-code/claude-desktop; Mo/Mi/Fr-Variante mit Codex-EN für codex; Di/Do/Sa für local-llm; Di/Do/So für freelancer-B2B)
6. **Escalation Policy** — wann Auto-Action, wann Mod, wann Founder

**Lade-Pattern** (im Skill-Run):

```
1. Resolve $TRACK = --track || "claude-code"
2. Validate $TRACK ∈ {claude-code, claude-desktop, codex, local-llm, freelancer} sonst FAIL mit klarer Fehlermeldung
3. Read masterkurs-agent/track-configs/$TRACK/community-rules.md
4. Apply Welcome-Message-Template, Off-Topic-Schwelle, Spam-Patterns, Engagement-Cadence, Escalation Policy aus dieser Datei
5. Generiere Output (siehe unten) im track-namespaced Pfad
```

Wenn die track-config-Datei fehlt → STOP und fordere `track-configs/<track>/community-rules.md` zur Erstellung an. **Nicht** auf Defaults zurückfallen.

## Output

Alle generierten Artefakte landen track-namespaced in:

```
masterkurs-agent/community/<track>/
├── community-rules.md            (rendered für aktuellen Surface — heute Forum)
├── moderation-guide.md
├── engagement-strategy.md
├── templates/
│   ├── welcome-message.md
│   ├── weekly-challenge.md
│   └── showcase-template.md
└── <YYYY-Wxx>-summary.md         (Wochen-Report — siehe "Weekly Summary" unten)
```

**Beispiele:**
- `masterkurs-agent/community/claude-code/2026-W20-summary.md`
- `masterkurs-agent/community/freelancer/2026-W20-summary.md`
- `masterkurs-agent/community/codex/templates/welcome-message.md`

## Weekly Summary Report

Wöchentlicher Mod-Report pro Track, abgelegt unter:

```
masterkurs-agent/community/<track>/<YYYY-Wxx>-summary.md
```

Format (Auszug):

```markdown
# Weekly Community Summary — Track: <track> — <ISO-Week>

## Stats
- New Members: X
- Active Members (≥1 Post): Y
- Messages: Z
- Mod-Actions: A (delete: B, warn: C, timeout: D, ban: E)

## Engagement-Cadence-Hits
- <Day>: <Prompt-Type> — <Submissions> Einreichungen
- ...

## Spam-Pattern-Triggers
- Pattern "<x>": N hits → action: <auto-delete / mod-review>

## Escalations
- <#thread>: <kurz-summary> → resolved by <mod/founder>

## Track-Health-Signal
- Sentiment: GOOD / WARNING / CRITICAL
- Off-Topic-Quote: X% (vs Schwelle des Tracks)
- Unresolved Reports: N

## Recommendations
- ...
```

## Community Rules Template (Track-aware)

> Der Track-spezifische Inhalt (Mission, Welcome, Allowed Topics, Off-Topic, Spam, Cadence, Escalation) wird zur Laufzeit aus `track-configs/<track>/community-rules.md` geladen. Dieses Template definiert nur die universellen Block-Slots und die Konsequenz-/Reporting-Standards, die über alle Tracks identisch sind.

```markdown
# Claude Code Masterkurs - Community-Regeln — Track: {{track}}

## Mission
{{from track-configs/{{track}}/community-rules.md → Welcome-Message-Kontext}}

## Erwünscht (universell)
- Fragen stellen (keine dumme Frage!)
- Projekte teilen
- Anderen helfen
- Konstruktives Feedback
- Code-Reviews

## Erwünscht (track-spezifisch)
{{from track-configs/{{track}}/community-rules.md → "Allowed Topics"}}

## Nicht erwünscht (universell)
- Spam oder Werbung
- Beleidigungen / Toxicity
- Politik, Religion, persönliche Konflikte
- Code ohne Kontext posten
- DM-Spam an Members

## Off-Topic-Schwelle (track-spezifisch)
{{from track-configs/{{track}}/community-rules.md → "Off-Topic" Block + Schwelle}}

## Spam-Patterns (track-spezifisch)
{{from track-configs/{{track}}/community-rules.md → "Spam-Patterns"}}

## Konsequenzen (universell)
1. Warnung
2. Temporärer Mute / Read-Only (24h)
3. Kick / Account-Lock
4. Permanent Ban

## Reporting
→ `#report`-Tag im Forum-Thread (oder `@mods` sobald Discord ausgerollt ist — Locked Decision #6)

## Escalation Policy (track-spezifisch)
{{from track-configs/{{track}}/community-rules.md → "Escalation Policy"}}
```

## Moderation-Workflows

### Spam-Handling
1. **Erkennen**: Link-Spam, Crypto, irrelevante Werbung
2. **Action**: Nachricht löschen + Warnung
3. **Repeat Offender**: Temporärer Ban (7 Tage)
4. **Dokumentieren**: Log in #mod-log Channel

### Konflikt-Lösung
1. **Deeskalieren**: Privat-DM an beide Parteien
2. **Mediieren**: "Ich verstehe beide Seiten..."
3. **Timeout**: Wenn nötig, beide 30 Min muten
4. **Follow-up**: Nach 24h checken

### Off-Topic Management
1. **Freundlich umlenken**: "Cool, aber #general passt besser"
2. **Bei Persist**: Nachricht in richtigen Channel verschieben
3. **Wiederholungstäter**: DM + Reminder

## Engagement-Strategien

### Wöchentliche Prompts (track-spezifische Cadence)

> **Quelle**: `track-configs/<track>/community-rules.md` → Sektion "Engagement-Cadence". Lade diese Datei zur Laufzeit.

**Default-Patterns je Track:**

| Track | Cadence | Begründung |
|-------|---------|------------|
| `claude-code` | Mo / Mi / Fr | Standard-Dev-Rhythmus |
| `claude-desktop` | Mo / Mi / Fr | Wie claude-code, GUI-Fokus |
| `codex` | Mo / Mi / Fr (EN-first) | Standard-Rhythmus, EN-Locale |
| `local-llm` | Di / Do / Sa | Hardware-Audience experimentiert am WE |
| `freelancer` | Di / Do / So | B2B-Audience, Mo+Fr blockiert durch Kund:innen-Wochenstart/-abschluss |

**Beispiel `claude-code`-Track** (default):
- **Montag**: "Show Your Project Monday" → Members teilen Wochenend-Projekte
- **Mittwoch**: "Claude Code Challenge Wednesday" → Kleine Coding-Challenge, 24h Zeit
- **Freitag**: "Feedback Friday" → Code-Review von Community

Konkrete Prompt-Texte stehen in der jeweiligen `community-rules.md` jedes Tracks.

### Gamification
- **Rollen-System**:
  - Newbie (0-10 Messages)
  - Coder (10-50 Messages)
  - Expert (50+ Messages + hilfreiche Antworten)
  - Legend (200+ Messages + Mod-Nomination)

- **Badges**:
  - "First Project" 🎯
  - "Helper" 🤝 (10 Fragen beantwortet)
  - "Challenge Winner" 🏆

### Content-Ideen

**#weekly-challenge**:
```markdown
# Challenge #12: API-Integration

**Aufgabe**: Nutze Claude Code um eine Weather-API zu integrieren

**Requirements**:
- Fetch Wetter-Daten
- Error-Handling
- UI-Display

**Deadline**: Freitag 18:00
**Prize**: Feature in Newsletter + Custom Role
```

**#code-review Struktur**:
```markdown
**Project**: [Name]
**Stack**: [Tech]
**What I need help with**: [Spezifisch]
**Code**: [GitHub/Gist Link]
```

**#showcase Template**:
```markdown
**Project**: [Name]
**What it does**: [1-2 Sätze]
**Tech**: [Stack]
**Claude Code helped with**: [Spezifisch]
**Demo**: [Link/Screenshot]
**Learnings**: [1-3 Bullet Points]
```

## Analytics

Track MONTHLY:
- **Member Growth**: +/- X Members
- **Active Members**: % die ≥1 Message schreiben
- **Engagement Rate**: Messages pro Active Member
- **Top Contributors**: Top 10 Helper
- **Challenge Participation**: % die mitmachen

**Gesunde Signale**:
- ✅ 20%+ Active Member Rate
- ✅ 3+ Messages pro Active Member/Woche
- ✅ <10% Moderation Actions

**Problematische Signale**:
- ⚠️ <10% Active Member Rate → Mehr Engagement-Prompts
- ⚠️ >20% Moderation Actions → Rules zu locker?
- ⚠️ Immer die gleichen 5 Leute antworten → Onboarding verbessern

## Welcome-Bot Message (track-spezifisch)

> **Quelle**: `track-configs/<track>/community-rules.md` → Sektion "Welcome-Message". Lade pro Track. **Niemals hardcoden.**

**Wrapper-Template** (umgibt den track-spezifischen Welcome-Text):

```markdown
{{from track-configs/{{track}}/community-rules.md → Welcome-Message}}

**Quick Start (universell)**:
1. Stelle dich kurz vor
2. Check die Community-Regeln deines Tracks
3. Stell deine erste Frage — keine ist zu klein

**Resources**:
- Plattform: https://akademie.cittasana.de/de/{{track}}  (claude-code-masterkurs.de 301 → akademie.cittasana.de/de/claude-code per Phase 5 Domain-Cutover)
- Forum: track-context Badge zeigt deinen aktiven Track
- Email-Sequenzen: tragen den Community-Layer mit (Locked Decision #6 — Discord deferred)

Viel Erfolg beim Lernen!
```

**Beispiel-Output für Track `freelancer`**:

```markdown
Hey {{username}}! Willkommen im **Freelancer Track** — Business-Modul für Solo-Devs ...
[Rest aus track-configs/freelancer/community-rules.md]
```

## Platform-spezifische Setup-Guides

> **Status:** Heute aktiv = **Forum** (mit track-context Badge per Phase 1 W2c). Discord/Slack-Sektionen unten sind **Forward-Compat-Referenz** für den Tag, an dem Locked Decision #6 aufgehoben wird ("Discord wenn Bedarf konkret wird"). Bei Discord-Rollout wird empfohlen: **ein gemeinsamer Server mit Track-Kanälen** (Cross-Track-Network-Effekte) — siehe Plan §"Out-of-Scope".

### Forum Setup (HEUTE AKTIV)

**Charakteristik:**
- Track-context Badge auf jedem Thread (Phase 1 W2c)
- Eventuell track-kategorisiert (Roadmap)
- Welcome-Auto-Reply auf erstem Post je User
- Mod-Aktionen über bestehende Forum-Tools
- Engagement-Cadence als geplante Sticky-Posts pro Track

**Pro Track ein "Track-Context"** statt separater Channels:
- Filter im Frontend (`useTrackStore` aus Phase 1 W1)
- Cross-Track-Threads sind erlaubt aber müssen den primären Track im Badge tragen

### Discord Setup (DEFERRED — Locked Decision #6)

**Vorteile**:
- Voice Channels für Live-Coding
- Bessere Bot-Ökosystem (MEE6, Dyno, Carl-bot)
- Screen-Sharing für Debugging-Sessions
- Threading für strukturierte Diskussionen
- Webhooks für Integration

**Setup-Checklist**:
```
SERVER STRUCTURE:
├── 📋 INFO
│   ├── #rules
│   ├── #announcements
│   └── #resources
├── 🎓 LEARNING
│   ├── #questions (für Anfänger)
│   ├── #advanced (für Fortgeschrittene)
│   ├── #debugging (Fehler besprechen)
│   └── #code-review
├── 💬 COMMUNITY
│   ├── #general
│   ├── #introductions
│   ├── #showcase (Projekte teilen)
│   └── #wins (Erfolge feiern)
├── 🏆 ENGAGEMENT
│   ├── #weekly-challenge
│   ├── #office-hours (Live Q&A)
│   └── #events
└── 🔧 MODERATION
    ├── #mod-log (nur Mods)
    └── #reports (nur Mods)

VOICE CHANNELS:
├── 🎤 Study Room 1
├── 🎤 Study Room 2
├── 🎤 Debugging Session
└── 🎤 Office Hours (Scheduled)
```

**Bot-Empfehlungen**:
1. **MEE6**: Auto-Moderation, Leveling, Welcome Messages
2. **Dyno**: Advanced Moderation, Custom Commands
3. **Carl-bot**: Reaction Roles, Logging
4. **Tatsu**: Gamification, Leaderboards
5. **Zapier**: Integration mit Email/Notion/etc.

**Role-Hierarchie**:
```
ADMIN ROLES:
├── Owner (Full Permissions)
├── Moderator (Kick, Ban, Delete Messages)
└── Helper (Delete Messages, Timeout)

MEMBER ROLES:
├── Legend (200+ Messages, Helper-Status)
├── Expert (50+ Messages)
├── Coder (10+ Messages)
└── Newbie (0-10 Messages)

SPECIAL ROLES:
├── Paid Student (Verified Email)
├── Challenge Winner
├── Top Contributor (monatlich vergeben)
└── Early Supporter (erste 100 Members)
```

### Slack Setup (Alternative — ebenfalls deferred)

**Vorteile**:
- Professionelleres Feeling
- Bessere Integration mit Tools (Notion, Asana, GitHub)
- Threaded Conversations (übersichtlicher)
- Workflow Builder für Automation

**Nachteile**:
- Weniger Gaming-Vibe
- Message-Limit bei Free Tier (10k Messages)
- Keine Voice Channels
- Teurer für große Communities

**Wann Slack nutzen?**
→ Wenn Community eher Enterprise/B2B-fokussiert ist
→ Wenn viele Tool-Integrationen benötigt werden
→ Wenn Budget für Paid Plan vorhanden (€7/User/Monat)

## Automation & Bot-Workflows

### Auto-Moderation Setup (Discord)

**MEE6 Configuration**:
```yaml
AUTO_MOD_RULES:
  - name: "Spam-Link-Filter"
    trigger: "message_contains_url"
    condition: "new_user_under_7_days"
    action: "delete_message + warn"

  - name: "Mass-Mention"
    trigger: "mentions_more_than_5"
    action: "delete_message + timeout_30min"

  - name: "CAPS-Spam"
    trigger: "message_70percent_caps"
    condition: "message_length > 50"
    action: "delete_message + warning"

  - name: "Duplicate-Message"
    trigger: "same_message_3times_in_60sec"
    action: "delete_messages + timeout_10min"

  - name: "Banned-Words"
    trigger: "contains_banned_word"
    banned_words: ["scam", "crypto-pump", "investment-opportunity"]
    action: "delete_message + notify_mods"
```

**Welcome-Automation Flow**:
```
USER JOINS
  ↓
1. Send Welcome-DM (instant)
  ↓
2. Assign "Newbie" Role (instant)
  ↓
3. Post in #introductions (suggest, nicht force)
  ↓
4. After first message: Remove "Newbie" → "Coder"
  ↓
5. After 10 messages: Send "You're active!" DM + "Active" Role
  ↓
6. After 50 messages: Nominate for "Expert" (Mod approval)
```

### Scheduled Posts (Webhook Automation)

**Setup via Zapier/Make**:
```javascript
// Montag 09:00 - Show Your Project
{
  "channel": "#showcase",
  "message": "🚀 **Show Your Project Monday!**\n\nHast du letztes Wochenende was mit Claude Code gebaut?\n\n→ Teile dein Projekt mit dem #showcase Template!\n→ Bestes Projekt kommt in den Newsletter\n\n💡 Inspiration: Letzte Woche haben wir X, Y, Z gesehen",
  "schedule": "cron(0 9 * * 1)"
}

// Mittwoch 10:00 - Challenge Announcement
{
  "channel": "#weekly-challenge",
  "message": "🏆 **Challenge #{{challenge_number}}: {{challenge_title}}**\n\n**Aufgabe**: {{description}}\n\n**Deadline**: Freitag 18:00\n**Prize**: Feature in Newsletter + Custom Role 'Challenge Winner'\n\n📋 Details im Thread 👇",
  "schedule": "cron(0 10 * * 3)"
}

// Freitag 18:00 - Challenge Recap
{
  "channel": "#weekly-challenge",
  "message": "⏰ **Challenge {{challenge_number}} endet JETZT!**\n\nEinreichungen ab jetzt geschlossen.\n\n**Stats**:\n- {{submission_count}} Einreichungen\n- {{participant_count}} Teilnehmer\n\n📊 Gewinner wird Montag bekannt gegeben!",
  "schedule": "cron(0 18 * * 5)"
}
```

## Crisis Management

### Toxicity-Handling

**Level 1: Subtle Toxicity** (Sarkasmus, Passive Aggressiveness)
```markdown
ACTION:
1. **Ignore-First-Time** (jeder hat mal schlechten Tag)
2. **Document** (Log in Mod-Tool)
3. **Watch** (bei Wiederholung → Level 2)
```

**Level 2: Direkte Toxicity** (Beleidigungen, Angriffe)
```markdown
ACTION:
1. **Delete Message** (sofort)
2. **Private Warning-DM**:
   "Hi {{username}},

   Deine Nachricht in #{{channel}} verstößt gegen unsere Community-Regeln (Respekt).

   Bitte bleib konstruktiv, auch bei Meinungsverschiedenheiten.

   Weitere Verstöße führen zu Timeout/Ban.

   Fragen? Antworte auf diese DM."
3. **Log in #mod-log**
4. **Bei Wiederholung innerhalb 7 Tage → Level 3**
```

**Level 3: Systematische Toxicity** (Wiederholungstäter, Trolling)
```markdown
ACTION:
1. **Temporary Ban** (7 Tage)
2. **Public Announcement** (optional, bei bekanntem Member):
   "{{username}} wurde temporär gebannt wegen wiederholter Verstöße gegen Community-Regeln.

   Wir nehmen Respekt ernst. 💙"
3. **Team-Meeting** (entscheiden ob Permanent Ban)
4. **Bei Return nach 7 Tagen**:
   - Final-Warning-DM
   - Nächster Verstoß = Permanent
```

### Raid-Schutz (Mass-Join-Attack)

**Trigger-Signale**:
- 10+ neue Members in <5 Min
- Alle posten ähnliche Messages
- Alle haben ähnliche Namen (z.B. "User1234")
- Keine Profilbilder

**Emergency-Protocol**:
```
STEP 1: LOCKDOWN (sofort)
→ Discord: Server Settings → Enable "Verification Level: High"
→ Require 10min on server before posting
→ Require verified email + phone

STEP 2: CLEANUP
→ Ban alle Raid-Accounts (bulk-ban via Bot)
→ Delete alle Spam-Messages

STEP 3: COMMUNICATION
→ Post in #announcements:
   "Wir hatten gerade einen Raid. Situation ist unter Kontrolle.
   Temporär erhöhte Verification für neue Joins.
   Zurück zu normal in 24h."

STEP 4: DEBRIEF
→ Team-Meeting: Wie kam es dazu?
→ Bessere Prävention (Invite-Links limitieren?)
→ Update Auto-Mod Rules
```

### Mass-Exit Handling (Churn-Event)

**Wenn 10+ Members an einem Tag leaven**:
```markdown
INVESTIGATION:
1. **Check #general**: Gab es Konflikt/Drama?
2. **Check External**: Reddit/Twitter - Negatives über uns?
3. **Email Survey** (an alle die left):
   "Hi {{name}}, wir haben gesehen dass du die Community verlassen hast.

   Magst du uns 1 Min Zeit geben für Feedback?

   → [Google Form Link]

   Was könnten wir besser machen?"

RESPONSE:
- Bei Pricing-Issue: Preis-Anpassung erwägen
- Bei Content-Issue: Mehr/bessere Content-Formate
- Bei Toxicity-Issue: Härtere Moderation
- Bei Platform-Issue: Alternative erwägen (Discord → Slack?)
```

## Community Growth Strategies

### Onboarding-Optimization

**Neue Member Journey** (First 7 Days):
```
DAY 1:
- ✅ Welcome-DM erhalten
- ✅ Rules gelesen
- ✅ Intro in #introductions gepostet
- 🎯 ZIEL: First Message in #questions

DAY 3:
- 📧 Email: "3 Tipps um das meiste aus der Community rauszuholen"
  1. Stelle deine erste Frage in #questions
  2. Check #showcase für Inspiration
  3. Mach bei nächster #weekly-challenge mit
- 🎯 ZIEL: Active Role Assignment

DAY 7:
- 🤖 Bot-DM: "Hey {{username}}! Du bist jetzt 1 Woche dabei.

  Brauchst du Hilfe? Hast du Fragen zum Kurs?

  → Antworte auf diese Message oder frag in #questions"
- 🎯 ZIEL: 10+ Messages → "Coder" Role
```

**Activation-Rate messen**:
```
METRIC: % von neuen Joins die innerhalb 7 Tagen ≥1 Message schreiben

BENCHMARK:
- < 10% = CRITICAL (Onboarding kaputt)
- 10-20% = OK (verbesserbar)
- 20-30% = GOOD
- > 30% = EXCELLENT

WENN < 20%:
→ Überarbeite Welcome-Message (zu lang? unklar?)
→ Mehr Prompts in ersten 48h
→ Persönlichere DMs (nicht Bot-generisch)
```

### Retention-Strategien

**Active → Inactive Detection**:
```javascript
// Trigger wenn User 14 Tage keine Message
IF user.last_message_date > 14_days_ago THEN
  SEND_DM({
    "message": "Hey {{username}}! 👋

    Wir haben dich seit 2 Wochen nicht mehr gesehen.

    Alles ok? Brauchst du Hilfe?

    **Was läuft gerade**:
    - Neue Challenge: {{current_challenge}}
    - Top-Projekt diese Woche: {{top_project}}
    - Nächste Office Hours: {{next_office_hours}}

    Würden uns freuen dich wieder zu sehen! 💙"
  })
END
```

**Re-Engagement Campaign**:
```markdown
TARGET: Users die 30+ Tage inaktiv

EMAIL SEQUENCE (3 Emails, 7 Tage Abstand):

EMAIL 1: "Das hast du verpasst"
- Top 3 Community-Highlights letzter Monat
- Neue Features im Kurs
- Nächste Challenge-Ankündigung

EMAIL 2: "Brauchen wir deine Hilfe?"
- Feedback-Umfrage (1 Min)
- Was würde dich zurückbringen?
- Spezielle "Welcome Back" Challenge

EMAIL 3: "Letzte Chance"
- Special Offer (z.B. 1 Monat geschenkt bei Return)
- Persönliche Note vom Founder
- "Wenn du gehst ist ok - aber sag uns warum"
```

### Referral-Programm

**Struktur**:
```markdown
INCENTIVE:
- Pro erfolgreichem Referral: 1 Monat kostenlos
- Bei 5 Referrals: Lifetime-Upgrade (€499 Wert)
- Bei 10 Referrals: Custom 1:1 Coaching-Session

TRACKING:
- Unique Referral-Link pro User: masterkurs.de/ref/{{username}}
- Dashboard: Wie viele Klicks/Signups/Conversions?
- Leaderboard in #community (Top 10 Referrer)

PROMOTION:
- Monatlich Top-3 Referrer in Newsletter featuren
- Special "Ambassador" Role für 5+ Referrals
- Quarterly Raffle: Alle mit ≥1 Referral im Pot für MacBook/iPad
```

## Content-Kalender (30-Day Engagement-Plan)

```markdown
# 30-Day Community-Engagement-Blueprint

WOCHE 1: ONBOARDING & BASICS
- Mo: "New Members: Stellt euch vor!"
- Mi: Challenge #1: "Dein erstes Claude Code Script"
- Fr: Office Hours (Live Q&A)

WOCHE 2: LERNEN & KOLLABORATION
- Mo: "Show Your Project Monday"
- Mi: Challenge #2: "API-Integration"
- Do: "Code-Review-Day" (Pairing im Voice)
- Fr: Community-Call (Retrospektive Woche 1-2)

WOCHE 3: ADVANCED TOPICS
- Mo: "Ask Me Anything" mit Founder
- Mi: Challenge #3: "Build a Full App"
- Fr: "Expert-Spotlight" (Interview mit Top-Contributor)

WOCHE 4: GAMIFICATION & FUN
- Mo: Hackathon-Ankündigung (Wochenende)
- Mi: Challenge #4: "Creative Use-Case"
- Sa-So: 48h-Hackathon (Prizes, Live-Coding)
- Mo (Woche 5): Hackathon-Winners + Recap
```

## Advanced Analytics

### Sentiment-Analyse

**Tools**: Sentiment-Bot (Python + Discord.py + NLTK)

```python
# Pseudo-Code
def analyze_channel_sentiment(channel_id, last_n_days=7):
    messages = fetch_messages(channel_id, days=last_n_days)

    positive_count = 0
    negative_count = 0
    neutral_count = 0

    for msg in messages:
        sentiment = analyze_sentiment(msg.content)

        if sentiment > 0.3:
            positive_count += 1
        elif sentiment < -0.3:
            negative_count += 1
        else:
            neutral_count += 1

    sentiment_score = (positive_count - negative_count) / len(messages)

    return {
        "score": sentiment_score,  # -1 to +1
        "positive_pct": positive_count / len(messages),
        "negative_pct": negative_count / len(messages),
        "health": "GOOD" if sentiment_score > 0.2 else "WARNING" if sentiment_score > 0 else "CRITICAL"
    }

# Usage
sentiment = analyze_channel_sentiment("#general", last_n_days=7)

# Alert Mods wenn CRITICAL
if sentiment["health"] == "CRITICAL":
    notify_mods(f"⚠️ #general Sentiment CRITICAL: {sentiment['score']:.2f}")
```

**Monatlicher Sentiment-Report**:
```markdown
# Community Health Report - Februar 2026

## Sentiment-Scores (per Channel)
- #general: 0.45 ✅ GOOD (78% positive)
- #questions: 0.62 ✅ EXCELLENT (85% positive)
- #debugging: -0.12 ⚠️ WARNING (45% positive, 55% negative/frustrated)
  → ACTION: Mehr Mods in #debugging, schnellere Response-Time

## Top Positive Topics (Word-Cloud):
- "thanks", "helped", "solved", "amazing", "works"

## Top Negative Topics:
- "bug", "error", "doesn't work", "confused", "stuck"
  → ACTION: FAQ für häufigste Errors erstellen
```

### Churn-Prediction

**Indikatoren für Churn-Risk**:
```
HIGH RISK (70%+ Churn-Wahrscheinlichkeit):
- Keine Message seit 21+ Tagen
- Letztes Sentiment: Negative
- Keine Challenge-Teilnahme
- Kein Kurs-Login seit 14+ Tagen

MEDIUM RISK (30-70%):
- Keine Message seit 14-21 Tagen
- Nur #general, nie #questions (nicht engaged)
- Keine Reactions/Upvotes auf eigene Posts

LOW RISK (<30%):
- Message in letzten 7 Tagen
- Challenge-Teilnahme
- Hilft anderen in #questions
```

**Proactive-Intervention**:
```markdown
HIGH RISK USER gefunden
  ↓
1. Personalisierte DM senden (siehe Re-Engagement Campaign)
  ↓
2. Falls keine Response nach 7 Tagen:
  ↓
3. Email mit Special-Offer:
   "Hey {{name}}, wir vermissen dich!

   Hier ist 1 Monat kostenlos als 'Welcome Back'.

   Was würde dich zurückbringen?"
  ↓
4. Falls keine Response nach 14 Tagen:
  ↓
5. Akzeptieren → Entferne aus aktiver Targeting-List
```

## Integration mit anderen Marketing-Channels

### Email-Newsletter Integration

**Automatische Sync**:
```markdown
DISCORD → EMAIL:
- Jedes "Show Your Project" → Feature in wöchentlichem Newsletter
- Challenge-Winners → Highlight-Sektion
- Top-Contributors → "Member-Spotlight"

EMAIL → DISCORD:
- Neue Blog-Posts → Auto-Post in #resources
- Kurs-Updates → Auto-Post in #announcements
- Event-Ankündigungen → Auto-Post in #events + Create Voice-Channel
```

**Zapier-Automation**:
```json
{
  "trigger": "new_message_in_channel",
  "channel": "#showcase",
  "filter": "has_tag('featured')",
  "action": "add_to_convertkit_segment",
  "segment": "newsletter_showcase_queue"
}
```

### Social-Media Cross-Posting

**Best Community-Moments → Social**:
```markdown
PIPELINE:
1. Mod tagged Message mit 🌟 Reaction
2. Bot sammelt alle 🌟-Messages wöchentlich
3. Erstelle Thread:
   "Diese Woche in unserer Community: 🧵

   1/ {{user1}} hat {{project}} gebaut! 🚀

   2/ {{user2}} half {{user3}} bei {{problem}} 🤝

   3/ Challenge-Winner: {{winner}} mit {{solution}} 🏆"
4. Cross-Post auf Twitter/LinkedIn
5. Verlinke zurück zu Discord (Recruitment-Funnel)
```

## Role & Permission Management

### Discord Permission-Matrix

```
PERMISSION TEMPLATES:

OWNER:
- Administrator (alles)

MODERATOR:
- Kick/Ban Members
- Manage Messages (delete)
- Timeout Members
- Manage Channels (create/delete)
- View Audit Log
- Manage Roles (außer Owner/Mod)

HELPER:
- Manage Messages (delete)
- Timeout Members (max 10 min)

PAID STUDENT (verified):
- Access to #paid-only Channel
- Priority in Office Hours
- Download Resources

FREE MEMBER:
- Read #announcements, #rules
- Post in #general, #questions
- Read #showcase (Post erst ab 10 Messages)
```

### Role-Progression-System

**Gamification-Path**:
```
NEWBIE (0 Messages)
  ↓ Send 1st Message
CODER (1-9 Messages)
  ↓ Send 10th Message
ACTIVE CODER (10-49 Messages)
  ↓ Send 50th Message OR Help 10 Others
EXPERT (50+ Messages + Mod-Nomination)
  ↓ Top-10-Contributor für 3 Monate
LEGEND (Lifetime-Status)
  ↓ Special: Founder-Nomination
HALL OF FAME (Display-only, Top-5 ever)
```

**Auto-Role-Assignment** (via Bot):
```javascript
// MEE6 Leveling
on('message', async (msg) => {
  const user = await getUser(msg.author.id);
  user.message_count += 1;

  // Role-Upgrades
  if (user.message_count === 1) assignRole(user, "Coder");
  if (user.message_count === 10) assignRole(user, "Active Coder");
  if (user.message_count === 50) nominateForExpert(user);

  // Badges
  if (user.helped_count >= 10) assignBadge(user, "Helper 🤝");
  if (user.challenge_wins >= 1) assignBadge(user, "Challenge Winner 🏆");
});
```

## Event-Planning (AMAs, Workshops, Hackathons)

### Monthly Office Hours (Live Q&A)

**Format**:
```markdown
WANN: Jeden letzten Freitag im Monat, 18:00-19:30 CET
WO: Discord Voice Channel "#office-hours"
WER: Founder + 1 Guest-Expert (rotiert)

ABLAUF:
18:00-18:15: Intro, Was kommt in Q&A
18:15-19:00: Live Q&A (Questions aus #questions Channel)
19:00-19:30: Free-Form, Networking, Show-Your-Project

PROMOTION:
- 2 Wochen vorher: Announcement in #events
- 1 Woche vorher: Email an alle Paid Students
- 3 Tage vorher: "Reiche deine Frage ein" Form
- 1 Tag vorher: Reminder in #announcements

POST-EVENT:
- Recording auf YouTube hochladen
- Timestamps für jede Q&A
- Summary-Blog-Post
- Feedback-Umfrage
```

### Quarterly Hackathon

**48h-Format** (Samstag 10:00 → Montag 10:00):
```markdown
VORBEREITUNG (4 Wochen vorher):
- Theme festlegen (z.B. "Build with MCP Servers")
- Sponsors suchen (Prizes)
- Landing-Page erstellen
- Promotion starten (Email, Social, Community)

ANMELDUNG:
- Max 50 Teilnehmer (First-Come-First-Serve)
- Teams: Solo oder 2-3er Teams
- Anmeldung via Google Form

KICKOFF (Samstag 10:00):
- Voice-Channel: Challenge-Vorstellung
- Starter-Kit bereitstellen (Template-Repo)
- Breakout-Rooms pro Team

WÄHREND HACKATHON:
- 24/7 Mod-Präsenz
- Live-Coding-Sessions (freiwillig)
- Midnight-Pizza-Party (Voice-Hangout)
- Progress-Check-Ins (12h, 24h, 36h)

SUBMISSION (Montag 10:00):
- GitHub-Repo-Link
- 2-Min-Demo-Video
- README mit Setup-Instructions

JUDGING (Montag 10:00-14:00):
- 3-Judge-Panel (Founder + 2 Experts)
- Kriterien: Functionality (40%), Creativity (30%), Polish (30%)

WINNERS (Montag 16:00):
- Announcement in #events
- 1st Place: €500 + Feature in Newsletter + Custom Role
- 2nd Place: €250 + Feature in Blog
- 3rd Place: €100 + Shoutout on Social

POST-EVENT:
- Showcase-Gallery mit allen Projekten
- Blog-Post: "Hackathon Recap + Learnings"
- Feedback für nächstes Mal
```

## Quality-Checks & Success-Metrics

### Monthly Community-Audit

**Checklist**:
```markdown
✅ GROWTH:
- [ ] Member-Count: +/- X% vs letzten Monat
- [ ] Activation-Rate: ≥ 20%
- [ ] Retention-Rate: ≤ 10% Churn

✅ ENGAGEMENT:
- [ ] Daily Active Users (DAU): ≥ 10% von Total Members
- [ ] Messages/Day: ≥ 50
- [ ] Challenge-Participation: ≥ 15% von Active Members

✅ QUALITY:
- [ ] Sentiment-Score: ≥ 0.3 (Positive)
- [ ] Moderation-Actions: ≤ 5% von Messages
- [ ] Response-Time in #questions: ≤ 2h (Median)

✅ CONTENT:
- [ ] Weekly Challenge: Released on-time
- [ ] Office Hours: Durchgeführt
- [ ] Showcase: ≥ 3 neue Projects featured

✅ MODERATION:
- [ ] No Unresolved Reports ≥24h alt
- [ ] Mod-Team aktiv (jeder ≥5 Actions/Woche)
- [ ] Zero False-Positive Bans/Kicks
```

### Success-Metrics (Quarterly Review)

**KPIs**:
```markdown
TIER 1 - CRITICAL:
- Member Growth Rate: +30% QoQ
- Paid Conversion: 20% von Free Members
- Churn Rate: <10%/Quarter

TIER 2 - IMPORTANT:
- DAU/MAU Ratio: ≥30% (Stickiness)
- NPS (Net Promoter Score): ≥50
- Challenge-Completion-Rate: ≥40%

TIER 3 - NICE-TO-HAVE:
- Referral-Rate: 10% machen ≥1 Referral
- UGC (User-Generated-Content): ≥10 Projects/Monat in Showcase
- External Mentions: Community in 5+ Blog-Posts/Podcasts erwähnt
```

**Benchmark-Vergleich**:
```markdown
UNSERE COMMUNITY vs INDUSTRY-AVERAGE:

Activation-Rate:
- Wir: 25%
- Industry: 15%
- Status: ✅ ABOVE AVERAGE

Churn-Rate:
- Wir: 8%/Quarter
- Industry: 12%/Quarter
- Status: ✅ ABOVE AVERAGE

Challenge-Participation:
- Wir: 18%
- Industry: 10%
- Status: ✅ ABOVE AVERAGE
```

## Edge Cases & Problem-Solving

### Scenario: "Community ist tot" (Low Activity)

**Diagnose**:
```markdown
SYMPTOME:
- <10 Messages/Day
- Keine Challenge-Teilnahme
- Nur noch Mods posten

URSACHEN:
1. Content nicht relevant?
2. Zu viele Rules (zu steif)?
3. Kein Founder-Präsenz?
4. Konkurrenz-Community aufgemacht?
5. Plattform-Problem (Discord down)?

LÖSUNG:
1. **Quick-Win**: Founder postet daily für 7 Tage
2. **Engagement-Booster**: Neue Challenge mit 2x Prize
3. **Re-Onboarding**: Email an alle Inaktiven
4. **Format-Change**: Mehr Voice-Events, weniger Text
5. **Audit**: Feedback-Umfrage "Was würde dich mehr engagieren?"
```

### Scenario: "Mod-Team burnt-out"

**Diagnose**:
```markdown
SYMPTOME:
- Mods antworten langsam (>24h)
- Frustration in Mod-Chat
- Erhöhte Mod-Turnover

LÖSUNG:
1. **Immediate**: Neue Mod-Rekrutierung (2-3 zusätzlich)
2. **Automation**: Mehr Auto-Mod-Rules (weniger manual work)
3. **Rotation**: Mod-Schichten (nicht jeder muss 24/7)
4. **Incentives**: Paid Moderation (€50-100/Monat) oder Perks
5. **Support**: Weekly Mod-Meetings für Feedback/Debrief
```

### Scenario: "Spam-Bot-Attack" (Advanced)

**Attack-Vector**: Bots joinen, posten Phishing-Links
```markdown
DETECTION:
- 10+ neue Members in <1 Min
- Alle haben default-Avatar
- Alle posten gleichen Link

RESPONSE (IMMEDIATE):
1. **Ban-All** (bulk-action via Bot)
2. **Delete-All-Messages**
3. **Enable Lockdown-Mode** (Verification: Phone + Email)
4. **Post Warning**: "Wir hatten Bot-Attack, seid vorsichtig mit Links"

PREVENTION:
- Require Email-Verification für alle neuen Joins
- Enable "Slowmode" in #general (30sec between messages)
- Auto-Delete Messages mit URL von Users <1 Tag alt
```

---

**Version**: 2.0.0 (Phase-2 Multi-Track Parametrization)
**Last Updated**: 2026-05-14
**Maintenance**: Review quarterly für Best-Practice-Updates
**Tracks unterstützt**: `claude-code` (default), `claude-desktop`, `codex`, `local-llm`, `freelancer`
**Aktive Surface**: Forum (track-context Badge per Phase 1 W2c)
**Deferred Surfaces**: Discord, Slack (Locked Decision #6 — wird parametrisierbar zugeschaltet sobald Bedarf konkret)
**Track-Config-Pfad**: `masterkurs-agent/track-configs/<track>/community-rules.md`
**Output-Pfad**: `masterkurs-agent/community/<track>/`
