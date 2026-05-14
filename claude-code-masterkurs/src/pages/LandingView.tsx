import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, FileText, BookOpen, Zap, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { useAuthStore } from '../store/authStore';
import VideoHero from '../components/Landing/VideoHero';
import FounderSection from '../components/Landing/FounderSection';
import SourcesHubSection from '../components/Landing/SourcesHubSection';
import TestimonialSection from '../components/Landing/TestimonialSection';
import NewsletterSignup from '../components/Newsletter/NewsletterSignup';
import { contentApi } from '../lib/api';
import type { AdminLessonConfig, AdminQuiz, AdminProjectConfig } from '../lib/api';
import { gsap } from '../lib/gsap';
import { TRACKS, TRACK_KEYS } from '../data/tracks';

const FEATURES = [
  { icon: BookOpen, titleKey: 'landing.featureLessons', descKey: 'landing.featureLessonsDesc' },
  { icon: Zap, titleKey: 'landing.featureChallenges', descKey: 'landing.featureChallengesDesc' },
  { icon: Award, titleKey: 'landing.featureCert', descKey: 'landing.featureCertDesc' },
];

const LandingView = () => {
  const { t, i18n } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const rootRef = useRef<HTMLDivElement>(null);
  const ctaParagraphRef = useRef<HTMLParagraphElement>(null);

  /** Final-CTA word-by-word opacity scrub — words rise from 0.1 to 1.0 along scroll progress. */
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !ctaParagraphRef.current) return;

      const words = ctaParagraphRef.current.querySelectorAll('[data-scrub-word]');
      if (words.length === 0) return;

      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: 'none',
          stagger: { each: 0.06, from: 'start' },
          scrollTrigger: {
            trigger: ctaParagraphRef.current,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 0.6,
          },
        }
      );
    },
    { scope: rootRef }
  );

  // ── Live content from CMS ─────────────────────────────────
  const [lessons, setLessons] = useState<AdminLessonConfig[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [projects, setProjects] = useState<AdminProjectConfig[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      contentApi.getLessons({ track: 'main' }),
      contentApi.getQuizzes(),
      contentApi.getProjects(),
    ]).then(([lessonsRes, quizzesRes, projectsRes]) => {
      if (cancelled) return;
      if (lessonsRes.status === 'fulfilled' && Array.isArray(lessonsRes.value.data)) {
        setLessons(lessonsRes.value.data);
      }
      if (quizzesRes.status === 'fulfilled' && Array.isArray(quizzesRes.value.data)) {
        setQuizzes(quizzesRes.value.data);
      }
      if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value.data)) {
        setProjects(projectsRes.value.data);
      }
      /* offline / cold start — leave whichever didn't resolve empty, UI falls back gracefully */
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalLessons = lessons.length;
  const totalQuizzes = quizzes.length;
  const totalProjects = projects.length;

  /** 4 most recently touched lessons, sorted by updatedAt desc. */
  const recentLessons = useMemo(
    () =>
      [...lessons]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 4),
    [lessons]
  );

  /** German "Mai 2026" / English "May 2026" — auto-localized. */
  const currentMonthLabel = useMemo(
    () =>
      new Date().toLocaleDateString(i18n.language || 'de-DE', {
        month: 'long',
        year: 'numeric',
      }),
    [i18n.language]
  );

  /** Live STATS — totals come from the CMS so we never lie about counts. */
  const stats = useMemo(
    () => [
      { key: 'statsLessons', value: totalLessons > 0 ? `${totalLessons}` : '...' },
      { key: 'statsLevels', value: '3' },
      { key: 'statsQuizzes', value: totalQuizzes > 0 ? `${totalQuizzes}` : '...' },
      { key: 'statsProjects', value: totalProjects > 0 ? `${totalProjects}` : '...' },
    ],
    [totalLessons, totalQuizzes, totalProjects]
  );

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = rootRef.current?.querySelectorAll('.reveal, .stagger');
    if (!elements) return;
    if (reduce) {
      elements.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen flex flex-col">
      <Helmet>
        <title>Claude Code Masterkurs – Lerne KI-gestütztes Programmieren</title>
        <meta
          name="description"
          content={`Der umfassende Online-Kurs für KI-gestützte Softwareentwicklung mit Claude Code. ${totalLessons || 'Aktuelle'} Lektionen, interaktive Challenges und Live-Playground.`}
        />
        <link rel="canonical" href="https://claude-code-masterkurs.de/" />
      </Helmet>

      {/* ── Full-page background video: top-to-bottom, edge-to-edge, fixed.
            Sits between the project .page-bg (z:-10) and main content (z:10).
            pointer-events-none so it never intercepts clicks. ───────── */}
      <video
        className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
        style={{ zIndex: -5 }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Dimming overlay so all content stays legible across the whole page */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -4,
          background: [
            'linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.30) 20%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.85) 100%)',
            'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(255,107,26,0.08) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

      {/* Hero content (VideoHero is now content-only — no background video) */}
      <div className="reveal">
        <VideoHero />
      </div>

      {/* Stats bar — italic Instrument Serif numerals */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="eyebrow center mb-10 reveal">
            <span className="pulse" />
            <span>Der Kurs in Zahlen</span>
          </div>
          <div className="stagger grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {stats.map(({ key, value }) => (
              <div key={key} className="shell">
                <div className="inner py-7 px-3 text-center">
                  <span className="num-serif block text-[clamp(38px,4.6vw,56px)] mb-2">{value}</span>
                  <span className="text-[11px] text-apple-textSecondary font-mono uppercase tracking-[0.06em]">
                    {t(`landing.${key}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wähle deinen Track — multi-track marketing surface (Phase 1 W2a).
            Renders all TRACK_KEYS so users see what's live AND what's coming.
            Public tracks are interactive; non-public show a "coming soon" badge
            and a disabled CTA. Labels/hooks/colors come from the TRACKS registry
            (single source of truth) — only frame strings are i18n'd. */}
      <section id="tracks" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="reveal flex flex-col items-center text-center gap-6 mb-12">
            <div className="eyebrow"><span className="pulse" />{t('tracks.sectionTitle')}</div>
            <h2 className="text-[clamp(32px,4.2vw,52px)] font-semibold tracking-[-0.032em] leading-[1.04] text-apple-text">
              {t('tracks.sectionTitle')}
            </h2>
            <p className="text-apple-textSecondary leading-relaxed max-w-2xl">
              {t('tracks.sectionSubtitle')}
            </p>
          </div>
          <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TRACK_KEYS.map((trackKey) => {
              const track = TRACKS[trackKey];
              const isPublic = track.isPublic;
              return (
                <div
                  key={trackKey}
                  className="shell group relative overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
                  style={{
                    /* Per-track border-glow accent (very subtle by default, brightens on hover). */
                    boxShadow: `inset 0 0 0 1px ${track.color}1f`,
                  }}
                >
                  {/* Soft per-track radial accent in the upper-left corner. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[2rem] opacity-40 transition-opacity duration-500 pointer-events-none group-hover:opacity-80"
                    style={{
                      background: `radial-gradient(ellipse 60% 50% at 15% 0%, ${track.color}24, transparent 65%)`,
                    }}
                  />
                  <div className="inner relative p-7 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      {/* Track color dot */}
                      <span
                        aria-hidden="true"
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{
                          background: track.color,
                          boxShadow: `0 0 14px ${track.color}80`,
                        }}
                      />
                      {!isPublic && (
                        <span
                          className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-1 rounded-full border"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            borderColor: 'rgba(255,255,255,0.12)',
                            color: 'rgba(255,255,255,0.55)',
                          }}
                        >
                          {t('tracks.comingSoon')}
                        </span>
                      )}
                    </div>
                    <h3
                      className="font-medium text-apple-text text-[20px] leading-[1.2] mb-3 tracking-tight transition-colors"
                      style={isPublic ? undefined : { color: 'rgba(255,255,255,0.75)' }}
                    >
                      {track.label}
                    </h3>
                    <p className="text-sm text-apple-textSecondary leading-relaxed flex-1 mb-6">
                      {track.marketingHook}
                    </p>
                    {isPublic ? (
                      <Link
                        to={`/dashboard?track=${track.slug}`}
                        className="inline-flex items-center gap-2 self-start text-[12px] font-mono uppercase tracking-[0.08em] px-3 py-2 rounded-full border transition-colors"
                        style={{
                          color: track.color,
                          borderColor: `${track.color}66`,
                          background: `${track.color}10`,
                        }}
                      >
                        {t('tracks.ctaExplore')}
                        <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="inline-flex items-center gap-2 self-start text-[12px] font-mono uppercase tracking-[0.08em] px-3 py-2 rounded-full border cursor-not-allowed"
                        style={{
                          color: 'rgba(255,255,255,0.4)',
                          borderColor: 'rgba(255,255,255,0.1)',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        {t('tracks.ctaExplore')}
                        <ArrowRight size={12} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warum Claude Code? */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <div className="reveal flex flex-col items-center text-center gap-6 mb-12">
            <div className="eyebrow"><span className="pulse" />Warum dieser Kurs</div>
            <h2 className="text-[clamp(32px,4.2vw,52px)] font-semibold tracking-[-0.032em] leading-[1.04] text-apple-text">
              {t('landing.sectionWhyTitle')}
            </h2>
            <p className="text-apple-textSecondary leading-relaxed max-w-2xl">
              {t('landing.sectionWhyLead')}
            </p>
          </div>
          <ul className="stagger space-y-3 max-w-xl mx-auto">
            {['sectionWhy1', 'sectionWhy2', 'sectionWhy3'].map((key) => (
              <li key={key} className="flex gap-4 items-start p-4 rounded-2xl bg-white/[0.025] border border-apple-border">
                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: 'rgba(255,107,26,0.15)', border: '1px solid rgba(255,107,26,0.35)' }}>
                  <CheckCircle2 size={13} className="text-apple-accent" />
                </span>
                <span className="text-apple-text leading-relaxed">{t(`landing.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature-Karten — asymmetric Bento with grid-flow-dense (no equal-3 antipattern) */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="reveal flex flex-col items-center text-center gap-6 mb-12">
            <div className="eyebrow"><span className="pulse" />Was du bekommst</div>
            <h2 className="text-[clamp(32px,4.2vw,52px)] font-semibold tracking-[-0.032em] leading-[1.04] text-apple-text">
              Drei <em className="italic-serif">Hebel</em>, die alles ändern
            </h2>
          </div>
          {/* Bento layout: Card 1 = Master (lg:col-span-2 row-span-2), Card 2 + 3 stacked on the right.
              grid-flow-dense ensures no empty cells if the gallery shrinks. */}
          <div
            className="stagger grid grid-cols-1 lg:grid-cols-3 lg:auto-rows-[minmax(200px,auto)] gap-4"
            style={{ gridAutoFlow: 'dense' }}
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const isMaster = i === 0;
              return (
                <div
                  key={f.titleKey}
                  className={`shell group transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 ${
                    isMaster ? 'lg:col-span-2 lg:row-span-2 relative overflow-hidden' : ''
                  }`}
                >
                  {/* Master-Card decorative background image, behind content */}
                  {isMaster && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-[6px] rounded-[calc(2rem-6px)] opacity-[0.22] mix-blend-luminosity pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.3]"
                      style={{
                        backgroundImage:
                          'url("https://picsum.photos/seed/claude-code-flow/1200/800")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'contrast(115%) saturate(0.7)',
                      }}
                    />
                  )}
                  {/* Master-Card accent glow on hover */}
                  {isMaster && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100"
                      style={{
                        background:
                          'radial-gradient(ellipse 50% 40% at 30% 30%, rgba(255,107,26,0.18), transparent 70%)',
                      }}
                    />
                  )}
                  <div
                    className={`inner relative ${
                      isMaster ? 'p-10 sm:p-12' : 'p-8'
                    } h-full flex flex-col`}
                  >
                    <div
                      className={`num-serif ${
                        isMaster
                          ? 'text-[clamp(64px,7vw,96px)] mb-7'
                          : 'text-[clamp(38px,3.8vw,52px)] mb-5'
                      }`}
                    >
                      <span>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <Icon
                      size={isMaster ? 28 : 22}
                      className="text-apple-accent mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    />
                    <h3
                      className={`font-medium text-apple-text mb-2 tracking-tight transition-colors group-hover:text-apple-accent ${
                        isMaster
                          ? 'text-[clamp(24px,2.8vw,32px)] leading-[1.15]'
                          : 'text-[19px]'
                      }`}
                    >
                      {t(f.titleKey)}
                    </h3>
                    <p
                      className={`text-apple-textSecondary leading-relaxed flex-1 ${
                        isMaster ? 'text-base max-w-[42ch]' : 'text-sm'
                      }`}
                    >
                      {t(f.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sources → Hub: scroll-driven curriculum overview */}
      <SourcesHubSection />

      {/* Founder Section */}
      <div className="reveal">
        <FounderSection contactEmail="office@cittasana.de" />
      </div>

      {/* Testimonials */}
      <div className="reveal">
        <TestimonialSection />
      </div>

      {/* Neueste Updates — live from CMS (top 4 most recently updated lessons) */}
      {recentLessons.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4">
            <div className="reveal flex flex-col items-center text-center gap-6 mb-12">
              <div className="eyebrow">
                <span className="pulse" />
                Aktuell &middot; {currentMonthLabel}
              </div>
              <h2 className="text-[clamp(30px,4vw,48px)] font-semibold tracking-[-0.032em] leading-[1.04] text-apple-text">
                Neueste <em className="italic-serif">Claude-Code</em>-Updates
              </h2>
              <p className="text-apple-textSecondary text-sm max-w-xl">
                Die zuletzt überarbeiteten Lektionen &mdash; jede Woche kommen neue dazu, sobald wichtige Claude-Code-Releases erscheinen.
              </p>
            </div>
            <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentLessons.map((lesson) => {
                const updatedAt = new Date(lesson.updatedAt);
                const formattedDate = updatedAt.toLocaleDateString(i18n.language || 'de-DE', {
                  day: '2-digit',
                  month: 'short',
                });
                return (
                  <Link
                    key={lesson.id}
                    to={`/lesson/${lesson.lessonId}`}
                    className="shell group block"
                  >
                    <div className="inner p-6 text-center transition-transform group-hover:translate-y-[-2px] h-full flex flex-col">
                      <Sparkles size={22} className="mx-auto mb-3 text-apple-accent" />
                      <h3 className="font-medium text-apple-text text-sm tracking-tight mb-2 group-hover:text-apple-accent transition-colors line-clamp-2">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-apple-textSecondary leading-relaxed flex-1 line-clamp-3">
                        {lesson.description}
                      </p>
                      <p className="mt-3 text-[10px] text-apple-muted font-mono uppercase tracking-[0.08em]">
                        {formattedDate} &middot; Level {lesson.level}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Was du lernst */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center reveal">
          <div className="eyebrow center mb-8"><span className="pulse" />Curriculum</div>
          <h2 className="text-[clamp(32px,4.2vw,52px)] font-semibold tracking-[-0.032em] leading-[1.04] text-apple-text mb-6">
            {t('landing.sectionWhatTitle')}
          </h2>
          <p className="text-apple-textSecondary mb-8 leading-relaxed">
            {t('landing.sectionWhatIntro')}
          </p>
          <div className="shell">
            <div className="inner p-8 sm:p-10">
              <p className="text-sm text-apple-text leading-[1.75] max-w-2xl mx-auto">
                {t('landing.sectionWhatItems')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto reveal">
          <NewsletterSignup source="landing" />
        </div>
      </section>

      {/* Final CTA — radial halo */}
      <section className="relative py-32 sm:py-40 px-4 isolate">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 30%, rgba(255,107,26,0.22) 0%, rgba(255,107,26,0.10) 35%, rgba(255,107,26,0.04) 60%, transparent 80%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(255,107,26,0.08), transparent 75%)',
            filter: 'blur(28px)',
          }}
        />
        <div className="max-w-2xl mx-auto text-center reveal">
          <div className="eyebrow center mb-8"><span className="pulse" />Bereit, loszulegen?</div>
          <h2 className="text-[clamp(42px,5.6vw,76px)] font-semibold tracking-[-0.038em] leading-[1.02] text-apple-text mb-6 text-wrap-balance">
            Dein <em className="italic-serif">eigener</em> Claude-Code-Workflow
          </h2>
          <p
            ref={ctaParagraphRef}
            className="text-apple-textSecondary mb-10 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            {t('landing.ctaText')
              .split(/\s+/)
              .map((word, idx) => (
                <span key={`${word}-${idx}`} data-scrub-word className="inline-block">
                  {word}
                  {idx < t('landing.ctaText').split(/\s+/).length - 1 ? ' ' : ''}
                </span>
              ))}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">
                {t('landing.openDashboard')}
                <span className="btn-icon"><ArrowRight size={12} /></span>
              </Link>
            ) : (
              <Link to="/start-kostenlos" className="btn-primary">
                {t('landing.ctaFreeStart')}
                <span className="btn-icon"><ArrowRight size={12} /></span>
              </Link>
            )}
            <Link to="/docs" className="btn-secondary">
              <FileText size={14} className="text-apple-accent" />
              {t('landing.ctaDocs')}
            </Link>
          </div>
          {!isAuthenticated && (
            <div className="mt-8">
              <Link to="/login" className="text-[12px] text-apple-textSecondary hover:text-apple-accent font-mono uppercase tracking-[0.06em] transition-colors">
                {t('auth.loginButton', 'Anmelden')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingView;
