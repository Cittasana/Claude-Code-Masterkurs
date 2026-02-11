import type { Lesson } from '../types';

/**
 * Freelancer Track – "Claude Code fuer Freelancer"
 * 8 Business-Module mit ContentBlock-System (identisch zu lessons.ts)
 *
 * Die Module nutzen eine eigene ID-Range (100+), damit sie sich nicht
 * mit den Haupt-Lektionen (0-27) ueberschneiden.
 */
export const freelancerModules: Lesson[] = [
  // ========================================
  // MODUL 1: Warum AI-Freelancing?
  // ========================================
  {
    id: 100,
    level: 1,
    title: 'Warum AI-Freelancing?',
    description: 'Marktuebersicht, Verdienstpotenzial und warum jetzt der perfekte Zeitpunkt ist, als AI-Developer durchzustarten.',
    duration: '20 Minuten',
    objectives: [
      'Den aktuellen Markt fuer AI-Development verstehen',
      'Verdienstpotenziale realistisch einschaetzen',
      'Die Nachfrage nach AI-Freelancern bewerten',
      'Deine persoenliche Ausgangslage analysieren',
    ],
    content: [
      {
        type: 'heading',
        content: '📊 Der AI-Freelancing Markt 2026',
      },
      {
        type: 'text',
        content:
          'Der Markt fuer AI-Development-Dienstleistungen waechst exponentiell. Unternehmen jeder Groesse suchen Freelancer, die AI-Tools wie Claude Code effektiv einsetzen koennen – und sie sind bereit, dafuer Premium-Preise zu zahlen. Warum? Weil ein AI-versierter Entwickler in Stunden liefert, wofuer ein traditionelles Team Wochen braucht.',
      },
      {
        type: 'highlight',
        title: '💡 Markt-Insight',
        content:
          'Laut aktuellen Freelancing-Plattformen (Upwork, Toptal, Malt) sind AI-Development-Projekte im Durchschnitt 2-3x hoeher verguetet als klassische Webentwicklung. Der Stundensatz fuer spezialisierte AI-Developer liegt zwischen 100-250 EUR.',
      },
      {
        type: 'heading',
        content: '💰 Verdienstpotenzial im Ueberblick',
      },
      {
        type: 'code',
        language: 'markdown',
        content: `| Spezialisierung | Stundensatz | Projektgroesse |
|----------------|-------------|----------------|
| AI-Prototyping (MVP) | 100-150 EUR | 2.000-10.000 EUR |
| Claude Code Integration | 120-180 EUR | 5.000-20.000 EUR |
| AI-Workflow Automation | 130-200 EUR | 8.000-30.000 EUR |
| Custom Agent Development | 150-250 EUR | 10.000-50.000 EUR |
| AI-Consulting & Strategie | 180-300 EUR | 5.000-25.000 EUR |`,
      },
      {
        type: 'heading',
        content: '🎯 Warum jetzt der perfekte Zeitpunkt ist',
      },
      {
        type: 'list',
        content: `**Fruehstartvorteil**
- Die meisten Unternehmen suchen AI-Expertise, aber der Markt ist noch nicht gesaettigt
- Wer jetzt einsteigt, baut sich einen Namen auf, bevor die Konkurrenz waechst

**Technologie-Reife**
- Claude Code und vergleichbare Tools sind produktionsreif
- MCP-Server und Agent-SDKs ermoeglichen echte Enterprise-Loesungen
- Die Lernkurve ist beherrschbar – du musst kein ML-Experte sein

**Nachfrage explodiert**
- Startups brauchen schnelle MVPs mit AI
- Mittelstand sucht Automatisierungsloesungen
- Enterprise will AI-Integration in bestehende Systeme
- Agenturen suchen AI-spezialisierte Freelancer als Partner`,
      },
      {
        type: 'heading',
        content: '🔍 Typische Kunden und Projekte',
      },
      {
        type: 'text',
        content:
          'Als AI-Freelancer bedienst du verschiedene Kundentypen. Jeder hat andere Beduerfnisse, Budgets und Erwartungen. Hier ein realistischer Ueberblick, welche Projekte auf dich warten:',
      },
      {
        type: 'list',
        content: `**Startups (Seed bis Series A)**
- MVP-Entwicklung mit AI-Features
- Budget: 5.000-20.000 EUR
- Timeline: 2-6 Wochen

**KMU / Mittelstand**
- Prozessautomatisierung mit AI
- Chatbots und Kundenservice-Loesungen
- Budget: 10.000-50.000 EUR
- Timeline: 1-3 Monate

**Agenturen**
- White-Label AI-Development
- Sie verkaufen, du lieferst
- Budget: Pro Projekt variabel
- Langfristige Partnerschaften moeglich

**Enterprise / Konzerne**
- AI-Integration in bestehende Systeme
- Consulting + Implementierung
- Budget: 20.000-100.000+ EUR
- Timeline: 3-6 Monate`,
      },
      {
        type: 'heading',
        content: '⚡ Dein Weg: Von Kurs-Absolvent zum Freelancer',
      },
      {
        type: 'code',
        language: 'text',
        content: `Phase 1: Foundation (Woche 1-2)
  ↓ Kurs abschliessen + Portfolio-Projekt bauen

Phase 2: Positionierung (Woche 3-4)
  ↓ Service-Angebot definieren + Profile erstellen

Phase 3: Erste Kunden (Monat 2-3)
  ↓ Akquise starten + erste bezahlte Projekte

Phase 4: Optimierung (Monat 4-6)
  ↓ Preise erhoehen + Prozesse automatisieren

Phase 5: Skalierung (ab Monat 6)
  ↓ Premium-Kunden + eventuell Team aufbauen`,
      },
      {
        type: 'highlight',
        title: '🚀 Praxis-Beispiel',
        content:
          'Lisa, 28, Junior-Entwicklerin: Nach dem Masterkurs hat sie sich auf "AI-Prototyping fuer Startups" spezialisiert. Erstes Projekt: MVP fuer ein HealthTech-Startup in 3 Wochen – 8.000 EUR. Nach 6 Monaten: 4 Stammkunden, 6.500 EUR/Monat neben ihrem Teilzeit-Job.',
      },
    ],
  },

  // ========================================
  // MODUL 2: Dein Service-Angebot definieren
  // ========================================
  {
    id: 101,
    level: 1,
    title: 'Dein Service-Angebot definieren',
    description: 'Finde deine Nische, definiere klare Services und positioniere dich als Experte in deinem Bereich.',
    duration: '25 Minuten',
    objectives: [
      'Deine ideale Nische identifizieren',
      'Konkrete Service-Pakete schnueren',
      'Ein ueberzeugendes Wertversprechen formulieren',
      'Dein Portfolio strategisch aufbauen',
    ],
    content: [
      {
        type: 'heading',
        content: '🎯 Nische finden: Spezialisierung schlaegt Generalisierung',
      },
      {
        type: 'text',
        content:
          'Der groesste Fehler, den neue Freelancer machen: "Ich mache alles mit AI." Das klingt flexibel, ist aber Gift fuer dein Business. Kunden suchen Experten, keine Generalisten. Wenn jemand ein AI-Chatbot-System braucht, will er den "AI-Chatbot-Spezialisten" – nicht den "Ich-kann-alles-Developer".',
      },
      {
        type: 'highlight',
        title: '💡 Pro-Tipp',
        content:
          'Starte mit EINER klaren Spezialisierung. Du kannst spaeter erweitern. Lieber der Top-Experte fuer eine Sache als ein mittelpraectiger Allrounder. Dein Spezialisten-Status rechtfertigt hoehere Preise und zieht bessere Kunden an.',
      },
      {
        type: 'heading',
        content: '🔍 Die 5 profitabelsten AI-Freelancer-Nischen',
      },
      {
        type: 'list',
        content: `**1. AI-Prototyping & MVP-Development**
- Zielgruppe: Startups, Gruender, Innovationsabteilungen
- Service: Von Idee zum funktionierenden Prototyp in 2-4 Wochen
- Tools: Claude Code + React/Next.js + Supabase/Firebase
- Preisrange: 5.000-15.000 EUR pro Projekt

**2. AI-Workflow-Automatisierung**
- Zielgruppe: KMU, Agenturen, interne Teams
- Service: Geschaeftsprozesse mit AI automatisieren
- Tools: Claude Code + MCP-Server + API-Integrationen
- Preisrange: 8.000-30.000 EUR pro Projekt

**3. Custom Agent Development**
- Zielgruppe: Tech-Unternehmen, SaaS-Companies
- Service: Spezialisierte AI-Agents fuer komplexe Aufgaben
- Tools: Claude Code Agent SDK + MCP + Custom Skills
- Preisrange: 10.000-50.000 EUR pro Projekt

**4. AI-Integration & Migration**
- Zielgruppe: Enterprise, Mittelstand mit Legacy-Systemen
- Service: AI in bestehende Systeme integrieren
- Tools: Claude Code + REST/GraphQL APIs + CI/CD
- Preisrange: 15.000-60.000 EUR pro Projekt

**5. AI-Consulting & Training**
- Zielgruppe: Teams, CTOs, Produktmanager
- Service: Strategie + Hands-on-Training
- Tools: Workshops, Live-Demos, CLAUDE.md-Templates
- Preisrange: 1.500-3.000 EUR/Tag`,
      },
      {
        type: 'heading',
        content: '📦 Service-Pakete schnueren',
      },
      {
        type: 'text',
        content:
          'Statt Stundensaetze zu nennen (das laesst Kunden rechnen), biete fertige Pakete an. Das zeigt Professionalitaet und macht die Entscheidung einfacher:',
      },
      {
        type: 'code',
        language: 'markdown',
        content: `Beispiel: "AI-Prototyping" Service-Pakete

📦 STARTER (ab 3.000 EUR)
├── Discovery Call (1h)
├── Technisches Konzept
├── MVP mit 3-5 Kernfeatures
├── Basic Deployment
└── 1 Woche Bug-Support

📦 PROFESSIONAL (ab 8.000 EUR)
├── Alles aus STARTER
├── Erweiterte Features (8-12)
├── User Authentication
├── API-Integrationen (bis 3)
├── Responsive Design
├── 2 Wochen Support
└── 1 Feedback-Runde

📦 ENTERPRISE (ab 15.000 EUR)
├── Alles aus PROFESSIONAL
├── Custom Design System
├── Unbegrenzte Features
├── CI/CD Pipeline
├── Testing Suite
├── 4 Wochen Support
├── 3 Feedback-Runden
└── Dokumentation`,
      },
      {
        type: 'heading',
        content: '✍️ Dein Wertversprechen formulieren',
      },
      {
        type: 'text',
        content:
          'Ein starkes Wertversprechen beantwortet drei Fragen: WAS du machst, fuer WEN und WARUM du anders bist. Hier die Formel:',
      },
      {
        type: 'code',
        language: 'text',
        content: `Formel:
"Ich helfe [ZIELGRUPPE] dabei, [ERGEBNIS] zu erreichen,
indem ich [METHODE] nutze – in [ZEITRAHMEN] statt [ALTERNATIVE]."

Beispiele:

"Ich helfe Startups, ihr AI-Produkt in 3 Wochen statt 3 Monaten
zu launchen, indem ich Claude Code und moderne AI-Workflows nutze."

"Ich helfe Mittelstaendlern, 20+ Stunden/Woche an manueller Arbeit
einzusparen, durch intelligente AI-Automatisierungen."

"Ich helfe Agenturen, ihren Kunden AI-Features anzubieten,
als zuverlaessiger White-Label-Partner fuer AI-Development."`,
      },
      {
        type: 'heading',
        content: '🖼️ Portfolio aufbauen (auch ohne Kunden)',
      },
      {
        type: 'list',
        content: `**Strategie 1: Eigene Projekte**
- Baue 2-3 beeindruckende Demo-Projekte
- Zeige den gesamten Prozess: Problem → Loesung → Ergebnis
- Veroeffentliche auf GitHub mit guter Dokumentation

**Strategie 2: Open-Source-Beitraege**
- Erstelle nuetzliche MCP-Server oder Claude Code Skills
- Teile CLAUDE.md-Templates fuer verschiedene Projekt-Typen
- Werde sichtbar in der Developer-Community

**Strategie 3: Case Studies schreiben**
- Dokumentiere jedes Projekt als Case Study
- Struktur: Challenge → Approach → Solution → Results
- Nutze konkrete Zahlen (Zeitersparnis, Kosteneinsparung)

**Strategie 4: Content Marketing**
- Schreibe Blogposts ueber AI-Development
- Erstelle kurze Tutorial-Videos
- Teile Learnings auf LinkedIn/Twitter`,
      },
      {
        type: 'highlight',
        title: '🚀 Aufgabe: Dein Service-Profil',
        content:
          'Nimm dir 30 Minuten und beantworte: 1) Welche Nische passt zu deinen Skills? 2) Welche 3 Service-Pakete bietest du an? 3) Wie lautet dein Wertversprechen in einem Satz? 4) Welche 2 Portfolio-Projekte baust du diese Woche?',
      },
    ],
  },

  // ========================================
  // MODUL 3: Preisgestaltung mit AI
  // ========================================
  {
    id: 102,
    level: 1,
    title: 'Preisgestaltung mit AI',
    description: 'Lerne, wie du deine AI-Services profitabel bepreist – von Stundensaetzen bis zu wertbasierten Paketpreisen.',
    duration: '20 Minuten',
    objectives: [
      'Verschiedene Pricing-Modelle verstehen und anwenden',
      'Deinen Wert statt deine Zeit verkaufen',
      'Preisanker und Pakete strategisch einsetzen',
      'Haeufige Pricing-Fehler vermeiden',
    ],
    content: [
      {
        type: 'heading',
        content: '💸 Die Pricing-Revolution fuer AI-Developer',
      },
      {
        type: 'text',
        content:
          'Das Besondere an AI-Development: Du lieferst in 2 Stunden, wofuer ein traditioneller Entwickler 2 Tage braucht. Wenn du nach Stunden abrechnest, bestrafst du dich selbst fuer deine Effizienz. Deshalb ist der Wechsel zu wertbasiertem Pricing entscheidend.',
      },
      {
        type: 'highlight',
        title: '💡 Mindset-Shift',
        content:
          'Verkaufe nicht deine Zeit. Verkaufe das Ergebnis. Ein MVP in 3 Wochen ist fuer ein Startup 50.000+ EUR wert – egal ob du 20 oder 100 Stunden dafuer brauchst. Dein Preis orientiert sich am Wert fuer den Kunden, nicht an deinem Zeitaufwand.',
      },
      {
        type: 'heading',
        content: '📊 Die 4 Pricing-Modelle',
      },
      {
        type: 'list',
        content: `**1. Stundensatz (Einstieg)**
- Einfach zu kommunizieren
- Kunden verstehen das Modell
- Nachteil: Du wirst fuer Effizienz bestraft
- Empfehlung: Nur am Anfang nutzen, Minimum 100 EUR/h

**2. Tagesssatz (Consulting)**
- Standard fuer Beratung und Workshops
- Typisch: 1.200-2.500 EUR/Tag
- Ideal fuer Vor-Ort-Arbeit und Training
- Vorteil: Klare Grenzen, kein Micro-Tracking

**3. Projektpauschale (Recommended)**
- Fester Preis fuer definiertes Ergebnis
- Vorteil: Je schneller du wirst, desto hoeher dein effektiver Stundensatz
- Risiko: Scope Creep – deshalb klare Abgrenzung noetig
- Empfehlung: Immer mit Aenderungsantraegen arbeiten

**4. Wertbasiertes Pricing (Expert)**
- Preis basiert auf dem ROI fuer den Kunden
- Beispiel: Automatisierung spart 5.000 EUR/Monat → du berechnest 25.000 EUR
- Hoechste Margen, erfordert aber gute Verhandlungsfaehigkeiten
- Ideal fuer Enterprise-Kunden und Langzeitprojekte`,
      },
      {
        type: 'heading',
        content: '🎯 Die Preisanker-Strategie',
      },
      {
        type: 'text',
        content:
          'Biete immer drei Optionen an. Die mittlere Option verkauft sich am besten (Goldilocks-Effekt). Die teure Option laesst die mittlere guenstig erscheinen:',
      },
      {
        type: 'code',
        language: 'text',
        content: `Beispiel: AI-Chatbot-Projekt

Option A: "Basic" – 4.000 EUR
├── Standard-Chatbot
├── 5 vordefinierte Flows
├── FAQ-Integration
└── 1 Woche Support

Option B: "Professional" – 8.000 EUR  ← Die meisten waehlen das
├── Alles aus Basic
├── Unbegrenzte Flows
├── CRM-Integration
├── Analytik-Dashboard
├── Knowledge-Base-Anbindung
└── 4 Wochen Support

Option C: "Enterprise" – 18.000 EUR
├── Alles aus Professional
├── Multi-Channel (Web, WhatsApp, Slack)
├── Custom AI Training
├── SLA-Garantie (99.5% Uptime)
├── Dedizierter Account Manager
└── 3 Monate Support`,
      },
      {
        type: 'heading',
        content: '⚠️ Die 5 groessten Pricing-Fehler',
      },
      {
        type: 'list',
        content: `**1. Zu billig starten**
- Unter 80 EUR/h signalisiert "Junior" oder "Unsicher"
- Billige Preise ziehen billige Kunden an (mehr Stress, weniger Respekt)
- Starte lieber hoeher und biete einen "Launch-Rabatt" an

**2. Stundensaetze bei AI-Projekten**
- Du bist mit Claude Code 5-10x schneller
- 20h-Projekt in 4h erledigt = nur 400 EUR statt 2.000 EUR bei 100 EUR/h
- Loesung: Projektpauschalen nutzen

**3. Keinen Scope definieren**
- "Mach mal ein paar Aenderungen" = unbezahlte Arbeit
- Immer schriftlich festhalten: Was ist inkludiert, was kostet extra
- Aenderungsantraege mit Preisschild versehen

**4. Zu schnell Rabatte geben**
- Rabatte senken deinen wahrgenommenen Wert dauerhaft
- Statt Rabatt: Mehr Leistung anbieten ("Ich kann den Preis nicht senken, aber ich kann X zusaetzlich einbauen")
- Wenn Rabatt, dann zeitlich begrenzt und begruendet

**5. Nicht ueber Geld reden**
- Preis frueh im Gespraech nennen (qualifiziert oder disqualifiziert schnell)
- "Meine Projekte starten ab X EUR" – klare Ansage
- Spart dir und dem Kunden Zeit`,
      },
      {
        type: 'heading',
        content: '📈 Preis-Entwicklung: Dein 12-Monats-Plan',
      },
      {
        type: 'code',
        language: 'text',
        content: `Monat 1-3: Einstieg
├── Stundensatz: 100-120 EUR (oder Pauschale ab 3.000 EUR)
├── Ziel: 2-3 Referenzprojekte sammeln
└── Umsatz-Ziel: 3.000-5.000 EUR/Monat

Monat 4-6: Positionierung
├── Pauschalen: 5.000-12.000 EUR pro Projekt
├── Ziel: Spezialisierung schaerfen, Case Studies erstellen
└── Umsatz-Ziel: 5.000-8.000 EUR/Monat

Monat 7-9: Optimierung
├── Pauschalen: 8.000-20.000 EUR pro Projekt
├── Ziel: Premium-Kunden gewinnen, Prozesse automatisieren
└── Umsatz-Ziel: 8.000-12.000 EUR/Monat

Monat 10-12: Premium
├── Wertbasiert: 15.000-40.000 EUR pro Projekt
├── Ziel: Stammkunden, Empfehlungen, passive Einnahmen
└── Umsatz-Ziel: 10.000-15.000+ EUR/Monat`,
      },
      {
        type: 'highlight',
        title: '🚀 Aufgabe: Dein Pricing definieren',
        content:
          'Erstelle drei Service-Pakete mit konkreten Preisen fuer deine gewaehlte Nische. Nutze die Preisanker-Strategie: Ein guenstiges Einstiegs-Paket, ein "Sweet-Spot" Mittel-Paket und ein Premium-Paket. Berechne deinen effektiven Stundensatz fuer jedes Paket.',
      },
    ],
  },

  // ========================================
  // MODUL 4: Kunden-Akquise
  // ========================================
  {
    id: 103,
    level: 2,
    title: 'Kunden-Akquise',
    description: 'Strategien und Kanaele, um konsistent neue Kunden zu gewinnen – von Plattformen bis Outreach.',
    duration: '30 Minuten',
    objectives: [
      'Die effektivsten Akquise-Kanaele kennenlernen',
      'Ueberzeugende Profile auf Freelancer-Plattformen erstellen',
      'Kaltakquise und Warm-Outreach meistern',
      'Ein nachhaltiges Empfehlungssystem aufbauen',
    ],
    content: [
      {
        type: 'heading',
        content: '🎯 Die Akquise-Pyramide',
      },
      {
        type: 'text',
        content:
          'Kundenakquise ist kein Gluecksspiel – es ist ein System. Die besten Freelancer nutzen mehrere Kanaele gleichzeitig und bauen sich so einen konstanten Strom an Anfragen auf. Hier ist die Pyramide der Effektivitaet:',
      },
      {
        type: 'code',
        language: 'text',
        content: `                    ┌─────────────┐
                    │ Empfehlungen │  ← Beste Conversion, hoechster Wert
                    │   (30-50%)   │
                    ├─────────────┤
                    │   Content    │  ← Langfristiger, organischer Zufluss
                    │  Marketing   │
                    │   (20-30%)   │
                    ├─────────────┤
                    │  Netzwerk &  │  ← Meetups, LinkedIn, Communities
                    │  Outreach    │
                    │   (15-25%)   │
                    ├─────────────┤
                    │ Plattformen  │  ← Upwork, Malt, Toptal
                    │   (10-20%)   │
                    └─────────────┘`,
      },
      {
        type: 'heading',
        content: '🌐 Kanal 1: Freelancer-Plattformen',
      },
      {
        type: 'text',
        content:
          'Plattformen sind ideal zum Starten, weil die Kunden bereits dort sind. Der Schluessel ist ein optimiertes Profil und strategische Bewerbungen:',
      },
      {
        type: 'list',
        content: `**Upwork (International)**
- Groesste Plattform, hohe Konkurrenz
- Tipp: Spezialisiertes Profil + "AI Development" Nische
- Bewirb dich nur auf Projekte, die genau passen
- Schreibe individuelle Cover-Letter (nie Copy-Paste!)

**Malt (Europa, deutsch)**
- Ideal fuer den DACH-Markt
- Geringere Konkurrenz als Upwork
- Hoehere Stundensaetze akzeptiert
- Persoenliches Profil mit Portfolio-Stuecken

**Toptal (Premium)**
- Sehr selektiv (Top 3% der Bewerber)
- Dafuer: Premium-Kunden und Premium-Preise
- Bewerbungsprozess: Screening → Test-Projekt → Interview
- Lohnt sich ab 6+ Monaten Freelancing-Erfahrung

**LinkedIn (Unterschaetzt)**
- Kein klassischer Freelancer-Marktplatz, aber effektiv
- Creator-Modus aktivieren, regelmaessig posten
- "Open to Work" fuer Freelance/Consulting aktivieren
- Direkte Nachrichten an Entscheider (CTOs, Produktmanager)`,
      },
      {
        type: 'heading',
        content: '📝 Das perfekte Plattform-Profil',
      },
      {
        type: 'code',
        language: 'text',
        content: `Profil-Struktur (Upwork/Malt):

HEADLINE (max. 60 Zeichen):
"AI Developer | Claude Code Expert | MVP in 3 Wochen"

ZUSAMMENFASSUNG:
Absatz 1: Was du machst + fuer wen (Wertversprechen)
Absatz 2: Dein Ansatz + warum AI-Development (Differenzierung)
Absatz 3: Konkrete Ergebnisse bisheriger Projekte (Social Proof)
Absatz 4: Call-to-Action ("Schreib mir fuer ein kostenloses Erstgespraech")

PORTFOLIO:
- 2-3 Case Studies mit Screenshots
- GitHub-Links zu relevanten Projekten
- Testimonials (auch von Nicht-Freelance-Projekten)

SKILLS (Keywords!):
Claude Code, AI Development, React, TypeScript, Node.js,
API Integration, Automation, MCP Server, Agent Development`,
      },
      {
        type: 'heading',
        content: '📨 Kanal 2: Outreach (Kalt & Warm)',
      },
      {
        type: 'text',
        content:
          'Outreach bedeutet, proaktiv auf potenzielle Kunden zuzugehen. Warm-Outreach (ueber bestehende Kontakte) ist 5x effektiver als Kaltakquise, aber beides hat seinen Platz:',
      },
      {
        type: 'code',
        language: 'text',
        content: `Kaltakquise-Template (LinkedIn/Email):

Betreff: [Konkreter Bezug zum Unternehmen]

Hi [Name],

ich habe gesehen, dass [Unternehmen] gerade [konkretes Thema, z.B.
"euer Produkt um AI-Features erweitert" / "nach AI-Loesungen sucht"].

Ich spezialisiere mich auf [deine Nische] und habe kuerzlich
[konkretes Ergebnis] fuer [aehnliches Unternehmen] erreicht.

Konkret koennte ich euch helfen, [spezifischer Mehrwert] –
typischerweise in [Zeitrahmen].

Haettest du naechste Woche 15 Minuten fuer einen kurzen Austausch?

Viele Gruesse,
[Name]

---
WICHTIG:
- Maximal 5-7 Saetze
- IMMER personalisieren (nie Massen-Emails)
- Konkreten Mehrwert nennen
- Niedrige Einstiegshuerde ("15 Minuten Gespraech")`,
      },
      {
        type: 'heading',
        content: '🤝 Kanal 3: Empfehlungssystem aufbauen',
      },
      {
        type: 'list',
        content: `**Nach jedem Projekt:**
- Frage aktiv nach einem Testimonial
- Bitte um Empfehlung: "Kennst du jemanden, der aehnliche Herausforderungen hat?"
- Biete eine Empfehlungsprovision an (10-15% oder Gutschein)

**Netzwerk pflegen:**
- Bleibe mit ehemaligen Kunden in Kontakt (quartalsweise Check-in)
- Teile nuetzliche Insights oder Artikel
- Biete einen "Bestands-Kunden-Rabatt" fuer Folgeauftraege

**Community-Building:**
- Sei aktiv in relevanten Slack/Discord-Gruppen
- Beantworte Fragen, teile Wissen
- Werde als "Go-to-Experte" wahrgenommen`,
      },
      {
        type: 'heading',
        content: '📅 Dein Akquise-Wochenplan',
      },
      {
        type: 'code',
        language: 'text',
        content: `Montag:     2h Content erstellen (Blog/LinkedIn Post)
Dienstag:   1h Plattform-Bewerbungen (3-5 targeted Proposals)
Mittwoch:   1h Outreach (5 personalisierte Nachrichten)
Donnerstag: 1h Netzwerk pflegen (Follow-ups, Community)
Freitag:    1h Pipeline reviewen + naechste Woche planen

Total: 6h/Woche Akquise
Ergebnis nach 4-6 Wochen: 2-4 qualifizierte Leads pro Woche`,
      },
      {
        type: 'highlight',
        title: '🚀 Aufgabe: Deine Akquise starten',
        content:
          'Diese Woche: 1) Erstelle dein Profil auf Malt oder Upwork. 2) Schreibe 5 personalisierte Outreach-Nachrichten. 3) Veroeffentliche einen LinkedIn-Post ueber ein AI-Thema deiner Wahl. Tracke alles in einer einfachen Tabelle.',
      },
    ],
  },

  // ========================================
  // MODUL 5: Projekt-Workflow mit Claude Code
  // ========================================
  {
    id: 104,
    level: 2,
    title: 'Projekt-Workflow mit Claude Code',
    description: 'Der komplette Workflow fuer Freelance-Projekte: Vom Erstgespraech bis zur Uebergabe – optimiert mit Claude Code.',
    duration: '35 Minuten',
    objectives: [
      'Einen professionellen Projekt-Workflow etablieren',
      'Claude Code gezielt in jedem Projektschritt einsetzen',
      'Zeitschaetzungen realistisch abgeben',
      'Effiziente Delivery-Prozesse aufsetzen',
    ],
    content: [
      {
        type: 'heading',
        content: '🔄 Der 7-Phasen Projekt-Workflow',
      },
      {
        type: 'text',
        content:
          'Ein strukturierter Workflow ist der Unterschied zwischen einem gestressten Freelancer und einem professionellen Dienstleister. Hier ist der Prozess, den du fuer jedes Projekt nutzen solltest:',
      },
      {
        type: 'code',
        language: 'text',
        content: `Phase 1: Discovery (Tag 1)
  ↓ Kundenanforderungen verstehen + dokumentieren

Phase 2: Proposal (Tag 2-3)
  ↓ Angebot mit Scope, Timeline, Preis erstellen

Phase 3: Setup (Tag 1 nach Zusage)
  ↓ Projektstruktur + CLAUDE.md + Git einrichten

Phase 4: Development (Hauptphase)
  ↓ Sprint-basierte Entwicklung mit Claude Code

Phase 5: Review (pro Sprint)
  ↓ Kundenfeedback einholen + einarbeiten

Phase 6: Delivery (Finalisierung)
  ↓ Testing, Docs, Deployment

Phase 7: Handover (Abschluss)
  ↓ Uebergabe, Support-Phase, Testimonial einholen`,
      },
      {
        type: 'heading',
        content: '📋 Phase 1-2: Discovery & Proposal',
      },
      {
        type: 'text',
        content:
          'Das Erstgespraech entscheidet ueber den Projekterfolg. Nutze Claude Code schon hier als Wettbewerbsvorteil:',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Discovery: Nutze Claude Code fuer schnelles Research
claude "Analysiere die Website von [Kundenname] und erstelle
eine Liste von 5 konkreten AI-Verbesserungsmoeglichkeiten
mit geschaetztem Business-Impact."

# Proposal: Lass Claude Code ein professionelles Angebot erstellen
claude "Erstelle ein Projektangebot fuer einen AI-Chatbot mit
folgenden Anforderungen: [Requirements]. Inkludiere Zeitplan,
Milestones, Deliverables und 3 Preis-Optionen (Basic/Pro/Enterprise)."`,
      },
      {
        type: 'highlight',
        title: '💡 Pro-Tipp: Live-Demo im Erstgespraech',
        content:
          'Zeige im Erstgespraech eine Live-Demo mit Claude Code. Baue in 10 Minuten einen kleinen Prototyp der gewuenschten Loesung. Das beeindruckt Kunden enorm und zeigt sofort deine Kompetenz. Bereite dafuer eine CLAUDE.md mit dem relevanten Kontext vor.',
      },
      {
        type: 'heading',
        content: '⚙️ Phase 3: Projekt-Setup mit Claude Code',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# 1. Projekt-Repository erstellen
mkdir client-project-name && cd client-project-name
git init

# 2. CLAUDE.md fuer das Projekt erstellen
claude "Erstelle eine CLAUDE.md fuer folgendes Kundenprojekt:
- Typ: [SaaS/E-Commerce/Chatbot/etc.]
- Tech-Stack: [React/Next.js/etc.]
- Kernfeatures: [Feature 1, Feature 2, ...]
- Projektstruktur: Monorepo mit Frontend + API
- Konventionen: TypeScript, ESLint, Prettier
Beachte: Kundenkommunikation in Deutsch, Code-Kommentare Englisch."

# 3. Projekt-Boilerplate generieren
claude "Erstelle die initiale Projektstruktur mit:
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Express + Prisma + PostgreSQL
- Shared Types
- ESLint + Prettier Config
- .env.example
- README mit Setup-Anweisungen"

# 4. Git-Workflow einrichten
git add . && git commit -m "Initial project setup"
# Feature-Branch-Strategie fuer den Kunden erklaeren`,
      },
      {
        type: 'heading',
        content: '🚀 Phase 4: Sprint-basierte Entwicklung',
      },
      {
        type: 'text',
        content:
          'Arbeite in 1-Wochen-Sprints. Jeder Sprint hat ein klares Ziel und liefert ein funktionierendes Inkrement, das du dem Kunden zeigen kannst:',
      },
      {
        type: 'list',
        content: `**Sprint-Montag: Planung**
- Sprint-Ziel definieren (1-3 Features)
- Tasks in CLAUDE.md als TODOs erfassen
- Claude Code fuer Architektur-Entscheidungen nutzen

**Sprint Di-Do: Entwicklung**
- Feature-Branches pro Task
- Claude Code fuer Implementierung + Tests
- Taeglicher Self-Review: "claude 'Review meinen heutigen Code auf Qualitaet und Sicherheit'"

**Sprint-Freitag: Review & Demo**
- Code-Review mit Claude Code
- Demo fuer den Kunden vorbereiten
- Feedback dokumentieren
- Sprint-Retrospektive (was lief gut, was besser machen)`,
      },
      {
        type: 'heading',
        content: '⏱️ Zeitschaetzung: Die 3x-Regel',
      },
      {
        type: 'text',
        content:
          'Die haeufigste Freelancer-Falle: zu optimistische Zeitschaetzungen. Mit Claude Code bist du zwar schneller, aber Kundenkommunikation, Reviews und Unvorhergesehenes fressen Zeit.',
      },
      {
        type: 'code',
        language: 'text',
        content: `Zeitschaetzung-Formel:

1. Schaetze die reine Entwicklungszeit mit Claude Code
   Beispiel: "Feature X dauert ca. 4 Stunden"

2. Multipliziere mit 2 (Buffer fuer Testing, Bugs, Edge Cases)
   → 4h x 2 = 8 Stunden

3. Addiere 30% fuer Kundenkommunikation & Reviews
   → 8h + 2.4h = ca. 10 Stunden

4. Runde auf den naechsten halben Tag auf
   → 1.5 Tage

Kommuniziere dem Kunden: "Feature X liefere ich in 1.5 Tagen"
Du hast intern 4h Entwicklungszeit – der Rest ist Puffer.
Lieferst du frueher → Kunden-Wow-Effekt.`,
      },
      {
        type: 'heading',
        content: '📦 Phase 6-7: Delivery & Handover',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Automatisierte Qualitaetspruefung vor Delivery
claude "Fuehre eine vollstaendige Qualitaetspruefung durch:
1. TypeScript Errors (tsc --noEmit)
2. Linting (eslint)
3. Tests ausfuehren
4. Security-Check (dependencies)
5. Performance-Audit
6. Accessibility-Check
Erstelle einen Report mit allen Ergebnissen."

# Dokumentation generieren
claude "Erstelle eine technische Dokumentation fuer dieses Projekt:
- Setup-Anleitung
- Architektur-Uebersicht
- API-Dokumentation
- Deployment-Guide
- Haeufige Probleme + Loesungen"

# Uebergabe-Paket erstellen
claude "Erstelle ein Handover-Dokument mit:
- Was wurde gebaut
- Wie deployed man Aenderungen
- Wo findet man was im Code
- Offene Punkte und Empfehlungen
- Support-Kontakt und -Bedingungen"`,
      },
      {
        type: 'highlight',
        title: '🚀 Aufgabe: Workflow testen',
        content:
          'Simuliere den kompletten Workflow mit einem eigenen Projekt. Erstelle ein Mini-Projekt (z.B. Landing Page mit AI-Feature), durchlaufe alle 7 Phasen und dokumentiere deine Zeiten. Das gibt dir einen realistischen Benchmark fuer echte Kundenprojekte.',
      },
    ],
  },

  // ========================================
  // MODUL 6: Client-Kommunikation
  // ========================================
  {
    id: 105,
    level: 2,
    title: 'Client-Kommunikation',
    description: 'Professionelle Kundenkommunikation: Erstgespraeche fuehren, Erwartungen managen und schwierige Situationen meistern.',
    duration: '25 Minuten',
    objectives: [
      'Erstgespraeche professionell fuehren',
      'Kundenerwartungen aktiv managen',
      'Schwierige Situationen souveraen loesen',
      'Langfristige Kundenbeziehungen aufbauen',
    ],
    content: [
      {
        type: 'heading',
        content: '🗣️ Das perfekte Erstgespraech',
      },
      {
        type: 'text',
        content:
          'Das Erstgespraech ist deine wichtigste Verkaufschance. In 30 Minuten entscheidet sich, ob aus einem Lead ein zahlender Kunde wird. Hier ist dein Skript:',
      },
      {
        type: 'code',
        language: 'text',
        content: `Erstgespraech-Struktur (30 Min):

PHASE 1: Rapport (5 Min)
├── Small Talk, gemeinsame Anknuepfungspunkte
├── "Erzaehl mir von eurem Unternehmen/Produkt"
└── Aktiv zuhoeren, Notizen machen

PHASE 2: Discovery (10 Min)
├── "Was ist die groesste Herausforderung gerade?"
├── "Was habt ihr schon versucht?"
├── "Wie sieht Erfolg fuer euch aus?"
├── "Was passiert, wenn das Problem ungeloest bleibt?"
└── "Wer entscheidet und wie ist die Timeline?"

PHASE 3: Solution (10 Min)
├── Zeige, dass du das Problem verstehst (zusammenfassen)
├── Skizziere deinen Loesungsansatz (high-level)
├── Optional: Live-Demo oder Beispiel zeigen
└── Preisrange nennen ("Projekte wie dieses starten ab X EUR")

PHASE 4: Next Steps (5 Min)
├── "Ich schicke dir bis [Tag] ein detailliertes Angebot"
├── Termin fuer Folgegespraech vereinbaren
└── Zusammenfassung per Email nachsenden`,
      },
      {
        type: 'heading',
        content: '📊 Erwartungsmanagement',
      },
      {
        type: 'text',
        content:
          'Die groesste Quelle fuer Kundenunzufriedenheit sind nicht schlechte Ergebnisse – es sind falsche Erwartungen. Manage Erwartungen proaktiv:',
      },
      {
        type: 'list',
        content: `**Vor Projektstart:**
- Schriftlicher Scope (was ist inkludiert, was nicht)
- Klare Milestones mit Daten
- Kommunikationsregeln (Kanal, Reaktionszeit, Update-Rhythmus)
- Aenderungsprozess definieren ("Change Requests kosten X EUR/h")

**Waehrend des Projekts:**
- Woechentliche Status-Updates (auch wenn es nichts Neues gibt!)
- Probleme sofort kommunizieren (nie verstecken)
- Zwischenergebnisse zeigen (Kunden lieben Transparenz)
- Bei Verzoegerungen: sofort informieren + neuen Termin nennen

**Bei Aenderungswuenschen:**
- Nie "Ja, mach ich schnell" sagen (Scope Creep!)
- Stattdessen: "Gute Idee! Das ist eine Erweiterung. Ich schaetze X Stunden/Y EUR."
- Schriftlich bestaetigen lassen
- Bei kleinen Wuenschen: grosszuegig sein (Goodwill aufbauen)`,
      },
      {
        type: 'heading',
        content: '⚡ Kommunikations-Templates',
      },
      {
        type: 'code',
        language: 'text',
        content: `--- Woechentliches Status-Update ---

Betreff: [Projekt] Status Update KW XX

Hi [Name],

hier dein woechentliches Update:

ERLEDIGT diese Woche:
- [Feature/Task 1] ✅
- [Feature/Task 2] ✅
- [Bugfix/Verbesserung] ✅

IN ARBEIT:
- [Feature/Task 3] (70% fertig, Fertigstellung: Mittwoch)

NAECHSTE WOCHE:
- [Feature/Task 4]
- [Feature/Task 5]

BLOCKER/FRAGEN:
- [Falls vorhanden: "Ich brauche von euch X bis Y"]

GESAMTFORTSCHRITT: XX% | Timeline: Im Plan / +X Tage

Gruesse,
[Name]

--- Aenderungsantrag ---

Hi [Name],

danke fuer die Idee mit [Feature]. Das passt gut zum Projekt!

Fuer die Umsetzung schaetze ich:
- Aufwand: ca. X Stunden
- Zusaetzliche Kosten: Y EUR
- Auswirkung auf Timeline: +Z Tage / keine

Soll ich das einplanen? Sag einfach Bescheid.

Gruesse,
[Name]`,
      },
      {
        type: 'heading',
        content: '🔥 Schwierige Situationen meistern',
      },
      {
        type: 'list',
        content: `**Situation: "Das dauert zu lange"**
- Nicht defensiv reagieren
- Zeige den bisherigen Fortschritt konkret
- Erklaere, was Komplexitaet verursacht
- Biete Optionen: "Wir koennen Feature X rausnehmen und 1 Woche frueher liefern"

**Situation: "Das ist zu teuer"**
- Frage: "Im Vergleich wozu?"
- Erklaere den Wert, nicht den Aufwand
- Biete ein guenstigeres Paket mit reduziertem Scope
- "Ich kann den Preis nicht senken, aber X weglassen spart Y EUR"

**Situation: Kunde antwortet nicht**
- Follow-up nach 3 Tagen (freundlich)
- Zweites Follow-up nach 1 Woche (direkt)
- Drittes Follow-up nach 2 Wochen: "Soll ich das Projekt auf Eis legen?"
- Nie mehr als 3 Follow-ups, dann weiterziehen

**Situation: Scope Creep**
- "Das haben wir nicht im Scope vereinbart"
- Zeige das Original-Dokument
- Biete einen Aenderungsantrag an
- Nicht nachtragend sein – professionell bleiben`,
      },
      {
        type: 'highlight',
        title: '💡 Pro-Tipp: AI fuer Kommunikation nutzen',
        content:
          'Nutze Claude Code auch fuer deine Kundenkommunikation. "claude \'Schreibe ein professionelles Status-Update fuer mein Projekt X. Diese Woche erledigt: Feature A, B. Problem: API-Rate-Limit. Naechste Woche: Feature C, D.\'" – Du erhaeltst in Sekunden einen professionellen Text.',
      },
    ],
  },

  // ========================================
  // MODUL 7: Qualitaetssicherung
  // ========================================
  {
    id: 106,
    level: 3,
    title: 'Qualitaetssicherung',
    description: 'Professionelle QA-Prozesse fuer Freelance-Projekte: Testing, Code-Qualitaet und Delivery-Standards.',
    duration: '25 Minuten',
    objectives: [
      'Einen QA-Prozess fuer Freelance-Projekte etablieren',
      'Claude Code fuer automatisierte Qualitaetschecks nutzen',
      'Delivery-Standards definieren, die Kunden begeistern',
      'Typische Qualitaetsfallen in Freelance-Projekten vermeiden',
    ],
    content: [
      {
        type: 'heading',
        content: '✅ Die Freelancer-QA-Checkliste',
      },
      {
        type: 'text',
        content:
          'Als Freelancer bist du gleichzeitig Entwickler, Tester und QA-Manager. Ohne klare Prozesse schleichen sich Fehler ein, die Kunden veraergern und Nacharbeit verursachen. Hier ist deine Checkliste:',
      },
      {
        type: 'code',
        language: 'text',
        content: `Pre-Delivery Checkliste (vor jeder Auslieferung):

CODE-QUALITAET
□ TypeScript: Keine Errors (tsc --noEmit)
□ Linting: Clean (eslint --fix durchlaufen)
□ Formatting: Konsistent (Prettier)
□ Keine console.logs oder Debug-Code
□ Keine auskommentierten Code-Bloecke
□ Sinnvolle Variablen- und Funktionsnamen

FUNKTIONALITAET
□ Alle Features getestet (Happy Path)
□ Edge Cases geprueft (leere Eingaben, Extremwerte)
□ Error-Handling vorhanden
□ Loading States implementiert
□ Responsive Design geprueft (Mobile, Tablet, Desktop)

SICHERHEIT
□ Keine Secrets im Code (API-Keys, Passwoerter)
□ Input-Validierung vorhanden
□ CORS korrekt konfiguriert
□ Dependencies aktuell (npm audit)
□ Authentifizierung/Autorisierung geprueft

PERFORMANCE
□ Keine unnoetige Re-Renders
□ Bilder optimiert
□ Bundle-Size akzeptabel
□ Keine Memory Leaks

DOKUMENTATION
□ README aktuell
□ API-Dokumentation vollstaendig
□ Environment-Variablen dokumentiert
□ Setup-Anleitung getestet`,
      },
      {
        type: 'heading',
        content: '🤖 Automatisierte QA mit Claude Code',
      },
      {
        type: 'text',
        content:
          'Claude Code ist dein bester QA-Assistent. Nutze es systematisch fuer Code-Reviews und Qualitaetschecks:',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Umfassender Code-Review
claude "Review den gesamten Code in src/ auf:
1. TypeScript Best Practices
2. Sicherheitsluecken
3. Performance-Probleme
4. Fehlende Error-Handling
5. Accessibility-Issues
Erstelle eine priorisierte Liste (Critical → Low)."

# Test-Generation
claude "Analysiere die Komponenten in src/components/ und erstelle
fehlende Unit-Tests. Fokus auf:
- Edge Cases und Fehlerfaelle
- User-Interaktionen
- Async-Operationen
Nutze Vitest + Testing Library."

# Security-Audit
claude "Fuehre ein Security-Audit durch:
- Sind alle API-Keys in .env (nicht im Code)?
- Gibt es SQL-Injection-Risiken?
- Sind alle Inputs validiert?
- Ist die Auth korrekt implementiert?
- Gibt es CORS-Probleme?"

# Accessibility-Check
claude "Pruefe die Accessibility (WCAG 2.1 AA) aller Komponenten:
- Semantisches HTML
- ARIA-Labels
- Keyboard-Navigation
- Farb-Kontraste
- Screen-Reader-Kompatibilitaet"`,
      },
      {
        type: 'heading',
        content: '📦 Delivery-Standards die begeistern',
      },
      {
        type: 'text',
        content:
          'Dein Delivery-Paket ist das, was der Kunde am Ende sieht und beurteilt. Mache es herausragend:',
      },
      {
        type: 'list',
        content: `**Das Standard-Delivery-Paket:**
- Sauberer, dokumentierter Code auf GitHub/GitLab
- README mit Setup-Anleitung
- .env.example mit allen noetigen Variablen
- Deployment-Guide (Schritt fuer Schritt)
- Kurze technische Dokumentation

**Das Premium-Delivery-Paket (Wow-Faktor):**
- Alles aus Standard
- Video-Walkthrough des Codes (5-10 Min Loom-Video)
- Architektur-Diagramm
- Performance-Report
- Empfehlungen fuer naechste Schritte
- "Maintenance Guide" fuer zukuenftige Entwickler

**Das Enterprise-Delivery-Paket:**
- Alles aus Premium
- CI/CD Pipeline eingerichtet
- Monitoring + Alerting Setup
- Load-Testing-Ergebnisse
- Security-Audit-Report
- Knowledge-Transfer-Session (Live)`,
      },
      {
        type: 'heading',
        content: '🔄 Continuous Improvement',
      },
      {
        type: 'code',
        language: 'text',
        content: `Nach-Projekt-Retrospektive (30 Min):

FRAGEN:
1. Was lief gut? (Wiederholen!)
2. Was lief schlecht? (Abstellen!)
3. Was hat ueberraschend lange gedauert? (Besser schaetzen!)
4. Wo war der Kunde besonders zufrieden? (Mehr davon!)
5. Wo gab es Missverstaendnisse? (Prozess anpassen!)

METRIKEN TRACKEN:
- Geschaetzte vs. tatsaechliche Zeit
- Anzahl der Revisionsrunden
- Kundenzufriedenheit (NPS-Frage stellen)
- Effektiver Stundensatz

TEMPLATE-BIBLIOTHEK PFLEGEN:
- CLAUDE.md Templates pro Projekttyp
- Code-Snippets und Boilerplates
- Proposal- und Vertrags-Templates
- Kommunikations-Templates`,
      },
      {
        type: 'highlight',
        title: '🚀 Aufgabe: Deine QA-Pipeline einrichten',
        content:
          'Erstelle ein Git-Repository mit deinen persoenlichen QA-Templates: 1) Pre-Delivery-Checkliste als Markdown, 2) Claude Code QA-Prompts als .md-Datei, 3) CLAUDE.md-Template fuer Kundenprojekte. Nutze dieses Repository als Ausgangspunkt fuer jedes neue Projekt.',
      },
    ],
  },

  // ========================================
  // MODUL 8: Skalierung – Freelancer zur Agentur
  // ========================================
  {
    id: 107,
    level: 3,
    title: 'Skalierung: Vom Freelancer zur Agentur',
    description: 'Wachstumsstrategien jenseits des Solo-Freelancings: Subunternehmer, Agenturbetrieb und passive Einnahmequellen.',
    duration: '30 Minuten',
    objectives: [
      'Erkennen, wann der Zeitpunkt zum Skalieren gekommen ist',
      'Verschiedene Skalierungsmodelle bewerten',
      'Subunternehmer effektiv einsetzen',
      'Passive Einkommensstraenge aufbauen',
    ],
    content: [
      {
        type: 'heading',
        content: '📈 Wann ist es Zeit zu skalieren?',
      },
      {
        type: 'text',
        content:
          'Du hast 3-6 Monate als Solo-Freelancer gearbeitet, deine Preise erhoehst du regelmaessig, und du musst Anfragen ablehnen, weil du keine Kapazitaet hast. Gratulation – du hast ein echtes Problem: Zu viel Nachfrage fuer eine Person.',
      },
      {
        type: 'list',
        content: `**Zeichen, dass du skalieren solltest:**
- Du lehnst regelmaessig Projekte ab
- Dein Kalender ist 4+ Wochen im Voraus voll
- Kunden bitten um mehr, als du alleine liefern kannst
- Dein Stundensatz ist ueber 150 EUR und steigt nicht mehr schnell
- Du willst mehr verdienen, ohne mehr zu arbeiten

**Zeichen, dass du NOCH NICHT skalieren solltest:**
- Du hast weniger als 6 Monate Freelancing-Erfahrung
- Dein Stundensatz liegt unter 100 EUR
- Du hast noch keine wiederkehrenden Kunden
- Deine Prozesse sind nicht dokumentiert
- Du suchst noch nach deiner Nische`,
      },
      {
        type: 'heading',
        content: '🏗️ Die 4 Skalierungsmodelle',
      },
      {
        type: 'code',
        language: 'text',
        content: `Modell 1: Solo+ (Freelancer mit Subunternehmern)
├── Du bleibst der Hauptansprechpartner
├── 1-2 Subunternehmer fuer Teilaufgaben
├── Dein Einkommen: Marge von 30-50%
├── Aufwand: Niedrig (Koordination)
└── Risiko: Niedrig

Modell 2: Micro-Agency (2-5 Personen)
├── Eigene Marke statt Personenmarke
├── Kleines Kern-Team (fest oder frei)
├── Spezialisierte Rollen (Dev, Design, PM)
├── Dein Einkommen: Agentur-Gewinn + eigene Arbeit
└── Aufwand: Mittel (Management + Delivery)

Modell 3: Productized Service
├── Standardisierter Service zum Festpreis
├── Beispiel: "AI-Chatbot Setup fuer 4.999 EUR"
├── Wiederholbar, skalierbar, delegierbar
├── Dein Einkommen: Volumen x Marge
└── Aufwand: Hoch initial, niedrig laufend

Modell 4: SaaS + Service Hybrid
├── Eigenes Produkt + Beratung drumherum
├── Beispiel: AI-Tool + Implementierungs-Service
├── Dein Einkommen: Recurring Revenue + Projektarbeit
└── Aufwand: Sehr hoch initial, hoechstes Potenzial`,
      },
      {
        type: 'heading',
        content: '👥 Subunternehmer richtig einsetzen',
      },
      {
        type: 'text',
        content:
          'Subunternehmer sind der einfachste Weg zu skalieren. Du nimmst ein Projekt an, delegierst Teile und koordinierst die Lieferung:',
      },
      {
        type: 'list',
        content: `**Wen suchen?**
- Junior-Developer, die lernen wollen (guenstig, aber mehr Betreuung)
- Spezialisierte Freelancer fuer Teilbereiche (Design, Backend, DevOps)
- Andere AI-Developer aus deinem Netzwerk (fuer grosse Projekte)

**Wo finden?**
- Discord/Slack-Communities (Claude Code, React, etc.)
- Freelancer-Plattformen (als Auftraggeber auftreten)
- Uni-Kontakte, Bootcamp-Absolventen
- Twitter/LinkedIn Developer-Community

**Wie managen?**
- Klare Briefings mit CLAUDE.md und Docs
- Woechentliche Check-ins (15 Min reichen)
- Code-Review ueber Pull Requests
- Zahlung nach Milestones (nicht im Voraus)

**Kalkulation:**
- Dein Preis an den Kunden: 10.000 EUR
- Subunternehmer-Kosten: 4.000-5.000 EUR
- Dein Koordinationsaufwand: 8-10 Stunden
- Dein Gewinn: 5.000-6.000 EUR (500-600 EUR/h effektiv)`,
      },
      {
        type: 'heading',
        content: '💰 Passive Einnahmequellen aufbauen',
      },
      {
        type: 'list',
        content: `**1. Templates & Boilerplates (500-2.000 EUR/Monat)**
- Verkaufe deine besten CLAUDE.md-Templates
- Next.js + AI Starter-Kits
- Plattformen: Gumroad, Lemon Squeezy

**2. Online-Kurs (1.000-5.000 EUR/Monat)**
- Teile dein Spezialwissen als Video-Kurs
- Beispiel: "AI-Chatbots bauen in 7 Tagen"
- Plattformen: Udemy, eigene Website

**3. SaaS-Tool (potenziell unbegrenzt)**
- Baue ein Tool, das du selbst immer wieder brauchst
- Beispiel: AI-Agent-Dashboard, Prompt-Management-Tool
- Monetarisierung: Monthly Subscription

**4. Affiliate & Referrals (passiv)**
- Empfehle Tools, die du nutzt (Hosting, APIs, etc.)
- Empfehlungsprogramme von Kunden-Plattformen
- Provisions-Vereinbarungen mit Partnern

**5. Mentoring & Coaching (300-500 EUR/Monat pro Person)**
- 1:1 Mentoring fuer angehende AI-Freelancer
- Monatliche Group-Calls
- Async-Support via Slack/Discord`,
      },
      {
        type: 'heading',
        content: '🗺️ Dein 12-Monats-Skalierungsplan',
      },
      {
        type: 'code',
        language: 'text',
        content: `Monat 1-3: Foundation Solo
├── Fokus: Kunden gewinnen, Prozesse aufbauen
├── Ziel: 5.000-8.000 EUR/Monat
└── Key Action: Processes dokumentieren

Monat 4-6: Optimierung
├── Fokus: Preise erhoehen, Effizienz steigern
├── Ziel: 8.000-12.000 EUR/Monat
└── Key Action: Erste Templates verkaufen

Monat 7-9: Erste Skalierung
├── Fokus: 1-2 Subunternehmer einsetzen
├── Ziel: 12.000-18.000 EUR/Monat
└── Key Action: Delegation lernen

Monat 10-12: Multiple Streams
├── Fokus: Passive Income aufbauen
├── Ziel: 15.000-25.000 EUR/Monat
└── Key Action: Kurs oder SaaS launchen

Ab Monat 12+: Agency oder Hybrid
├── Fokus: Team aufbauen oder Productized Service
├── Ziel: 20.000+ EUR/Monat
└── Key Action: Entscheidung: Agency vs. SaaS vs. Hybrid`,
      },
      {
        type: 'highlight',
        title: '🚀 Abschluss-Aufgabe: Dein Business-Plan',
        content:
          'Erstelle deinen persoenlichen 12-Monats-Plan: 1) Deine Nische und dein Wertversprechen, 2) Drei Service-Pakete mit Preisen, 3) Deine Top-3 Akquise-Kanaele, 4) Dein Skalierungsmodell (ab Monat 7), 5) Ein Ziel-Einkommen pro Phase. Nutze Claude Code: "claude \'Erstelle einen Business-Plan fuer einen AI-Freelancer mit Spezialisierung auf [X].\'"',
      },
    ],
  },
];
