import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  BookOpen,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { contentApi, freeSignupApi, newsletterApi, ApiError } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { FREE_LESSON_LIMIT } from '../lib/lessons-config';
import TestimonialSection from '../components/Landing/TestimonialSection';

const StartKostenlosView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [lessons, setLessonsData] = useState<{ lessonId: number; title: string; description: string; duration: string }[]>([]);

  useEffect(() => {
    contentApi.getLessons({ track: 'main' }).then(res => {
      setLessonsData(res.data.map(l => ({ lessonId: l.lessonId, title: l.title, description: l.description, duration: l.duration })));
    }).catch(() => {});
  }, []);

  // Get the first 5 lessons (free tier)
  const freeLessons = lessons.filter((l) => l.lessonId < FREE_LESSON_LIMIT);

  const handleFreeSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Bitte gib deine E-Mail-Adresse ein.');
      return;
    }

    setLoading(true);

    try {
      const result = await freeSignupApi.signup(email.trim());

      // Store token and user in auth store
      // We need to manually set the state since this is a free signup
      useAuthStore.setState({
        user: result.user,
        token: result.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // Subscribe to newsletter if opted in (non-blocking)
      if (newsletterOptIn) {
        newsletterApi.subscribe(email.trim(), undefined, 'signup').catch(() => {
          // Non-blocking – newsletter signup failure should not affect free signup
        });
      }

      setSuccess(true);

      // Redirect to first lesson after a brief moment
      setTimeout(() => {
        navigate('/lesson/0');
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof TypeError) {
        setError('Server nicht erreichbar. Bitte versuche es spaeter erneut.');
      } else {
        setError('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg">
      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-apple-accent/10 text-apple-accent text-sm font-medium mb-6">
            <BookOpen size={16} />
            {t('freeTier.badge5Free')}
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-apple-text mb-5 tracking-tight leading-tight">
            {t('freeTier.heroTitle')}
          </h1>

          <p className="text-lg sm:text-xl text-apple-textSecondary leading-relaxed max-w-2xl mx-auto">
            {t('freeTier.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Free Lessons Preview */}
      <section className="py-10 sm:py-14 px-4 border-t border-apple-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-apple-text mb-8 text-center">
            {t('freeTier.lessonsPreviewTitle')}
          </h2>

          <div className="space-y-4">
            {freeLessons.map((lesson, index) => (
              <div
                key={lesson.lessonId}
                className="group relative rounded-apple-lg bg-apple-surface border border-apple-border hover:border-apple-accent/40 transition-all duration-200 overflow-hidden"
              >
                {isAuthenticated ? (
                  <Link
                    to={`/lesson/${lesson.lessonId}`}
                    className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6"
                  >
                    <LessonCardContent lesson={lesson} index={index} t={t} />
                  </Link>
                ) : (
                  <div className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6">
                    <LessonCardContent lesson={lesson} index={index} t={t} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border bg-apple-surface/30">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-3">
            {t('freeTier.signupTitle')}
          </h2>

          {isAuthenticated ? (
            <div className="mt-6">
              <p className="text-apple-textSecondary mb-5">
                Du bist bereits angemeldet! Starte direkt mit den Lektionen.
              </p>
              <Link
                to="/lesson/0"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                Jetzt mit Lektion 1 starten
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : success ? (
            <div className="mt-6 p-6 rounded-apple-lg bg-apple-success/10 border border-apple-success/20">
              <CheckCircle2 size={40} className="mx-auto text-apple-success mb-3" />
              <p className="text-apple-success font-semibold text-lg">
                {t('freeTier.signupSuccess')}
              </p>
              <p className="text-apple-textSecondary text-sm mt-2">
                Du wirst gleich zur ersten Lektion weitergeleitet...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center justify-center gap-2 p-3 mb-5 rounded-apple bg-apple-error/10 border border-apple-error/20 text-sm text-apple-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleFreeSignup} className="mt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('freeTier.signupPlaceholder')}
                      required
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3.5 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-2 focus:ring-apple-accent/20 transition-colors text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t('freeTier.signupLoading')}
                      </>
                    ) : (
                      <>
                        {t('freeTier.signupButton')}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

                {/* Newsletter Opt-In Checkbox */}
                <label className="flex items-start gap-2.5 mt-4 cursor-pointer text-left">
                  <input
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-apple-border text-apple-accent focus:ring-apple-accent/20"
                  />
                  <span className="text-sm text-apple-muted">
                    {t('newsletter.signupCheckbox')}
                  </span>
                </label>
              </form>

              {/* Trust Signals */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-apple-muted">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-apple-success" />
                  {t('freeTier.trustNoCreditCard')}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-apple-success" />
                  {t('freeTier.trustFullAccess')}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-apple-success" />
                  {t('freeTier.trustCommunity')}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Social Proof – Reuse existing TestimonialSection */}
      <TestimonialSection />

      {/* Upsell / Upgrade CTA */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-4">
            {t('freeTier.upsellTitle')}
          </h2>
          <p className="text-apple-textSecondary leading-relaxed mb-8 max-w-xl mx-auto">
            {t('freeTier.upsellText')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              {t('freeTier.upsellButton')}
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Feature comparison mini-grid */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            <div className="rounded-apple bg-apple-surface border border-apple-border py-4 px-3 text-center">
              <span className="block text-2xl font-bold text-apple-accent font-mono">27</span>
              <span className="text-xs text-apple-muted">Lektionen</span>
            </div>
            <div className="rounded-apple bg-apple-surface border border-apple-border py-4 px-3 text-center">
              <span className="block text-2xl font-bold text-apple-accent font-mono">6+</span>
              <span className="text-xs text-apple-muted">Projekte</span>
            </div>
            <div className="rounded-apple bg-apple-surface border border-apple-border py-4 px-3 text-center">
              <span className="block text-2xl font-bold text-apple-accent font-mono">24+</span>
              <span className="text-xs text-apple-muted">Challenges</span>
            </div>
            <div className="rounded-apple bg-apple-surface border border-apple-border py-4 px-3 text-center">
              <span className="block text-2xl font-bold text-apple-accent font-mono">1</span>
              <span className="text-xs text-apple-muted">Zertifikat</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ── Lesson Card Content (extracted for Link/div wrapper) ──────────

interface LessonCardContentProps {
  lesson: { id: number; title: string; description: string; duration: string };
  index: number;
  t: (key: string, options?: Record<string, unknown>) => string;
}

function LessonCardContent({ lesson, index, t }: LessonCardContentProps) {
  return (
    <>
      {/* Lesson Number */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-apple-accent/10 border border-apple-accent/20 flex items-center justify-center">
        <span className="text-lg font-bold text-apple-accent font-mono">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-apple-text group-hover:text-apple-accent transition-colors text-base sm:text-lg truncate">
              {lesson.title}
            </h3>
            <p className="text-sm text-apple-textSecondary mt-1 leading-relaxed line-clamp-2">
              {lesson.description}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-apple-muted flex-shrink-0 mt-1">
            <Clock size={14} />
            <span className="text-xs font-mono whitespace-nowrap">{lesson.duration}</span>
          </div>
        </div>

        {/* Free label */}
        <div className="mt-2.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-apple-success/10 text-apple-success text-xs font-medium border border-apple-success/20">
            <CheckCircle2 size={12} />
            {t('freeTier.freeLabel')}
          </span>
        </div>
      </div>
    </>
  );
}

export default StartKostenlosView;
