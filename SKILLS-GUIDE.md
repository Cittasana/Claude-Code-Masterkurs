# 🎯 Skills-Guide für Claude Code Masterkurs

**Zweck**: Übersicht über verfügbare Skills und One-Shot-Prompts für schnelle Feature-Entwicklung
**Für**: Claude Teams, Claude Code, Co-work Mode

---

## 📚 Vorhandene Skills (Sofort nutzbar)

### 🎨 Marketing Skills

#### 1. `marketing:content-creation`
**Nutze für**: Blog-Posts, Social Media, Emails, Landing Pages

**One-Shot-Prompt Beispiele**:
```
Nutze marketing:content-creation und erstelle:

1. Blog-Post: "5 Claude Code Tricks, die dich 10x produktiver machen"
   - 1500 Wörter
   - SEO-optimiert für "Claude Code Tutorial"
   - Inkl. Code-Beispiele
   - CTA: Free Tier Signup

2. LinkedIn-Post für Kurs-Launch
   - Hook über AI-Coding
   - Kurz (200 Wörter)
   - CTA: Link zum Free Tier

3. Email-Newsletter: "Wöchentliche Claude Code Tipps"
   - Format: 1 Tipp + Code-Beispiel + CTA
   - Casual, freundlich
   - Template für wöchentliche Wiederverwendung
```

#### 2. `marketing:campaign-planning`
**Nutze für**: Launch-Kampagnen, Content-Kalender

**One-Shot-Prompt**:
```
Nutze marketing:campaign-planning und erstelle:

Free-Tier-Launch-Kampagne für Claude Code Masterkurs:
- Ziel: 100 Free Signups in 30 Tagen
- Channels: LinkedIn, Twitter, Reddit, Discord
- Budget: €500 (€300 Ads, €200 Tools)
- Content-Kalender: 4 Wochen, tägliche Posts
- Success Metrics: Signups, Email Open-Rate, Conversion

Inkludiere:
- Post-Templates für jeden Channel
- Ad-Creatives Briefing
- Email-Sequence (Tag 0, 3, 7, 14)
- Tracking-Setup (GA4 Events)
```

#### 3. `marketing:competitive-analysis`
**Nutze für**: Wettbewerber analysieren

**One-Shot-Prompt**:
```
Nutze marketing:competitive-analysis für:

Vergleiche Claude Code Masterkurs mit:
1. Pirate Skills (https://pirateskills.com)
2. Wes Bos Kurse
3. Frontend Masters

Analysiere:
- Pricing-Strategie
- Content-Struktur
- Community-Features
- Marketing-Channels
- Unique Selling Points

Output: Positioning-Strategie + Feature-Gaps + Pricing-Empfehlungen
```

#### 4. `marketing:performance-analytics`
**Nutze für**: Kampagnen-Auswertung

**One-Shot-Prompt**:
```
Nutze marketing:performance-analytics:

Analysiere Free-Tier-Kampagne (letzte 30 Tage):

Daten:
- 437 Landing-Page-Besucher
- 82 Free Signups (18,7% Conversion)
- 1.245 Email Opens (35% Open-Rate)
- 8 Paid Upgrades (9,8% Free→Paid)

Erstelle:
- Performance-Report mit Key Metrics
- Channel-Breakdown (LinkedIn vs. Twitter vs. Ads)
- Bottleneck-Analyse (wo steigen User aus?)
- Optimization-Empfehlungen
```

---

### 📦 Product Management Skills

#### 5. `product-management:feature-spec`
**Nutze für**: PRDs für neue Features schreiben

**One-Shot-Prompt**:
```
Nutze product-management:feature-spec:

Erstelle PRD für "Live Code-Review Feature":

Context:
- User können Code in Discord posten
- Community gibt Feedback
- Best Reviews werden in "Hall of Fame" gepinnt

Schreibe:
- Problem Statement
- User Stories (Beginner, Intermediate, Expert)
- Acceptance Criteria
- Technical Requirements
- Success Metrics (Engagement, NPS)
- Timeline-Estimate
```

#### 6. `product-management:roadmap-management`
**Nutze für**: Feature-Priorisierung

**One-Shot-Prompt**:
```
Nutze product-management:roadmap-management:

Priorisiere Features für Q1 2026:

Features-Backlog:
1. Discord Community Integration
2. Free Tier (5 Lektionen)
3. Founder Story Video
4. Projekt-Showcase-Galerie
5. Live-Workshops (monatlich)
6. Freelancer Business-Track
7. Certificate of Completion
8. Mobile App
9. Offline-Events (Berlin, München)
10. Team-Lizenzen

Nutze RICE-Framework:
- Reach: Wie viele User profitieren?
- Impact: Wie groß ist der Effekt?
- Confidence: Wie sicher sind wir?
- Effort: Wie aufwändig ist es?

Output: Priorisierte Roadmap (Now / Next / Later)
```

---

### 💼 Sales Skills

#### 7. `sales:create-an-asset`
**Nutze für**: Sales-Materialien erstellen

**One-Shot-Prompt**:
```
Nutze sales:create-an-asset:

Erstelle One-Pager für B2B-Sales:

Zielgruppe: Unternehmen, die Teams in AI-Coding schulen wollen
Use-Case: Team-Lizenzen (10+ Developer)

Inkludiere:
- Value Proposition (warum Claude Code Training?)
- ROI-Kalkulation (Zeit-Ersparnis × Stundensatz)
- Curriculum-Overview (27 Lektionen)
- Success Stories / Case Studies
- Pricing für Team-Lizenzen
- CTA: Demo-Call buchen

Format: PDF, professionell designed
```

---

### 📝 Document Skills

#### 8. `docx`
**Nutze für**: Word-Dokumente erstellen

**One-Shot-Prompt**:
```
Nutze docx-Skill:

Erstelle "Claude Code Masterkurs - Media Kit" als .docx:

Inhalt:
1. Über den Kurs (1 Seite)
2. Founder Bio + Foto
3. Pressefotos (Screenshots, Logo)
4. Key Facts & Figures
5. Testimonials
6. Kontakt-Informationen

Formatting:
- Professional Layout
- Branded (Farben aus Website)
- Druckbereit
- Inkl. Inhaltsverzeichnis
```

#### 9. `pptx`
**Nutze für**: Präsentationen erstellen

**One-Shot-Prompt**:
```
Nutze pptx-Skill:

Erstelle "Claude Code Masterkurs - Pitch Deck" für Investoren:

Slides (15-20):
1. Cover (Title + Logo)
2. Problem (Programmieren lernen ist schwer)
3. Solution (Claude Code Masterkurs)
4. Product (Screenshots, Features)
5. Traction (Students, Revenue, Growth)
6. Business Model (Pricing, LTV)
7. Market (TAM, SAM, SOM)
8. Competition (vs. Pirate Skills, Bootcamps)
9. Team (Founder Story)
10. Financials (Revenue, Costs, Runway)
11. Ask (Investitions-Summe, Use of Funds)
12. Thank You + Contact

Design: Modern, Professional, Minimal
```

---

## 🚀 Custom Skills für dieses Projekt

### Idee 1: `masterkurs:lesson-creator`
**Zweck**: Neue Lektion von Konzept bis fertig in einem Durchgang

**Skill-Prompt**:
```
Erstelle Custom Skill: "masterkurs:lesson-creator"

Input:
- Thema (z.B. "React Hooks mit Claude Code")
- Schwierigkeitsgrad (Beginner/Intermediate/Expert)
- Dauer (15/30/45 Min)

Output:
1. Lektions-Script (Markdown)
   - Intro (Problem + Lernziele)
   - Theorie (Konzepte erklären)
   - Praxis (Code-Beispiele)
   - Challenge (Übungsaufgabe)
   - Recap + Next Steps

2. Code-Beispiele (lauffähig)
   - Starter-Code (für User)
   - Lösung (für Referenz)
   - Tests (optional)

3. Quiz (5 Fragen)
   - Multiple Choice
   - Code-Completion
   - Debugging-Aufgabe

4. Video-Script (für Aufnahme)
   - Scene-by-Scene
   - On-Screen-Text
   - B-Roll-Notizen

Speichere in:
/content/lessons/[nummer]-[slug]/
├── README.md (Script)
├── starter-code/
├── solution/
├── quiz.json
└── video-script.md
```

**Nutzung**:
```
Nutze masterkurs:lesson-creator:

Erstelle Lektion: "Debugging mit Claude Code"
- Schwierigkeit: Intermediate
- Dauer: 30 Min
- Fokus: Error Messages verstehen, Debugging-Tools
```

---

### Idee 2: `masterkurs:email-sequence`
**Zweck**: Email-Kampagnen für verschiedene User-Segmente

**Skill-Prompt**:
```
Erstelle Custom Skill: "masterkurs:email-sequence"

Input:
- Segment (Free User / Paid User / Churned User)
- Ziel (Onboarding / Engagement / Upsell / Winback)
- Länge (3-Email / 5-Email / 7-Email Sequence)

Output:
Email-Serie mit:
1. Subject Lines (A/B-Test-Varianten)
2. Preheader Text
3. Body (HTML + Plain Text)
4. CTAs (Button-Text + Links)
5. Timing (Tag 0, 3, 7, etc.)
6. Success Metrics (Open Rate / Click Rate / Conversion)

Format: ConvertKit/Mailchimp-kompatibel

Templates:
- Onboarding (Free): Willkommen → First Win → Upgrade-Offer
- Engagement (Paid): Weekly Tips → Feature-Highlights → Community-Invite
- Winback (Churned): We Miss You → Special Offer → Last Chance
```

**Nutzung**:
```
Nutze masterkurs:email-sequence:

Erstelle Onboarding-Serie für Free Users:
- 5 Emails über 14 Tage
- Ziel: 10% Free→Paid Conversion
- Tone: Freundlich, hilfsbereit, nicht pushy
- Inkl. Rabatt-Code für Email 5
```

---

### Idee 3: `masterkurs:social-media-pack`
**Zweck**: Social-Media-Content für 30 Tage in einem Durchgang

**Skill-Prompt**:
```
Erstelle Custom Skill: "masterkurs:social-media-pack"

Input:
- Platform (LinkedIn / Twitter / Instagram)
- Thema (Launch / Tips / Success Stories)
- Frequenz (täglich / 3x/Woche / wöchentlich)

Output:
30 Tage Content-Kalender mit:

LinkedIn (Professional):
- Post-Text (max 1300 Zeichen)
- Hashtags (#ClaudeCode #AICoding)
- Visuals-Briefing (Screenshots, Grafiken)
- Best Time to Post

Twitter (Short & Punchy):
- Tweet-Thread (1 Hook + 3-5 Tweets)
- Code-Snippets (formatiert)
- Hashtags & Mentions
- Engagement-Fragen

Instagram (Visual):
- Caption (Story-Format)
- Carousel-Ideen (Slide 1-5)
- Stories-Content
- Reels-Scripts

Jeder Post hat:
- Variante A (Educational)
- Variante B (Promotional)
- CTA (Learn More / Sign Up / Join Community)
```

**Nutzung**:
```
Nutze masterkurs:social-media-pack:

Erstelle LinkedIn-Content für Free-Tier-Launch:
- 30 Tage, täglich 1 Post
- Mix: 60% Educational, 30% Inspirational, 10% Promotional
- Fokus: Claude Code Tutorials + Success Stories
- CTA: Free Tier Signup
```

---

### Idee 4: `masterkurs:community-moderator`
**Zweck**: Discord-Community-Inhalte & Moderation-Guides

**Skill-Prompt**:
```
Erstelle Custom Skill: "masterkurs:community-moderator"

Input:
- Community-Größe (10-50 / 50-200 / 200+ Members)
- Aktivitäts-Level (Low / Medium / High)
- Problem (Spam / Inaktivität / Off-Topic / Konflikte)

Output:

1. Moderation-Guide:
   - Community-Regeln (präzise, freundlich)
   - Mod-Workflows (Spam-Handling, Konflikt-Lösung)
   - Escalation-Process
   - Response-Templates

2. Engagement-Strategie:
   - Wöchentliche Prompts (z.B. "Show your project Friday")
   - Contests & Challenges (Hackathons, Code-Golf)
   - AMA-Sessions mit Founder
   - Welcome-Bot-Messages

3. Content-Ideen:
   - #weekly-challenge Aufgaben
   - #code-review Struktur
   - #showcase Templates
   - #resources Kuratierung

4. Analytics:
   - Welche Metriken tracken?
   - Gesunde vs. Ungesunde Community-Signale
   - Aktivitäts-Reports (wöchentlich)
```

**Nutzung**:
```
Nutze masterkurs:community-moderator:

Setup Discord-Community für 50-200 Members:
- Fokus: High-Quality Diskussionen, wenig Noise
- Problem: Zu viele Fragen, zu wenig Antworten
- Lösung: Engagement-Strategie + Gamification
```

---

### Idee 5: `masterkurs:ab-test-planner`
**Zweck**: A/B-Tests für Conversion-Optimierung planen

**Skill-Prompt**:
```
Erstelle Custom Skill: "masterkurs:ab-test-planner"

Input:
- Element zu testen (Headline / CTA / Pricing / Layout)
- Aktuelle Conversion-Rate
- Traffic (Visitors/Woche)
- Ziel (Signups / Upgrades / Engagement)

Output:

1. Test-Hypothese:
   - Was testen wir?
   - Warum erwarten wir Verbesserung?
   - Welcher Lift ist realistisch?

2. Varianten:
   - Control (aktuell)
   - Variante A (Änderung 1)
   - Variante B (Änderung 2)
   - Mockups/Code für jede Variante

3. Test-Setup:
   - Statistical Significance (95% Confidence)
   - Sample Size Calculator
   - Test-Duration (Wochen)
   - Tools (Google Optimize, VWO, etc.)

4. Tracking:
   - Primary Metric (z.B. Signup-Rate)
   - Secondary Metrics (Time on Page, Scroll Depth)
   - GA4 Events Setup

5. Analysis-Template:
   - Results-Report
   - Winner-Declaration-Criteria
   - Rollout-Plan
```

**Nutzung**:
```
Nutze masterkurs:ab-test-planner:

Teste Free-Tier Landing-Page:
- Element: Headline
- Current: "Lerne Programmieren mit AI in 27 Lektionen"
- Variante A: "Von Null auf Production-Ready Code in 8 Wochen"
- Variante B: "Programmieren lernen ohne Bootcamp - mit AI als Co-Pilot"
- Traffic: 500 Visitors/Woche
- Ziel: Signup-Rate von 15% → 20%
```

---

## 🎯 One-Shot-Prompts für häufige Tasks

### 1. Neue Feature-Idee validieren
```
Nutze product-management:feature-spec + marketing:competitive-analysis:

Feature-Idee: "AI-Pair-Programming Sessions" (Live-Coding mit Community)

Erstelle:
1. Feature-Spec (PRD)
2. Competitive-Check (hat das jemand?)
3. Go/No-Go Recommendation
4. Wenn Go: Roadmap-Integration
```

### 2. Launch-Kampagne von 0 auf 100
```
Nutze marketing:campaign-planning + marketing:content-creation:

Launch: "Freelancer-Track" (neues Kurs-Modul)

Erstelle:
1. Campaign-Brief (Ziele, Channels, Budget)
2. Landing-Page-Copy
3. Email-Announcement (an bestehende Students)
4. Social-Media-Content (30 Tage)
5. Paid-Ads-Creatives (LinkedIn, Twitter)
```

### 3. Monatliches Performance-Review
```
Nutze marketing:performance-analytics + product-management:metrics-review:

Analysiere Januar 2026:

Daten:
- Revenue: €X
- New Signups: Y
- Churn: Z%
- Community: N Members
- Content: M neue Lektionen

Erstelle:
- Performance-Report
- Bottleneck-Analyse
- Next-Month-Priorities
```

### 4. Schnell Content für Social Media
```
Nutze marketing:content-creation:

Erstelle 10 LinkedIn-Posts für diese Woche:
- Thema: Claude Code Pro-Tips
- Format: Hook + 3 Bullets + CTA
- Ton: Freundlich, educational, nicht verkaufsy
- CTA-Mix: 50% Community, 30% Free Tier, 20% Blog
```

### 5. Sales-Material für B2B
```
Nutze sales:create-an-asset + docx:

Erstelle B2B-Sales-Deck für Corporate Training:

Pitch: "Train your dev team in AI-coding in 4 weeks"
- One-Pager (PDF)
- Full Deck (PPT, 15 Slides)
- ROI-Calculator (Excel)
- Case Study (Word Doc)

Zielgruppe: CTOs, Engineering Managers
```

---

## 📝 Cheatsheet: Welcher Skill für welchen Task?

| Task | Skill | Beispiel-Prompt |
|------|-------|----------------|
| **Neue Lektion schreiben** | `masterkurs:lesson-creator` (Custom) | "Erstelle Lektion: React Hooks" |
| **Blog-Post** | `marketing:content-creation` | "Blog: 5 Claude Code Hacks" |
| **Feature-Spec** | `product-management:feature-spec` | "PRD für Live-Workshops" |
| **Email-Kampagne** | `masterkurs:email-sequence` (Custom) | "Onboarding für Free Users" |
| **Social-Media-Plan** | `masterkurs:social-media-pack` (Custom) | "30 Tage LinkedIn-Content" |
| **Wettbewerber analysieren** | `marketing:competitive-analysis` | "Vergleich mit Pirate Skills" |
| **Roadmap priorisieren** | `product-management:roadmap-management` | "Q1 Feature-Priorisierung" |
| **A/B-Test planen** | `masterkurs:ab-test-planner` (Custom) | "Teste Landing-Page Headline" |
| **Performance-Report** | `marketing:performance-analytics` | "Monatliches Review" |
| **Sales-Deck** | `sales:create-an-asset` + `pptx` | "B2B-Pitch für Corporate" |
| **Community-Setup** | `masterkurs:community-moderator` (Custom) | "Discord-Engagement-Strategie" |
| **Press Kit** | `docx` | "Media Kit für Journalisten" |

---

## 🚀 Nächste Schritte

### Sofort nutzen (Vorhandene Skills):
1. `marketing:content-creation` → Blog-Posts für SEO
2. `marketing:campaign-planning` → Free-Tier-Launch
3. `product-management:roadmap-management` → Feature-Priorisierung

### Custom Skills entwickeln (diese Woche):
1. `masterkurs:lesson-creator` → Produktivität 10x
2. `masterkurs:email-sequence` → Email-Marketing automatisieren
3. `masterkurs:social-media-pack` → Content-Kalender vorfertigen

### Skills testen (nächste Woche):
- 3 Skills ausprobieren mit echten Tasks
- Output-Qualität bewerten
- Iterieren und verbessern

---

**Tipp für Claude Teams**: Speichere häufig genutzte Prompts als Snippets, damit du sie in Sekunden abrufen kannst!

**Letzte Aktualisierung**: 11. Februar 2026
