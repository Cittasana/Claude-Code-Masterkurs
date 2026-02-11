import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';

// Discord SVG icon (matching project pattern from DiscordWidget)
function DiscordIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  );
}

interface FounderSectionProps {
  /** Path to founder headshot image. Falls back to placeholder avatar. */
  founderImageUrl?: string;
  /** Discord invite URL */
  discordUrl?: string;
  /** Contact email */
  contactEmail?: string;
}

const FounderSection = ({
  founderImageUrl,
  discordUrl = 'https://discord.gg/claude-code-masterkurs',
  contactEmail = 'office@cittasana.de',
}: FounderSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="py-14 sm:py-20 border-t border-apple-border">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14 items-center">
          {/* Left: Founder image (2 cols) */}
          <div className="md:col-span-2 flex justify-center">
            {founderImageUrl ? (
              <img
                src={founderImageUrl}
                alt={t('founder.imageAlt')}
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl object-cover border-2 border-apple-border shadow-apple"
              />
            ) : (
              /* Placeholder avatar */
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl bg-apple-surface border-2 border-apple-border shadow-apple flex flex-col items-center justify-center">
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
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-apple text-sm font-medium text-white transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: '#5865F2' }}
              >
                <DiscordIcon className="w-4 h-4" />
                {t('founder.joinDiscord')}
                <ArrowRight size={14} className="shrink-0" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
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
