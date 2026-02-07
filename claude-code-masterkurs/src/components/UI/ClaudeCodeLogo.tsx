import { useTranslation } from 'react-i18next';

/** Logo colors: Apple-Style Orange mit dunklerer Outline für Tiefe */
const LOGO_FILL = '#ff9500';
const LOGO_OUTLINE = '#cc7700';
/* Crisp outline: multiple 0-blur shadows in all directions (no spread in text-shadow) */
const LOGO_OUTLINE_SHADOW = [
  '1px 0 0 ' + LOGO_OUTLINE,
  '-1px 0 0 ' + LOGO_OUTLINE,
  '0 1px 0 ' + LOGO_OUTLINE,
  '0 -1px 0 ' + LOGO_OUTLINE,
  '1px 1px 0 ' + LOGO_OUTLINE,
  '-1px -1px 0 ' + LOGO_OUTLINE,
  '1px -1px 0 ' + LOGO_OUTLINE,
  '-1px 1px 0 ' + LOGO_OUTLINE,
  '2px 0 0 ' + LOGO_OUTLINE,
  '-2px 0 0 ' + LOGO_OUTLINE,
  '0 2px 0 ' + LOGO_OUTLINE,
  '0 -2px 0 ' + LOGO_OUTLINE,
  '2px 1px 0 ' + LOGO_OUTLINE,
  '-2px -1px 0 ' + LOGO_OUTLINE,
  '1px 2px 0 ' + LOGO_OUTLINE,
  '-1px -2px 0 ' + LOGO_OUTLINE,
].join(', ');

interface ClaudeCodeLogoProps {
  /** Size: 'sm' (nav), 'md' (default), 'lg' (dashboard hero) */
  size?: 'sm' | 'md' | 'lg';
  /** Show "Masterkurs" subtitle */
  showSubtitle?: boolean;
  /** Optional wrapper class */
  className?: string;
}

const sizeStyles = {
  sm: {
    line1: 'text-lg sm:text-xl tracking-[0.2em]',
    line2: 'text-lg sm:text-xl tracking-[0.35em]',
    subtitle: 'text-[10px] mt-1 tracking-[0.25em]',
  },
  md: {
    line1: 'text-2xl sm:text-3xl tracking-[0.22em]',
    line2: 'text-2xl sm:text-3xl tracking-[0.38em]',
    subtitle: 'text-xs mt-2 tracking-[0.3em]',
  },
  lg: {
    line1: 'text-4xl sm:text-5xl md:text-6xl tracking-[0.2em] sm:tracking-[0.25em]',
    line2: 'text-4xl sm:text-5xl md:text-6xl tracking-[0.35em] sm:tracking-[0.4em]',
    subtitle: 'text-sm sm:text-base mt-4 tracking-[0.35em]',
  },
};

export default function ClaudeCodeLogo({
  size = 'lg',
  showSubtitle = true,
  className = '',
}: ClaudeCodeLogoProps) {
  const { t } = useTranslation();
  const s = sizeStyles[size];

  const outlineWithDepth = `${LOGO_OUTLINE_SHADOW}, 3px 3px 0 rgba(0,0,0,0.25), 2px 2px 0 rgba(0,0,0,0.2)`;

  return (
    <div className={`claude-code-logo inline-block text-center ${className}`}>
      <div
        className="font-bold uppercase leading-none"
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 700,
          color: LOGO_FILL,
          textShadow: outlineWithDepth,
        }}
      >
        <div className={s.line1}>Claude</div>
        <div className={s.line2}>Code</div>
      </div>
      {showSubtitle && (
        <div
          className={`${s.subtitle} flex items-center justify-center gap-3 mt-3 sm:mt-4`}
          aria-hidden
        >
          <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-apple-accent/50 rounded-full" />
          <span className="font-mono uppercase tracking-[0.35em] text-apple-accent font-semibold">
            {t('logo.masterkurs')}
          </span>
          <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-apple-accent/50 rounded-full" />
        </div>
      )}
    </div>
  );
}
