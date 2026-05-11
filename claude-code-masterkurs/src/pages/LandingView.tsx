import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, FileText, BookOpen, Zap, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import VideoHero from '../components/Landing/VideoHero';
import FounderSection from '../components/Landing/FounderSection';
import NewsletterSignup from '../components/Newsletter/NewsletterSignup';
import { contentApi } from '../lib/api';
import type { AdminLessonConfig } from '../lib/api';

const FEATURES = [
  { icon: BookOpen, titleKey: 'landing.featureLessons', descKey: 'landing.featureLessonsDesc' },
  { icon: Zap, titleKey: 'landing.featureChallenges', descKey: 'landing.featureChallengesDesc' },
  { icon: Award, titleKey: 'landing.featureCert', descKey: 'landing.featureCertDesc' },
];

const LandingView = () => {
  const { t, i18n } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const rootRef = useRef<HTMLDivElement>(null);

  // ── Live content from CMS ─────────────────────────────────
  const [lessons, setLessons] = useState<AdminLessonConfig[]>([]);

  useEffect(() => {
    let cancelled = false;
    contentApi
      .getLessons({ track: 'main' })
      .then((res) => {
        if (!cancelled && Array.isArray(res.data)) setLessons(res.data);
      })
      .catch(() => {
        /* offline / cold start — leave lessons empty, UI falls back gracefully */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalLessons = lessons.length;

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
      { key: 'statsQuizzes', value: totalLessons > 0 ? `${totalLessons}` : '...' },
      { key: 'statsProjects', value: '6+' },
    ],
    [totalLessons]
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

      {/* Hero (existing VideoHero component) */}
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

      {/* Feature-Karten (Outcome bento with serif numerals) */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="reveal flex flex-col items-center text-center gap-6 mb-12">
            <div className="eyebrow"><span className="pulse" />Was du bekommst</div>
            <h2 className="text-[clamp(32px,4.2vw,52px)] font-semibold tracking-[-0.032em] leading-[1.04] text-apple-text">
              Drei <em className="italic-serif">Hebel</em>, die alles ändern
            </h2>
          </div>
          <div className="stagger grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.titleKey} className="shell">
                  <div className="inner p-8 h-full flex flex-col">
                    <div className="num-serif text-[clamp(38px,3.8vw,52px)] mb-5">
                      <span>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <Icon size={22} className="text-apple-accent mb-3" />
                    <h3 className="text-[19px] font-medium text-apple-text mb-2 tracking-tight">
                      {t(f.titleKey)}
                    </h3>
                    <p className="text-sm text-apple-textSecondary leading-relaxed flex-1">
                      {t(f.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <div className="reveal">
        <FounderSection contactEmail="office@cittasana.de" />
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
          <p className="text-apple-textSecondary mb-10 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t('landing.ctaText')}
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
