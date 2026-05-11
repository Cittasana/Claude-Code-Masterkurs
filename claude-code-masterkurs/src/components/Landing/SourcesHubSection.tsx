/**
 * Sources → Hub composition.
 * Six course topics flow inward to the central "Claude Code Masterkurs" hub.
 * Uses the SCROLL-MOTION-CRAFT primitives defined in src/index.css.
 * Reduced-motion + IO-fallback already wired globally.
 */

const TOPICS = [
  { id: 'claudemd', label: 'CLAUDE.md', position: 'smc-n1' },
  { id: 'mcp', label: 'MCP Server', position: 'smc-n2' },
  { id: 'hooks', label: 'Hooks', position: 'smc-n3' },
  { id: 'skills', label: 'Skills', position: 'smc-n4' },
  { id: 'agents', label: 'Sub-Agents', position: 'smc-n5' },
  { id: 'plugins', label: 'Plugins', position: 'smc-n6' },
];

/** Marquee topics — covers what's inside the course. */
const MARQUEE_TOPICS = [
  'Worktrees',
  'Effort-Levels',
  'Auto-Mode',
  'Advisor Tool',
  '$defaults',
  'Compaction',
  'Sandbox',
  'Slash Commands',
  'MCP Tools',
  '/clear',
  'Multi-Agent',
  'Memory',
];

const SourcesHubSection = () => {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Eyebrow with pulse dot */}
        <div className="eyebrow center mb-6 reveal">
          <span className="pulse" />
          Curriculum-Universum
        </div>

        {/* Heading with gradient text fill */}
        <h2 className="smc-section-heading reveal text-[clamp(36px,5.4vw,64px)] font-semibold tracking-[-0.032em] leading-[1.04] mb-4">
          Alle Themen. Ein <em className="italic-serif">Hub</em>.
        </h2>

        {/* Subline */}
        <p className="reveal text-apple-textSecondary max-w-xl mx-auto text-base leading-relaxed">
          Sechs Säulen der Claude-Code-Beherrschung &mdash; vom statischen Kontext bis zum
          orchestrierten Multi-Agent-Workflow. Alles in einem strukturierten Kurs.
        </p>

        {/* Divider that draws in on scroll */}
        <div className="smc-section-divider reveal" aria-hidden="true" />

        {/* Hub diagram — 6 wires from outer topics into the central tile.
            Every <path> authored OUTER → CENTER so animateMotion walks inward. */}
        <div className="smc-hub reveal" aria-hidden="true">
          <svg viewBox="0 0 920 360" preserveAspectRatio="none">
            <defs>
              {/* Soft glow behind the hub */}
              <radialGradient id="smc-hub-glow" cx="50%" cy="50%" r="40%">
                <stop offset="0%" stopColor="rgba(255,107,26,0.25)" />
                <stop offset="60%" stopColor="rgba(255,107,26,0.05)" />
                <stop offset="100%" stopColor="rgba(255,107,26,0)" />
              </radialGradient>
            </defs>
            <ellipse cx="460" cy="180" rx="180" ry="90" fill="url(#smc-hub-glow)" />

            {/* Wires — top-left, top-right, mid-left, mid-right, bottom-left, bottom-right.
                pathLength="100" makes every dot traverse normalised length so they meet centrally. */}
            <path
              id="smc-wire-1"
              className="smc-dataflow-line"
              pathLength="100"
              d="M 92 50 C 250 70, 360 140, 460 180"
            />
            <path
              id="smc-wire-2"
              className="smc-dataflow-line"
              pathLength="100"
              d="M 828 50 C 670 70, 560 140, 460 180"
            />
            <path
              id="smc-wire-3"
              className="smc-dataflow-line"
              pathLength="100"
              d="M 36 180 L 460 180"
            />
            <path
              id="smc-wire-4"
              className="smc-dataflow-line"
              pathLength="100"
              d="M 884 180 L 460 180"
            />
            <path
              id="smc-wire-5"
              className="smc-dataflow-line"
              pathLength="100"
              d="M 166 310 C 280 280, 380 220, 460 180"
            />
            <path
              id="smc-wire-6"
              className="smc-dataflow-line"
              pathLength="100"
              d="M 754 310 C 640 280, 540 220, 460 180"
            />

            {/* Six real moving circles ride each wire, staggered every 0.4s (dur 2.4s / 6 paths). */}
            <circle className="smc-dataflow-dot" r="4">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="0s" rotate="auto">
                <mpath href="#smc-wire-1" />
              </animateMotion>
            </circle>
            <circle className="smc-dataflow-dot" r="4">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.4s" rotate="auto">
                <mpath href="#smc-wire-2" />
              </animateMotion>
            </circle>
            <circle className="smc-dataflow-dot" r="4">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.8s" rotate="auto">
                <mpath href="#smc-wire-3" />
              </animateMotion>
            </circle>
            <circle className="smc-dataflow-dot" r="4">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="1.2s" rotate="auto">
                <mpath href="#smc-wire-4" />
              </animateMotion>
            </circle>
            <circle className="smc-dataflow-dot" r="4">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="1.6s" rotate="auto">
                <mpath href="#smc-wire-5" />
              </animateMotion>
            </circle>
            <circle className="smc-dataflow-dot" r="4">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="2.0s" rotate="auto">
                <mpath href="#smc-wire-6" />
              </animateMotion>
            </circle>
          </svg>

          {/* Outer nodes */}
          {TOPICS.map((topic) => (
            <div key={topic.id} className={`smc-node ${topic.position}`}>
              {topic.label}
            </div>
          ))}

          {/* Center hub — floats ambiently */}
          <div className="smc-node smc-nc center">Claude Code Masterkurs</div>
        </div>

        {/* Marquee — seamless infinite topic pills, doubled for perfect loop */}
        <div className="smc-marquee mt-12" aria-label="Im Kurs behandelte Themen">
          <div className="smc-marquee-track">
            {[...MARQUEE_TOPICS, ...MARQUEE_TOPICS].map((topic, i) => (
              <span
                key={`${topic}-${i}`}
                className="smc-logo-pill"
                aria-hidden={i >= MARQUEE_TOPICS.length}
              >
                <span className="smc-pill-dot" />
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Inline quote */}
        <p className="smc-inline-quote reveal">
          Ein Kurs. Sechs Säulen. Alles, was du brauchst, um Claude Code wie ein
          Senior-Entwickler einzusetzen.
        </p>

        {/* Stat row */}
        <div className="smc-stats">
          <div className="smc-stat">
            <span className="smc-stat-value">6</span>
            <span className="smc-stat-label">Kern-Säulen</span>
          </div>
          <div className="smc-stat">
            <span className="smc-stat-value">12+</span>
            <span className="smc-stat-label">Patterns</span>
          </div>
          <div className="smc-stat">
            <span className="smc-stat-value">∞</span>
            <span className="smc-stat-label">Workflows</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SourcesHubSection;
