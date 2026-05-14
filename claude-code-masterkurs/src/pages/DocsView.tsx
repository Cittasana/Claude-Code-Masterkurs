import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Zap,
  Brain,
  Shield,
  Trophy,
  Users,
  Code2,
  ArrowRight,
  GraduationCap,
  Layers,
  GitBranch,
  Terminal,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';
import { contentApi } from '../lib/api';
import type { AdminOfficialDoc, AdminLessonConfig, AdminQuiz, AdminProjectConfig } from '../lib/api';

const officialDocsIndexUrl = 'https://code.claude.com/docs/llms.txt';

// ─────────────────────────────────────────────────────────────
// Dokumentations- / Informationsseite
// Erklärt warum der Masterkurs wichtig ist und was er bietet
// ─────────────────────────────────────────────────────────────

// Static labels for the stats strip — values are filled at runtime from
// the CMS so the displayed numbers can never drift from the source of truth.
// Levels stays hardcoded ('3') because adding a 4th level is a curriculum
// decision, not an automated content change.
const STAT_DEFS: { key: 'lessons' | 'levels' | 'quizzes' | 'projects'; label: string; icon: typeof BookOpen }[] = [
  { key: 'lessons', label: 'Lektionen', icon: BookOpen },
  { key: 'levels', label: 'Schwierigkeitsstufen', icon: Layers },
  { key: 'quizzes', label: 'Praxis-Quizzes', icon: Brain },
  { key: 'projects', label: 'Projekte', icon: Code2 },
];

const LEVELS = [
  {
    level: 1,
    title: 'Grundlagen',
    color: '#30d158',
    lessons: [
      'Was ist Claude Code?',
      'Installation & Setup',
      'Authentifizierung & Model-Auswahl',
      'Erste Schritte & Befehle',
      'CLAUDE.md Mastery',
      'Context Management',
    ],
  },
  {
    level: 2,
    title: 'Fortgeschritten',
    color: '#ff9500',
    lessons: [
      'MCP Server Integration',
      'Skills & Workflows erstellen',
      'Subagents Deep Dive',
      'Custom Agents erstellen',
      'Agent Personality & Configuration',
      'Git-Integration Profi',
    ],
  },
  {
    level: 3,
    title: 'Expert',
    color: '#ff453a',
    lessons: [
      'Hooks & Automation',
      'Custom Slash Commands',
      'Advanced Prompting Techniques',
      'Plan & Thinking Mode',
      'Agent Orchestration',
      'Production Best Practices',
      'Troubleshooting Pro',
      'Context Engineering Masterclass',
      'IDE-Integrationen',
      'Sandboxing & Security Deep Dive',
      'CI/CD & Headless Mode',
      'Kosten-Optimierung Profi',
      'Claude Agent SDK',
      'Plugins & Marketplace',
      'Real-World Workflow Patterns',
      'Fast Mode & Opus 4.6',
      'Agent Teams & Checkpointing',
      'Claude Code überall & offizielle Ressourcen',
    ],
  },
];

const FEATURES = [
  {
    icon: Terminal,
    title: 'Interaktive Lektionen',
    description:
      'Lerne Claude Code Schritt für Schritt mit detaillierten Erklärungen, Code-Beispielen und praktischen Übungen.',
  },
  {
    icon: Brain,
    title: 'Intelligente Quizzes',
    description:
      'Teste dein Wissen nach jeder Lektion mit automatisch bewerteten Multiple-Choice- und Code-Fragen.',
  },
  {
    icon: Code2,
    title: 'Playground',
    description:
      'Experimentiere in einer sicheren Sandbox-Umgebung mit Claude Code Befehlen und Workflows.',
  },
  {
    icon: Sparkles,
    title: 'Spaced Repetition',
    description:
      'Wissenschaftlich fundiertes Wiederholungssystem, das sicherstellt, dass du Gelerntes langfristig behältst.',
  },
  {
    icon: Users,
    title: 'Community & Forum',
    description:
      'Tausche dich mit anderen Lernenden aus, stelle Fragen und teile deine besten Claude Code Patterns.',
  },
  {
    icon: Trophy,
    title: 'Challenges & Zertifikat',
    description:
      'Fordere dich mit Coding-Challenges heraus und erhalte am Ende ein Abschluss-Zertifikat.',
  },
];

const WHY_REASONS = [
  {
    icon: Zap,
    title: 'KI verändert die Softwareentwicklung',
    description:
      'Claude Code ist kein Autocomplete-Tool — es ist ein autonomer AI-Agent, der ganze Features implementiert, Tests schreibt und Architektur-Entscheidungen trifft. Wer diese Technologie beherrscht, hat einen massiven Produktivitäts-Vorteil.',
  },
  {
    icon: Target,
    title: 'Strukturiertes Lernen statt Trial & Error',
    description:
      'Statt stundenlang Dokumentation zu lesen und durch Versuch und Irrtum zu lernen, führt dich dieser Kurs systematisch von den Grundlagen bis zu fortgeschrittenen Multi-Agent-Workflows.',
  },
  {
    icon: Shield,
    title: 'Best Practices von Anfang an',
    description:
      'Lerne von Beginn an die richtigen Patterns: CLAUDE.md Konfiguration, Context Engineering, Kosten-Optimierung, Security und Production-Ready Workflows — keine schlechten Gewohnheiten.',
  },
  {
    icon: Clock,
    title: 'Spare hunderte Stunden Entwicklungszeit',
    description:
      'Entwickler, die Claude Code effektiv nutzen, berichten von 3-10x Produktivitätssteigerungen. Dieser Kurs zeigt dir genau, wie du dieses Potenzial freischaltest.',
  },
];

function DocsCtaSection() {
  const { t } = useTranslation();
  return (
    <section className="text-center pb-8">
      <div
        className="apple-card py-12 px-8"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,149,0,0.08) 0%, rgba(36,36,36,1) 60%)',
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-4">
          {t('docs.ctaTitle')}
        </h2>
        <p className="text-apple-muted max-w-md mx-auto mb-8">
          {t('docs.ctaSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
          >
            {t('docs.ctaRegister')}
            <ArrowRight size={20} />
          </Link>
          <Link
            to="/login"
            className="text-apple-accent hover:text-apple-accentHover text-sm font-medium transition-colors"
          >
            {t('docs.ctaLogin')}
          </Link>
        </div>
      </div>
    </section>
  );
}

const DocsView = () => {
  const [allDocs, setAllDocs] = useState<AdminOfficialDoc[]>([]);
  const [lessons, setLessons] = useState<AdminLessonConfig[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [projects, setProjects] = useState<AdminProjectConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      contentApi.getOfficialDocs(),
      contentApi.getLessons({ track: 'main' }),
      contentApi.getQuizzes(),
      contentApi.getProjects(),
    ])
      .then(([docsRes, lessonsRes, quizzesRes, projectsRes]) => {
        if (cancelled) return;
        if (docsRes.status === 'fulfilled' && Array.isArray(docsRes.value.data)) setAllDocs(docsRes.value.data);
        if (lessonsRes.status === 'fulfilled' && Array.isArray(lessonsRes.value.data)) setLessons(lessonsRes.value.data);
        if (quizzesRes.status === 'fulfilled' && Array.isArray(quizzesRes.value.data)) setQuizzes(quizzesRes.value.data);
        if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value.data)) setProjects(projectsRes.value.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const statValues: Record<'lessons' | 'levels' | 'quizzes' | 'projects', string> = {
    lessons: lessons.length > 0 ? `${lessons.length}` : '...',
    levels: '3',
    quizzes: quizzes.length > 0 ? `${quizzes.length}` : '...',
    projects: projects.length > 0 ? `${projects.length}` : '...',
  };

  const officialDocsOverview = allDocs.filter(d => d.category === 'overview');
  const officialDocsCore = allDocs.filter(d => d.category === 'core');
  const officialDocsExtend = allDocs.filter(d => d.category === 'extend');
  const officialDocsOutsideTerminal = allDocs.filter(d => d.category === 'outsideTerminal');

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-apple-accent border-t-transparent" /></div>;

  return (
    <div className="min-h-screen animate-fade-in-up">
      <Helmet>
        <title>Dokumentation | Claude Code Masterkurs</title>
        <meta name="description" content="Umfassende Dokumentation zum Claude Code Masterkurs. Lehrplan, Features, Lernpfad und offizielle Claude Code Referenzen." />
        <link rel="canonical" href="https://claude-code-masterkurs.de/docs" />
      </Helmet>
      {/* ── Hero Section — Ethereal ──────────────────── */}
      <section className="text-center pt-16 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,107,26,0.10) 0%, transparent 70%)',
          }}
        />

        <div className="relative">
          <div className="eyebrow center mb-8"><span className="pulse" />Dokumentation</div>
          <ClaudeCodeLogo size="lg" showSubtitle className="mb-8" />

          <p className="text-xl sm:text-2xl text-apple-textSecondary max-w-2xl mx-auto mb-4 leading-relaxed">
            Die umfassende Lernplattform für{' '}
            <em className="italic-serif text-apple-accent">KI-gestützte</em>{' '}
            Softwareentwicklung mit Claude Code
          </p>
          <p className="text-apple-muted max-w-xl mx-auto mb-10">
            Von den Grundlagen bis zur Multi-Agent-Orchestration — werde zum Claude Code Profi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
            >
              Jetzt starten
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="btn-secondary flex items-center gap-2 px-8 py-3"
            >
              Bereits registriert? Anmelden
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────── */}
      <section className="mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_DEFS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="apple-card text-center py-6"
              >
                <Icon size={22} className="mx-auto mb-3 text-apple-accent" />
                <p className="num-serif text-[clamp(28px,3vw,40px)] leading-none">{statValues[stat.key]}</p>
                <p className="text-[11px] text-apple-muted mt-2 font-mono uppercase tracking-[0.06em]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Warum dieser Kurs? ─────────────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-apple-text mb-3">
            Warum Claude Code lernen?
          </h2>
          <p className="text-apple-muted max-w-lg mx-auto">
            KI-gestützte Entwicklung ist nicht die Zukunft — sie ist die Gegenwart.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {WHY_REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.title} className="apple-card group">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-apple-accent/10 border border-apple-accent/20 group-hover:bg-apple-accent/20 transition-colors">
                    <Icon size={22} className="text-apple-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-apple-text mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-apple-textSecondary text-sm leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Was bietet die Plattform? ──────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-apple-text mb-3">
            Was bietet die Plattform?
          </h2>
          <p className="text-apple-muted max-w-lg mx-auto">
            Alles was du brauchst, um Claude Code von Grund auf zu meistern.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="apple-card hover:border-apple-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-apple-accent/10 mb-4">
                  <Icon size={20} className="text-apple-accent" />
                </div>
                <h3 className="font-semibold text-apple-text mb-2">{feature.title}</h3>
                <p className="text-sm text-apple-muted leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Lehrplan / Curriculum ──────────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-apple-text mb-3">
            Der Lehrplan
          </h2>
          <p className="text-apple-muted max-w-lg mx-auto">
            {statValues.lessons === '...' ? 'Lektionen' : `${statValues.lessons} Lektionen`} in 3 Schwierigkeitsstufen — vom Einsteiger zum Experten.
          </p>
        </div>

        <div className="space-y-6">
          {LEVELS.map((level) => (
            <div key={level.level} className="apple-card">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg font-mono"
                  style={{ backgroundColor: level.color }}
                >
                  {level.level}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-apple-text">
                    Level {level.level}: {level.title}
                  </h3>
                  <p className="text-xs text-apple-muted">
                    {level.lessons.length} Lektionen
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {level.lessons.map((lesson, i) => (
                  <div
                    key={lesson}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-apple-bg/50 text-sm"
                  >
                    <span
                      className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-mono font-medium"
                      style={{ color: level.color, backgroundColor: `${level.color}15` }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-apple-textSecondary">{lesson}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lernpfad-Übersicht ─────────────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-apple-text mb-3">
            Dein Lernpfad
          </h2>
          <p className="text-apple-muted max-w-lg mx-auto">
            Schritt für Schritt zum Claude Code Profi
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              icon: GraduationCap,
              title: 'Grundlagen lernen',
              desc: 'Installation, Setup und erste Befehle meistern',
            },
            {
              step: '02',
              icon: GitBranch,
              title: 'Workflows aufbauen',
              desc: 'MCP-Server, Skills und eigene Agents erstellen',
            },
            {
              step: '03',
              icon: Layers,
              title: 'Expertise vertiefen',
              desc: 'Multi-Agent-Orchestration und Production-Patterns',
            },
            {
              step: '04',
              icon: Trophy,
              title: 'Zertifikat erhalten',
              desc: 'Challenges bestehen und Abschluss-Zertifikat holen',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="text-center">
                <div className="relative inline-block mb-4">
                  <span className="absolute -top-2 -right-2 text-xs font-mono font-bold text-apple-accent bg-apple-accent/10 border border-apple-accent/20 rounded-full w-6 h-6 flex items-center justify-center">
                    {item.step}
                  </span>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-apple-elevated border border-apple-border">
                    <Icon size={28} className="text-apple-accent" />
                  </div>
                </div>
                <h3 className="font-semibold text-apple-text mb-1">{item.title}</h3>
                <p className="text-sm text-apple-muted">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Was du lernst ──────────────────────────────── */}
      <section className="mb-16">
        <div className="apple-card" style={{ background: 'linear-gradient(135deg, #242424 0%, #1a1a1a 100%)' }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-apple-text mb-2">
              Was du nach dem Kurs kannst
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Claude Code installieren, konfigurieren und effizient nutzen',
              'CLAUDE.md Dateien für optimalen Projekt-Kontext erstellen',
              'MCP-Server für Datenbanken, APIs und externe Tools einrichten',
              'Eigene Skills, Workflows und Custom Slash Commands bauen',
              'Multi-Agent-Systeme orchestrieren (Subagents, Pipelines)',
              'Production-Ready Workflows mit CI/CD und Headless Mode',
              'Advanced Prompting und Context Engineering beherrschen',
              'Kosten optimieren und Security Best Practices anwenden',
              'Git-Integration für automatische Commits und Pull Requests',
              'Das Claude Agent SDK für eigene AI-Anwendungen nutzen',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 py-2">
                <CheckCircle2 size={18} className="shrink-0 text-apple-success mt-0.5" />
                <span className="text-sm text-apple-textSecondary leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offizielle Claude Code Dokumentation ───────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-apple-text mb-3">
            Offizielle Claude Code Dokumentation
          </h2>
          <p className="text-apple-muted max-w-lg mx-auto">
            Zentrale Referenz: <a href="https://code.claude.com/docs/de/overview" target="_blank" rel="noopener noreferrer" className="text-apple-accent hover:underline">code.claude.com</a>. Vollständiger Index für alle Seiten:{' '}
            <a href={officialDocsIndexUrl} target="_blank" rel="noopener noreferrer" className="text-apple-accent hover:underline font-mono text-sm">llms.txt</a>
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="apple-card">
            <h3 className="font-semibold text-apple-text mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-apple-accent" />
              Einstieg
            </h3>
            <ul className="space-y-2">
              {officialDocsOverview.map((doc) => (
                <li key={doc.url}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-apple-textSecondary hover:text-apple-accent flex items-center gap-1.5 group">
                    {doc.title}
                    <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="apple-card">
            <h3 className="font-semibold text-apple-text mb-3 flex items-center gap-2">
              <Terminal size={18} className="text-apple-accent" />
              CLI & Konfiguration
            </h3>
            <ul className="space-y-2">
              {officialDocsCore.map((doc) => (
                <li key={doc.url}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-apple-textSecondary hover:text-apple-accent flex items-center gap-1.5 group">
                    {doc.title}
                    <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="apple-card">
            <h3 className="font-semibold text-apple-text mb-3 flex items-center gap-2">
              <Layers size={18} className="text-apple-accent" />
              Erweitern
            </h3>
            <ul className="space-y-2">
              {officialDocsExtend.map((doc) => (
                <li key={doc.url}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-apple-textSecondary hover:text-apple-accent flex items-center gap-1.5 group">
                    {doc.title}
                    <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="apple-card">
            <h3 className="font-semibold text-apple-text mb-3 flex items-center gap-2">
              <Code2 size={18} className="text-apple-accent" />
              Web, Desktop, IDE
            </h3>
            <ul className="space-y-2">
              {officialDocsOutsideTerminal.map((doc) => (
                <li key={doc.url}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-apple-textSecondary hover:text-apple-accent flex items-center gap-1.5 group">
                    {doc.title}
                    <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <DocsCtaSection />
    </div>
  );
};

export default DocsView;
