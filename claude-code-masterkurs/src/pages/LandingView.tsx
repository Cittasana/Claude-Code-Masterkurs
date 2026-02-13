import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileText, BookOpen, Zap, Award, CheckCircle2, Layers, Monitor, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import VideoHero from '../components/Landing/VideoHero';
import FounderSection from '../components/Landing/FounderSection';
import TestimonialSection from '../components/Landing/TestimonialSection';
import NewsletterSignup from '../components/Newsletter/NewsletterSignup';

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
      <Helmet>
        <title>Claude Code Masterkurs – Lerne KI-gestütztes Programmieren</title>
        <meta name="description" content="Der umfassende Online-Kurs für KI-gestützte Softwareentwicklung mit Claude Code. 27 Lektionen, interaktive Challenges und Live-Playground." />
        <link rel="canonical" href="https://claude-code-masterkurs.de/" />
      </Helmet>
      {/* NEW: Hero with Video Embed */}
      <VideoHero />

      {/* Stats bar */}
      <section className="py-8 sm:py-10 border-t border-apple-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto px-4">
          {STATS.map(({ key, value }) => (
            <div
              key={key}
              className="rounded-apple bg-apple-surface border border-apple-border py-4 px-3 text-center"
            >
              <span className="block text-2xl font-bold text-apple-accent font-mono">{value}</span>
              <span className="text-sm text-apple-muted">{t(`landing.${key}`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Warum Claude Code? */}
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

      {/* Feature-Karten */}
      <section className="py-10 sm:py-16 border-t border-apple-border px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 max-w-5xl mx-auto">
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

      {/* NEW: Founder Story Section */}
      <FounderSection
        discordUrl={`https://discord.gg/${import.meta.env.VITE_DISCORD_SERVER_ID || 'claude-code-masterkurs'}`}
        contactEmail="office@cittasana.de"
      />

      {/* NEW: Testimonial Section */}
      <TestimonialSection />

      {/* Neueste Updates */}
      <section className="py-10 sm:py-14 border-t border-apple-border px-4 bg-apple-surface/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text text-center mb-2">
            Neueste Claude-Code-Updates
          </h2>
          <p className="text-apple-textSecondary text-center mb-8 max-w-xl mx-auto text-sm">
            Fast Mode, Agent Teams, Checkpointing und offizielle Docs – im Kurs abgedeckt.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              to="/docs"
              className="apple-card text-center p-5 border border-apple-border bg-apple-surface hover:border-apple-accent/40 transition-colors group"
            >
              <Zap size={26} className="mx-auto mb-2 text-apple-accent" />
              <h3 className="font-semibold text-apple-text mb-1 text-sm group-hover:text-apple-accent transition-colors">Fast Mode & Opus 4.6</h3>
              <p className="text-xs text-apple-muted leading-relaxed">Schnellere Antworten mit /fast</p>
            </Link>
            <Link
              to="/docs"
              className="apple-card text-center p-5 border border-apple-border bg-apple-surface hover:border-apple-accent/40 transition-colors group"
            >
              <Layers size={26} className="mx-auto mb-2 text-apple-accent" />
              <h3 className="font-semibold text-apple-text mb-1 text-sm group-hover:text-apple-accent transition-colors">Agent Teams & Checkpointing</h3>
              <p className="text-xs text-apple-muted leading-relaxed">Multi-Agent, /rewind</p>
            </Link>
            <Link
              to="/docs"
              className="apple-card text-center p-5 border border-apple-border bg-apple-surface hover:border-apple-accent/40 transition-colors group"
            >
              <Monitor size={26} className="mx-auto mb-2 text-apple-accent" />
              <h3 className="font-semibold text-apple-text mb-1 text-sm group-hover:text-apple-accent transition-colors">Claude Code überall</h3>
              <p className="text-xs text-apple-muted leading-relaxed">Web, Desktop, IDE, Slack</p>
            </Link>
            <Link
              to="/docs"
              className="apple-card text-center p-5 border border-apple-border bg-apple-surface hover:border-apple-accent/40 transition-colors group"
            >
              <ExternalLink size={26} className="mx-auto mb-2 text-apple-accent" />
              <h3 className="font-semibold text-apple-text mb-1 text-sm group-hover:text-apple-accent transition-colors">Offizielle Docs</h3>
              <p className="text-xs text-apple-muted leading-relaxed">code.claude.com</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Was du lernst */}
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

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 border-t border-apple-border bg-apple-surface/30 px-4">
        <NewsletterSignup source="landing" />
      </section>

      {/* CTA-Bereich */}
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
              <Link to="/start-kostenlos" className="btn-primary flex items-center gap-2 px-6 py-3.5 font-semibold">
                {t('landing.ctaFreeStart')}
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
