import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, CheckCircle2, ArrowRight, BookOpen, Zap, Award, Users, Repeat } from 'lucide-react';
import { FREE_LESSON_LIMIT } from '../../lib/lessons-config';
import { useAuthStore } from '../../store/authStore';

interface PaywallOverlayProps {
  lessonId: number;
  lessonTitle: string;
}

const PaywallOverlay = ({ lessonId, lessonTitle }: PaywallOverlayProps) => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const benefits = [
    { icon: BookOpen, text: t('paywall.benefit1') },
    { icon: Zap, text: t('paywall.benefit2') },
    { icon: Award, text: t('paywall.benefit3') },
    { icon: Users, text: t('paywall.benefit4') },
    { icon: Repeat, text: t('paywall.benefit5') },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="rounded-apple-lg bg-apple-surface border border-apple-border overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-apple-accent/10 via-apple-accent/5 to-transparent px-6 sm:px-10 py-10 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-apple-accent/15 border border-apple-accent/20 flex items-center justify-center">
            <Lock size={28} className="text-apple-accent" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-3">
            {t('paywall.title')}
          </h2>
          <p className="text-apple-textSecondary text-lg max-w-md mx-auto leading-relaxed">
            {t('paywall.subtitle')}
          </p>
          <p className="mt-3 text-sm text-apple-muted font-mono">
            Lektion #{String(lessonId).padStart(2, '0')}: {lessonTitle}
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 sm:px-10 py-8">
          <h3 className="text-base font-semibold text-apple-text mb-5">
            {t('paywall.benefitsTitle')}
          </h3>
          <div className="space-y-3.5">
            {benefits.map(({ icon: Icon, text }, index) => (
              <div
                key={index}
                className="flex items-center gap-3.5 bg-apple-bg/60 rounded-apple px-4 py-3 border border-apple-border/40"
              >
                <div className="w-8 h-8 rounded-lg bg-apple-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-apple-accent" />
                </div>
                <span className="text-sm text-apple-text">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 sm:px-10 pb-8 space-y-4">
          {/* Primary CTA */}
          <Link
            to="/register"
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base font-semibold"
          >
            {t('paywall.upgradeButton')}
            <ArrowRight size={18} />
          </Link>

          {/* Free lessons hint */}
          <div className="rounded-apple bg-apple-accent/[0.06] border border-apple-accent/15 px-5 py-4 text-center">
            <p className="text-sm text-apple-textSecondary mb-3">
              {t('paywall.freeHint', { count: FREE_LESSON_LIMIT })}
            </p>
            <Link
              to="/start-kostenlos"
              className="inline-flex items-center gap-2 text-apple-accent hover:text-apple-accentHover text-sm font-medium transition-colors"
            >
              <CheckCircle2 size={16} />
              {t('paywall.freeButton')}
            </Link>
          </div>

          {/* Login hint for unauthenticated users */}
          {!isAuthenticated && (
            <p className="text-center text-sm text-apple-muted pt-2">
              {t('paywall.loginHint')}{' '}
              <Link
                to="/login"
                className="text-apple-accent hover:text-apple-accentHover font-medium transition-colors"
              >
                {t('paywall.loginLink')}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaywallOverlay;
