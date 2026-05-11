import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle } from 'lucide-react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';

interface FounderSectionProps {
  /** Path to founder headshot image. Falls back to placeholder avatar. */
  founderImageUrl?: string;
  /** Contact email */
  contactEmail?: string;
}

const FounderSection = ({
  founderImageUrl = '/founder.jpg',
  contactEmail = 'office@cittasana.de',
}: FounderSectionProps) => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  /** Scrubbing scale + opacity on the round portrait as the section enters view. */
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !portraitRef.current) return;

      gsap.fromTo(
        portraitRef.current,
        { scale: 0.88, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: portraitRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 0.6,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 border-t border-apple-border">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14 items-center">
          {/* Left: Founder image (2 cols) — round portrait with accent ring + GSAP scale-on-view */}
          <div className="md:col-span-2 flex justify-center">
            {founderImageUrl ? (
              <div ref={portraitRef} className="relative will-change-transform">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-apple-accent/30 via-transparent to-transparent blur-2xl scale-110"
                />
                <img
                  src={founderImageUrl}
                  alt={t('founder.imageAlt')}
                  className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full object-cover border border-apple-border shadow-[0_30px_80px_-40px_rgba(255,107,26,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              /* Placeholder avatar — round */
              <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-apple-surface border border-apple-border shadow-apple flex flex-col items-center justify-center">
                <span className="text-6xl sm:text-7xl mb-2">C</span>
                <span className="text-apple-muted text-xs font-mono uppercase tracking-wider">
                  {t('founder.photoPlaceholder')}
                </span>
              </div>
            )}
          </div>

          {/* Right: Story (3 cols) */}
          <div className="md:col-span-3">
            <p className="text-apple-accent font-mono text-xs uppercase tracking-widest mb-3">
              {t('founder.sectionLabel')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-4">
              {t('founder.greeting')}
            </h2>

            <div className="space-y-4 text-apple-textSecondary leading-relaxed">
              <p>{t('founder.story1')}</p>
              <p>{t('founder.story2')}</p>
              <p>{t('founder.story3')}</p>
            </div>

            {/* Mission statement */}
            <div className="mt-6 p-4 rounded-apple bg-apple-accent/8 border border-apple-accent/20">
              <p className="text-apple-text font-medium text-sm leading-relaxed">
                <span className="text-apple-accent font-mono mr-2">{'//'}</span>
                {t('founder.mission')}
              </p>
            </div>

            {/* Contact links */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-apple bg-apple-surface border border-apple-border hover:border-apple-accent/40 transition-colors text-sm text-apple-textSecondary hover:text-apple-text"
              >
                <Mail size={16} className="text-apple-accent shrink-0" />
                {contactEmail}
              </a>
              <a
                href={`mailto:${contactEmail}?subject=Frage%20zum%20Claude%20Code%20Masterkurs`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-apple bg-apple-surface border border-apple-border hover:border-apple-accent/40 transition-colors text-sm text-apple-textSecondary hover:text-apple-text"
              >
                <MessageCircle size={16} className="text-apple-accent shrink-0" />
                {t('founder.contactCta')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
