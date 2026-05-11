import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useAuthStore } from '../../store/authStore';
import { gsap } from '../../lib/gsap';

interface VideoHeroProps {
  /**
   * Local MP4/WebM path or YouTube/Vimeo URL.
   * Local files render as <video autoplay muted loop>; remote URLs as <iframe>.
   * Defaults to the bundled Cittasana ambient background loop.
   */
  videoUrl?: string;
}

const VideoHero = ({ videoUrl }: VideoHeroProps) => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const heroRef = useRef<HTMLElement>(null);

  const resolvedVideoUrl =
    videoUrl || import.meta.env.VITE_HERO_VIDEO_URL || '/hero-bg.mp4';

  const isLocalVideoFile = /\.(mp4|webm|mov)(\?.*)?$/i.test(resolvedVideoUrl);

  /** One-time stagger entry on the hero text blocks. */
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      const introTargets = heroRef.current?.querySelectorAll('[data-hero-intro]');
      if (introTargets && introTargets.length > 0) {
        gsap.fromTo(
          introTargets,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.1,
          }
        );
      }
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden isolate"
      style={{
        minHeight: 'min(90vh, 880px)',
      }}
    >
      {/* ── Background video (full-bleed) ───────────────────────── */}
      {isLocalVideoFile ? (
        <video
          className="absolute inset-0 w-full h-full object-cover -z-10"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={resolvedVideoUrl} type="video/mp4" />
        </video>
      ) : (
        <iframe
          src={resolvedVideoUrl}
          className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
          allow="autoplay; fullscreen; picture-in-picture"
          title={t('landing.videoTitle')}
          loading="lazy"
        />
      )}

      {/* ── Multi-layer overlay for text legibility ─────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: [
            // Top-down dark vignette so nav stays readable
            'linear-gradient(180deg, rgba(5,5,5,0.65) 0%, rgba(5,5,5,0.20) 25%, rgba(5,5,5,0.55) 75%, rgba(5,5,5,0.92) 100%)',
            // Left side gradient pulling focus to text
            'linear-gradient(90deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.20) 45%, rgba(5,5,5,0) 100%)',
            // Subtle warm accent breath at the very top edge
            'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(255,107,26,0.10) 0%, transparent 65%)',
          ].join(', '),
        }}
      />

      {/* ── Content (bottom-left aligned, mirrors webinar pattern) ─ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28 flex flex-col justify-end min-h-inherit">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div
            data-hero-intro
            className="eyebrow mb-7"
          >
            <span className="pulse" />
            Claude Code · Masterkurs · 2026
          </div>

          {/* H1 — italic-serif emphasis like the webinar pattern */}
          <h1
            data-hero-intro
            className="text-[clamp(40px,6vw,80px)] font-semibold text-white leading-[1.02] mb-6"
            style={{
              letterSpacing: '-0.035em',
              textWrap: 'balance',
            }}
          >
            {t('landing.videoHeroTitle')}
          </h1>

          {/* Subtitle */}
          <p
            data-hero-intro
            className="text-lg sm:text-xl text-white/80 max-w-xl mb-7 leading-relaxed"
          >
            {t('landing.videoHeroSubtitle')}
          </p>

          {/* Benefit bullets */}
          <ul
            data-hero-intro
            className="flex flex-col gap-3 mb-9 max-w-md"
          >
            {['videoHeroBenefit1', 'videoHeroBenefit2', 'videoHeroBenefit3'].map((key) => (
              <li
                key={key}
                className="flex items-center gap-2.5 text-white/85 text-sm sm:text-base"
              >
                <CheckCircle2 size={18} className="shrink-0 text-apple-accent" />
                <span>{t(`landing.${key}`)}</span>
              </li>
            ))}
          </ul>

          {/* CTA row */}
          <div
            data-hero-intro
            className="flex flex-col sm:flex-row items-start gap-3"
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
            <Link
              to="/docs"
              className="btn-secondary flex items-center justify-center gap-2 text-base px-7 py-3.5 w-full sm:w-auto min-h-[52px]"
            >
              {t('landing.ctaDocs')}
            </Link>
          </div>

          <p
            data-hero-intro
            className="text-white/55 text-xs sm:text-sm mt-5 font-mono tracking-[0.02em]"
          >
            {t('landing.trustLine')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;
