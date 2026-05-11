import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useAuthStore } from '../../store/authStore';
import { gsap } from '../../lib/gsap';

interface VideoHeroProps {
  /** Video embed URL (Vimeo or YouTube). Falls back to placeholder if empty. */
  videoUrl?: string;
}

const VideoHero = ({ videoUrl }: VideoHeroProps) => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const heroRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  const resolvedVideoUrl =
    videoUrl || import.meta.env.VITE_HERO_VIDEO_URL || '';

  /** Scrubbing scale + opacity on the video tile + staggered intro for hero text */
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      // Image-scale on view — tile starts smaller + slightly faded, scrubs to 1.0 as it enters
      if (tileRef.current) {
        gsap.fromTo(
          tileRef.current,
          { scale: 0.92, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: tileRef.current,
              start: 'top 90%',
              end: 'center center',
              scrub: 0.6,
            },
          }
        );
      }

      // One-time intro stagger: H1 + subtitle + bullets + CTA all rise together with slight offset
      const introTargets = heroRef.current?.querySelectorAll('[data-hero-intro]');
      if (introTargets && introTargets.length > 0) {
        gsap.fromTo(
          introTargets,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.08,
          }
        );
      }
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pb-24 overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        backgroundColor: 'var(--inner)',
      }}
    >
      {/* Subtle accent glow at top — Ethereal orange, matches the rest of the page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,107,26,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 80% 80%, rgba(255,107,26,0.05), transparent 75%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <h1
              data-hero-intro
              className="text-[clamp(36px,4.8vw,56px)] font-semibold text-apple-text leading-[1.04] mb-5 max-w-[20ch] mx-auto lg:mx-0"
              style={{
                letterSpacing: '-0.032em',
                textWrap: 'balance',
              }}
            >
              {t('landing.videoHeroTitle')}
            </h1>
            <p
              data-hero-intro
              className="text-lg sm:text-xl text-apple-textSecondary max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed"
            >
              {t('landing.videoHeroSubtitle')}
            </p>

            {/* Benefit bullets */}
            <ul
              data-hero-intro
              className="flex flex-col gap-3 mb-8 max-w-md mx-auto lg:mx-0"
            >
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
            <div
              data-hero-intro
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
            >
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

            <p
              data-hero-intro
              className="text-apple-muted text-xs sm:text-sm mt-4"
            >
              {t('landing.trustLine')}
            </p>
          </div>

          {/* Right: Video embed — scale-on-view via GSAP ScrollTrigger */}
          <div ref={tileRef} className="w-full will-change-transform">
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
