import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface VideoHeroProps {
  /** Video embed URL (Vimeo or YouTube). Falls back to placeholder if empty. */
  videoUrl?: string;
}

const VideoHero = ({ videoUrl }: VideoHeroProps) => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const resolvedVideoUrl =
    videoUrl || import.meta.env.VITE_HERO_VIDEO_URL || '';

  return (
    <section
      className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pb-24 overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        backgroundColor: '#1a1a1a',
      }}
    >
      {/* Subtle orange glow at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -20%, rgba(255,149,0,0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-apple-text tracking-tight leading-tight mb-5">
              {t('landing.videoHeroTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-apple-textSecondary max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed">
              {t('landing.videoHeroSubtitle')}
            </p>

            {/* Benefit bullets */}
            <ul className="flex flex-col gap-3 mb-8 max-w-md mx-auto lg:mx-0">
              {['videoHeroBenefit1', 'videoHeroBenefit2', 'videoHeroBenefit3'].map(
                (key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 text-apple-textSecondary text-sm sm:text-base"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-apple-accent"
                    />
                    <span>{t(`landing.${key}`)}</span>
                  </li>
                )
              )}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary flex items-center justify-center gap-2 text-base sm:text-lg px-8 py-3.5 w-full sm:w-auto min-h-[52px] font-semibold"
                >
                  {t('landing.openDashboard')}
                  <ArrowRight size={20} className="shrink-0" />
                </Link>
              ) : (
                <Link
                  to="/start-kostenlos"
                  className="btn-primary flex items-center justify-center gap-2 text-base sm:text-lg px-8 py-3.5 w-full sm:w-auto min-h-[52px] font-semibold shadow-apple-glow"
                >
                  {t('landing.ctaFreeStart')}
                  <ArrowRight size={20} className="shrink-0" />
                </Link>
              )}
            </div>

            <p className="text-apple-muted text-xs sm:text-sm mt-4">
              {t('landing.trustLine')}
            </p>
          </div>

          {/* Right: Video embed */}
          <div className="w-full">
            {resolvedVideoUrl ? (
              <div className="relative rounded-apple-lg overflow-hidden border border-apple-border shadow-apple aspect-video bg-apple-surface">
                <iframe
                  src={resolvedVideoUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={t('landing.videoTitle')}
                  loading="lazy"
                />
              </div>
            ) : (
              /* Video placeholder when no URL is configured */
              <div className="relative rounded-apple-lg overflow-hidden border border-apple-border shadow-apple aspect-video bg-apple-surface flex flex-col items-center justify-center group cursor-pointer hover:border-apple-accent/40 transition-colors">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-apple-accent/15 flex items-center justify-center mb-4 group-hover:bg-apple-accent/25 transition-colors">
                  <Play
                    size={32}
                    className="text-apple-accent ml-1"
                    fill="currentColor"
                  />
                </div>
                <p className="text-apple-textSecondary text-sm font-medium">
                  {t('landing.videoPlaceholder')}
                </p>
                <p className="text-apple-muted text-xs mt-1">
                  {t('landing.videoComingSoon')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;
