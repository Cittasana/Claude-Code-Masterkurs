import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileText, BookOpen, Zap, Award, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Apple-Design: Grau-Basis, dezentes Punktmuster
const dotPatternStyle = {
  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)`,
  backgroundSize: '28px 28px',
  backgroundColor: '#1a1a1a',
};

// Equalizer nur in Grau + Orange (Apple)
const BARS = [42, 68, 35, 80, 55, 72, 48, 90, 62, 38, 75, 52];
const BAR_COLORS = [
  '#3a3a3a',
  '#ff9500',
  '#4a4a4a',
  '#ffaa33',
  '#3a3a3a',
  '#242424',
  '#ff9500',
  '#4a4a4a',
  '#3a3a3a',
  '#ff9500',
  '#4a4a4a',
  '#3a3a3a',
];

const STATS = [
  { key: 'statsLessons', value: '27' },
  { key: 'statsLevels', value: '3' },
  { key: 'statsQuizzes', value: '27' },
  { key: 'statsProjects', value: '6+' },
];

const LandingView = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg">
      {/* Hero – Grau + Orange Akzent */}
      <section
        className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pb-24 overflow-hidden"
        style={dotPatternStyle}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% -20%, rgba(255,149,0,0.06) 0%, transparent 55%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Headline: Value Proposition (above the fold) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-apple-text tracking-tight leading-tight mb-5">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-apple-textSecondary max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>

          {/* Benefit bullets – Conversion: "What's in it for me?" in 3 seconds */}
          <ul className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 max-w-2xl mx-auto">
            {['heroBenefit1', 'heroBenefit2', 'heroBenefit3'].map((key) => (
              <li key={key} className="flex items-center gap-2 text-apple-textSecondary text-sm sm:text-base">
                <CheckCircle2 size={18} className="shrink-0 text-apple-accent" />
                <span>{t(`landing.${key}`)}</span>
              </li>
            ))}
          </ul>

          {/* Single primary CTA + secondary (Conversion: one clear action) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary flex items-center justify-center gap-2 text-base sm:text-lg px-8 py-3.5 w-full sm:w-auto min-h-[52px] font-semibold"
              >
                {t('landing.openDashboard')}
                <ArrowRight size={20} className="shrink-0" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary flex items-center justify-center gap-2 text-base sm:text-lg px-8 py-3.5 w-full sm:w-auto min-h-[52px] font-semibold shadow-apple-glow"
                  aria-label={t('landing.ctaStart')}
                >
                  {t('landing.ctaStart')}
                  <ArrowRight size={20} className="shrink-0" />
                </Link>
                <Link
                  to="/docs"
                  className="flex items-center justify-center gap-2 text-base px-6 py-3 w-full sm:w-auto rounded-apple border border-apple-borderLight text-apple-text font-medium hover:bg-apple-hover hover:border-apple-accent/50 transition-colors"
                >
                  <FileText size={18} className="shrink-0 text-apple-accent" />
                  {t('landing.ctaDocs')}
                </Link>
              </>
            )}
          </div>

          {/* Social proof one-liner */}
          <p className="text-apple-muted text-xs sm:text-sm uppercase tracking-wider mb-8">
            {t('landing.socialProofLine')}
          </p>

          {/* Stats – Grau Karten, Orange nur für Zahlen/Akzent */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-14">
            {STATS.map(({ key, value }) => (
              <div
                key={key}
                className="rounded-apple bg-apple-surface border border-apple-border py-4 px-3"
              >
                <span className="block text-2xl font-bold text-apple-accent font-mono">{value}</span>
                <span className="text-sm text-apple-muted">{t(`landing.${key}`)}</span>
              </div>
            ))}
          </div>

          {/* Equalizer nur Grau/Orange */}
          <div className="flex items-end justify-center gap-1.5 h-14 sm:h-16" aria-hidden>
            {BARS.map((height, i) => (
              <div
                key={i}
                className="w-2 sm:w-2.5 rounded-full opacity-90"
                style={{
                  height: `${height}%`,
                  minHeight: 6,
                  backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Warum Claude Code? – mehr Info */}
      <section className="py-12 sm:py-16 border-t border-apple-border bg-apple-bg">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-3">
            {t('landing.sectionWhyTitle')}
          </h2>
          <p className="text-apple-textSecondary mb-8 leading-relaxed">
            {t('landing.sectionWhyLead')}
          </p>
          <ul className="space-y-4 text-left max-w-xl mx-auto">
            {['sectionWhy1', 'sectionWhy2', 'sectionWhy3'].map((key) => (
              <li key={key} className="flex gap-3 items-start">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-apple-accent" />
                <span className="text-apple-textSecondary">{t(`landing.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature-Karten – Apple Cards Grau, Orange nur Icon */}
      <section className="py-12 sm:py-16 border-t border-apple-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="apple-card text-center p-6 border border-apple-border bg-apple-surface hover:border-apple-borderLight transition-colors">
            <BookOpen size={28} className="mx-auto mb-3 text-apple-accent" />
            <h3 className="font-semibold text-apple-text mb-2">{t('landing.featureLessons')}</h3>
            <p className="text-sm text-apple-muted leading-relaxed">{t('landing.featureLessonsDesc')}</p>
          </div>
          <div className="apple-card text-center p-6 border border-apple-border bg-apple-surface hover:border-apple-borderLight transition-colors">
            <Zap size={28} className="mx-auto mb-3 text-apple-accent" />
            <h3 className="font-semibold text-apple-text mb-2">{t('landing.featureChallenges')}</h3>
            <p className="text-sm text-apple-muted leading-relaxed">{t('landing.featureChallengesDesc')}</p>
          </div>
          <div className="apple-card text-center p-6 border border-apple-border bg-apple-surface hover:border-apple-borderLight transition-colors">
            <Award size={28} className="mx-auto mb-3 text-apple-accent" />
            <h3 className="font-semibold text-apple-text mb-2">{t('landing.featureCert')}</h3>
            <p className="text-sm text-apple-muted leading-relaxed">{t('landing.featureCertDesc')}</p>
          </div>
        </div>
      </section>

      {/* Was du lernst – Kurzüberblick */}
      <section className="py-12 sm:py-16 border-t border-apple-border bg-apple-surface/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-3">
            {t('landing.sectionWhatTitle')}
          </h2>
          <p className="text-apple-textSecondary mb-6 leading-relaxed">
            {t('landing.sectionWhatIntro')}
          </p>
          <p className="text-sm text-apple-muted leading-relaxed max-w-2xl mx-auto">
            {t('landing.sectionWhatItems')}
          </p>
        </div>
      </section>

      {/* CTA-Bereich – Conversion: wiederholter CTA + Trust */}
      <section className="py-12 border-t border-apple-border">
        <div className="text-center">
          <p className="text-apple-textSecondary mb-6 max-w-xl mx-auto">{t('landing.ctaText')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary flex items-center gap-2 px-6 py-3.5 font-semibold">
                {t('landing.openDashboard')}
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/register" className="btn-primary flex items-center gap-2 px-6 py-3.5 font-semibold">
                {t('landing.ctaStart')}
                <ArrowRight size={18} />
              </Link>
            )}
            <Link
              to="/docs"
              className="flex items-center gap-2 px-6 py-3 rounded-apple border border-apple-borderLight text-apple-text font-medium hover:bg-apple-hover transition-colors"
            >
              <FileText size={18} className="text-apple-accent" />
              {t('landing.ctaDocs')}
            </Link>
            <Link to="/login" className="text-apple-textSecondary hover:text-apple-accent text-sm font-medium transition-colors">
              {t('auth.loginButton', 'Anmelden')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
