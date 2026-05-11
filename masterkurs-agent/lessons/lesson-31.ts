export const lesson31 = {
  id: 31,
  level: 3,
  title: '1M Context Window & Context Management Masterclass',
  description:
    'Das 1M Token Context Window verstehen und optimal nutzen – plus die fortgeschrittensten Context-Management-Strategien für maximale Produktivität.',
  duration: '50 Minuten',
  objectives: [
    'Das 1M Token Context Window und seine Auswirkungen auf große Projekte verstehen',
    'Context-Auslastung überwachen, /compact und /clear strategisch einsetzen',
    'Subagents als Context-Entlastung nutzen und Context-Splitting beherrschen',
    'Fortgeschrittene Patterns: PostCompact Hook, Session-Naming, CLAUDE.md-Optimierung',
  ],
  content: [
    // ============================
    // TEIL 1: 1M CONTEXT WINDOW
    // ============================
    {
      type: 'heading',
      content: '🎯 Teil 1: Das 1M Token Context Window',
    },
    {
      type: 'text',
      content: `Im März 2026 wurde das 1M Token Context Window für Claude Opus 4.6 und Sonnet 4.6 allgemein verfügbar (GA) – ohne Beta-Header, zum Standard-Preis, ohne dedizierte Rate Limits. Das ist eine fundamentale Änderung: Vorher war das Context Window auf 200K Tokens begrenzt, was bei größeren Projekten ständig zu Context-Komprimierung führte. Jetzt kann Claude Code ganze Codebases in einem einzigen Kontext halten.

Was bedeutet 1M Tokens in der Praxis? Grob geschätzt: 1 Million Tokens entspricht etwa 750.000 Wörtern oder rund 30.000-50.000 Zeilen Code (je nach Sprache und Kommentardichte). Das reicht aus, um ein mittelgroßes Projekt mit 100+ Dateien vollständig im Kontext zu halten – inklusive aller Abhängigkeiten, Tests und Konfigurationsdateien.`,
    },
    {
      type: 'highlight',
      title: '💡 Was das für dich konkret bedeutet',
      content: `Mit 200K Tokens musstest du ständig aufpassen, welche Dateien Claude "sieht", und regelmäßig /compact nutzen, um Platz zu schaffen. Mit 1M Tokens kannst du viel freier arbeiten: Große Refactorings über viele Dateien, komplette Architektur-Analysen, Multi-File-Debugging – alles in einer Session, ohne Context-Verlust. Aber Achtung: 1M Tokens bedeutet nicht, dass Context Management überflüssig wird. Es wird nur weniger dringend.`,
    },
    {
      type: 'heading',
      content: '📊 Context Window verstehen: Tokens, Größen, Grenzen',
    },
    {
      type: 'text',
      content: `Um das Context Window optimal zu nutzen, musst du verstehen, was Tokens verbraucht und wie viel Platz verschiedene Inhalte beanspruchen. Nicht alles, was im Kontext ist, ist gleich "teuer" – manche Inhalte verbrauchen überproportional viel Platz.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `TOKEN-VERBRAUCH: WAS KOSTET WIE VIEL?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEINE NACHRICHTEN:
  Kurzer Prompt (1 Satz):           ~20-50 Tokens
  Mittlerer Prompt (1 Absatz):      ~100-300 Tokens
  Langer Prompt (detaillierte Spec): ~500-2.000 Tokens

CLAUDE'S ANTWORTEN:
  Kurze Antwort (1-2 Sätze):        ~50-100 Tokens
  Code-Generierung (50 Zeilen):      ~200-500 Tokens
  Ausführliche Erklärung:            ~500-2.000 Tokens

DATEI-LESEN (Read Tool):
  Kleine Datei (50 Zeilen):          ~200-500 Tokens
  Mittlere Datei (200 Zeilen):       ~800-2.000 Tokens
  Große Datei (1000 Zeilen):         ~4.000-8.000 Tokens
  Riesige Datei (5000 Zeilen):       ~20.000-40.000 Tokens

TOOL-ERGEBNISSE:
  git diff (kleines Diff):           ~200-500 Tokens
  git diff (großes Refactoring):     ~5.000-20.000 Tokens
  grep-Ergebnis (20 Treffer):        ~500-1.500 Tokens
  Test-Output (100 Tests):           ~2.000-5.000 Tokens

SYSTEM-KONTEXT (immer geladen):
  System-Prompt:                     ~2.000-5.000 Tokens
  CLAUDE.md:                         ~500-3.000 Tokens
  Tool-Definitionen:                 ~5.000-10.000 Tokens
  MCP-Server-Beschreibungen:         ~1.000-5.000 Tokens pro Server

FAUSTREGEL:
  200K Window ≈ 5-10 große Dateien + Konversation
  1M Window  ≈ 30-50 große Dateien + Konversation`,
    },
    {
      type: 'text',
      content: `Die System-Kontext-Kosten sind besonders wichtig: CLAUDE.md, Tool-Definitionen und MCP-Server-Beschreibungen werden bei jeder Session geladen und verbrauchen dauerhaft Kontext. Eine aufgeblähte CLAUDE.md mit 500 Zeilen frisst dauerhaft 3.000+ Tokens – bei einem 200K Window sind das 1,5%, bei 1M Window nur 0,3%. Trotzdem: Jeder Token zählt, besonders in langen Sessions.`,
    },
    {
      type: 'heading',
      content: '🔍 Context-Auslastung überwachen',
    },
    {
      type: 'text',
      content: `Du kannst die aktuelle Context-Auslastung jederzeit überprüfen. Claude Code zeigt die Auslastung in der Statuszeile an – aber nur, wenn du weißt, wo du hinschauen musst. Hier die wichtigsten Tools und Methoden zur Überwachung.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# Context-Auslastung prüfen
/context

# Was /context dir zeigt:
# - Aktuelle Token-Nutzung (z.B. 145.000 / 1.000.000)
# - Prozentuale Auslastung (z.B. 14.5%)
# - Geladene CLAUDE.md Dateien und deren Größe
# - Aktive MCP-Server und deren Tool-Definitionen
# - Anzahl der Nachrichten in der Konversation

# Statuszeile konfigurieren (zeigt Auslastung permanent)
# In den Settings:
# Status Line → Context Usage aktivieren

# Context-Auslastung als Prozentzahl in der Statuszeile:
#   ○ 0-30%    → Grün (viel Platz)
#   ◐ 30-70%   → Gelb (aufpassen)
#   ● 70-90%   → Orange (bald komprimieren)
#   ● 90%+     → Rot (Performance leidet!)`,
    },
    {
      type: 'text',
      content: `Die Statuszeile ist dein wichtigstes Werkzeug: Wenn du sie konfiguriert hast, siehst du jederzeit, wie voll dein Context Window ist. Das ist wie eine Tankuhr – du willst nicht auf Reserve fahren.`,
    },
    {
      type: 'heading',
      content: '🧹 /compact und /clear strategisch einsetzen',
    },
    {
      type: 'text',
      content: `Auch mit 1M Tokens werden Sessions lang genug, um den Kontext zu füllen. Die zwei wichtigsten Werkzeuge sind \`/compact\` (komprimiert den Kontext ohne die Session zu beenden) und \`/clear\` (startet den Kontext komplett neu). Der Unterschied ist entscheidend: /compact behält eine Zusammenfassung, /clear löscht alles.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# /compact – Kontext komprimieren
/compact

# Was passiert bei /compact:
# 1. Claude analysiert die gesamte bisherige Konversation
# 2. Erstellt eine komprimierte Zusammenfassung
# 3. Ersetzt die alte Konversation durch die Zusammenfassung
# 4. Behält: Wichtige Entscheidungen, Code-Änderungen, Kontext
# 5. Verliert: Wortlaut, Details, Zwischen-Ergebnisse

# /clear – Kontext komplett neu starten
/clear

# Was passiert bei /clear:
# 1. Gesamte Konversation wird gelöscht
# 2. Nur System-Prompt, CLAUDE.md und MCP bleiben
# 3. Wie eine komplett neue Session
# 4. Behält: Nichts aus der Konversation
# 5. Verliert: Alles – totaler Neustart

# /compact mit Custom-Prompt (für gezielte Komprimierung)
/compact "Behalte besonders die Architektur-Entscheidungen
          und die Stripe-Integration-Details"`,
    },
    {
      type: 'text',
      content: `Der Custom-Prompt bei /compact ist ein mächtiges Feature, das viele übersehen: Du kannst Claude sagen, welche Informationen bei der Komprimierung priorisiert werden sollen. Wenn du weißt, dass du gleich an der Stripe-Integration weiterarbeitest, sagst du /compact "Behalte die Stripe-Details" – und Claude komprimiert alles andere stärker.`,
    },
    {
      type: 'heading',
      content: '📈 Wann /compact, wann /clear?',
    },
    {
      type: 'text',
      content: `Die Entscheidung zwischen /compact und /clear ist eine der wichtigsten im täglichen Workflow. Hier ein detaillierter Entscheidungsbaum mit konkreten Szenarien.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `ENTSCHEIDUNGSBAUM: /compact vs. /clear
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Arbeitest du noch am GLEICHEN Thema?
  → JA: /compact (Zusammenfassung behält Kontext)
  → NEIN: /clear (sauberer Neustart)

Hast du Claude 2x zum gleichen Fehler korrigiert?
  → JA: /clear (Claude ist "festgefahren" – Neustart hilft)
  → NEIN: /compact reicht

Ist die Context-Auslastung über 70%?
  → JA: /compact (proaktiv Platz schaffen)
  → NEIN: Weiterarbeiten, noch kein Handlungsbedarf

Hast du eine komplett neue Aufgabe?
  → JA: /clear (frischer Kontext = bessere Ergebnisse)
  → NEIN: /compact

Brauchst du Details aus der bisherigen Konversation?
  → JA: /compact (Zusammenfassung behält das Wichtigste)
  → NEIN: /clear (schneller, sauberer)

SZENARIEN:

Szenario 1: Du baust ein Feature, Context bei 60%
  → Weiterarbeiten, kein /compact nötig

Szenario 2: Feature fertig, neues Feature beginnen
  → /clear (sauberer Kontext für neues Thema)

Szenario 3: Mitten im Debugging, Context bei 80%
  → /compact "Behalte den Bug-Kontext und bisherige Versuche"

Szenario 4: Claude macht immer wieder den gleichen Fehler
  → /clear und Problem von Grund auf neu beschreiben

Szenario 5: Große Codebase-Analyse, 50 Dateien gelesen
  → /compact (Zusammenfassung der Analyse behalten)`,
    },
    {
      type: 'text',
      content: `Die Community-Konsens-Regel ist einfach: **Nach jeder abgeschlossenen Aufgabe /clear.** Das ist die sicherste Strategie – du startest jede neue Aufgabe mit frischem Kontext, ohne Ballast aus der vorherigen. /compact ist das Tool für "Ich bin mitten in etwas Komplexem und brauche mehr Platz, aber will den Kontext nicht verlieren."`,
    },
    // ============================
    // TEIL 2: CONTEXT MANAGEMENT
    // ============================
    {
      type: 'heading',
      content: '🎯 Teil 2: Context Management Masterclass',
    },
    {
      type: 'text',
      content: `Context Management ist der #1 Performance-Faktor bei Claude Code – das ist der Community-Konsens. Egal ob du 200K oder 1M Tokens hast: Wer seinen Kontext gut managt, bekommt bessere Ergebnisse. Wer ihn vernachlässigt, bekommt schlechtere Ergebnisse, mehr Fehler, und muss öfter korrigieren. In diesem Teil lernst du die fortgeschrittensten Strategien.`,
    },
    {
      type: 'highlight',
      title: '⚠️ Warum das so wichtig ist',
      content: `Studien und Community-Erfahrungen zeigen: Ab 90% Context-Auslastung degradiert Claudes Performance messbar. Wichtige Instruktionen aus der CLAUDE.md werden "vergessen", Claude macht Fehler die es vorher nicht gemacht hätte, und die Antwortqualität sinkt. Das passiert auch mit 1M Tokens – es dauert nur länger bis du dort ankommst.`,
    },
    {
      type: 'heading',
      content: '🧩 Strategie 1: Subagents als Context-Entlastung',
    },
    {
      type: 'text',
      content: `Subagents sind das mächtigste Werkzeug für Context Management – und die meisten Leute nutzen sie falsch. Subagents haben ihr eigenes Context Window. Das bedeutet: Wenn du einen Subagent beauftragst, "Analysiere die Datenbankstruktur", dann belastet diese Analyse DEINEN Kontext nicht. Der Subagent liest 20 Dateien in seinem eigenen Window, fasst die Ergebnisse zusammen, und nur die Zusammenfassung landet in deinem Kontext.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `SUBAGENT ALS CONTEXT-ENTLASTUNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ OHNE Subagent:
  Du: "Lies src/models/ und erkläre die DB-Struktur"
  → Claude liest 15 Dateien (je 200 Zeilen)
  → 15 × ~1.500 Tokens = ~22.500 Tokens in DEINEM Kontext
  → Plus Claudes Analyse: ~3.000 Tokens
  → Gesamt: ~25.500 Tokens verbraucht

✅ MIT Subagent:
  Du: "Starte einen Subagent der src/models/ analysiert"
  → Subagent liest 15 Dateien in SEINEM Kontext
  → Subagent erstellt Zusammenfassung (~500 Tokens)
  → Nur die Zusammenfassung landet in DEINEM Kontext
  → Gesamt: ~600 Tokens verbraucht (Prompt + Ergebnis)

  ERSPARNIS: ~24.900 Tokens (97.6%!)

WANN SUBAGENT NUTZEN:
  ✅ Dateien durchsuchen / Code-Analyse
  ✅ Recherche-Aufgaben (100+ Dateien scannen)
  ✅ Test-Ausführung und Ergebnis-Analyse
  ✅ Dependency-Audit
  ✅ Architektur-Review einzelner Module

WANN KEIN SUBAGENT:
  ❌ Einzelne Datei lesen (Overhead zu hoch)
  ❌ Schnelle Fragen (Subagent-Start dauert)
  ❌ Wenn du den Analyse-Prozess selbst sehen willst`,
    },
    {
      type: 'text',
      content: `Der Schlüssel ist die richtige Granularität: Für eine einzelne Datei ist ein Subagent Overkill. Für die Analyse eines ganzen Verzeichnisses oder eine Codebase-weite Suche ist er perfekt. Faustregel: Wenn die Aufgabe mehr als 3 Dateien lesen muss, lohnt sich ein Subagent.`,
    },
    {
      type: 'heading',
      content: '🧩 Strategie 2: CLAUDE.md-Optimierung für Context-Effizienz',
    },
    {
      type: 'text',
      content: `Deine CLAUDE.md wird bei jeder Session geladen und bleibt dauerhaft im Kontext. Eine aufgeblähte CLAUDE.md ist wie ein Memory-Leak – sie frisst permanent Platz. Die Community-Best-Practice: 50-100 Zeilen in der Root-CLAUDE.md, Details in @imports auslagern. Aber es gibt noch mehr Optimierungspotenzial.`,
    },
    {
      type: 'code',
      language: 'markdown',
      content: `# ❌ FALSCH: Aufgeblähte CLAUDE.md (250 Zeilen, ~2.500 Tokens)

# Projekt-Beschreibung
Dies ist ein E-Commerce-Projekt das wir im Januar 2026 gestartet haben.
Das Team besteht aus 3 Entwicklern und 1 Designer.
Wir nutzen Scrum mit 2-Wochen-Sprints...
[...50 Zeilen Projektbeschreibung die Claude nicht braucht...]

# API-Endpunkte (vollständige Liste)
GET /api/users
GET /api/users/:id
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
GET /api/products
[...80 Zeilen API-Endpunkte die Claude aus dem Code lesen kann...]

# Changelog
2026-01-15: Projekt gestartet
2026-01-22: Auth implementiert
[...40 Zeilen Changelog die in Git stehen...]`,
    },
    {
      type: 'code',
      language: 'markdown',
      content: `# ✅ RICHTIG: Optimierte CLAUDE.md (60 Zeilen, ~600 Tokens)

# E-Commerce App

## Tech Stack
React 18, TypeScript, Tailwind, Prisma, PostgreSQL, Stripe

## Regeln
- TypeScript strict: true – keine any-Types
- Alle DB-Zugriffe über Prisma (kein Raw SQL)
- API-Responses immer als { data, error, meta } Objekt
- Tests für alle API-Routes pflicht (Vitest)
- Preise in Cents (Integer), Anzeige in EUR (formatCurrency())

## Befehle
\`\`\`bash
npm run dev        # Dev-Server (Port 3000)
npm run test       # Tests
npm run typecheck  # TypeScript Prüfung
\`\`\`

## Struktur
@src/CLAUDE.md     # Frontend-Konventionen
@api/CLAUDE.md     # API-Konventionen
@prisma/CLAUDE.md  # Datenbank-Schema-Hinweise`,
    },
    {
      type: 'text',
      content: `Die Faustregel für jede Zeile in der CLAUDE.md: "Würde Claude ohne diese Zeile einen Fehler machen?" Wenn die Antwort "Nein" ist, streiche die Zeile. Projektbeschreibungen, Team-Infos, Changelogs – das alles braucht Claude nicht. Was Claude braucht: Regeln, Konventionen, Befehle, und Pointer auf Detail-Dateien.

Die @imports (Progressive Disclosure) sind besonders clever: Detail-Dateien in Unterverzeichnissen werden nur geladen, wenn Claude in diesen Verzeichnissen arbeitet. So bleibt die Root-CLAUDE.md schlank, aber Claude hat trotzdem Zugriff auf Detail-Konventionen, wenn es sie braucht.`,
    },
    {
      type: 'heading',
      content: '🧩 Strategie 3: Session-Splitting für große Aufgaben',
    },
    {
      type: 'text',
      content: `Auch mit 1M Tokens gibt es Aufgaben, die man besser über mehrere Sessions verteilt. Der Grund: Nicht nur die Token-Menge zählt, sondern auch die "Signal-to-Noise Ratio" im Kontext. Eine Session mit 500K Tokens, in der 80% irrelevante Zwischen-Ergebnisse sind, performt schlechter als eine frische Session mit 50K Tokens gezieltem Kontext.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# Session-Splitting für ein großes Refactoring
# ================================================

# SESSION 1: Analyse und Planung
claude -n "Auth Migration - Analyse"
# Prompt: "Analysiere unsere aktuelle Auth-Implementierung.
#          Welche Dateien sind betroffen? Welche Abhängigkeiten?
#          Erstelle einen Plan für die Migration zu OAuth2."
# → Ergebnis: Detaillierter Migrations-Plan
# → Plan in PLAN.md speichern lassen
# → /clear

# SESSION 2: Kern-Migration
claude -n "Auth Migration - Core"
# Prompt: "Lies PLAN.md. Implementiere Schritt 1-3 des Plans:
#          OAuth2-Provider Setup, Token-Service, Middleware."
# → Ergebnis: Kern-Code migriert
# → /clear

# SESSION 3: Abhängige Dateien
claude -n "Auth Migration - Dependencies"
# Prompt: "Lies PLAN.md. Die Kern-Migration ist fertig.
#          Implementiere Schritt 4-6: Routes, Guards, Tests."
# → Ergebnis: Abhängige Dateien angepasst
# → /clear

# SESSION 4: Verifizierung
claude -n "Auth Migration - Verify"
# Prompt: "Die Auth-Migration ist fertig. Prüfe:
#          1. Alle Tests grün? 2. TypeScript-Errors?
#          3. Vergessene alte Auth-Referenzen?"`,
    },
    {
      type: 'text',
      content: `Beachte die Session-Namen (\`claude -n "..."\`): Das neue Session-Naming-Feature hilft dir, den Überblick über parallele Workstreams zu behalten. In der Session-Liste (\`/sessions\`) siehst du dann nicht "Session vom 16.03." sondern "Auth Migration - Core". Das ist besonders nützlich wenn du mehrere Sessions parallel hast.

Der Schlüssel zum erfolgreichen Session-Splitting: Persistiere den Plan in einer Datei (PLAN.md), die jede Session lesen kann. So muss nicht jede Session die gesamte Analyse wiederholen.`,
    },
    {
      type: 'heading',
      content: '🧩 Strategie 4: Context-Hygiene im Alltag',
    },
    {
      type: 'text',
      content: `Context-Hygiene sind die kleinen Gewohnheiten, die in Summe einen riesigen Unterschied machen. Wie bei der Code-Hygiene (keine toten Imports, keine auskommentierten Blöcke) gibt es auch bei Context-Hygiene klare Do's und Don'ts.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `CONTEXT-HYGIENE CHEAT SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━

VOR JEDER NEUEN AUFGABE:
  ✅ /clear (frischer Kontext)
  ✅ Oder /compact mit gezieltem Prompt

WÄHREND DER ARBEIT:
  ✅ /context regelmäßig prüfen (wie auf die Tankuhr schauen)
  ✅ Subagents für Recherche-Aufgaben nutzen
  ✅ Nicht "mal eben" 20 Dateien lesen lassen
  ✅ Tests gezielt laufen lassen (nicht die gesamte Suite)
  ✅ Git Diff fokussiert: git diff -- src/auth/ statt git diff

PROMPTS SCHREIBEN:
  ✅ Präzise Prompts (weniger Rückfragen = weniger Kontext)
  ✅ Relevante Dateien nennen statt "such mal"
  ✅ Kontext in CLAUDE.md statt in jedem Prompt wiederholen

VERMEIDEN:
  ❌ "Lies alle Dateien in src/" (riesiger Kontext-Verbrauch)
  ❌ "Zeig mir die gesamte Git-History" (hunderte Commits)
  ❌ Unnötige Erklärungen anfordern (Claude redet gerne viel)
  ❌ Tests mit vollem Verbose-Output laufen lassen
  ❌ Große Dateien komplett lesen statt gezielt nach Zeilen

PROFI-TIPPS:
  💡 "Fasse dich kurz" als Anweisung spart Output-Tokens
  💡 grep/Glob vor Read: Erst suchen, dann gezielt lesen
  💡 Effort Level "low" für einfache Tasks (weniger Tokens)
  💡 /compact bei ~70% statt bei 90% (proaktiv!)`,
    },
    {
      type: 'heading',
      content: '🧩 Strategie 5: PostCompact Hook',
    },
    {
      type: 'text',
      content: `Seit März 2026 gibt es den PostCompact-Hook – ein Event das feuert, nachdem Claude den Kontext komprimiert hat. Das ist ein mächtiges Tool für Automatisierung: Du kannst automatisch loggen, wann und wie oft komprimiert wird, Notifications senden, oder sogar automatische Aktionen nach der Komprimierung auslösen.`,
    },
    {
      type: 'code',
      language: 'jsonc',
      content: `// .claude/settings.json – PostCompact Hook konfigurieren
{
  "hooks": {
    "PostCompact": [
      {
        // Logging: Wann wurde komprimiert?
        // Hilft dir zu verstehen, wie schnell dein Kontext voll wird
        "type": "command",
        "command": "echo \"$(date '+%Y-%m-%d %H:%M') | Context komprimiert\" >> ~/.claude/compact.log"
      },
      {
        // Desktop-Notification (macOS)
        // Damit du weißt, dass Kontext verloren gegangen sein könnte
        "type": "command",
        "command": "osascript -e 'display notification \"Context wurde komprimiert – prüfe ob wichtige Infos fehlen\" with title \"Claude Code\"'"
      }
    ]
  }
}`,
    },
    {
      type: 'text',
      content: `Der PostCompact-Hook ist besonders nützlich für Langzeit-Sessions: Wenn du stundenlang an einem Feature arbeitest, merkst du möglicherweise nicht, dass Claude den Kontext automatisch komprimiert hat. Die Desktop-Notification erinnert dich daran, dass möglicherweise Details verloren gegangen sind – und du wichtige Instruktionen wiederholen solltest.

Du kannst auch das Compact-Log auswerten, um Muster zu erkennen: Wenn du jede 30 Minuten komprimieren musst, liest du wahrscheinlich zu viele Dateien direkt statt Subagents zu nutzen.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# Compact-Log auswerten
cat ~/.claude/compact.log

# Beispiel-Output:
# 2026-03-16 09:15 | Context komprimiert
# 2026-03-16 09:48 | Context komprimiert
# 2026-03-16 10:22 | Context komprimiert
# → Alle 30 Minuten komprimiert = zu viel Kontext-Verbrauch!

# Compact-Log nach Häufigkeit analysieren
awk '{print $1}' ~/.claude/compact.log | uniq -c | sort -rn
# Zeigt dir, an welchen Tagen du am meisten komprimiert hast`,
    },
    {
      type: 'heading',
      content: '🧩 Strategie 6: Große Projekte mit 1M Context',
    },
    {
      type: 'text',
      content: `Mit dem 1M Context Window ändert sich fundamental, wie du mit großen Projekten arbeitest. Vorher musstest du Claude Code "führen" – genau sagen, welche Dateien es lesen soll. Jetzt kann Claude Code eigenständig viel mehr Kontext aufnehmen und Zusammenhänge erkennen, die über viele Dateien verteilt sind.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `WORKFLOW: GROSSES REFACTORING MIT 1M CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRÜHER (200K Context):
  1. "Lies src/auth/login.ts" → 1.500 Tokens
  2. "Lies src/auth/middleware.ts" → 1.200 Tokens
  3. "Lies src/auth/tokens.ts" → 800 Tokens
  4. /compact (Context wird knapp)
  5. "Lies src/routes/protected.ts" → 1.000 Tokens
  6. Refactoring-Plan erstellen
  7. /compact (Context wieder knapp)
  8. Implementierung starten
  9. /compact (mitten in der Implementierung!)
  10. Wichtige Details aus Step 1-3 vergessen 😞

JETZT (1M Context):
  1. "Analysiere die gesamte Auth-Architektur.
      Lies alle relevanten Dateien in src/auth/,
      src/routes/, src/middleware/ und src/types/.
      Erstelle einen detaillierten Refactoring-Plan."
  → Claude liest 25 Dateien (~30.000 Tokens)
  → Erstellt Plan mit vollem Überblick
  → Implementiert das Refactoring
  → Alles in einer Session, kein Kontext-Verlust 🎉

  Gesamt-Verbrauch: ~100.000 Tokens (10% des Windows)
  → Noch 900.000 Tokens für weitere Arbeit`,
    },
    {
      type: 'text',
      content: `Das bedeutet nicht, dass du Claude wahllos alles lesen lassen sollst. Es bedeutet, dass du bei komplexen, zusammenhängenden Aufgaben nicht mehr künstlich aufteilen musst. Claude kann jetzt den "Big Picture"-Blick haben, den es für gute Architektur-Entscheidungen braucht.`,
    },
    {
      type: 'heading',
      content: '❌ Common Mistakes beim Context Management',
    },
    {
      type: 'text',
      content: `Diese Fehler sind die häufigsten Ursachen für schlechte Claude Code Ergebnisse. Die gute Nachricht: Jeder dieser Fehler ist einfach zu vermeiden, wenn du ihn einmal kennst.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `❌ FALSCH: Alles in eine Session packen
"Implementiere Feature A, dann Feature B, dann fixe Bug C"
→ Context wird voll, spätere Tasks leiden unter Qualitätsverlust

✅ RICHTIG: Eine Aufgabe pro Session
Session 1: Feature A → /clear
Session 2: Feature B → /clear
Session 3: Bug C

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ FALSCH: /compact ignorieren bis 95%
Claude macht plötzlich Fehler, du korrigierst,
Claude macht denselben Fehler nochmal...

✅ RICHTIG: Bei 70% proaktiv /compact nutzen
Performance bleibt stabil, keine plötzlichen Qualitätseinbrüche

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ FALSCH: "Lies die Datei" für jede Kleinigkeit
Du fragst "Was ist der Rückgabetyp von getUser?"
Claude liest die gesamte Datei (1.500 Tokens) für 1 Zeile

✅ RICHTIG: Gezielt fragen oder grep nutzen
"Zeige mir nur die Signatur von getUser in src/services/"
→ grep findet die Zeile, minimal Kontext-Verbrauch

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ FALSCH: CLAUDE.md als Wiki missbrauchen
300 Zeilen mit Projektgeschichte, Team-Infos, Changelogs
→ Permanent 3.000+ Tokens belegt die Claude nie braucht

✅ RICHTIG: CLAUDE.md als Regelwerk
50-100 Zeilen: Tech Stack, Konventionen, Befehle, @imports
→ ~600 Tokens, alles davon nützlich

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ FALSCH: Tests mit --verbose in Claude laufen lassen
npm test -- --verbose
→ 500 Zeilen Test-Output = ~5.000 Tokens für "42 passed"

✅ RICHTIG: Tests ohne Verbose, nur bei Fehlern Details
npm test
→ "42 passed, 0 failed" = ~20 Tokens`,
    },
    {
      type: 'heading',
      content: '📊 Context-Budget für verschiedene Aufgabentypen',
    },
    {
      type: 'text',
      content: `Hier eine Orientierungshilfe, wie viel Context verschiedene Aufgabentypen typischerweise verbrauchen. Diese Zahlen helfen dir einzuschätzen, ob du mit dem 1M Window bequem hinkommst oder doch Session-Splitting brauchst.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `CONTEXT-BUDGET PRO AUFGABENTYP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EINFACHE AUFGABE (~20.000-50.000 Tokens)
  "Füge Input-Validierung zur Login-Route hinzu"
  → 2-3 Dateien lesen + Änderungen
  → Passt problemlos in 200K und 1M

MITTLERE AUFGABE (~50.000-150.000 Tokens)
  "Implementiere ein Caching-Layer für die API"
  → 5-10 Dateien lesen + analysieren + implementieren
  → Passt in 200K (eng), bequem in 1M

GROSSE AUFGABE (~150.000-400.000 Tokens)
  "Migriere von REST zu GraphQL"
  → 20-40 Dateien + umfangreiche Implementierung
  → Schwierig in 200K (mehrere /compact), ok in 1M

SEHR GROSSE AUFGABE (~400.000-800.000 Tokens)
  "Komplettes Architektur-Refactoring des Monolithen"
  → 50+ Dateien + tiefe Analyse + Plan + Implementierung
  → Unmöglich in 200K, machbar in 1M mit Session-Splitting

EMPFEHLUNG:
  ≤150K Tokens: Eine Session, kein /compact nötig
  150K-500K:    Eine Session mit 1-2× /compact
  500K-800K:    Session-Splitting empfohlen
  >800K:        Zwingend Session-Splitting + Subagents`,
    },
    {
      type: 'heading',
      content: '🏋️ Praxis-Übungen',
    },
    {
      type: 'text',
      content: `Diese Übungen helfen dir, Context Management zur Gewohnheit zu machen. Mache sie in der angegebenen Reihenfolge – jede baut auf der vorherigen auf.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `ÜBUNG 1: Context-Monitoring (5 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Starte Claude Code in einem Projekt
2. Nutze /context – notiere die Baseline-Auslastung
3. Lies 5 Dateien deines Projekts
4. Nutze /context erneut – wie viel hat sich geändert?
5. Nutze /compact – wie viel wurde eingespart?
→ Ziel: Gefühl für Token-Verbrauch entwickeln

ÜBUNG 2: Subagent vs. Direkt (10 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Aufgabe: "Finde alle TODO-Kommentare im Projekt"
2. Erst direkt: "Durchsuche alle Dateien nach TODO"
   → Notiere Context-Verbrauch mit /context
3. /clear
4. Per Subagent: "Starte einen Subagent der alle
   TODOs findet und zusammenfasst"
   → Notiere Context-Verbrauch mit /context
5. Vergleiche die beiden Werte
→ Ziel: Subagent-Vorteil quantifizieren

ÜBUNG 3: CLAUDE.md Audit (10 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Öffne deine CLAUDE.md (oder erstelle eine mit /init)
2. Gehe jede Zeile durch und frage:
   "Würde Claude ohne diese Zeile einen Fehler machen?"
3. Lösche alles was "Nein" ist
4. Lagere Details in @imports aus
5. Ziel: ≤100 Zeilen Root-CLAUDE.md
→ Ziel: Dauerhaften Context-Overhead reduzieren

ÜBUNG 4: PostCompact Hook (5 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Füge den PostCompact-Hook aus dieser Lektion hinzu
2. Arbeite eine Stunde normal mit Claude Code
3. Prüfe ~/.claude/compact.log
4. Wie oft wurde komprimiert?
→ Ziel: Transparenz über Komprimierungs-Häufigkeit

ÜBUNG 5: Session-Splitting (15 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Wähle eine größere Aufgabe in deinem Projekt
2. Teile sie in 3 Sessions auf:
   Session 1: Analyse + Plan in PLAN.md
   Session 2: Implementierung (liest PLAN.md)
   Session 3: Review + Tests
3. Nutze Session-Names: claude -n "..."
4. Vergleiche: Ist die Qualität besser als alles
   in einer Session?
→ Ziel: Session-Splitting als Workflow etablieren`,
    },
    {
      type: 'highlight',
      title: '🎓 Zusammenfassung',
      content: `✅ 1M Context Window: GA für Opus 4.6 und Sonnet 4.6, zum Standard-Preis
✅ ~750.000 Wörter oder 30.000-50.000 Zeilen Code in einem Kontext
✅ Context Management bleibt wichtig – ab 90% Auslastung degradiert Performance
✅ /context regelmäßig prüfen – wie eine Tankuhr
✅ /compact bei ~70% proaktiv nutzen, /clear nach jeder abgeschlossenen Aufgabe
✅ Subagents sparen bis zu 97% Context gegenüber direktem Dateien-Lesen
✅ CLAUDE.md: ≤100 Zeilen, nur Regeln und Konventionen, Details in @imports
✅ PostCompact Hook für Monitoring und Notifications
✅ Session-Splitting für sehr große Aufgaben (>500K Tokens)
✅ Session-Naming mit claude -n "..." für Übersicht`,
    },
  ],
};
