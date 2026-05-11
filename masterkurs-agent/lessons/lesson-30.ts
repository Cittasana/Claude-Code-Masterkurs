export const lesson30 = {
  id: 30,
  level: 2,
  title: 'Voice Mode & Code Review Tool',
  description:
    'Sprachsteuerung mit Voice Mode und automatische Code-Qualitätssicherung mit dem neuen Code Review Tool – zwei Game-Changer für deinen Workflow.',
  duration: '40 Minuten',
  objectives: [
    'Voice Mode aktivieren, konfigurieren und effektiv im Entwicklungsalltag einsetzen',
    'Push-to-Talk, Keybindings und Sprachoptionen anpassen',
    'Das Code Review Tool für systematische Qualitätssicherung nutzen',
    'Best Practices für die Kombination von Voice Mode und Code Review kennen',
  ],
  content: [
    // ============================
    // TEIL 1: VOICE MODE
    // ============================
    {
      type: 'heading',
      content: '🎯 Teil 1: Voice Mode – Sprachsteuerung für Claude Code',
    },
    {
      type: 'text',
      content: `Voice Mode ist eine der spannendsten Neuerungen in Claude Code: Du kannst jetzt per Sprache mit Claude Code interagieren. Statt lange Prompts zu tippen, hältst du eine Taste gedrückt, sprichst deine Anweisung, und Claude Code setzt sie um. Das ist besonders nützlich beim Pair-Programming, wenn du beide Hände am Keyboard hast, oder wenn du komplexe Anweisungen schneller aussprechen als tippen kannst.

Voice Mode ist kein "Always-On Listening" – es funktioniert über Push-to-Talk. Du bestimmst, wann Claude zuhört. Das ist bewusst so gestaltet: Keine versehentlichen Aufnahmen, kein Datenschutz-Risiko durch permanentes Mikrofon. Du drückst die Taste, sprichst, lässt los – fertig.`,
    },
    {
      type: 'highlight',
      title: '💡 Warum Voice Mode ein Game-Changer ist',
      content: `Studien zeigen, dass Sprechen etwa 3x schneller ist als Tippen. Bei komplexen Anweisungen wie "Refactore die getUserById-Funktion so, dass sie einen Cache-Layer nutzt und bei Cache-Miss die Datenbank abfragt" sparst du erheblich Zeit. Außerdem kannst du natürlicher kommunizieren – du sagst einfach, was du willst, statt es in eine optimale Prompt-Struktur zu gießen.`,
    },
    {
      type: 'heading',
      content: '🚀 Voice Mode aktivieren und starten',
    },
    {
      type: 'text',
      content: `Voice Mode wird über den Slash-Befehl \`/voice\` aktiviert. Sobald du ihn aufrufst, wechselt Claude Code in den Sprachmodus. Du erkennst den aktiven Voice Mode an einem Mikrofon-Symbol in der Statuszeile. Der Standard-Hotkey für Push-to-Talk ist die Leertaste – halte sie gedrückt, sprich, und lasse sie los, um deine Anweisung abzusenden.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# Voice Mode aktivieren
/voice

# So funktioniert Push-to-Talk:
# 1. Leertaste HALTEN → Mikrofon aktiv (du siehst einen Indikator)
# 2. Deine Anweisung sprechen
# 3. Leertaste LOSLASSEN → Anweisung wird verarbeitet

# Voice Mode beenden
# Einfach /voice erneut eingeben oder Escape drücken

# Tipp: Wenn du gerade Text im Eingabefeld hast,
# wird die Leertaste normal tippen (kein Push-to-Talk).
# Push-to-Talk aktiviert sich nur bei leerem Eingabefeld.`,
    },
    {
      type: 'text',
      content: `Beachte: Voice Mode funktioniert nur, wenn dein System ein Mikrofon hat und Claude Code darauf zugreifen kann. Unter macOS wirst du beim ersten Start um Mikrofon-Berechtigung gebeten. Wenn du die Berechtigung versehentlich abgelehnt hast, kannst du sie in den Systemeinstellungen unter "Datenschutz & Sicherheit → Mikrofon" nachträglich erteilen.`,
    },
    {
      type: 'heading',
      content: '⌨️ Push-to-Talk Keybinding anpassen',
    },
    {
      type: 'text',
      content: `Die Standard-Leertaste als Push-to-Talk-Taste kann in manchen Workflows unpraktisch sein – besonders wenn du gerade Code eingibst. Du kannst den Hotkey in der Datei \`~/.claude/keybindings.json\` anpassen. Wähle eine Taste, die du nicht zum Tippen brauchst – \`meta+k\` (Cmd+K auf Mac) oder \`ctrl+space\` sind gute Alternativen.`,
    },
    {
      type: 'code',
      language: 'jsonc',
      content: `// ~/.claude/keybindings.json
// Push-to-Talk Taste anpassen
{
  // Option 1: Cmd+K (macOS) / Ctrl+K (Linux)
  "voice:pushToTalk": "meta+k",

  // Option 2: Ctrl+Leertaste
  // "voice:pushToTalk": "ctrl+space",

  // Option 3: Fn-Taste (wenn vom System unterstützt)
  // "voice:pushToTalk": "fn"
}

// Nach dem Speichern: Claude Code neu starten
// oder /voice erneut aufrufen, um die neue Taste zu nutzen.`,
    },
    {
      type: 'text',
      content: `Die Keybinding-Datei wird automatisch geladen – du musst Claude Code nicht komplett neu starten, aber den Voice Mode kurz deaktivieren und wieder aktivieren, damit die neue Taste greift. Teste die neue Taste direkt nach der Änderung, um sicherzugehen, dass sie wie gewünscht funktioniert.`,
    },
    {
      type: 'heading',
      content: '🌍 Sprachen und Sprachqualität',
    },
    {
      type: 'text',
      content: `Voice Mode unterstützt mittlerweile 20 Sprachen – im März 2026 wurden 10 neue hinzugefügt. Die Spracherkennung erkennt automatisch, welche Sprache du sprichst. Du musst also nicht manuell umschalten, wenn du zwischen Deutsch und Englisch wechselst. Das ist besonders praktisch, wenn du deutsche Anweisungen gibst, aber englische Fachbegriffe verwendest.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `UNTERSTÜTZTE SPRACHEN (Voice Mode, Stand März 2026)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ursprüngliche 10 Sprachen:
  ✅ Englisch          ✅ Deutsch           ✅ Französisch
  ✅ Spanisch          ✅ Portugiesisch     ✅ Italienisch
  ✅ Niederländisch    ✅ Japanisch         ✅ Koreanisch
  ✅ Chinesisch (Mandarin)

Neue 10 Sprachen (März 2026):
  ✅ Polnisch          ✅ Tschechisch       ✅ Schwedisch
  ✅ Norwegisch        ✅ Dänisch           ✅ Finnisch
  ✅ Türkisch          ✅ Russisch          ✅ Hindi
  ✅ Arabisch

SPRACHERKENNUNGS-QUALITÄT:
  Englisch:  ★★★★★  (am besten trainiert)
  Deutsch:   ★★★★☆  (sehr gut, gelegentlich Fachbegriffe)
  Andere:    ★★★☆☆  (gut, Verbesserungen laufend)

TIPP: Sprich deutlich und in normalem Tempo.
Fachbegriffe wie "Refactoring" oder "API" werden
in allen Sprachen gut erkannt.`,
    },
    {
      type: 'heading',
      content: '💼 Voice Mode im Arbeitsalltag',
    },
    {
      type: 'text',
      content: `Voice Mode ist nicht für jede Situation gleich gut geeignet. Hier eine ehrliche Einschätzung, wann Voice Mode wirklich hilft und wann du besser tippst. Die Faustregel: Je länger und natürlichsprachlicher deine Anweisung, desto mehr profitierst du von Voice Mode. Je kürzer und technischer (z.B. exakte Dateinamen, Code-Snippets), desto besser ist Tippen.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `VOICE MODE – WANN NUTZEN?
━━━━━━━━━━━━━━━━━━━━━━━━

✅ IDEAL FÜR:
  • Komplexe Anweisungen beschreiben
    "Erstelle eine neue React-Komponente für ein Kontaktformular
     mit Validierung für Email und Telefonnummer"

  • Pair-Programming-Situationen
    Du schaust auf Code, beide Hände am Keyboard,
    und gibst Claude schnell eine Anweisung

  • Code-Reviews aussprechen
    "Schau dir die Funktion processPayment an, die hat
     keine Fehlerbehandlung für den Timeout-Fall"

  • Brainstorming / Planung
    "Wie würdest du die Datenbankstruktur für ein
     Buchungssystem mit Stornierungen aufbauen?"

❌ WENIGER GEEIGNET FÜR:
  • Exakte Dateinamen und Pfade
    Tippen: src/components/auth/LoginForm.tsx
    → Sprechen ist fehleranfällig bei Pfaden

  • Code-Snippets diktieren
    Tippen: const [state, setState] = useState<User | null>(null)
    → Sprechen ist umständlich für Syntax

  • Kurze Befehle
    Tippen: /clear  /compact  git status
    → Schneller getippt als gesprochen

  • Offene Großraumbüros
    → Kollegen hören alles mit`,
    },
    {
      type: 'text',
      content: `Ein bewährter Workflow ist die Kombination: Du nutzt Voice Mode für die initiale Beschreibung dessen, was du willst, und tippst dann Korrekturen und Details nach. Zum Beispiel: Du sprichst "Erstelle eine REST-API für User-Management mit CRUD-Operationen", und tippst danach die spezifischen Details wie Datenbankfelder oder Validierungsregeln.`,
    },
    {
      type: 'heading',
      content: '🛠️ Voice Mode Troubleshooting',
    },
    {
      type: 'text',
      content: `Es gibt einige typische Probleme beim Voice Mode. Hier die häufigsten Ursachen und Lösungen, damit du nicht unnötig Zeit mit Debugging verlierst.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# Problem: Mikrofon wird nicht erkannt
# Lösung 1: macOS Systemeinstellungen prüfen
# → Datenschutz & Sicherheit → Mikrofon → Terminal/iTerm erlauben

# Lösung 2: Mikrofon-Eingabe testen
# Öffne "Audio-MIDI-Setup" und prüfe, ob das Mikrofon Pegel zeigt

# Problem: Spracherkennung versteht Fachbegriffe nicht
# Lösung: Buchstabiere schwierige Wörter oder tippe sie nach
# Beispiel: "Erstelle einen Hook, also H-O-O-K, für..."

# Problem: Push-to-Talk reagiert nicht
# Lösung: Prüfe ob das Eingabefeld leer ist
# (bei Text im Feld tippt Leertaste normal)

# Problem: Voice Mode startet nicht
# Lösung: Claude Code Version prüfen
claude --version
# Voice Mode erfordert eine aktuelle Version`,
    },
    {
      type: 'text',
      content: `Wenn die Spracherkennung ein Wort falsch versteht, kannst du die Anweisung einfach im Textfeld korrigieren, bevor du sie absendest. Claude Code zeigt dir den transkribierten Text, und du kannst ihn bearbeiten. Das ist oft schneller als nochmal zu sprechen.`,
    },
    // ============================
    // TEIL 2: CODE REVIEW TOOL
    // ============================
    {
      type: 'heading',
      content: '🔍 Teil 2: Code Review Tool – KI-gestützte Qualitätssicherung',
    },
    {
      type: 'text',
      content: `Das Code Review Tool ist eines der wichtigsten neuen Features in Claude Code (Launch: 9. März 2026). Es adressiert die größte Sorge bei KI-generiertem Code: Wie stelle ich sicher, dass der Code, den Claude schreibt, wirklich gut ist?

Die Idee ist einfach aber mächtig: Du lässt Claude Code deinen Code reviewen – egal ob du ihn selbst geschrieben hast oder ob Claude ihn generiert hat. Das ist wie ein "Four Eyes Principle" mit KI: Eine KI schreibt den Code, eine andere (oder dieselbe mit frischem Kontext) prüft ihn. Studien zeigen, dass 34% der Entwickler Security- und IP-Bedenken bei KI-generiertem Code haben – das Code Review Tool ist die Antwort darauf.`,
    },
    {
      type: 'highlight',
      title: '💡 Warum KI-Code-Review wichtig ist',
      content: `KI-generierter Code hat typische Schwachstellen: fehlende Edge-Case-Behandlung, suboptimale Error-Handling-Patterns, potenzielle Security-Lücken (SQL-Injection, XSS), und manchmal "halluzinierte" API-Aufrufe an Funktionen die nicht existieren. Ein systematisches Review fängt diese Probleme ab, bevor sie in die Produktion gelangen.`,
    },
    {
      type: 'heading',
      content: '🚀 Code Review starten',
    },
    {
      type: 'text',
      content: `Du kannst ein Code Review auf verschiedene Weisen starten. Die einfachste Methode ist der direkte Prompt: Du sagst Claude Code, dass es den Code reviewen soll. Für systematischere Reviews gibt es den dedizierten Review-Workflow, der gezielt nach bestimmten Kategorien von Problemen sucht.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# Methode 1: Einfaches Review per Prompt
# Im Claude Code Terminal:
"Reviewe die Datei src/api/auth.ts auf Security-Probleme"

# Methode 2: Gesamtes Diff reviewen (z.B. vor einem Commit)
"Reviewe alle Änderungen seit dem letzten Commit"

# Methode 3: PR-Review
"Reviewe den PR #42 und gib Feedback zu Code-Qualität und Security"

# Methode 4: Gezieltes Review mit Fokus-Bereichen
"Reviewe src/payments/ mit Fokus auf:
 1. Error Handling
 2. Input Validation
 3. Race Conditions"

# Methode 5: Review mit Kontext
"Reviewe die neue Stripe-Integration.
 Kontext: Wir verarbeiten EUR-Beträge in Cents.
 Achte besonders auf korrekte Umrechnung."`,
    },
    {
      type: 'text',
      content: `Der entscheidende Unterschied zum "normalen" Feedback von Claude Code: Das Code Review Tool führt eine strukturierte Analyse durch. Es prüft systematisch verschiedene Kategorien (Security, Performance, Maintainability, Error Handling) statt nur oberflächlich über den Code zu schauen. Das Ergebnis ist ein detaillierter Review-Report mit konkreten Verbesserungsvorschlägen.`,
    },
    {
      type: 'heading',
      content: '📋 Was das Code Review Tool prüft',
    },
    {
      type: 'text',
      content: `Das Review Tool analysiert deinen Code in mehreren Dimensionen. Hier eine Übersicht der Prüfkategorien und was jeweils untersucht wird. Je nach Kontext und Fokus deines Reviews werden unterschiedliche Kategorien priorisiert.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `CODE REVIEW KATEGORIEN
━━━━━━━━━━━━━━━━━━━━

🔐 SECURITY
  • SQL Injection, XSS, CSRF
  • Unsichere Abhängigkeiten
  • Hardcoded Secrets / API Keys
  • Fehlende Input-Validierung
  • Unsichere Crypto-Patterns

⚡ PERFORMANCE
  • N+1 Queries
  • Unnötige Re-Renders (React)
  • Fehlende Indizes bei DB-Queries
  • Memory Leaks
  • Blockierende Operationen im Main Thread

🏗️ ARCHITEKTUR
  • Single Responsibility Principle
  • Zirkuläre Abhängigkeiten
  • God-Klassen / God-Funktionen
  • Coupling und Cohesion
  • API-Design-Konsistenz

🐛 BUG-POTENZIAL
  • Off-by-One Errors
  • Null/Undefined Handling
  • Race Conditions
  • Unbehandelte Promise-Rejections
  • Typ-Fehler (bei schwacher Typisierung)

📖 WARTBARKEIT
  • Code-Duplizierung
  • Magische Zahlen / Strings
  • Fehlende Error Messages
  • Zu komplexe Funktionen (Cyclomatic Complexity)
  • Inkonsistente Namensgebung`,
    },
    {
      type: 'heading',
      content: '🎯 Praxis: Code Review Workflow',
    },
    {
      type: 'text',
      content: `Hier ein vollständiger Workflow, wie du das Code Review Tool in deinen Entwicklungsalltag integrierst. Der Schlüssel ist, Reviews nicht als einmaliges Event zu sehen, sondern als regelmäßigen Bestandteil deines Workflows – idealerweise vor jedem Commit und vor jedem PR.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# WORKFLOW: Code Review vor dem Commit
# =====================================

# Schritt 1: Änderungen ansehen
git diff --stat

# Schritt 2: Claude Code Review starten
# Im Claude Code Terminal:
"Reviewe alle geänderten Dateien (git diff) auf:
 1. Security-Probleme
 2. Fehlende Error-Behandlung
 3. TypeScript-Typ-Sicherheit
 Zeige nur echte Probleme, keine Style-Hinweise."

# Schritt 3: Gefundene Probleme beheben
# Claude zeigt dir die Probleme mit Datei und Zeile
# Du entscheidest, welche du fixst

# Schritt 4: Erneutes Review der Fixes
"Prüfe ob meine Fixes die gemeldeten Probleme korrekt beheben"

# Schritt 5: Commit wenn alles sauber ist
git add -A && git commit -m "feat: Implementierung mit Review-Fixes"`,
    },
    {
      type: 'text',
      content: `Beachte den Prompt im Schritt 2: Wir geben dem Review Tool explizite Fokus-Bereiche und bitten es, Style-Hinweise zu ignorieren. Das ist wichtig, weil ein unkonstrolliertes Review sonst hunderte Kleinigkeiten meldet und die wirklich wichtigen Probleme untergehen. Fokussiere auf das, was wirklich schadet: Security-Lücken, Bugs, fehlende Error-Behandlung.`,
    },
    {
      type: 'heading',
      content: '❌ Common Mistakes beim Code Review',
    },
    {
      type: 'text',
      content: `Diese Fehler sehen wir immer wieder. Lerne aus den Fehlern anderer und spare dir die frustrierenden Debugging-Sessions.`,
    },
    {
      type: 'code',
      language: 'typescript',
      content: `// ❌ FALSCH: Review ohne Kontext
// Prompt: "Reviewe auth.ts"
// → Claude versteht nicht, welche Auth-Strategie gewählt wurde
// → Meldet "Probleme" die eigentlich gewolltes Design sind

// ✅ RICHTIG: Review mit Kontext
// Prompt: "Reviewe auth.ts. Wir nutzen JWT mit Refresh-Tokens.
//          Tokens werden im HttpOnly Cookie gespeichert.
//          Die Session-Dauer ist 15 Minuten.
//          Achte besonders auf Token-Validierung und Expiry-Handling."

// ❌ FALSCH: Alles auf einmal reviewen
// Prompt: "Reviewe das gesamte Projekt"
// → Zu viel Kontext, oberflächliches Review

// ✅ RICHTIG: Fokussierte Reviews
// Prompt: "Reviewe nur src/payments/ mit Fokus auf Stripe-Integration"

// ❌ FALSCH: Review-Ergebnisse blind umsetzen
// Claude sagt "Diese Funktion sollte in 3 kleinere aufgeteilt werden"
// → Du teilst auf ohne nachzudenken
// → Ergebnis: 3 Funktionen die nur einmal aufgerufen werden

// ✅ RICHTIG: Review-Ergebnisse bewerten
// Claude sagt "Diese Funktion sollte in 3 kleinere aufgeteilt werden"
// → Du fragst: "Wird jede der 3 Funktionen an mehreren Stellen genutzt?"
// → Wenn nein: Funktion lassen, Komplexität ist akzeptabel`,
    },
    {
      type: 'text',
      content: `Der wichtigste Punkt: Ein Code Review Tool ist ein Berater, kein Richter. Du entscheidest, welche Empfehlungen du umsetzt. Nicht jedes "Problem" ist wirklich ein Problem in deinem Kontext. Eine Funktion mit 50 Zeilen ist nicht automatisch "zu lang" – wenn sie eine klare Aufgabe hat und gut lesbar ist, ist sie in Ordnung.`,
    },
    {
      type: 'heading',
      content: '🔄 Review von KI-generiertem Code',
    },
    {
      type: 'text',
      content: `Das spannendste Einsatzgebiet: Du lässt Claude Code Code schreiben und reviewst ihn dann mit einem frischen Kontext. Das "Four Eyes Principle" mit KI. Warum frischer Kontext? Weil Claude Code in der gleichen Session den eigenen Code tendenziell positiver bewertet – es hat ihn ja gerade geschrieben. Mit einem frischen Kontext (neue Session oder Subagent) ist die Bewertung objektiver.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# WORKFLOW: Four Eyes Principle mit KI
# =====================================

# Schritt 1: Code generieren lassen
"Implementiere eine Middleware für Rate Limiting mit Redis"
# → Claude Code schreibt die Implementierung

# Schritt 2: Kontext bereinigen
/clear
# WICHTIG: Frischer Kontext für objektives Review!

# Schritt 3: Review mit frischem Kontext
"Ich habe eine Rate-Limiting-Middleware implementiert.
 Reviewe src/middleware/rateLimiter.ts auf:
 - Race Conditions bei konkurrierenden Requests
 - Redis-Connection-Fehlerbehandlung
 - Korrekte Header (X-RateLimit-Limit, X-RateLimit-Remaining)
 - Edge Cases: Was passiert bei Redis-Ausfall?"

# Schritt 4: Fixes umsetzen
# Claude Code kann die gefundenen Probleme direkt beheben

# ALTERNATIVE: Subagent für Review (kein /clear nötig)
# Der Subagent hat automatisch einen eigenen, frischen Kontext
"Starte einen Subagent der src/middleware/rateLimiter.ts
 auf Security und Race Conditions prüft"`,
    },
    {
      type: 'text',
      content: `Der Subagent-Ansatz ist besonders elegant: Du musst deinen aktuellen Kontext nicht aufgeben. Der Subagent läuft in einem eigenen Kontextfenster, reviewt den Code objektiv, und meldet seine Findings zurück. So kannst du nahtlos weiterarbeiten, während das Review im Hintergrund läuft.`,
    },
    {
      type: 'heading',
      content: '⚙️ Review in CI/CD integrieren',
    },
    {
      type: 'text',
      content: `Für Teams und professionelle Projekte kannst du das Code Review als automatischen Schritt in deine CI/CD-Pipeline einbauen. Claude Code läuft headless (ohne interaktives Terminal) in GitHub Actions oder GitLab CI/CD und reviewt jeden PR automatisch.`,
    },
    {
      type: 'code',
      language: 'yaml',
      content: `# .github/workflows/ai-code-review.yml
# Automatisches Code Review bei jedem PR
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Vollständige Git-History für Diff

      - name: Claude Code Review
        # Claude Code im Headless-Modus starten
        # und das Diff des PRs reviewen lassen
        run: |
          claude --print "Reviewe den folgenden Git-Diff auf
            Security, Performance und Bug-Potenzial.
            Formatiere als Markdown mit Severity-Levels
            (critical/warning/info).
            $(git diff origin/main...HEAD)"

      # Ergebnis als PR-Kommentar posten
      - name: Post Review
        uses: actions/github-script@v7
        with:
          script: |
            // Review-Ergebnis als Kommentar zum PR hinzufügen
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: '## 🤖 AI Code Review\n\n' + reviewResult
            })`,
    },
    {
      type: 'text',
      content: `Diese GitHub Action zeigt das Grundprinzip: Claude Code läuft im \`--print\` Modus (Headless, keine Interaktion), bekommt den PR-Diff als Input, und gibt ein strukturiertes Review als Output. Das Ergebnis wird automatisch als PR-Kommentar gepostet. Für produktive Setups solltest du Rate-Limiting, Caching und Fehlerbehandlung hinzufügen – aber das Grundprinzip bleibt gleich.`,
    },
    {
      type: 'heading',
      content: '🔗 Voice Mode + Code Review kombinieren',
    },
    {
      type: 'text',
      content: `Die mächtigste Kombination: Du nutzt Voice Mode für die schnelle Interaktion und das Code Review Tool für die Qualitätssicherung. Hier ein typischer Workflow, der beides verbindet:`,
    },
    {
      type: 'code',
      language: 'text',
      content: `KOMBINIERTER WORKFLOW: Voice + Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. VOICE: Feature beschreiben
   🎤 "Implementiere eine Passwort-Reset-Funktion
       mit Email-Versand und Token-Validierung"

2. CLAUDE: Code wird generiert
   → Mehrere Dateien, Route, Controller, Service, Email-Template

3. VOICE: Schnelle Nachfragen
   🎤 "Wie lange ist der Reset-Token gültig?"
   🎤 "Füge noch Rate Limiting für die Reset-Anfragen hinzu"

4. TIPPEN: Review starten (präziser Prompt)
   "Reviewe die Passwort-Reset-Implementierung auf:
    - Token-Sicherheit (Entropie, Speicherung, Ablauf)
    - Email-Injection-Schutz
    - Brute-Force-Schutz
    - Timing-Attack-Resistenz bei Token-Vergleich"

5. VOICE: Review-Ergebnisse besprechen
   🎤 "Fix das Timing-Attack-Problem mit
       crypto.timingSafeEqual"

6. TIPPEN: Finaler Commit
   git commit -m "feat: Passwort-Reset mit Security-Review"`,
    },
    {
      type: 'text',
      content: `Beachte das Muster: Voice für natürlichsprachliche Beschreibungen und schnelle Interaktion, Tippen für präzise technische Prompts und Befehle. Das ist kein Entweder-Oder – die Kombination macht's aus.`,
    },
    {
      type: 'heading',
      content: '🏋️ Praxis-Übungen',
    },
    {
      type: 'text',
      content: `Probiere diese Übungen aus, um Voice Mode und Code Review in deinen Workflow zu integrieren. Jede Übung baut auf der vorherigen auf.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `ÜBUNG 1: Voice Mode Grundlagen (5 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Aktiviere Voice Mode mit /voice
2. Sprich: "Erkläre mir was CLAUDE.md ist"
3. Sprich: "Zeige mir ein Beispiel für eine gute CLAUDE.md"
4. Deaktiviere Voice Mode
→ Ziel: Komfortabel mit Push-to-Talk werden

ÜBUNG 2: Voice + Code-Generierung (10 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Aktiviere Voice Mode
2. Sprich: "Erstelle eine TypeScript-Funktion die
   prüft ob eine Email-Adresse gültig ist. Mit Tests."
3. Lass Claude den Code generieren
4. Sprich: "Füge noch Unterstützung für
   internationale Domains hinzu"
→ Ziel: Iteration per Sprache

ÜBUNG 3: Code Review Basics (10 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Nimm eine beliebige Datei aus deinem Projekt
2. Tippe: "Reviewe [datei] auf Security und Error Handling"
3. Lies die Findings durch
4. Entscheide: Welche Findings sind relevant?
5. Lass Claude die relevanten Fixes umsetzen
→ Ziel: Kritisches Bewerten von Review-Ergebnissen

ÜBUNG 4: Four Eyes Principle (15 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Lass Claude Code eine REST-API-Route schreiben
   (z.B. POST /api/users mit Validierung)
2. /clear für frischen Kontext
3. Reviewe den generierten Code
4. Setze die Top-3-Findings um
5. Nochmal reviewen – sind die Fixes korrekt?
→ Ziel: Kompletten Review-Zyklus durchlaufen`,
    },
    {
      type: 'highlight',
      title: '🎓 Zusammenfassung',
      content: `✅ Voice Mode: /voice aktivieren, Leertaste für Push-to-Talk, 20 Sprachen
✅ Keybinding anpassbar in ~/.claude/keybindings.json
✅ Voice ideal für komplexe Beschreibungen, Tippen für präzise technische Prompts
✅ Code Review Tool: Systematische Qualitätssicherung in 5 Kategorien
✅ Immer Kontext mitgeben beim Review – sonst bekommst du irrelevante Findings
✅ Four Eyes Principle: /clear vor Review oder Subagent nutzen
✅ Review-Ergebnisse kritisch bewerten – nicht blind umsetzen
✅ CI/CD-Integration möglich über Headless-Modus (--print)
✅ Beste Kombination: Voice für Interaktion + Review für Qualität`,
    },
  ],
};
