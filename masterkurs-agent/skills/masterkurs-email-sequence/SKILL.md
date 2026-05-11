---
name: masterkurs-email-sequence
description: |
  Erstelle Email-Kampagnen für verschiedene User-Segmente (Onboarding, Engagement, Winback). Nutze IMMER wenn User "Email-Serie", "Onboarding-Emails", "Newsletter-Sequenz" erwähnt.
compatibility:
  required_tools: [Write]
---

# Masterkurs Email Sequence

Erstellt Email-Kampagnen automatisch.

## Input
- **Segment**: Free/Paid/Churned User
- **Ziel**: Onboarding/Engagement/Upsell/Winback
- **Länge**: 3/5/7 Emails

## Template-Struktur

Speichere in: `/masterkurs-agent/email-campaigns/[segment]-[ziel]/`

```
├── sequence.json (Metadaten)
├── email-1.md
├── email-2.md
└── ...
```

## sequence.json Format

```json
{
  "name": "Free User Onboarding",
  "segment": "free",
  "goal": "onboarding",
  "emails": [
    {
      "day": 0,
      "subject_lines": ["Option A", "Option B"],
      "goal": "Willkommen + First Win",
      "cta": "Erste Lektion starten"
    }
  ]
}
```

## Email Template (Markdown)

```markdown
---
subject: [Subject Line A/B Test]
preheader: [First 50 chars preview]
send_day: 0
---

# Email [N]: [Name]

## Subject Lines (A/B Test)
- **Variante A**: [Text]
- **Variante B**: [Text]

## Preheader
[Text]

## Body (Plain Text Version)

Hallo {{first_name}},

[Absatz 1: Hook]

[Absatz 2: Value]

[Absatz 3: CTA]

Viele Grüße,
Cosmo

## Body (HTML Version)

<table width="600">
  <tr><td>[Hero Image]</td></tr>
  <tr><td>[Body]</td></tr>
  <tr><td><button>[CTA]</button></td></tr>
</table>

## CTA
**Button Text**: [Text]
**Link**: https://claude-code-masterkurs.de/[path]

## Success Metrics
- Open Rate Ziel: X%
- Click Rate Ziel: Y%
- Conversion Ziel: Z%
```

## Standard-Sequenzen

### 1. Free User Onboarding (5 Emails, 14 Tage)
Day 0: Willkommen
Day 2: Erste Lektion abschließen
Day 5: Community vorstellen
Day 10: Erfolgsgeschichte teilen
Day 14: Upgrade-Angebot (20% Rabatt)

### 2. Paid User Engagement (3 Emails/Woche)
Wöchentlich: Tutorial-Highlight
Wöchentlich: Community-Spotlight
Wöchentlich: Claude Code Tips

### 3. Churned User Winback (3 Emails, 21 Tage)
Day 0: "We miss you"
Day 7: "Was hat gefehlt?" (Survey)
Day 14: Special Comeback-Offer (50% Rabatt)

## Tone Guidelines
- Du-Form, freundlich
- Technisch akkurat, aber verständlich
- Keine Marketing-Floskeln
- Konkrete Beispiele
- Klare CTAs

---

## Detaillierter Workflow

### Step 1: Segment & Goal Analysis

**Input Validation**:
```
REQUIRED:
- Segment (Free/Paid/Churned/Trial)
- Goal (Onboarding/Engagement/Upsell/Winback/Retention)
- Länge (3/5/7 Emails)

OPTIONAL:
- Spezifisches Feature-Highlight
- Promotion/Rabatt (wenn applicable)
- Zeitfenster (14/21/30 Tage)
```

**Segment-Persona Mapping**:
```markdown
FREE USER:
- **Mindset**: Skeptisch, probiert nur aus
- **Pain**: "Ist das überhaupt für mich?"
- **Goal**: First Win schnell erreichen
- **Tonality**: Motivierend, nicht verkaufs-lastig

PAID USER:
- **Mindset**: Committed, will Wert sehen
- **Pain**: "Nutze ich das genug?"
- **Goal**: Aktivierung + Advanced Features zeigen
- **Tonality**: Professionell, wertorientiert

CHURNED USER:
- **Mindset**: Enttäuscht oder vergessen
- **Pain**: "Warum sollte ich zurückkommen?"
- **Goal**: Re-Engagement ohne Begging
- **Tonality**: Empathisch, ehrlich

TRIAL USER:
- **Mindset**: Evaluiert aktiv
- **Pain**: "Lohnt sich Paid?"
- **Goal**: Value demonstrieren, ROI zeigen
- **Tonality**: Beratend, transparent
```

**Goal-Framework**:
```
ONBOARDING:
→ Success Metric: % complete Lektion 1 in 48h
→ Email Focus: Quick Wins, Ease-of-Use
→ CTA: Action-orientiert ("Jetzt starten")

ENGAGEMENT:
→ Success Metric: Weekly Active Users
→ Email Focus: Tips, Community, New Features
→ CTA: Discovery-orientiert ("Entdecke X")

UPSELL:
→ Success Metric: Free→Paid Conversion Rate
→ Email Focus: Value, ROI, Social Proof
→ CTA: Commitment-orientiert ("Upgrade jetzt")

WINBACK:
→ Success Metric: Re-Activation Rate
→ Email Focus: "Was fehlt dir?", Special Offers
→ CTA: Low-Friction ("Schau mal rein")

RETENTION:
→ Success Metric: Churn Reduction
→ Email Focus: Success Stories, Advanced Features
→ CTA: Engagement-orientiert ("Probiere X aus")
```

### Step 2: Email-Sequenz Planning

**Timing-Strategie**:
```markdown
AGGRESSIVE (3 Emails, 7 Tage):
Day 0, Day 3, Day 7
→ Use for: Trial Users (deadline pressure)

STANDARD (5 Emails, 14 Tage):
Day 0, Day 2, Day 5, Day 10, Day 14
→ Use for: Free/Paid Onboarding

PATIENT (7 Emails, 30 Tage):
Day 0, Day 3, Day 7, Day 10, Day 14, Day 21, Day 30
→ Use for: Winback, Long-term Engagement
```

**Email-Arc-Struktur** (Story über Sequenz):
```
5-EMAIL SEQUENCE ARC:

Email 1: WELCOME
└→ "Du bist dabei!" (Excitement)

Email 2: FIRST WIN
└→ "So gehst du vor" (Activation)

Email 3: DEEPER VALUE
└→ "Hier wird's interessant" (Discovery)

Email 4: SOCIAL PROOF
└→ "Andere haben's geschafft" (Validation)

Email 5: CALL-TO-ACTION
└→ "Nächster Schritt?" (Conversion)
```

**Content-Mix** (pro Sequenz):
```
✅ 60% Educational (Tipps, Tutorials)
✅ 20% Social Proof (Testimonials, Case Studies)
✅ 20% Promotional (Offers, CTAs)

❌ NIEMALS >40% Promotional (wirkt spammy)
```

### Step 3: Subject Line & Preheader Creation

**Subject Line Framework** (A/B Testing):

```markdown
VARIANTE A: CURIOSITY-DRIVEN
- "Wie [Name] in 7 Tagen [Result] erreichte"
- "Das hast du übersehen..."
- "1 Trick, den 90% nicht kennen"
→ Open Rate: HOCH (Curiosity)
→ Click Rate: MITTEL (nicht immer relevant)

VARIANTE B: VALUE-DRIVEN
- "3 Claude Code Tips für [Specific Use-Case]"
- "Neu: [Feature] macht [Task] 10x schneller"
- "Deine nächste Lektion: [Topic]"
→ Open Rate: MITTEL (klarer Benefit)
→ Click Rate: HOCH (spezifischer Value)

VARIANTE C: URGENCY-DRIVEN
- "Nur noch 48h: [Offer]"
- "Dein Trial endet morgen"
- "Letzte Chance für [Benefit]"
→ Open Rate: SEHR HOCH (FOMO)
→ Click Rate: HOCH (wenn Offer stark)
→ ⚠️ RISIKO: Unsubscribes steigen

VARIANTE D: PERSONAL
- "{{first_name}}, hast du das gesehen?"
- "Für dich: [Personalized Recommendation]"
- "Dein Progress: [Metric]"
→ Open Rate: HOCH (Personalisierung)
→ Click Rate: MITTEL (muss relevant sein)
```

**Subject Line RULES**:
```
✅ DO:
- Unter 50 Zeichen (Mobile-optimiert)
- Keine CAPSLOCK (außer Akronyme wie "AI")
- Emojis sparsam (max 1 pro Subject)
- Testen mit Preview-Tools (Litmus)

❌ DON'T:
- Spam-Trigger-Words: "Kostenlos", "Jetzt kaufen", "$$$"
- Clickbait ohne Substanz ("Du glaubst nicht was...")
- Zu viele Sonderzeichen (!!! $$$ ???)
- Irreführende Behauptungen
```

**Preheader-Strategie**:
```markdown
Preheader = First 50-80 chars NACH Subject
→ Zeigt in Inbox neben Subject Line

GOOD Example:
Subject: "3 Claude Code Tricks für React"
Preheader: "useState, useEffect und Custom Hooks meistern."
→ Complement: Subject + Preheader = vollständiger Satz

BAD Example:
Subject: "3 Claude Code Tricks"
Preheader: "View in Browser | Unsubscribe"
→ Wasted Space: Standard-Text statt Value
```

### Step 4: Copy-Writing (Plain Text & HTML)

**Plain Text Version** (für maximale Deliverability):

```markdown
## Plain Text Template

Hallo {{first_name}},

[HOOK - 1 Satz, Problem oder Frage]

[VALUE PROP - 2-3 Sätze, was user lernt/bekommt]

[SOCIAL PROOF - Optional, 1-2 Sätze Testimonial]

[CTA - Klar, actionable, single-purpose]
→ [Link Text]: https://domain.com/path

[SIGNATURE - Persönlich, human]

Viele Grüße,
Cosmo

PS: [Optional, secondary CTA oder Bonus-Info]

---
Claude Code Masterkurs
[Unsubscribe](https://...)
```

**Copywriting-Prinzipien**:
```
✅ AIDA-Framework:
  - Attention (Hook)
  - Interest (Problem + Solution)
  - Desire (Benefits + Proof)
  - Action (CTA)

✅ EINEM Ziel pro Email:
  - 1 CTA, nicht 5
  - 1 Link, nicht 10
  - 1 Message, nicht Bauchladen

✅ Scannable:
  - Kurze Absätze (2-3 Zeilen max)
  - Bullet Points für Listen
  - Bold für Key-Terms

❌ Vermeiden:
  - Walls of Text (>5 Zeilen ohne Break)
  - Mehrdeutigkeit ("Vielleicht", "Eventuell")
  - Passive Voice ("Es wurde entwickelt" → "Wir haben entwickelt")
```

**HTML Version** (für visuelle Brands):

```html
<!-- Email HTML Template -->
<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: -apple-system, sans-serif;">

  <!-- Header -->
  <tr>
    <td style="padding: 20px; background: #f8f9fa;">
      <img src="https://domain.com/logo.png" alt="Logo" width="120">
    </td>
  </tr>

  <!-- Hero Image (optional) -->
  <tr>
    <td>
      <img src="https://domain.com/hero.jpg" alt="Hero" width="600" style="display: block;">
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding: 40px 30px;">

      <h1 style="font-size: 24px; margin-bottom: 20px;">
        {{email_heading}}
      </h1>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        {{body_paragraph_1}}
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        {{body_paragraph_2}}
      </p>

      <!-- CTA Button -->
      <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
        <tr>
          <td style="background: #007bff; border-radius: 5px;">
            <a href="{{cta_link}}" style="display: inline-block; padding: 15px 30px; color: #ffffff; text-decoration: none; font-weight: bold;">
              {{cta_text}}
            </a>
          </td>
        </tr>
      </table>

      <p style="font-size: 14px; color: #666;">
        Viele Grüße,<br>
        Cosmo
      </p>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding: 20px; background: #f8f9fa; text-align: center; font-size: 12px; color: #999;">
      <p>Claude Code Masterkurs | office@cittasana.de</p>
      <p>
        <a href="{{unsubscribe_link}}" style="color: #999;">Abmelden</a>
      </p>
    </td>
  </tr>

</table>
```

**HTML Best Practices**:
```
✅ Table-based Layout (nicht div/flex)
✅ Inline CSS (externe Stylesheets funktionieren nicht)
✅ Fallback-Fonts (-apple-system, Arial, sans-serif)
✅ Alt-Text für alle Images (Accessibility)
✅ Responsive (max-width für Mobile)
✅ Dark Mode Support (prefers-color-scheme)

❌ JavaScript (blocked von Email-Clients)
❌ CSS Animations (nicht supported)
❌ Background Images (unreliable)
❌ Custom Fonts (langsame Load-Zeit)
```

### Step 5: A/B Testing Setup

**Testing-Strategie**:

```markdown
SINGLE-VARIABLE TESTING (empfohlen):

TEST 1: Subject Lines
- 50% bekommen Variante A
- 50% bekommen Variante B
- Winner nach 2h → Rest bekommt Winner

TEST 2: CTA Text
- "Jetzt starten" vs "Erste Lektion ansehen"
- Measure: Click-Rate

TEST 3: Timing
- Send Day 2 vs Day 3
- Measure: Open + Click Rate

NEVER: Multi-Variable Tests (zu komplex für Auswertung)
```

**Winning-Kriterien**:
```
STATISTICALLY SIGNIFICANT:
- Sample Size: Min 100 Empfänger pro Variante
- Difference: Min 10% Lift
- Confidence: 95% (p < 0.05)

Example:
- Variante A: 20% Open Rate (n=500)
- Variante B: 28% Open Rate (n=500)
- Lift: +40% relative (+8% absolute)
→ Winner: Variante B (send to remaining 8000)
```

**Testing-Tools Integration**:
```json
{
  "ab_test": {
    "enabled": true,
    "variable": "subject_line",
    "variants": [
      {
        "id": "A",
        "subject": "3 Claude Code Tricks für React",
        "split": 50
      },
      {
        "id": "B",
        "subject": "React Hooks: 3 Anfänger-Fehler vermeiden",
        "split": 50
      }
    ],
    "winning_metric": "open_rate",
    "test_duration_hours": 2,
    "min_sample_size": 100
  }
}
```

### Step 6: Analytics & Success Metrics

**Key Metriken pro Email**:

```markdown
OPEN RATE:
- Formel: (Öffnungen / Zugestellt) × 100
- Benchmark Free Onboarding: 40-50%
- Benchmark Paid Engagement: 30-40%
- Benchmark Winback: 20-30%

CLICK RATE (CTR):
- Formel: (Klicks / Öffnungen) × 100
- Benchmark: 15-25% (von Opens)
- Optimierung: Single CTA besser als Multiple

CLICK-TO-OPEN RATE (CTOR):
- Formel: (Unique Clicks / Unique Opens) × 100
- Besser als CTR (berücksichtigt nur Leser)
- Benchmark: 20-35%

CONVERSION RATE:
- Formel: (Conversions / Zugestellt) × 100
- Definition von "Conversion":
  * Onboarding: Lektion 1 completed
  * Upsell: Free → Paid
  * Winback: Re-Activation (Login)
- Benchmark: 2-5% (highly variable)

UNSUBSCRIBE RATE:
- Formel: (Unsubscribes / Zugestellt) × 100
- Healthy: <0.5%
- Warning: >1%
- Critical: >2% (Content/Frequency-Problem)

SPAM COMPLAINT RATE:
- Formel: (Spam Markierungen / Zugestellt) × 100
- Threshold: <0.1% (sonst Deliverability-Risk)
```

**Sequenz-Level Metriken**:

```markdown
SEQUENCE COMPLETION RATE:
- % die alle Emails der Sequenz bekommen (nicht unsubscribed)
- Target: >90%

EMAIL-TO-EMAIL ENGAGEMENT DECAY:
- Wie stark sinkt Open Rate über Sequenz?
- Healthy: <5% pro Email
- Problem: >10% pro Email (Content nicht relevant)

GOAL ACHIEVEMENT RATE:
- % die Sequenz-Ziel erreichen
- Onboarding: 40% complete Lektion 1
- Upsell: 10% convert zu Paid
- Winback: 15% re-activate

TIME-TO-CONVERT:
- Durchschnittliche Days bis Conversion
- Hilft: Optimal Timing für Follow-Ups finden
```

**Reporting-Template**:

```markdown
# Email Sequence Performance Report

**Sequenz**: Free User Onboarding (5 Emails, 14 Tage)
**Zeitraum**: 2026-02-01 bis 2026-02-28
**Empfänger**: 850 neue Free Users

---

## Overall Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Avg Open Rate | 40% | 43% | ✅ |
| Avg CTR | 20% | 18% | ⚠️ |
| Sequence Completion | 90% | 88% | ⚠️ |
| Goal Achievement (Lektion 1) | 40% | 35% | ❌ |
| Unsubscribe Rate | <0.5% | 0.3% | ✅ |

---

## Email-by-Email Breakdown

### Email 1: Welcome (Day 0)
- Sent: 850
- Open Rate: 52% ✅ (Target: 50%)
- CTR: 28% ✅ (Target: 25%)
- Winner: Subject B ("Du bist dabei! 🎉")

### Email 2: First Win (Day 2)
- Sent: 847 (-3 unsubscribed)
- Open Rate: 45% ✅
- CTR: 22% ✅
- Note: CTA "Jetzt starten" performed better than "Los geht's"

### Email 3: Community (Day 5)
- Sent: 842
- Open Rate: 38% ⚠️ (Target: 40%)
- CTR: 15% ❌ (Target: 20%)
- Issue: Community-Thema weniger interessant als erwartet

### Email 4: Success Story (Day 10)
- Sent: 838
- Open Rate: 41% ✅
- CTR: 20% ✅
- Winner: Social Proof wirkt gut

### Email 5: Upgrade Offer (Day 14)
- Sent: 835
- Open Rate: 40% ✅
- CTR: 16% ⚠️
- Conversions: 29 (3.5% → ❌ Target: 5%)

---

## Insights & Actions

**Was lief gut**:
- ✅ Open Rates durchgehend stark
- ✅ Low Unsubscribe (Content relevant)
- ✅ Email 1+2 sehr performant

**Was lief schlecht**:
- ❌ Email 3 (Community) schwach → Redesign nötig
- ❌ Final Conversion unter Target
- ⚠️ CTR sinkt zu stark über Sequenz

**Action Items**:
1. [ ] Email 3 neu schreiben: Fokus auf "Hilfe bekommen" statt "Community beitreten"
2. [ ] Email 5 Offer testen: 20% statt 10% Rabatt?
3. [ ] Zusätzliche Email nach Day 7 einfügen: "Quick Win 2" für Re-Engagement
4. [ ] A/B Test: Email 5 Timing (Day 10 vs Day 14?)

**Next Steps**:
- Iterate v2 der Sequenz mit Learnings
- Test neue Email 3 mit Sample (n=100)
- Monitor Conversion Rate über nächste 30 Tage
```

## Edge Cases & Error Handling

### Email-Länge zu lang/kurz

**Problem**: Plain Text Version ist >1000 Wörter

**Detection**:
```bash
WORD_COUNT=$(wc -w < email-1.md)
if [ $WORD_COUNT -gt 500 ]; then
    echo "⚠️ Email zu lang: $WORD_COUNT Wörter (max 500)"
fi
```

**Lösung**: Split in 2 Emails oder kürzen
```
OPTIMAL:
- Onboarding Email: 200-300 Wörter
- Engagement Email: 150-250 Wörter
- Promotional Email: 100-200 Wörter
```

### Spam-Trigger-Words

**Problem**: Email enthält Spam-Wörter

**Spam-Filter-Checklist**:
```
❌ AVOID:
- "Kostenlos", "Gratis", "Free"
- "Jetzt kaufen", "Buy now"
- "$$$", "€€€", "Geld verdienen"
- "Garantiert", "100%", "Risk-free"
- ALL CAPS WORDS (außer Akronyme)
- Zu viele Ausrufezeichen!!!

✅ USE INSTEAD:
- "Inklusive" statt "Kostenlos"
- "Angebot ansehen" statt "Jetzt kaufen"
- Konkrete Zahlen statt "100%"
```

**Spam-Score Testing**:
```bash
# Use Mail-Tester.com API (vor Versand)
curl -X POST https://www.mail-tester.com/check-email \
  -d "email=$(cat email-1.md)" \
  -d "format=json"

# Score >7/10 = OK
# Score <7/10 = Redesign nötig
```

### GDPR-Compliance

**CRITICAL Requirements**:

```markdown
✅ MUST HAVE (gesetzlich verpflichtend):

1. **Double Opt-In**:
   - User muss Email bestätigen BEVOR Sequenz startet
   - Confirmation-Link in Welcome-Email

2. **Unsubscribe-Link**:
   - In JEDEM Email (Footer)
   - 1-Click Unsubscribe (kein Login nötig)
   - Sofort wirksam (<10 Sekunden)

3. **Data Declaration**:
   - Was speichern wir? (Email, Name, Verhalten)
   - Wo speichern wir? (Server-Location)
   - Wer hat Zugriff? (Team, Tools)

4. **Right to be Forgotten**:
   - User kann Daten-Deletion anfordern
   - 30 Tage Umsetzung (gesetzlich)

5. **Consent Management**:
   - User kann Consent zurückziehen
   - Granular: Email-Typen einzeln abbestellen
```

**Footer-Template** (GDPR-compliant):

```html
<p style="font-size: 12px; color: #999;">
  Du erhältst diese Email, weil du dich für den Claude Code Masterkurs registriert hast.<br>
  <a href="{{manage_preferences_link}}">Email-Einstellungen anpassen</a> |
  <a href="{{unsubscribe_link}}">Abmelden</a><br><br>

  Claude Code Masterkurs<br>
  Cittasana, Musterstraße 123, 12345 Berlin<br>
  office@cittasana.de
</p>
```

### Unsubscribe-Spike

**Problem**: >2% Unsubscribe Rate

**Root Cause Analysis**:
```
MÖGLICHE URSACHEN:
1. Email-Frequenz zu hoch
   → Lösung: Spacing erhöhen (Day 2 → Day 3)

2. Content nicht relevant
   → Lösung: Segment besser (Free vs Paid)

3. Subject Line clickbait
   → Lösung: Honest Subject Lines

4. Zu viel Promotion
   → Lösung: 60/20/20 Mix (Education/Social/Promo)

5. Technische Probleme
   → Lösung: Check Formatting, Broken Links
```

**Recovery-Strategy**:
```markdown
SOFORT:
- [ ] Pause Sequenz für 24h (emergency stop)
- [ ] Analyze letzte 3 Emails (was war anders?)
- [ ] Segment-specific Check (ein Segment betroffen?)

KURZ-FRISTIG (48h):
- [ ] Fix identified Issue
- [ ] Test Email mit kleinem Sample (n=50)
- [ ] Resume nur wenn Test OK

LANG-FRISTIG:
- [ ] Win-back Kampagne für Unsubscribed
- [ ] "Why did you leave?" Survey (opt-in)
- [ ] Learnings dokumentieren
```

## Performance-Optimierung

### Batch-Email Creation

Erstelle alle Emails einer Sequenz parallel:

```bash
# PARALLEL (recommended):
Write email-1.md &
Write email-2.md &
Write email-3.md &
Write email-4.md &
Write email-5.md &
Write sequence.json &
wait

# Speedup: ~6x (6 files in parallel)
```

### Template-Reuse

Nutze Basis-Templates für gemeinsame Patterns:

```
/masterkurs-agent/.templates/emails/
├── onboarding-day-0.md (Welcome Pattern)
├── onboarding-day-2.md (First Win Pattern)
├── onboarding-day-14.md (Upgrade Offer Pattern)
├── engagement-weekly.md (Tip Pattern)
└── winback-day-0.md (We Miss You Pattern)
```

**Usage**: Copy + personalize statt from-scratch

### ConvertKit/Mailchimp Export

Generiere platform-ready Formats:

```json
{
  "platform": "convertkit",
  "sequence": {
    "name": "Free User Onboarding",
    "emails": [
      {
        "subject": "...",
        "content_html": "...",
        "content_text": "...",
        "delay_days": 0,
        "tags": ["free-user", "onboarding"]
      }
    ]
  }
}
```

→ Direkt importierbar ohne Manual Copy-Paste

## Quality Checks

**Vor Deployment prüfen**:

```markdown
## ✅ Email Sequence Quality Checklist

### Content Quality:
- [ ] **Subject Lines**: Unter 50 Zeichen
- [ ] **Preheaders**: Unter 80 Zeichen, complement Subject
- [ ] **Body Length**: 200-500 Wörter (nicht >800)
- [ ] **CTA**: Klar, single-purpose, actionable
- [ ] **Personalization**: {{first_name}} korrekt verwendet
- [ ] **Links**: Alle funktionieren (keine 404s)
- [ ] **Tone**: Consistent mit Brand-Guidelines

### Technical Quality:
- [ ] **Plain Text**: Vorhanden & formatiert
- [ ] **HTML**: Table-based, Inline CSS, Responsive
- [ ] **Images**: Alt-Text vorhanden, hosted (nicht local paths)
- [ ] **Unsubscribe**: In jedem Email Footer
- [ ] **GDPR**: Consent, Data-Declaration, Right-to-Delete
- [ ] **Spam Score**: <7/10 (mail-tester.com)

### Testing:
- [ ] **Litmus/Email on Acid**: Rendering in 20+ Clients
- [ ] **Mobile Preview**: iPhone, Android (70% öffnen Mobile)
- [ ] **Dark Mode**: Readable in Dark Mode
- [ ] **Broken Links**: Alle URLs checked (curl -I)
- [ ] **Personalization Test**: {{variables}} werden ersetzt

### A/B Test Setup:
- [ ] **Variants**: Klar definiert (was wird getestet?)
- [ ] **Winning Metric**: Open/Click/Conversion?
- [ ] **Sample Size**: Min 100 pro Variante
- [ ] **Duration**: 2-4h vor Rollout

### Sequence-Level:
- [ ] **Arc**: Story-Flow über alle Emails?
- [ ] **Timing**: Spacing macht Sinn? (nicht zu dicht)
- [ ] **Goal Alignment**: Jedes Email→Sequenz-Goal?
- [ ] **Exit Points**: Was wenn User unsubscribes nach Email 2?
```

**Automated Checks** (Script):

```bash
#!/bin/bash
# check-email-sequence.sh

CAMPAIGN_DIR="$1"

echo "📧 Email Sequence Quality Check"

# 1. Check all emails exist
for i in {1..5}; do
    FILE="$CAMPAIGN_DIR/email-$i.md"
    if [ -f "$FILE" ]; then
        echo "✓ email-$i.md exists"

        # Check word count
        WORDS=$(wc -w < "$FILE")
        if [ $WORDS -gt 800 ]; then
            echo "  ⚠️ Too long: $WORDS words (max 800)"
        elif [ $WORDS -lt 100 ]; then
            echo "  ⚠️ Too short: $WORDS words (min 100)"
        fi

        # Check for personalization
        if ! grep -q "{{first_name}}" "$FILE"; then
            echo "  ⚠️ No personalization found"
        fi

        # Check for CTA
        if ! grep -qE "https?://" "$FILE"; then
            echo "  ⚠️ No links/CTA found"
        fi
    else
        echo "✗ email-$i.md MISSING"
    fi
done

# 2. Check sequence.json
if [ -f "$CAMPAIGN_DIR/sequence.json" ]; then
    echo "✓ sequence.json exists"

    # Validate JSON
    if jq empty "$CAMPAIGN_DIR/sequence.json" 2>/dev/null; then
        echo "  ✓ Valid JSON"
    else
        echo "  ✗ Invalid JSON syntax"
    fi
else
    echo "✗ sequence.json MISSING"
fi

echo "\n✅ Quality check complete"
```

## Beispiel-Outputs

### Vollständige Sequenz: Free User Onboarding (5 Emails, 14 Tage)

```
./email-campaigns/free-user-onboarding/
├── sequence.json
├── email-1-welcome.md (Day 0)
├── email-2-first-win.md (Day 2)
├── email-3-community.md (Day 5)
├── email-4-success-story.md (Day 10)
└── email-5-upgrade-offer.md (Day 14)
```

**sequence.json**:
```json
{
  "name": "Free User Onboarding",
  "segment": "free",
  "goal": "onboarding",
  "success_metric": "lektion_1_completed",
  "target_conversion": "10% to paid",
  "total_emails": 5,
  "duration_days": 14,
  "emails": [
    {
      "email_id": 1,
      "send_day": 0,
      "subject_lines": {
        "variant_a": "Willkommen beim Claude Code Masterkurs! 🎉",
        "variant_b": "Du bist dabei - deine ersten Schritte mit Claude Code"
      },
      "goal": "Activation - First Login",
      "cta": "Zur Dashboard gehen",
      "expected_open_rate": 0.50,
      "expected_ctr": 0.30
    },
    {
      "email_id": 2,
      "send_day": 2,
      "subject_lines": {
        "variant_a": "Deine erste Lektion wartet auf dich",
        "variant_b": "So erstellst du deinen ersten Code mit Claude"
      },
      "goal": "Complete Lektion 1",
      "cta": "Lektion 1 starten",
      "expected_open_rate": 0.45,
      "expected_ctr": 0.25
    },
    {
      "email_id": 3,
      "send_day": 5,
      "subject_lines": {
        "variant_a": "Triff andere Claude Code Lerner",
        "variant_b": "Hilfe gefällig? Unsere Community hilft dir"
      },
      "goal": "Join Discord Community",
      "cta": "Discord beitreten",
      "expected_open_rate": 0.40,
      "expected_ctr": 0.20
    },
    {
      "email_id": 4,
      "send_day": 10,
      "subject_lines": {
        "variant_a": "Wie Max in 7 Tagen seine erste App baute",
        "variant_b": "Von Anfänger zu App-Creator: Eine Erfolgsgeschichte"
      },
      "goal": "Inspiration + Motivation",
      "cta": "Erfolgsgeschichte lesen",
      "expected_open_rate": 0.40,
      "expected_ctr": 0.22
    },
    {
      "email_id": 5,
      "send_day": 14,
      "subject_lines": {
        "variant_a": "Exklusiv für dich: 20% auf den Masterkurs",
        "variant_b": "Bereit für mehr? Hier ist dein Special Offer"
      },
      "goal": "Conversion - Free to Paid",
      "cta": "Jetzt upgraden (20% Rabatt)",
      "expected_open_rate": 0.40,
      "expected_ctr": 0.18,
      "expected_conversion": 0.05
    }
  ],
  "created": "2026-02-11",
  "version": "1.0"
}
```

**email-1-welcome.md** (Excerpt):
```markdown
---
subject: Willkommen beim Claude Code Masterkurs! 🎉
preheader: Deine erste Lektion ist ready - lass uns anfangen.
send_day: 0
---

# Email 1: Willkommen

## Subject Lines (A/B Test)
- **Variante A**: Willkommen beim Claude Code Masterkurs! 🎉
- **Variante B**: Du bist dabei - deine ersten Schritte mit Claude Code

## Preheader
Deine erste Lektion ist ready - lass uns anfangen.

---

## Body (Plain Text Version)

Hallo {{first_name}},

willkommen beim Claude Code Masterkurs! 🎉

Du hast gerade den ersten Schritt gemacht, um KI-gestütztes Programmieren zu meistern. Und ich verspreche dir: Es wird spannend.

**Was dich erwartet:**
- 27 strukturierte Lektionen (von Basics bis Advanced)
- Live-Playground für sofortiges Experimentieren
- Challenges, die dich wirklich weiterbringen
- Eine Community, die dir hilft wenn du stuck bist

**Dein nächster Schritt:**
Geh jetzt zu deinem Dashboard und starte Lektion 1. Du wirst in 15 Minuten deinen ersten Code mit Claude erstellen - versprochen.

→ Zum Dashboard: https://claude-code-masterkurs.de/dashboard

Viel Erfolg & viel Spaß beim Coden!

Cosmo
Founder, Claude Code Masterkurs

PS: Stuck? Schreib mir einfach auf office@cittasana.de - ich helfe gern!

---

## Body (HTML Version)

[HTML Table mit Hero Image, formatiertem Text, CTA-Button]

---

## CTA
**Button Text**: Zum Dashboard
**Link**: https://claude-code-masterkurs.de/dashboard

---

## Success Metrics (Target)
- Open Rate: 50%
- Click Rate: 30%
- Dashboard-Visit: 25%
```

### Edge Case: Winback-Sequenz mit Survey

```
./email-campaigns/churned-user-winback/
├── sequence.json
├── email-1-we-miss-you.md (Day 0)
├── email-2-survey.md (Day 7)
└── email-3-comeback-offer.md (Day 14)
```

**email-2-survey.md** (mit Typeform-Integration):
```markdown
---
subject: Kurze Frage: Was hat dir gefehlt?
preheader: 2 Minuten Survey - und ein Geschenk von uns.
send_day: 7
---

# Email 2: Feedback Survey

## Subject Lines (A/B Test)
- **Variante A**: Kurze Frage: Was hat dir gefehlt?
- **Variante B**: {{first_name}}, deine Meinung zählt (+ Belohnung)

---

## Body (Plain Text)

Hallo {{first_name}},

vor einer Woche habe ich dir geschrieben, dass wir dich vermissen. Heute habe ich eine ehrliche Frage:

**Was hat dir am Masterkurs gefehlt?**

Ich würde gern verstehen, warum du gegangen bist - nicht um dich zurückzuholen (obwohl ich mich freuen würde), sondern um den Kurs besser zu machen.

Als Dankeschön für dein Feedback bekommst du:
→ Ein kostenloses E-Book "Claude Code Pro-Tips" (Wert: €19)
→ UND falls du zurückkommst: 50% Rabatt für 3 Monate

Survey ausfüllen (2 Min): https://forms.xyz/masterkurs-feedback

Danke, dass du dir Zeit nimmst.

Cosmo

PS: Das Feedback ist komplett anonym, wenn du willst.

---

## Typeform Integration

**Survey Questions**:
1. Warum hast du den Masterkurs verlassen?
   - [ ] Zu wenig Zeit
   - [ ] Zu schwierig
   - [ ] Zu teuer
   - [ ] Fehlende Features: _____
   - [ ] Anderer Grund: _____

2. Was hätte dich zum Bleiben bewogen?
   [Freitext]

3. Würdest du zurückkommen für 50% Rabatt?
   - [ ] Ja, sofort
   - [ ] Vielleicht später
   - [ ] Nein, der Kurs passt nicht

4. Optional: Email für E-Book & Rabatt-Code
   [Email Input]

---

## Success Metrics
- Open Rate: 25% (niedriger wegen Churned-Segment)
- Survey Completion: 10%
- Reactivation Intent: 30% sagen "Ja" oder "Vielleicht"
```

### Batch-Creation: Engagement-Serie (3 Emails/Woche für 4 Wochen)

**Output**: 12 Emails in einem Run

```
./email-campaigns/paid-user-engagement/
├── sequence.json (12 Emails)
├── week-1/
│   ├── monday-tutorial.md
│   ├── wednesday-community.md
│   └── friday-tips.md
├── week-2/
│   ├── monday-tutorial.md
│   ├── wednesday-community.md
│   └── friday-tips.md
├── week-3/
│   └── [same structure]
└── week-4/
    └── [same structure]
```

**Pattern-Based Generation**:
```markdown
MONDAY = Tutorial-Highlight (New Feature, Deep-Dive)
WEDNESDAY = Community-Spotlight (Success Story, Q&A)
FRIDAY = Quick Tips (3 Pro-Tips, 5-Min Read)

→ Automatisch für 4 Wochen = 12 Emails
→ Consistent Structure = schnellere Creation
```

## Success Metrics (KPIs)

**Nach Deployment tracken**:

```markdown
## Campaign: Free User Onboarding v1.0

### Input:
- Segment: Free Users
- Sample Size: 850
- Duration: 14 Days (5 Emails)

### Delivery Metrics:
- Emails Sent: 4,235 (850 × 5 avg, considering unsubscribes)
- Delivery Rate: 98.5% (4,172 delivered)
- Bounce Rate: 1.5% (63 bounces)
- Spam Rate: 0.08% (3 complaints) ✅

### Engagement Metrics:
- Avg Open Rate: 43% (Target: 40%) ✅
- Avg Click Rate: 18% (Target: 20%) ⚠️
- Avg CTOR: 42% (Target: 35%) ✅
- Unsubscribe Rate: 0.3% (Target: <0.5%) ✅

### Conversion Metrics:
- Lektion 1 Completed: 298 (35% of 850) ❌ (Target: 40%)
- Free→Paid Conversions: 29 (3.4%) ❌ (Target: 5%)
- Revenue Generated: €696 (29 × €24)

### A/B Test Winners:
- Email 1 Subject: Variante A (+12% Open Rate)
- Email 2 CTA: "Jetzt starten" (+8% CTR vs "Los geht's")
- Email 5 Timing: Day 14 (vs Day 10, +15% Conversion)

### ROI:
- Cost: ~€85 (ConvertKit + Design-Zeit)
- Revenue: €696
- ROI: 719% ✅

### Learnings:
- ✅ Subject Lines mit Emojis performen besser
- ✅ Social Proof (Email 4) hoher Engagement
- ❌ Email 3 (Community) schwach → Redesign
- ❌ Conversion unter Target → Offer testen (30% statt 20%)
```

Speichere IMMER in: `/masterkurs-agent/email-campaigns/`
