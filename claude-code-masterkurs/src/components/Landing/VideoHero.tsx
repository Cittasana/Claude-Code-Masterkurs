import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useAuthStore } from '../../store/authStore';
import { gsap } from '../../lib/gsap';

/**
 * Hero content section.
 * The background video now lives at the LandingView root and spans the entire
 * page (top-to-bottom, edge-to-edge, fixed). This component only renders the
 * eyebrow + headline + bullets + CTA stack that sits on top of it.
 */
const VideoHero = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const heroRef = useRef<HTMLElement>(null);

  /** One-time staggered entry on hero text blocks. */
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
      className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8"
      style={{
        minHeight: 'min(90vh, 880px)',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28 flex flex-col justify-end min-h-inherit">
        <div className="max-w-2xl">
          <div data-hero-intro className="eyebrow mb-7">
            <span className="pulse" />
            Claude Code · Masterkurs · 2026
          </div>

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

          <p
            data-hero-intro
            className="text-lg sm:text-xl text-white/80 max-w-xl mb-7 leading-relaxed"
          >
            {t('landing.videoHeroSubtitle')}
          </p>

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
