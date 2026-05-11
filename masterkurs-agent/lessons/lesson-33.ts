export const lesson33 = {
  id: 33,
  level: 3,
  title: 'Computer Use – Claude steuert deinen Mac',
  description:
    'Claude kann jetzt deinen Mac-Desktop steuern: Screenshots aufnehmen, Maus bewegen, klicken, tippen und scrollen. Lerne, wie der Vision-Loop funktioniert, wann du Computer Use statt MCP oder Bash nutzt, und wie du es sicher und effektiv einsetzt.',
  duration: '55 Minuten',
  objectives: [
    'Computer Use als Konzept verstehen und den Vision-Loop erklären können',
    'Computer Use auf macOS aktivieren und korrekt konfigurieren',
    'Das Prioritäten-System (Connectors > MCP > Computer Use) verinnerlichen',
    'Praktische Use Cases für Dev-Tools, Browser-Testing und App-Automatisierung kennen',
    'Grenzen und Sicherheitsaspekte des Research Preview einschätzen',
    'Computer Use gezielt von MCP und Bash abgrenzen und die richtige Methode wählen',
  ],
  content: [
    // ============================
    // SEKTION 1: WAS IST COMPUTER USE?
    // ============================
    {
      type: 'heading',
      content: '🎯 Sektion 1: Was ist Computer Use?',
    },
    {
      type: 'text',
      content: `Am 23. März 2026 hat Anthropic ein Feature als Research Preview gelauncht, das die Interaktion mit Claude grundlegend verändert: Computer Use. Claude kann jetzt deinen Mac-Desktop direkt steuern – Screenshots aufnehmen, die Maus bewegen und klicken, Tastatur-Eingaben machen, scrollen und Apps öffnen. Das klingt nach Science Fiction, ist aber bereits nutzbar.

Stell dir vor, du sagst Claude: "Öffne die Systemeinstellungen und aktiviere den Dark Mode." Statt dir eine Anleitung zu geben, macht Claude es einfach selbst. Es nimmt einen Screenshot, erkennt den aktuellen Zustand deines Desktops, bewegt die Maus zur richtigen Stelle, klickt, und überprüft per erneutem Screenshot, ob die Aktion erfolgreich war. Das ist Computer Use.`,
    },
    {
      type: 'highlight',
      title: '💡 Research Preview – Was das bedeutet',
      content: `Computer Use ist aktuell ein Research Preview, verfügbar nur auf macOS für Pro- und Max-Subscriber. Das bedeutet: Das Feature funktioniert, ist aber noch nicht perfekt. Es kann Fehler machen, falsche Bereiche klicken oder UI-Elemente falsch interpretieren. Anthropic sammelt aktiv Feedback, um Computer Use zu verbessern. Behandle es wie einen sehr fähigen, aber noch lernenden Assistenten – nicht wie ein ausgereiftes Produktions-Tool.`,
    },
    {
      type: 'text',
      content: `Das Revolutionäre an Computer Use ist, dass Claude damit die "letzte Meile" überbrückt. Bisher konnte Claude nur mit Tools interagieren, für die explizite APIs, MCP-Server oder CLI-Befehle existierten. Wenn eine App keine API hatte, musstest du selbst klicken. Jetzt kann Claude jede App bedienen, die du auch bedienen kannst – über die gleiche visuelle Oberfläche, die du nutzt. Das macht Claude zum universellen Automator.`,
    },
    {
      type: 'heading',
      content: '🔄 Der Vision-Loop – Das Herzstück von Computer Use',
    },
    {
      type: 'text',
      content: `Computer Use funktioniert über einen kontinuierlichen Kreislauf, den sogenannten Vision-Loop. Dieser Loop ist das zentrale Konzept, das du verstehen musst, um Computer Use effektiv zu nutzen. Claude "sieht" deinen Bildschirm nicht in Echtzeit – es arbeitet mit Snapshots.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `DER VISION-LOOP – SO FUNKTIONIERT COMPUTER USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Schritt 1: SCREENSHOT
  → Claude nimmt einen Screenshot deines Bildschirms auf
  → Das Bild wird als Input an das Modell gesendet

Schritt 2: ANALYSE
  → Claude analysiert den Screenshot visuell
  → Erkennt UI-Elemente: Buttons, Menüs, Textfelder, Icons
  → Versteht den aktuellen Zustand der Anwendung
  → Plant die nächste Aktion

Schritt 3: AKTION
  → Claude führt eine Aktion aus:
     • Maus bewegen und klicken (Links-/Rechtsklick)
     • Text per Tastatur eingeben
     • Scrollen (hoch/runter)
     • Tastenkombinationen drücken (Cmd+S, Cmd+Tab, etc.)
     • Apps über Spotlight oder Dock öffnen

Schritt 4: SCREENSHOT (Verifizierung)
  → Claude nimmt erneut einen Screenshot auf
  → Vergleicht: Hat die Aktion den gewünschten Effekt?
  → Falls JA: Nächste Aktion oder fertig
  → Falls NEIN: Korrektur-Aktion → zurück zu Schritt 3

  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │Screenshot│───▶│ Analyse  │───▶│  Aktion  │
  └──────────┘    └──────────┘    └──────────┘
       ▲                               │
       │         ┌──────────┐          │
       └─────────│Screenshot│◀─────────┘
                 │(Verify)  │
                 └──────────┘`,
    },
    {
      type: 'text',
      content: `Dieser Loop wiederholt sich, bis die Aufgabe erledigt ist. Das Entscheidende ist der Verifizierungs-Screenshot nach jeder Aktion: Claude prüft, ob der Klick tatsächlich das erwartete Ergebnis hatte. Wenn nicht, korrigiert es sich selbst. Das macht Computer Use robust, aber auch langsamer als direkte API-Aufrufe – jeder Schritt braucht einen Screenshot-Analyse-Zyklus. Für einfache Aktionen dauert das wenige Sekunden, für komplexere Workflows mit vielen Schritten kann es eine Minute oder länger dauern.`,
    },

    // ============================
    // SEKTION 2: SETUP & AKTIVIERUNG
    // ============================
    {
      type: 'heading',
      content: '🚀 Sektion 2: Setup & Aktivierung auf macOS',
    },
    {
      type: 'text',
      content: `Computer Use ist ausschließlich auf macOS verfügbar und erfordert ein Pro- oder Max-Abo bei Anthropic. Die Aktivierung erfolgt über die Claude Desktop App – nicht über die Webversion, nicht über die API. Hier die Schritt-für-Schritt-Anleitung.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `VORAUSSETZUNGEN
━━━━━━━━━━━━━━
✅ macOS (aktuelles System empfohlen)
✅ Claude Pro oder Claude Max Abo
✅ Claude Desktop App installiert (neueste Version)
✅ Bildschirm-Aufnahme-Berechtigung für Claude
✅ Bedienungshilfen-Berechtigung für Claude

AKTIVIERUNG – SCHRITT FÜR SCHRITT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Claude Desktop App öffnen
   → Stelle sicher, dass du die neueste Version hast

2. Settings öffnen
   → Claude Desktop → Einstellungen (Cmd + ,)
   → Oder über das Menü: Claude → Settings

3. Computer Use aktivieren
   → Navigiere zum Abschnitt "Computer Use"
   → Schalte "Enable Computer Use" ein

4. macOS-Berechtigungen erteilen
   → Beim ersten Start fragt macOS nach zwei Berechtigungen:

   a) Bildschirmaufnahme (Screen Recording)
      → Systemeinstellungen → Datenschutz & Sicherheit
        → Bildschirmaufnahme → Claude aktivieren
      → Ohne diese Berechtigung kann Claude keine
        Screenshots aufnehmen

   b) Bedienungshilfen (Accessibility)
      → Systemeinstellungen → Datenschutz & Sicherheit
        → Bedienungshilfen → Claude aktivieren
      → Ohne diese Berechtigung kann Claude keine
        Maus-/Tastatur-Aktionen ausführen

5. Neustart der App
   → Nach dem Erteilen der Berechtigungen:
     Claude Desktop komplett beenden (Cmd + Q)
     und neu starten`,
    },
    {
      type: 'highlight',
      title: '💡 Berechtigungen nachträglich ändern',
      content: `Wenn du eine Berechtigung beim ersten Start versehentlich abgelehnt hast, kannst du sie jederzeit in den macOS-Systemeinstellungen nachträglich erteilen. Gehe zu Systemeinstellungen → Datenschutz & Sicherheit → Bildschirmaufnahme (bzw. Bedienungshilfen) und aktiviere den Schalter neben "Claude". Danach musst du die Claude App neu starten, damit die Änderung greift.`,
    },
    {
      type: 'text',
      content: `Computer Use funktioniert sowohl in der Claude Desktop App (Cowork-Modus) als auch in Claude Code. In Claude Code nutzt du Computer Use, wenn du Claude bittest, eine GUI-Aktion auszuführen, für die kein CLI-Befehl oder MCP-Server verfügbar ist. Claude entscheidet dabei intelligent, welchen Weg es nimmt – mehr dazu in Sektion 4.`,
    },
    {
      type: 'code',
      language: 'bash',
      content: `# Computer Use in Claude Code testen
# Starte Claude Code und gib eine GUI-Aufgabe:

# Einfacher Test – Finder öffnen
> "Öffne den Finder und erstelle einen neuen Ordner namens 'test-cu' auf dem Desktop"

# Claude wird:
# 1. Screenshot aufnehmen
# 2. Finder öffnen (über Spotlight oder Dock)
# 3. Zum Desktop navigieren
# 4. Neuen Ordner erstellen
# 5. Ordner umbenennen
# 6. Per Screenshot verifizieren

# Wichtig: Claude fragt vor GUI-Aktionen um Erlaubnis!
# Du siehst einen Prompt wie:
# "I'd like to take a screenshot and interact with your desktop.
#  Allow? [y/n]"`,
    },
    {
      type: 'text',
      content: `Sicherheitshinweis: Claude fragt dich vor jeder Computer-Use-Aktion um Erlaubnis. Du siehst, was Claude vorhat (z.B. "Ich möchte auf den Button 'Speichern' klicken"), und kannst ablehnen. Das ist ein bewusstes Design-Prinzip – Claude handelt nie ohne dein Einverständnis auf deinem Desktop.`,
    },

    // ============================
    // SEKTION 3: WIE DER VISION-LOOP FUNKTIONIERT
    // ============================
    {
      type: 'heading',
      content: '👁️ Sektion 3: Der Vision-Loop im Detail',
    },
    {
      type: 'text',
      content: `Du hast den Vision-Loop bereits konzeptionell kennengelernt. Jetzt schauen wir uns an, was in jedem Schritt genau passiert und wie Claude Entscheidungen trifft. Dieses Verständnis hilft dir, bessere Anweisungen zu geben und Fehler zu vermeiden.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `SCHRITT 1: SCREENSHOT-AUFNAHME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Was passiert:
  → Claude nutzt die macOS Screen-Capture-API
  → Nimmt den gesamten Bildschirm auf (oder den relevanten Bereich)
  → Das Bild wird als Pixel-Daten an das Modell gesendet
  → Auflösung wird ggf. herunterskaliert für Effizienz

Tipps für bessere Screenshots:
  → Halte den Desktop aufgeräumt
  → Vermeide überlappende Fenster
  → Dunkle und helle Themes funktionieren beide
  → Größere UI-Elemente werden besser erkannt

SCHRITT 2: VISUELLE ANALYSE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Was Claude erkennt:
  → Fenster-Grenzen und -Titel
  → Buttons, Menüs, Tabs, Dropdown-Listen
  → Textfelder und deren Inhalt
  → Icons und deren wahrscheinliche Funktion
  → Scrollbars und Scroll-Position
  → Dialoge, Pop-ups, Benachrichtigungen

Was Claude NICHT gut erkennt:
  → Sehr kleine UI-Elemente (< 16px)
  → Subtile Farb-Unterschiede (z.B. aktiv/inaktiv)
  → Animationen (nur Snapshots, kein Video)
  → Overlays die teilweise transparent sind

SCHRITT 3: AKTIONS-AUSFÜHRUNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verfügbare Aktionen:
  → mouse_move(x, y)     – Maus zu Koordinaten bewegen
  → left_click()         – Linksklick
  → right_click()        – Rechtsklick
  → double_click()       – Doppelklick
  → type_text("...")     – Text eingeben
  → key_press("cmd+s")  – Tastenkombination
  → scroll(direction)    – Hoch/runter scrollen

SCHRITT 4: VERIFIZIERUNG
━━━━━━━━━━━━━━━━━━━━━━━━
Nach jeder Aktion:
  → Neuer Screenshot
  → Vergleich: Hat sich der erwartete Zustand eingestellt?
  → Selbst-Korrektur bei Fehlern
  → Maximal 3-5 Korrektur-Versuche pro Aktion`,
    },
    {
      type: 'text',
      content: `Ein wichtiges Detail: Claude verarbeitet den Screenshot als Bild-Input, genau wie wenn du ein Bild in den Chat hochladen würdest. Das bedeutet, dass die gleichen multimodalen Fähigkeiten genutzt werden, die Claude auch für Bildanalyse hat. Der Unterschied ist, dass Claude hier nicht nur analysiert, sondern auch handelt – es schließt den Loop zwischen Wahrnehmung und Aktion.`,
    },
    {
      type: 'highlight',
      title: '💡 Warum der Loop manchmal langsam ist',
      content: `Jeder Durchlauf des Vision-Loops braucht: 1) Screenshot aufnehmen (~0,5s), 2) Bild an Claude senden (~1-2s), 3) Analyse und Entscheidung (~2-5s), 4) Aktion ausführen (~0,5s). Das sind 4-8 Sekunden pro Schritt. Ein Workflow mit 10 Schritten dauert also 40-80 Sekunden. Das ist deutlich langsamer als ein CLI-Befehl (Millisekunden) oder ein MCP-Aufruf (1-3 Sekunden). Deshalb ist Computer Use immer die letzte Option, wenn schnellere Wege nicht verfügbar sind.`,
    },
    {
      type: 'text',
      content: `Um Claude die Arbeit zu erleichtern, solltest du bei Computer-Use-Aufgaben ein paar Dinge beachten: Maximiere das Fenster der Ziel-App, damit UI-Elemente groß und gut erkennbar sind. Schließe unnötige Fenster. Vermeide Fenster-Überlappungen. Und beschreibe so genau wie möglich, was du willst – "Klicke auf den blauen Button rechts oben" ist besser als "Klicke irgendwo".`,
    },

    // ============================
    // SEKTION 4: PRIORITÄTEN-SYSTEM
    // ============================
    {
      type: 'heading',
      content: '📋 Sektion 4: Das Prioritäten-System – Wann nutzt Claude was?',
    },
    {
      type: 'text',
      content: `Eine der cleversten Design-Entscheidungen bei Computer Use ist das Prioritäten-System. Claude greift nicht sofort zur Maus – es prüft zuerst, ob es schnellere und zuverlässigere Wege gibt. Dieses Priorisierungssystem ist hierarchisch aufgebaut und folgt einer klaren Logik: Je direkter und deterministischer der Zugriff, desto besser.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `CLAUDES PRIORITÄTEN-SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━

PRIORITÄT 1: DIREKTE CONNECTORS (Höchste Priorität)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Native Integrationen wie Slack, Google Calendar, Gmail
  → Strukturierte API-Aufrufe, 100% zuverlässig
  → Millisekunden-Antwortzeit
  → Beispiel: "Schicke eine Slack-Nachricht" → Slack-Connector

PRIORITÄT 2: MCP-SERVER
━━━━━━━━━━━━━━━━━━━━━━━
  → Benutzerdefinierte Tool-Server (Supabase, Stripe, etc.)
  → Strukturierte Eingabe/Ausgabe, hohe Zuverlässigkeit
  → 1-3 Sekunden Antwortzeit
  → Beispiel: "Erstelle einen Stripe-Kunden" → Stripe MCP

PRIORITÄT 3: BASH / CLI
━━━━━━━━━━━━━━━━━━━━━━━
  → Terminal-Befehle für Dateisystem, Git, npm, etc.
  → Deterministisch, schnell, gut dokumentiert
  → Millisekunden bis Sekunden
  → Beispiel: "Installiere lodash" → npm install lodash

PRIORITÄT 4: COMPUTER USE (Niedrigste Priorität)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Visuelle Desktop-Interaktion als Fallback
  → Nicht-deterministisch, langsamer, fehleranfälliger
  → 4-8 Sekunden pro Aktion
  → Beispiel: "Ändere die Figma-Farbe" → Computer Use
    (weil Figma keine CLI hat)

ENTSCHEIDUNGS-FLUSS:
  Aufgabe → Gibt es einen Connector? → JA → Connector nutzen
                                      → NEIN ↓
            Gibt es einen MCP-Server? → JA → MCP nutzen
                                      → NEIN ↓
            Gibt es einen CLI-Befehl? → JA → Bash nutzen
                                      → NEIN ↓
            Computer Use als Fallback → Desktop-Interaktion`,
    },
    {
      type: 'text',
      content: `Dieses System ist nicht willkürlich – es folgt einem klaren Prinzip: Determinismus vor Heuristik. Ein API-Aufruf liefert immer das gleiche Ergebnis bei gleicher Eingabe. Ein Mausklick auf einen Button hängt davon ab, ob Claude den Button korrekt erkennt, ob er an der erwarteten Stelle ist, ob kein Pop-up ihn verdeckt. Je weiter oben in der Hierarchie, desto zuverlässiger und schneller ist die Methode.`,
    },
    {
      type: 'highlight',
      title: '💡 Was das für dich in der Praxis bedeutet',
      content: `Wenn du Claude bittest, eine Nachricht in Slack zu senden, wird es NICHT den Slack-Desktop-Client öffnen und die Nachricht per Maus und Tastatur eintippen. Es wird den Slack-Connector nutzen – viel schneller und zuverlässiger. Computer Use kommt erst zum Einsatz, wenn kein anderer Weg existiert. Das ist ein bewusster Fallback, kein primäres Werkzeug. Du musst Claude also nicht sagen "nutze den Connector statt Computer Use" – das macht es automatisch.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `BEISPIELE: WAS NUTZT CLAUDE FÜR WELCHE AUFGABE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Sende eine Slack-Nachricht an #team"
  → Connector (Slack-Integration) ✅
  → NICHT: Slack-App öffnen und tippen ❌

"Erstelle einen neuen Supabase-Bucket"
  → MCP-Server (Supabase MCP) ✅
  → NICHT: Supabase-Dashboard im Browser öffnen ❌

"Installiere die neueste Version von React"
  → Bash (npm install react@latest) ✅
  → NICHT: npmjs.com im Browser öffnen ❌

"Ändere die Hintergrundfarbe in Figma"
  → Computer Use (kein Figma-CLI verfügbar) ✅
  → Figma hat keine Terminal-Schnittstelle

"Teste das Login-Formular im Browser"
  → Computer Use (visuelle Interaktion nötig) ✅
  → Alternativ: Playwright MCP für automatisierte Tests

"Ändere eine Einstellung in den macOS Systemeinstellungen"
  → Computer Use (GUI-only Einstellungen) ✅
  → Einige Settings per defaults-Befehl möglich`,
    },
    {
      type: 'text',
      content: `Beachte den letzten Punkt: Manche macOS-Einstellungen können sowohl über die GUI als auch per Terminal (defaults write ...) geändert werden. In solchen Fällen wird Claude den Terminal-Befehl bevorzugen, weil er schneller und zuverlässiger ist. Computer Use kommt nur zum Einsatz, wenn wirklich keine andere Option existiert.`,
    },

    // ============================
    // SEKTION 5: PRAKTISCHE USE CASES
    // ============================
    {
      type: 'heading',
      content: '🛠️ Sektion 5: Praktische Use Cases',
    },
    {
      type: 'text',
      content: `Genug Theorie – schauen wir uns an, wo Computer Use wirklich glänzt. Die stärksten Use Cases sind dort, wo GUI-Interaktion unvermeidbar ist und keine API oder CLI existiert. Hier sind die wichtigsten Szenarien für Entwickler.`,
    },
    {
      type: 'heading',
      content: '🔍 Use Case 1: Dev-Tools debuggen',
    },
    {
      type: 'text',
      content: `Stell dir vor, du hast einen visuellen Bug in deiner App – ein Element wird falsch positioniert, eine Animation ruckelt, oder ein Dropdown öffnet sich an der falschen Stelle. Du kannst Claude bitten, den Browser DevTools zu öffnen, den Element-Inspektor zu nutzen und die CSS-Eigenschaften zu analysieren. Das ist mit reinem CLI nicht möglich, weil die visuelle Inspektion das Problem ist.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `USE CASE: VISUELLEN BUG MIT DEVTOOLS DEBUGGEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dein Prompt an Claude:
  "Öffne Chrome, navigiere zu localhost:3000/dashboard,
   öffne die DevTools, inspiziere den Header-Bereich
   und finde heraus, warum das Logo abgeschnitten wird."

Was Claude tut (Vision-Loop):
  1. Screenshot → Erkennt Chrome im Dock
  2. Klick auf Chrome-Icon → Chrome öffnet sich
  3. Screenshot → Erkennt Adresszeile
  4. Klick auf Adresszeile → Text eingeben: localhost:3000/dashboard
  5. Enter drücken → Seite lädt
  6. Screenshot → Seite ist geladen
  7. Cmd+Option+I → DevTools öffnen
  8. Screenshot → DevTools sind offen
  9. Klick auf Element-Inspektor (Pfeil-Icon)
  10. Klick auf den Header-Bereich
  11. Screenshot → CSS-Eigenschaften sichtbar
  12. Analyse: "Das Logo hat overflow: hidden und eine
      feste Höhe von 32px, aber das Bild ist 48px hoch.
      Setze die Höhe auf auto oder erhöhe sie auf 48px."`,
    },
    {
      type: 'text',
      content: `Das Besondere hier: Claude verbindet seine visuellen Fähigkeiten (das Logo "sehen" und das Problem erkennen) mit seiner Code-Kenntnis (die CSS-Eigenschaft als Ursache identifizieren). Diese Kombination ist mit reinem CLI nicht möglich. Natürlich kannst du alternativ Playwright MCP für automatisierte Browser-Interaktion nutzen – aber für spontanes visuelles Debugging ist Computer Use oft schneller einzurichten.`,
    },
    {
      type: 'heading',
      content: '🌐 Use Case 2: Browser-Testing',
    },
    {
      type: 'text',
      content: `Ein weiterer starker Use Case ist das manuelle Testing im Browser. Statt selbst durch deine App zu klicken und zu prüfen, ob alles funktioniert, kann Claude das für dich übernehmen. Besonders nützlich für Formulare, Multi-Step-Workflows und responsive Design-Checks.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `USE CASE: LOGIN-FLOW TESTEN
━━━━━━━━━━━━━━━━━━━━━━━━━━

Dein Prompt an Claude:
  "Teste den Login-Flow meiner App auf localhost:3000.
   Probiere diese Szenarien:
   1. Falsches Passwort → Wird eine Fehlermeldung angezeigt?
   2. Leere Felder → Wird Validierung angezeigt?
   3. Korrektes Login (test@example.com / test123)
      → Komme ich zum Dashboard?"

Was Claude tut:
  Szenario 1:
  → Navigiert zu localhost:3000
  → Gibt test@example.com in E-Mail-Feld ein
  → Gibt "falsch" in Passwort-Feld ein
  → Klickt "Login"
  → Screenshot → Prüft auf Fehlermeldung
  → Ergebnis: "Fehlermeldung 'Invalid credentials'
     wird in Rot unter dem Formular angezeigt. ✅"

  Szenario 2:
  → Leert beide Felder
  → Klickt "Login"
  → Screenshot → Prüft auf Validierung
  → Ergebnis: "Beide Felder zeigen 'Required' in Rot.
     Der Submit-Button ist nicht deaktiviert – das sollte
     er vielleicht sein. 🟡"

  Szenario 3:
  → Gibt korrekte Credentials ein
  → Klickt "Login"
  → Screenshot → Prüft auf Dashboard
  → Ergebnis: "Redirect zum Dashboard erfolgreich.
     User-Name wird in der Navbar angezeigt. ✅"`,
    },
    {
      type: 'text',
      content: `Beachte, wie Claude beim zweiten Szenario proaktiv einen Verbesserungsvorschlag macht – der Submit-Button sollte deaktiviert sein bei leeren Feldern. Das ist der Mehrwert gegenüber reinem E2E-Testing: Claude denkt mit und erkennt UX-Probleme, die in einem automatisierten Test-Script nicht abgefragt werden. Für regelmäßige, reproduzierbare Tests solltest du trotzdem Playwright oder Cypress verwenden – Computer Use ist ideal für explorative, einmalige Tests.`,
    },
    {
      type: 'heading',
      content: '⚙️ Use Case 3: App-Automatisierung',
    },
    {
      type: 'text',
      content: `Der dritte große Use Case ist die Automatisierung von Desktop-Apps, die keine API oder CLI haben. Denk an Apps wie Figma, Photoshop, Notion (Desktop-App), oder spezifische Branchen-Software. Mit Computer Use kann Claude diese Apps bedienen, als würde ein Mensch davor sitzen.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `USE CASE: WIEDERHOLTE GUI-AUFGABE AUTOMATISIEREN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Beispiel: Export von 5 Design-Varianten aus einer Design-App

Dein Prompt an Claude:
  "Öffne die Design-App, und exportiere die Datei
   'hero-section' in folgenden Formaten:
   - PNG 1x (Desktop)
   - PNG 2x (Retina)
   - SVG
   - WebP
   Speichere alle in ~/Desktop/exports/"

Was Claude tut:
  → Öffnet die Design-App
  → Navigiert zur Datei "hero-section"
  → Öffnet Export-Dialog
  → Wählt PNG, setzt Scale auf 1x
  → Exportiert nach ~/Desktop/exports/
  → Öffnet Export-Dialog erneut
  → Wählt PNG, setzt Scale auf 2x
  → Exportiert...
  → Wiederholt für SVG und WebP

Ergebnis:
  "Alle 4 Exporte erfolgreich gespeichert:
   ~/Desktop/exports/hero-section.png (1x)
   ~/Desktop/exports/hero-section@2x.png (2x)
   ~/Desktop/exports/hero-section.svg
   ~/Desktop/exports/hero-section.webp"`,
    },
    {
      type: 'text',
      content: `Solche repetitiven GUI-Aufgaben sind perfekt für Computer Use. Du sparst dir das manuelle Durchklicken von Export-Dialogen und kannst die Zeit für kreativere Arbeit nutzen. Aber sei realistisch: Bei sehr komplexen GUI-Workflows mit vielen verschachtelten Menüs und Dialogen kann Computer Use an seine Grenzen stoßen. Mehr dazu in Sektion 6.`,
    },

    // ============================
    // SEKTION 6: GRENZEN & VORSICHTSMAßNAHMEN
    // ============================
    {
      type: 'heading',
      content: '⚠️ Sektion 6: Grenzen & Vorsichtsmaßnahmen',
    },
    {
      type: 'text',
      content: `Computer Use ist ein Research Preview – und das merkst du in der Praxis. Es funktioniert oft erstaunlich gut, hat aber klare Grenzen, die du kennen musst. Hier die wichtigsten Einschränkungen und wie du damit umgehst.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `BEKANNTE GRENZEN VON COMPUTER USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. FEHLERHAFTE KLICKS
   → Claude kann UI-Elemente falsch erkennen
   → Besonders bei kleinen Buttons oder ähnlich aussehenden Elementen
   → Mitigation: Fenster maximieren, UI-Elemente vergrößern

2. GESCHWINDIGKEIT
   → 4-8 Sekunden pro Aktion (Vision-Loop)
   → Ein 10-Schritt-Workflow dauert 40-80 Sekunden
   → Nicht geeignet für zeitkritische Aufgaben

3. DYNAMISCHE UI-ELEMENTE
   → Animationen werden nicht erkannt (nur Snapshots)
   → Pop-ups und Tooltips können irritieren
   → Loading-Spinner: Claude wartet, aber nicht unbegrenzt

4. AUFLÖSUNG UND SKALIERUNG
   → Sehr hochauflösende Displays: Mehr Daten pro Screenshot
   → Sehr kleine UI-Elemente werden leichter übersehen
   → HiDPI-Skalierung kann Koordinaten verschieben

5. MULTI-MONITOR
   → Verhalten bei mehreren Bildschirmen kann variieren
   → Am besten: Ziel-App auf dem Hauptbildschirm

6. KONTEXTABHÄNGIGKEIT
   → Claude kennt den vorherigen Zustand der App nicht
   → Jeder Screenshot ist ein "frischer Blick"
   → Komplexe App-Zustände müssen beschrieben werden`,
    },
    {
      type: 'highlight',
      title: '💡 Sensible Daten und Sicherheit',
      content: `Computer Use nimmt Screenshots deines gesamten Bildschirms auf. Das bedeutet: Alles, was auf deinem Bildschirm sichtbar ist, wird an Claude gesendet – inklusive geöffneter E-Mails, Passwort-Manager, Chat-Nachrichten, und persönlicher Dokumente. Schließe sensible Apps und Fenster, bevor du Computer Use aktivierst. Zeige keine Passwörter, API-Keys, Kreditkartennummern oder vertrauliche Geschäftsdaten auf dem Bildschirm. Auch wenn Anthropic strenge Datenschutzrichtlinien hat: Was nicht gesendet wird, kann nicht kompromittiert werden.`,
    },
    {
      type: 'list',
      content: `- Schließe Passwort-Manager und Banking-Apps vor Computer-Use-Sessions
- Logge dich aus sensiblen Accounts aus, die im Browser geöffnet sind
- Vermeide es, API-Keys oder Secrets in sichtbaren Terminal-Fenstern zu haben
- Nutze Computer Use nicht für Aufgaben, die Login-Credentials erfordern
- Räume deinen Desktop auf – weniger sichtbare Daten = weniger Risiko
- Prüfe nach der Session, ob unbeabsichtigte Aktionen stattgefunden haben`,
    },
    {
      type: 'text',
      content: `Ein weiterer wichtiger Punkt: Computer Use kann unbeabsichtigte Aktionen ausführen. Wenn Claude einen Button falsch erkennt und darauf klickt, könnte es z.B. versehentlich eine E-Mail senden, eine Datei löschen, oder eine Einstellung ändern. Das Erlaubnis-System (du musst jede Aktion bestätigen) ist dein Sicherheitsnetz – nutze es bewusst und klicke nicht blind "Ja" bei jeder Aktion.`,
    },

    // ============================
    // SEKTION 7: COMPUTER USE VS MCP VS BASH
    // ============================
    {
      type: 'heading',
      content: '🔀 Sektion 7: Computer Use vs. MCP vs. Bash – Wann was?',
    },
    {
      type: 'text',
      content: `Eine der häufigsten Fragen ist: "Wann soll ich Computer Use nutzen, wann MCP, und wann reicht ein Bash-Befehl?" Die Antwort folgt immer dem gleichen Prinzip: Nutze die deterministischste und schnellste Methode, die für deine Aufgabe funktioniert.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `VERGLEICH: COMPUTER USE vs. MCP vs. BASH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                 BASH           MCP            COMPUTER USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Geschwindigkeit  Sofort         1-3 Sek.       4-8 Sek./Aktion
Zuverlässigkeit  99,9%          99%            ~85-95%
Determinismus    100%           100%           Nicht garantiert
Setup-Aufwand    Keiner         MCP konfigur.  Berechtigungen
Anwendungsbereich CLI-fähige    API-basierte   GUI-only Apps
                 Programme      Services
Fehler-Handling  Exit-Codes     JSON-Errors    Visuell
Reproduzierbar   Ja             Ja             Eingeschränkt
Batch-fähig      Ja (Scripts)   Ja (Loops)     Nein

ENTSCHEIDUNGSHILFE:

  "Kann ich es im Terminal machen?"
    → JA: Bash nutzen
    → NEIN ↓

  "Gibt es einen MCP-Server oder eine API?"
    → JA: MCP nutzen
    → NEIN ↓

  "Muss ich eine GUI bedienen?"
    → JA: Computer Use
    → NEIN: Überdenke die Aufgabe – es gibt fast immer
            einen CLI- oder API-Weg`,
    },
    {
      type: 'text',
      content: `Lass uns das an konkreten Beispielen durchspielen, damit du das Muster verinnerlichst. Für jede Aufgabe gibt es oft mehrere Wege – der beste ist fast nie Computer Use, außer es geht um rein visuelle Interaktion.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `PRAXIS-BEISPIELE: DEN RICHTIGEN WEG WÄHLEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUFGABE: "Git-Repo klonen"
  ❌ Computer Use: Browser öffnen → GitHub → Clone-Button
  ✅ Bash: git clone https://github.com/user/repo.git

AUFGABE: "Supabase-Tabelle erstellen"
  ❌ Computer Use: Browser → Dashboard → SQL-Editor
  ✅ MCP: Supabase MCP → apply_migration

AUFGABE: "Slack-Nachricht senden"
  ❌ Computer Use: Slack-App öffnen → Kanal suchen → Tippen
  ✅ Connector: Slack-Integration → slack_send_message

AUFGABE: "Screenshot einer Website machen"
  ❌ Computer Use: Browser öffnen → Navigieren → Cmd+Shift+3
  ✅ Bash/MCP: Playwright MCP → browser_take_screenshot

AUFGABE: "Figma-Design reviewen"
  ✅ Computer Use: Figma öffnen → Design anschauen → Feedback
  (Figma-Inspektion ist inherent visuell – hier passt CU)

AUFGABE: "Desktop-App-Einstellung ändern ohne CLI"
  ✅ Computer Use: App öffnen → Preferences → Einstellen
  (Keine API vorhanden – CU ist der einzige Weg)

AUFGABE: "Browser-Formular manuell testen"
  🟡 Computer Use: Browser → Formular ausfüllen → Submit
  🟡 MCP: Playwright → browser_fill_form → browser_click
  → Playwright ist reproduzierbarer, CU ist flexibler
  → Für einmalige Tests: CU. Für wiederkehrende: Playwright`,
    },
    {
      type: 'highlight',
      title: '💡 Die Faustregel',
      content: `Wenn du dich fragst "Soll ich Computer Use nutzen?", stell dir zuerst die Gegenfrage: "Gibt es einen nicht-visuellen Weg?" In 90% der Fälle gibt es einen – und der ist besser. Computer Use ist für die restlichen 10%, wo GUI-Interaktion der einzige Weg ist. Denk daran: Computer Use ist ein Fallback, kein primäres Werkzeug. Es glänzt dort, wo nichts anderes funktioniert.`,
    },

    // ============================
    // SEKTION 8: BEST PRACTICES & TIPPS
    // ============================
    {
      type: 'heading',
      content: '✅ Sektion 8: Best Practices & Tipps',
    },
    {
      type: 'text',
      content: `Hier die wichtigsten Regeln für den effektiven Einsatz von Computer Use. Diese Best Practices helfen dir, bessere Ergebnisse zu erzielen und typische Fehler zu vermeiden.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `BEST PRACTICES FÜR COMPUTER USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. AUFGERÄUMTER DESKTOP
   → Schließe unnötige Fenster
   → Maximiere die Ziel-App
   → Keine überlappenden Fenster
   → Weniger auf dem Bildschirm = bessere Erkennung

2. PRÄZISE ANWEISUNGEN
   ❌ "Ändere was in den Einstellungen"
   ✅ "Öffne die Systemeinstellungen, gehe zu
      Allgemein → Erscheinungsbild und wähle 'Dunkel'"

3. SCHRITTWEISE AUFGABEN
   ❌ "Mache alles auf einmal"
   ✅ Teile komplexe Workflows in kleinere Schritte
      → Claude kann nach jedem Schritt verifizieren

4. FEEDBACK GEBEN
   → Wenn Claude falsch klickt: Sage es
   → "Das war der falsche Button – der richtige ist
      der blaue Button rechts daneben"
   → Claude lernt aus deinem Feedback im Kontext

5. VERIFIZIERE WICHTIGE AKTIONEN
   → Prüfe nach Computer-Use-Sessions:
     Wurden die richtigen Dateien gespeichert?
     Wurden keine unbeabsichtigten Änderungen gemacht?

6. NUTZE BESCHREIBENDE REFERENZEN
   ❌ "Klicke auf den dritten Button"
   ✅ "Klicke auf den Button mit der Aufschrift 'Save'"
   → Text-Labels sind zuverlässiger als Positionen`,
    },
    {
      type: 'text',
      content: `Ein oft übersehener Tipp: Wenn Claude Schwierigkeiten hat, ein UI-Element zu finden, kannst du helfen, indem du den ungefähren Bereich beschreibst. "Der Button ist in der oberen rechten Ecke des Fensters, blau, mit weißem Text" ist deutlich hilfreicher als "Klick da drauf". Je mehr visuelle Hinweise du gibst, desto besser kann Claude das Element identifizieren.`,
    },
    {
      type: 'list',
      content: `- Starte mit einfachen Aufgaben, um ein Gefühl für Computer Use zu bekommen
- Beobachte den Vision-Loop: Sieh dir an, wo Claude Screenshots macht und was es erkennt
- Nutze Computer Use nicht für sicherheitskritische Aktionen (Deployments, Löschvorgänge)
- Kombiniere Computer Use mit anderen Tools: z.B. Screenshot per CU, Analyse per Bash
- Halte deine macOS-Berechtigungen aktuell – nach Updates können sie zurückgesetzt werden
- Feedback an Anthropic geben: Als Research Preview profitiert das Feature von deinem Input`,
    },
    {
      type: 'highlight',
      title: '💡 Computer Use und Cowork-Modus',
      content: `Computer Use entfaltet sein volles Potenzial im Cowork-Modus der Claude Desktop App. Hier kann Claude nicht nur Code schreiben, sondern auch die Ergebnisse visuell überprüfen – es baut eine React-Komponente, öffnet den Browser, prüft das Ergebnis per Screenshot, und passt den Code an, bis es stimmt. Das ist ein vollständiger visueller Feedback-Loop, der bisher nur mit menschlichem Eingreifen möglich war.`,
    },

    // ============================
    // SEKTION 9: ÜBUNGEN
    // ============================
    {
      type: 'heading',
      content: '📝 Sektion 9: Übungen',
    },
    {
      type: 'text',
      content: `Diese Übungen helfen dir, Computer Use praktisch zu erleben und ein Gefühl für den Vision-Loop, die Geschwindigkeit und die Grenzen zu entwickeln. Beginne mit den einfachen Übungen und arbeite dich vor.`,
    },
    {
      type: 'code',
      language: 'text',
      content: `ÜBUNG 1: Erste Schritte mit Computer Use (5 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Aktiviere Computer Use (Settings → Computer Use → Enable)
2. Erteile die macOS-Berechtigungen (Bildschirmaufnahme + Bedienungshilfen)
3. Starte die Claude Desktop App neu
4. Gib Claude die Aufgabe:
   "Öffne die Systemeinstellungen und sage mir,
    welche macOS-Version ich nutze."
5. Beobachte den Vision-Loop:
   → Wie viele Screenshots nimmt Claude?
   → Wie lange dauert es?
   → Ist das Ergebnis korrekt?
→ Ziel: Computer Use aktivieren und erste Interaktion erleben

ÜBUNG 2: Prioritäten-System verstehen (10 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Gib Claude diese 4 Aufgaben nacheinander:
   a) "Erstelle eine neue Datei namens test.txt im aktuellen Verzeichnis"
      → Beobachte: Nutzt Claude Bash oder Computer Use?
   b) "Zeige mir den Inhalt der Datei test.txt"
      → Beobachte: Welches Tool wird verwendet?
   c) "Öffne den Finder und navigiere zum Desktop"
      → Beobachte: Jetzt sollte Computer Use kommen
   d) "Lösche die Datei test.txt"
      → Beobachte: Bash oder Computer Use?
2. Notiere für jede Aufgabe, welchen Weg Claude gewählt hat
→ Ziel: Das Prioritäten-System in Aktion sehen

ÜBUNG 3: Browser-Testing mit Computer Use (15 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Voraussetzung: Eine lokale Web-App auf localhost
1. Starte deine App (npm run dev)
2. Bitte Claude:
   "Öffne Chrome, navigiere zu localhost:3000,
    mache einen Screenshot und beschreibe, was du siehst."
3. Dann:
   "Klicke auf den ersten Link/Button den du siehst
    und beschreibe die nächste Seite."
4. Dann:
   "Gibt es visuell etwas, das verbessert werden könnte?"
→ Ziel: Computer Use für visuelles Feedback nutzen

ÜBUNG 4: Vergleich CU vs. Playwright (15 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Aufgabe: "Navigiere zu example.com und mache einen Screenshot"
2. Erst per Computer Use:
   "Öffne Chrome, navigiere zu example.com,
    und beschreibe was du siehst"
   → Notiere die Dauer
3. Dann per Playwright MCP:
   "Nutze den Playwright MCP um zu example.com zu
    navigieren und einen Screenshot zu machen"
   → Notiere die Dauer
4. Vergleiche: Geschwindigkeit, Zuverlässigkeit, Detailgrad
→ Ziel: Wann CU, wann Playwright – praktisch erleben

ÜBUNG 5: Desktop-Automatisierung (10 Minuten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Bitte Claude:
   "Öffne TextEdit, erstelle ein neues Dokument,
    schreibe 'Hello from Computer Use!' hinein,
    und speichere es als 'cu-test.txt' auf dem Desktop."
2. Prüfe: Wurde die Datei korrekt erstellt?
3. Dann:
   "Öffne die Datei cu-test.txt auf dem Desktop
    und ändere den Text zu 'Computer Use funktioniert!'"
4. Prüfe erneut
→ Ziel: Dateierstellung und -bearbeitung per GUI erleben`,
    },
    {
      type: 'text',
      content: `Wichtig bei den Übungen: Gib Claude Zeit. Der Vision-Loop braucht mehrere Sekunden pro Aktion, und bei den ersten Versuchen kann es länger dauern, wenn Claude die UI deines Systems noch nicht "kennt". Sei geduldig und gib Feedback, wenn etwas nicht klappt. Genau dafür ist das Research Preview da – zum Lernen und Feedback-Geben.`,
    },

    // ============================
    // SEKTION 10: ZUSAMMENFASSUNG
    // ============================
    {
      type: 'heading',
      content: '🎓 Sektion 10: Zusammenfassung',
    },
    {
      type: 'text',
      content: `Computer Use ist ein faszinierendes neues Feature, das Claude vom reinen Text- und Code-Assistenten zum visuellen Desktop-Automator erweitert. Es überbrückt die "letzte Meile" zwischen Claude und Apps, die keine API haben. Aber es ist kein Ersatz für die bewährten, schnelleren Methoden – es ist eine Ergänzung.`,
    },
    {
      type: 'highlight',
      title: '🎓 Die wichtigsten Takeaways',
      content: `✅ Computer Use: Claude steuert deinen Mac per Screenshot → Analyse → Aktion → Verifizierung
✅ Aktivierung: Claude Desktop App → Settings → Computer Use → Enable (macOS, Pro/Max)
✅ Vision-Loop: Screenshot-basiert, 4-8 Sekunden pro Aktion, selbst-korrigierend
✅ Prioritäten: Connectors > MCP > Bash > Computer Use (CU ist immer Fallback)
✅ Beste Use Cases: GUI-only Apps, visuelles Debugging, Browser-Testing, Desktop-Automatisierung
✅ Grenzen: Research Preview, fehleranfällig bei kleinen UI-Elementen, langsamer als API/CLI
✅ Sicherheit: Sensible Daten vom Bildschirm entfernen, jede Aktion bewusst bestätigen
✅ Faustregel: "Gibt es einen nicht-visuellen Weg?" → Wenn ja, nutze den. Wenn nein → Computer Use
✅ Kombination: CU für visuelle Inspektion + Bash/MCP für die eigentliche Arbeit = Power-Workflow
✅ Zukunft: Computer Use wird mit jeder Version besser – jetzt einarbeiten lohnt sich`,
    },
    {
      type: 'text',
      content: `Computer Use ist heute das, was Claude Code vor einem Jahr war – ein vielversprechender Anfang, der schnell besser wird. Wenn du jetzt lernst, wie du effektive Computer-Use-Anweisungen formulierst und das Feature strategisch einsetzt, bist du bestens vorbereitet, wenn es aus dem Research Preview in die allgemeine Verfügbarkeit wechselt. Die Übungen in dieser Lektion geben dir eine solide Grundlage dafür.`,
    },
  ],
};
