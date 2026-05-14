---
name: masterkurs-social-media
description: |
  Erstelle 30-Tage Social Media Content-Kalender für LinkedIn/Twitter/Instagram, jetzt track-aware für Multi-Track Plattform.
  Nutze wenn User "Social Media Content", "30-Tage-Plan", "LinkedIn Posts", "codex social calendar",
  "freelancer LinkedIn posts", "local-llm twitter thread", "claude-desktop instagram carousel" oder einen track-spezifischen
  Marketing-Launch (Codex Wochen 1-6, Local-LLM Wochen 7-12, Claude Desktop Wochen 13-18) erwähnt.
compatibility:
  required_tools: [Write]
---

# Masterkurs Social Media (Multi-Track)

Erstellt 30-Tage Content-Kalender, parametrisiert pro Lerntrack der Multi-Track Plattform.

## Arguments

| Argument | Default | Werte | Beschreibung |
|---|---|---|---|
| `--track <key>` | `claude-code` | `claude-code` · `claude-desktop` · `codex` · `local-llm` · `freelancer` | Track-Key — bestimmt Voice, Hashtags, Content-Pillars und Output-Namespace. |
| `--platform` | (alle aus Track-Mix) | `linkedin` · `twitter` · `instagram` | Optional Platform-Filter (sonst Track-Default-Mix). |
| `--month` | aktuelles Jahr-Monat | `YYYY-MM` | Monat für den der Kalender erstellt wird. |
| `--frequency` | `daily` | `daily` · `3x-week` · `weekly` | Posting-Frequenz. |

### Trigger-Phrasen (Multi-Track)
- `"Social Media Content für [track]"` · `"30-Tage-Plan für [track]"` · `"[track] LinkedIn Posts"`
- `"codex social calendar"` · `"freelancer LinkedIn posts"` · `"local-llm twitter thread"`
- `"claude-desktop instagram carousel"` · `"launch staggering content"` (-> nimmt aktuellen Launch-Track aus Phase-6-Plan)

### Wo der Skill den Track-Voice liest
Vor jedem Generation-Run liest der Skill **zwingend**:
```
masterkurs-agent/track-configs/<track-key>/social-voice.md
```
Daraus ziehen wir Hashtags, Hook-Templates, Content-Pillars, Tone-Notes und Kanal-Defaults.
Fehlt die Datei → Skill bricht mit `ERROR: track-config nicht gefunden` ab und schlägt vor, sie neu anzulegen.

## Track-aware Platform Mix

Welche Plattform pro Track *primär* bzw. *sekundär* befüllt wird (entspricht Phase-6-Launch-Plan):

| Track | Primary Platforms | Secondary Platform | Format-Schwerpunkt |
|---|---|---|---|
| `claude-code` | LinkedIn + Twitter/X | Instagram | technische Threads, Code-Snippets, Terminal-Recordings |
| `claude-desktop` | LinkedIn + Twitter/X | Instagram | Projects/Artifacts-Screenshots, UI-Walkthroughs |
| `codex` | LinkedIn + Twitter/X | Instagram | CLI-Recordings, Multi-Agent-Tree-Vergleiche |
| `local-llm` | LinkedIn + Twitter/X | Instagram | Hardware-Benchmarks, Quantization-Tabellen, Setup-Reels |
| `freelancer` | LinkedIn + Instagram | Twitter/X | Case-Studies, Founder-Story, Pricing-Story-Threads |

> Tech-Tracks (`claude-code`, `claude-desktop`, `codex`, `local-llm`) priorisieren LinkedIn + Twitter (Devs lesen dort Code).
> `freelancer` priorisiert LinkedIn + Instagram (Business-Audience + Personal-Brand-Carousels), Twitter ist sekundär.

## Track-aware Content Mix

| Track-Gruppe | Educational | News | Community | Case-Study | Positioning |
|---|---|---|---|---|---|
| Tech-Tracks (`claude-code`, `claude-desktop`, `codex`, `local-llm`) | **60%** | **20%** | **20%** | — | — |
| `freelancer` | **30%** | — | — | **50%** | **20%** |

**Tech-Track-Definition:**
- *Educational* — Workflows, Skills, Tutorials, Quick-Tips (siehe `social-voice.md` content-pillars).
- *News* — Releases, Versions-Updates, Skill-Marketplace-News, Modell-Releases.
- *Community* — User-Showcases, Setup-Vergleiche, Challenge-Recaps.

**Freelancer-Track-Definition:**
- *Case-Study* — Echte Mandate, Pricing-Diskussionen, Vorher/Nachher-Cases (anonymisiert).
- *Educational* — Akquise-Frameworks, Pricing-Modelle, Tool-Stacks für Solo-Consultants.
- *Positioning* — Personal-Brand, Founder-Story, Industry-Takes.

> Falls der User explizit eine andere Mix-Verteilung möchte, override via `--mix educational=50,news=30,community=20`.

## Output

Speichere in: `masterkurs-agent/social-media/<track>/<YYYY-MM>-calendar.md`

Pro Generation-Run entsteht ein Track-Namespace:

```
masterkurs-agent/social-media/<track>/
├── <YYYY-MM>-calendar.md           # menschenlesbarer 30-Tage-Plan
├── <YYYY-MM>-content-calendar.json # Maschinen-lesbar (Buffer/Hootsuite-kompatibel)
├── posts/
│   ├── <YYYY-MM-DD>-post-01-[platform]-[type].md
│   ├── <YYYY-MM-DD>-post-02-[platform]-[type].md
│   └── ...
└── assets/ (optional: Grafiken/Screenshots/Reel-Storyboards)
```

**Beispiele konkret:**
- `masterkurs-agent/social-media/codex/2026-06-calendar.md` (Codex-Launch Woche 1-4)
- `masterkurs-agent/social-media/local-llm/2026-08-calendar.md` (Local-LLM-Launch Woche 7-10)
- `masterkurs-agent/social-media/freelancer/2026-09-calendar.md` (Freelancer-Track Evergreen)

## Post Template

```markdown
---
date: 2026-02-11
track: claude-code
platform: linkedin
post_type: educational         # tech: educational|news|community  ·  freelancer: case-study|educational|positioning
content_pillar: workflows      # aus track-configs/<track>/social-voice.md
scheduled_time: "09:00"
---

# Post [N]: [Titel]

## Copy

[Hier der Post-Text — Hook aus track-configs/<track>/social-voice.md]

**Hashtags**: [aus track-configs/<track>/social-voice.md, max. Platform-Limit]

## Visuals
- Type: Screenshot/Graphic/Video
- Description: [Was zeigen?]
- Dimensions: [Platform-spezifisch]

## Engagement Strategy
- **Call-to-Action**: [Text]
- **Expected Engagement**: [Likes/Comments/Shares Ziel]

## A/B Variants
### Variante A (Educational)
[Text]

### Variante B (Promotional)
[Text]
```

## Platform-Guidelines (Cross-Track-Defaults)

> Diese Defaults gelten plattformweit. Track-spezifische Overrides (Tone, Hashtag-Set, Hook-Stil) kommen
> aus `track-configs/<track>/social-voice.md` und gewinnen immer.

### LinkedIn (Professional)
- **Länge**: Max 1300 Zeichen (Sweet-Spot 1100-1300)
- **Tone**: Professionell, lehrreich (Tech-Tracks) · erfolgsorientiert-direkt (Freelancer)
- **Best Time**: Di-Do 09:00-11:00
- **Hashtags**: 3-5 (aus `social-voice.md`)
- **Format**: Text + Screenshot/Code-Snippet (Tech) · Story + Carousel (Freelancer)

### Twitter/X (Short & Punchy)
- **Länge**: Max 280 Zeichen (Thread 3-7 Tweets)
- **Tone**: Casual, direkt (Tech) · pointiert-kollegial (Freelancer)
- **Best Time**: Täglich 08:00, 13:00, 18:00
- **Hashtags**: 1-2 pro Tweet (aus `social-voice.md`)
- **Format**: Thread mit Code-Snippets/CLI-Recordings (Tech) · Pricing-/Akquise-Threads (Freelancer)

### Instagram (Visual)
- **Caption**: Max 2200 Zeichen
- **Tone**: Freundlich, visuell · für Freelancer: Personal-Brand, Founder-First-Person
- **Best Time**: Mo-Fr 18:00-20:00
- **Hashtags**: 10-15 (aus `social-voice.md` + Long-Tail)
- **Format**:
  - Tech-Tracks: Terminal-Recordings, Screenshot-Carousels, MCP/Setup-Reels (15-30 Sek)
  - Freelancer: Story-Carousels (8-10 Slides), Founder-Talking-Head-Reels (30 Sek)

### Wo der track-spezifische Mix herkommt
Die **prozentualen Content-Mix-Werte** stehen *nicht* mehr platform-bezogen hier, sondern track-bezogen (siehe Section
"Track-aware Content Mix" oben). Tech-Tracks: 60/20/20. Freelancer: 50/30/20.

## 30-Tage Beispiel-Plan (Tech-Track Vorlage)

### Woche 1: Launch-Phase
- Tag 1: Ankündigung (track-spezifisch, Hook 1 aus `social-voice.md`)
- Tag 2: Feature-Highlight 1 (Pillar 1)
- Tag 3: User-Testimonial / Community-Showcase
- Tag 4: Behind-the-Scenes / Setup-Walkthrough
- Tag 5: Tutorial-Snippet (Pillar 2)
- Tag 6-7: News-Update + Community-Q&A

### Woche 2-4: [Struktur wiederholt, rotierende Pillars]

> **Freelancer-Track** nutzt eine andere Wochenstruktur:
> Tag 1 Case-Study · Tag 2 Pricing-Take · Tag 3 Akquise-Tip · Tag 4 Founder-Story-Slice
> Tag 5 Client-Management-Frame · Tag 6-7 Behind-the-Scenes / Q&A.

## Phase-6 Launch-Staggering Mapping

Phase-6 des Multi-Track-Plans staffelt die Marketing-Launches über 18 Wochen. Dieser Skill liefert pro Launch-Fenster
einen Track-spezifischen 30-Tage-Kalender:

| Wochen | Track | Skill-Aufruf |
|---|---|---|
| 1-6 | `codex` | `--track codex --month <launch-monat>` |
| 7-12 | `local-llm` | `--track local-llm --month <launch-monat>` |
| 13-18 | `claude-desktop` | `--track claude-desktop --month <launch-monat>` |
| Evergreen | `claude-code` | `--track claude-code --month <monat>` |
| Evergreen | `freelancer` | `--track freelancer --month <monat>` |

## Automatisierung
- **Scheduling**: Buffer/Hootsuite-kompatibel
- **Analytics**: Track Engagement pro Post
- **Repurposing**: 1 LinkedIn-Post → 3 Tweets → 1 Instagram-Carousel

---

## Detaillierter Workflow

### Step 1: Content-Ideation & Themen-Clustering

**Themen-Kategorien** (für 30 Tage):
```markdown
40% EDUCATIONAL:
- Claude Code Tutorials
- Best Practices & Pro-Tips
- Common Mistakes vermeiden
- Tool-Vergleiche (Cursor vs Claude Code)

30% INSPIRATIONAL:
- Success Stories (User-Generated)
- Behind-the-Scenes (Founder-Story)
- Industry Trends & News
- Motivational Content

20% COMMUNITY:
- User-Shoutouts
- Q&A Sessions
- Polls & Questions
- Community-Highlights

10% PROMOTIONAL:
- Course-Features
- Launch-Announcements
- Special Offers (zeitlich begrenzt)
```

**Content-Batching-Strategie**:
```
BATCH-CREATION (effizient):
- 1x pro Woche: 7 Posts auf einmal erstellen
- 2h Fokus-Zeit statt täglich 20 Min
- Themes pro Woche: Woche 1 = "Getting Started", Woche 2 = "Advanced Techniques", etc.
```

### Step 2: Platform-Specific Optimization

**LinkedIn Algorithm-Hacks**:
```markdown
✅ ALGORITHMUS MAG:
- Native Text (kein Copy-Paste aus anderen Platforms)
- Lange Posts (>1000 Zeichen engagement)
- Fragen am Ende (fördert Comments)
- Tagging relevanter Personen (max 5)
- Dwell Time (User liest lange)

❌ ALGORITHMUS STRAFT:
- External Links im Post-Body (nutze First Comment!)
- Zu viele Hashtags (>5 = Spam)
- Stock-Photos (nutze eigene Bilder)
- Cross-Posting (LinkedIn erkennt identische Posts)

BEST PRACTICES:
- Hook in ersten 2 Zeilen (entscheidet über "See More" Click)
- Line Breaks für Lesbarkeit (nicht Wall of Text)
- Emojis sparsam (1-2 pro Post max)
- Post zwischen 09:00-11:00 Uhr (höchste Reichweite)
```

**Twitter/X Algorithm-Hacks**:
```markdown
✅ ALGORITHMUS MAG:
- Threads (2-5 Tweets) > Single Tweets
- Schnelle Replies (erste 30 Min)
- Retweets mit Comment (nicht Pure-Retweet)
- Media (Bilder/Videos) = 2x Engagement
- Conversations (Reply zu anderen)

❌ ALGORITHMUS STRAFT:
- Externe Links (reduziert Reichweite um 50%)
- Zu viele Hashtags (>2 = Spam-Signal)
- Pure-Retweets (keine eigene Value-Add)
- Automated Posting (erkennt Bots)

BEST PRACTICES:
- Threads mit Nummerierung (1/5, 2/5, etc.)
- First Tweet = Hook (rest in replies)
- Quote-Tweets statt Pure-Retweets
- Reply zu großen Accounts (Visibility-Hack)
```

**Instagram Algorithm-Hacks**:
```markdown
✅ ALGORITHMUS MAG:
- Reels (10-30 Sek) = Höchste Reichweite
- Carousels (Multi-Slide) = Längere Dwell Time
- Saves > Likes (Signal: Valuable Content)
- Shares to Stories (hoher Engagement-Score)
- Location Tags (Local Discovery)

❌ ALGORITHMUS STRAFT:
- Recycled Content (TikTok-Watermarks)
- External Links in Caption (nutze Bio-Link!)
- Shadow-Banned Hashtags (#follow4follow)
- Low-Quality Images (<1080px)

BEST PRACTICES:
- Carousel: Letzter Slide = CTA ("Save for Later")
- Reels: Hook in 1. Sekunde (scrolling stoppen)
- Caption: Storytelling (nicht reine Fakten)
- Post zwischen 18:00-20:00 (höchste Aktivität)
```

### Step 3: Content-Repurposing Matrix

**1 Content-Idee → 10+ Posts**:

```markdown
ORIGINAL CONTENT: "useState Hook Tutorial"

REPURPOSING:
1. LinkedIn Post (1300 Zeichen, Educational)
2. Twitter Thread (5 Tweets, Code-Snippets)
3. Instagram Carousel (7 Slides, Visuals)
4. LinkedIn Carousel PDF (10 Slides, Downloadable)
5. Twitter Poll ("Welchen Hook nutzt du?")
6. Instagram Reel (30 Sek, Code-Transformation)
7. LinkedIn Video (2 Min, Screen-Recording)
8. Twitter Tip-Thread (3 Tweets, Quick-Wins)
9. Instagram Story (15 Sek, Swipe-Up to Tutorial)
10. LinkedIn Article (2000 Wörter, Deep-Dive)

TOTAL: 1 Idee = 10 Platform-spezifische Assets
```

**Repurposing-Template**:
```json
{
  "source_content": {
    "title": "useState Hook Mastery",
    "format": "Blog Post",
    "length": "2000 words",
    "key_points": [
      "useState Basics",
      "Callback Form",
      "Common Pitfalls",
      "Best Practices"
    ]
  },
  "derivatives": [
    {
      "platform": "linkedin",
      "format": "text_post",
      "hook": "90% of React developers miss this useState trick...",
      "cta": "Save for later!",
      "effort": "15 min"
    },
    {
      "platform": "twitter",
      "format": "thread",
      "tweets": 5,
      "hook": "useState made simple (thread) 🧵",
      "effort": "20 min"
    },
    {
      "platform": "instagram",
      "format": "carousel",
      "slides": 7,
      "visual_style": "Code-Snippets + Explanations",
      "effort": "40 min (design-intensive)"
    }
  ]
}
```

### Step 4: Engagement-Strategien

**Reply-Framework** (Community-Building):
```markdown
GOLDEN HOUR STRATEGY:
- First 60 Min nach Post = Critical
- Reply zu JEDEM Comment (100% Response-Rate)
- Algorithmus boost für aktive Conversations

REPLY-TYPES:
1. Appreciation: "Danke für den Input!"
2. Question Back: "Was denkst du über X?"
3. Value-Add: "Guter Punkt - hier noch Tipp Y..."
4. Humor: "😄 Exactly!" (sparsam nutzen)

❌ AVOID:
- One-Word Replies ("Danke", "Cool")
- Copy-Paste Standard-Antworten
- Ignoring negative Comments (reply höflich!)
```

**Engagement-Boost-Tactics**:
```markdown
TACTIC 1: Question-Posts
- Frage am Ende jedes Posts
- "Was ist dein größtes Problem mit X?"
- Generiert Comments = Algorithmus-Signal

TACTIC 2: Polls (Twitter/LinkedIn)
- Multiple Choice
- Relevant für Zielgruppe
- Share Results in Follow-Up Post

TACTIC 3: Tag-a-Friend
- "Tag someone who needs this"
- Erhöht Shares
- ABER: Sparsam nutzen (sonst nerve)

TACTIC 4: Giveaways (Instagram)
- "Like + Follow + Tag 2 Friends = Win"
- Massive Reach-Boost
- ABER: Attracts Low-Quality Followers

RECOMMENDATION:
→ Focus auf Value, nicht Tricks
→ Sustainable Growth > Viral Spikes
```

### Step 5: Analytics & Performance-Tracking

**KPIs pro Platform**:

```markdown
LINKEDIN:
- Impressions (Wie viele sehen Post)
- Engagement Rate: (Likes + Comments + Shares) / Impressions × 100
  → Target: >3% = Good, >5% = Excellent
- Click-Through-Rate (wenn Link)
  → Target: >2%
- Follower Growth
  → Target: +5% MoM

TWITTER:
- Impressions
- Engagement Rate: (Likes + Retweets + Replies) / Impressions × 100
  → Target: >1% = Good, >3% = Excellent
- Profile Visits
- Follower Growth
  → Target: +10% MoM (schneller als LinkedIn)

INSTAGRAM:
- Reach (unique viewers)
- Engagement Rate: (Likes + Comments + Saves + Shares) / Reach × 100
  → Target: >4% = Good, >8% = Excellent
- Saves (wichtiger als Likes!)
  → Target: Saves/Post >5% of Reach
- Follower Growth
  → Target: +8% MoM
```

**Content-Performance-Matrix**:
```
NACH 30 TAGEN AUSWERTEN:

TOP-PERFORMER (>5% Engagement):
→ What worked? (Topic, Format, Timing)
→ Create More Similar Content

MID-PERFORMER (2-5% Engagement):
→ OK, aber Optimization-Potenzial
→ A/B Test Variations

LOW-PERFORMER (<2% Engagement):
→ Why failed? (Topic not relevant? Bad Timing?)
→ Retire Content-Type or Pivot Approach
```

### Step 6: Scheduling & Automation

**Scheduling-Tools-Integration**:

```json
{
  "tool": "buffer",
  "posts": [
    {
      "text": "...",
      "platforms": ["linkedin", "twitter"],
      "scheduled_time": "2026-02-11T09:00:00Z",
      "media": ["image1.png"],
      "link": "https://..."
    }
  ]
}
```

**Posting-Frequenz**:
```
LinkedIn: 3-5x / Woche (Quality > Quantity)
Twitter: 1-3x / Tag (Consistent Presence)
Instagram: 5-7x / Woche (Mix: Posts + Stories + Reels)

CRITICAL: Consistency > Frequency
→ Better: 3x/Woche konstant über Monate
→ Worse: Daily für 2 Wochen, dann silent
```

## Edge Cases & Crisis Management

### Negative Comments / Trolls

**Response-Framework**:
```
SITUATION 1: Constructive Criticism
→ Reply: "Thanks for feedback! You're right about X. We're working on Y."
→ Shows: Openness + Professionalism

SITUATION 2: Factual Error (von User)
→ Reply: "Actually, it works like X [explain politely]."
→ Avoid: "You're wrong!" (defensive)

SITUATION 3: Troll / Spam
→ Action: Hide Comment (LinkedIn/Instagram) or Mute (Twitter)
→ Do NOT engage (gives them attention)

SITUATION 4: Justified Complaint
→ Reply: "Sorry for the trouble! DM me your details, I'll fix ASAP."
→ Take offline (DM) to resolve privately
```

### Algorithm-Changes

**Problem**: Platform changes algorithm, reach drops

**Detection**:
```
SIGNALS:
- Impressions drop >30% week-over-week
- Engagement Rate halved
- New Content-Types favored (e.g., Reels on Instagram)
```

**Adaptation-Strategy**:
```
STEP 1: Research
- Check Platform Blog for Announcements
- Monitor Competitors (what they doing different?)
- Test New Formats (e.g., if Reels get boosted)

STEP 2: Pivot
- Shift Content-Mix (more of what works now)
- Iterate fast (weekly experiments)
- Track what recovers Reach

STEP 3: Diversify
- Don't rely on ONE platform
- Build Email List (owned audience)
- Cross-Platform-Strategy
```

### Content-Burnout

**Problem**: Out of ideas after 2 weeks

**Prevention**:
```
CONTENT-BANK:
- Maintain list of 50+ Content-Ideas
- Replenish weekly (add 10 new ideas)
- Sources: Reddit, Twitter Trends, User-Questions

EVERGREEN CONTENT:
- 30% of Content = Timeless
- Can repost after 3-6 Months
- Example: "useState Basics" (always relevant)

USER-GENERATED CONTENT:
- Ask: "What would you like to learn?"
- Repost User Success Stories (with permission)
- Q&A Sessions (Users provide questions)
```

## Quality Checks

**Vor Posting prüfen**:
```markdown
✅ Content Quality:
- [ ] Typos/Grammar gecheckt (Grammarly)
- [ ] Links funktionieren (preview in tool)
- [ ] Images haben Alt-Text (Accessibility)
- [ ] Hashtags recherchiert (nicht Banned)
- [ ] CTA ist klar ("Save this", nicht "Check it out")

✅ Platform-Fit:
- [ ] Länge passt (LinkedIn 1300, Twitter 280)
- [ ] Tone passt (Professional für LinkedIn, Casual für Twitter)
- [ ] Format optimiert (Carousel für Instagram, Thread für Twitter)
- [ ] Scheduled Time optimal (siehe Best Times)

✅ Brand Consistency:
- [ ] Tone-of-Voice consistent (Du-Form, freundlich)
- [ ] Visuals on-brand (wenn applicable)
- [ ] Hashtags relevant (#ClaudeCode, nicht #Coding)
```

## Beispiel-Output: 30-Tage Codex-Track-Kalender (LinkedIn + Twitter Primary)

```
./social-media/codex/
├── 2026-06-calendar.md                            # menschenlesbarer Plan
├── 2026-06-content-calendar.json                  # Maschinen-lesbar
├── posts/
│   ├── 2026-06-01-post-01-linkedin-educational.md
│   ├── 2026-06-01-post-02-twitter-educational.md  # gleicher Tag, andere Plattform
│   ├── 2026-06-02-post-03-linkedin-news.md
│   ├── ... (bis post-NN)
└── assets/
    ├── codex-cli-vs-claude-code.png
    └── multi-agent-tree-recording.mp4
```

**Excerpt 2026-06-content-calendar.json**:
```json
{
  "track": "codex",
  "month": "2026-06",
  "primary_platforms": ["linkedin", "twitter"],
  "secondary_platforms": ["instagram"],
  "posting_frequency": "daily",
  "content_mix": {
    "educational": 60,
    "news": 20,
    "community": 20
  },
  "voice_source": "masterkurs-agent/track-configs/codex/social-voice.md",
  "posts": [
    {
      "date": "2026-06-01",
      "post_id": 1,
      "platform": "linkedin",
      "type": "educational",
      "content_pillar": "cli-workflows",
      "title": "Codex CLI Approval-Modes erklärt",
      "scheduled_time": "09:00",
      "hashtags": ["#OpenAICodex", "#CodexCLI", "#GPT5"],
      "expected_engagement_rate": 0.04,
      "cta": "Voller Workflow in Lektion 12 des Codex-Tracks"
    }
  ]
}
```

**Excerpt post-1-launch-announcement.md**:
```markdown
---
date: 2026-02-11
platform: linkedin
scheduled_time: "09:00"
---

# Post 1: Launch Announcement

## Copy

🚀 Der Claude Code Masterkurs ist live!

Nach 6 Monaten Arbeit freue ich mich, euch 27 strukturierte Lektionen zu präsentieren - von den Basics bis zu Advanced MCP-Servern.

Was drin ist:
✅ 15h Video-Content
✅ Live-Playground zum Experimentieren
✅ Challenges mit echten Use-Cases
✅ Community-Support

Warum Claude Code?
Weil KI-gestütztes Programmieren die Zukunft ist. Und weil 90% der Tutorials da draußen zu oberflächlich sind.

Für Early Adopters: 20% Rabatt bis Freitag.

Link in den Comments 👇

**Hashtags**: #ClaudeCode #AICoding #LaunchDay

## Engagement Strategy
- **First Comment**: Link zur Landing Page
- **Reply to all comments** in ersten 60 Min
- **Expected**: 500 Impressions, 25 Likes, 5 Comments

## Analytics (post-publish):
- Actual Impressions: [TBD]
- Engagement Rate: [TBD]
- Click-Through-Rate: [TBD]
```

Speichere IMMER in: `masterkurs-agent/social-media/<track>/` (track-namespaced — flacher Output ist deprecated).

## Validation-Checklist (vor Calendar-Output)

- [ ] `--track <key>` aufgelöst und gegen Whitelist (`claude-code` · `claude-desktop` · `codex` · `local-llm` · `freelancer`) geprüft
- [ ] `track-configs/<track>/social-voice.md` gelesen (sonst hard-fail)
- [ ] Hashtags, Hook-Templates, Content-Pillars, Tone aus Track-Voice gezogen — keine Cross-Track-Vermischung
- [ ] Platform-Mix entsprechend Track-Tabelle gewählt (Tech: LinkedIn+Twitter primary, Freelancer: LinkedIn+Instagram primary)
- [ ] Content-Mix-Verteilung korrekt: Tech 60/20/20, Freelancer 50/30/20
- [ ] Output-Pfad ist `masterkurs-agent/social-media/<track>/<YYYY-MM>-calendar.md`
- [ ] CTA verlinkt auf track-spezifische Lektions-URL (siehe `social-voice.md` CTA-Default)
