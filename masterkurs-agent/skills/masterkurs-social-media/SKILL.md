---
name: masterkurs-social-media
description: |
  Erstelle 30-Tage Social Media Content-Kalender für LinkedIn/Twitter/Instagram. Nutze wenn User "Social Media Content", "30-Tage-Plan", "LinkedIn Posts" erwähnt.
compatibility:
  required_tools: [Write]
---

# Masterkurs Social Media

Erstellt 30-Tage Content-Kalender.

## Input
- **Platform**: LinkedIn/Twitter/Instagram
- **Thema**: Launch/Tips/Success Stories
- **Frequenz**: täglich/3x Woche/wöchentlich

## Output

Speichere in: `/masterkurs-agent/social-media/[platform]-[monat]/`

```
├── content-calendar.json
├── posts/
│   ├── 2026-02-11-post-1.md
│   ├── 2026-02-12-post-2.md
│   └── ...
└── assets/ (wenn Grafiken nötig)
```

## Post Template

```markdown
---
date: 2026-02-11
platform: linkedin
post_type: educational
scheduled_time: "09:00"
---

# Post [N]: [Titel]

## Copy

[Hier der Post-Text]

**Hashtags**: #ClaudeCode #AICoding #Programming

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

## Platform-Guidelines

### LinkedIn (Professional)
- **Länge**: Max 1300 Zeichen
- **Tone**: Professionell, lehrreich
- **Best Time**: Di-Do 09:00-11:00
- **Hashtags**: 3-5 relevante
- **Format**: Text + Screenshot oder Code-Snippet

**Content-Mix**:
- 60% Educational (Tutorials, Tips)
- 20% Inspirational (Success Stories)
- 20% Promotional (Kurs-Features)

### Twitter/X (Short & Punchy)
- **Länge**: Max 280 Zeichen (Thread 3-5 Tweets)
- **Tone**: Casual, direkt
- **Best Time**: Täglich 08:00, 13:00, 18:00
- **Hashtags**: 1-2 pro Tweet
- **Format**: Thread mit Code-Snippets

**Content-Mix**:
- 70% Quick Tips & Tricks
- 20% Community-Interaktion
- 10% Promotional

### Instagram (Visual)
- **Caption**: Max 2200 Zeichen
- **Tone**: Freundlich, visuell
- **Best Time**: Mo-Fr 18:00-20:00
- **Hashtags**: 10-15 relevante
- **Format**: Carousel (5-10 Slides) oder Reels (15-30 Sek)

**Content-Mix**:
- 50% Code-Transformations (Before/After)
- 30% Behind-the-Scenes
- 20% Tips & Tricks

## 30-Tage Beispiel-Plan

### Woche 1: Launch-Phase
- Tag 1: Ankündigung
- Tag 2: Feature-Highlight 1
- Tag 3: User-Testimonial
- Tag 4: Behind-the-Scenes
- Tag 5: Tutorial-Snippet
- Tag 6-7: Community-Posts

### Woche 2-4: [Struktur wiederholt]

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

## Beispiel-Output: 30-Tage LinkedIn-Kalender

```
./social-media/linkedin-2026-02/
├── content-calendar.json (30 Posts)
├── posts/
│   ├── 2026-02-11-post-1-launch-announcement.md
│   ├── 2026-02-12-post-2-useState-tutorial.md
│   ├── 2026-02-13-post-3-user-testimonial.md
│   ├── ... (bis post-30)
└── analytics-template.xlsx
```

**Excerpt content-calendar.json**:
```json
{
  "month": "2026-02",
  "platform": "linkedin",
  "posting_frequency": "daily",
  "content_mix": {
    "educational": 60,
    "inspirational": 20,
    "promotional": 20
  },
  "posts": [
    {
      "date": "2026-02-11",
      "post_id": 1,
      "type": "promotional",
      "title": "Launch Announcement",
      "scheduled_time": "09:00",
      "hashtags": ["#ClaudeCode", "#AICoding", "#LaunchDay"],
      "expected_engagement_rate": 0.05,
      "cta": "Check out the course"
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

Speichere IMMER in: `/masterkurs-agent/social-media/`
