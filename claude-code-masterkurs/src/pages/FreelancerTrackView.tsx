import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  Clock,
  Target,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { contentApi } from '../lib/api';
import { useUserProgress } from '../store/userProgress';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess';
import type { Lesson, LessonContent as LessonContentType } from '../types';

/** First 2 modules are free (IDs 100, 101) */
const FREE_MODULE_LIMIT = 2;

function isFreeTierModule(index: number): boolean {
  return index < FREE_MODULE_LIMIT;
}

const FreelancerTrackView = () => {
  const { t } = useTranslation();
  const { lessonsCompleted } = useUserProgress();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasPremium = useSubscriptionAccess();

  // ── API Data Loading ──────────────────────────────────────
  const [freelancerModules, setFreelancerModules] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    contentApi.getLessons({ track: 'freelancer' })
      .then((res) => {
        if (cancelled) return;
        const mapped: Lesson[] = res.data.map((l) => ({
          id: l.lessonId,
          level: l.level as Lesson['level'],
          title: l.title,
          description: l.description,
          duration: l.duration,
          objectives: l.objectives,
          content: l.content as LessonContentType[],
        }));
        setFreelancerModules(mapped);
      })
      .catch(() => {
        if (!cancelled) setFreelancerModules([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const completedModuleIds = useMemo(
    () => freelancerModules.filter((m) => lessonsCompleted.includes(m.id)).map((m) => m.id),
    [freelancerModules, lessonsCompleted],
  );

  const progress = freelancerModules.length > 0
    ? Math.round((completedModuleIds.length / freelancerModules.length) * 100)
    : 0;

  const stats = [
    { icon: Briefcase, value: '8', labelKey: 'freelancer.statsModules' },
    { icon: Clock, value: '~3.5h', labelKey: 'freelancer.statsDuration' },
    { icon: DollarSign, value: '100-200', labelKey: 'freelancer.statsHourly' },
    { icon: Users, value: '5+', labelKey: 'freelancer.statsClients' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-apple-accent/30 border-t-apple-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <Helmet>
        <title>Freelancer-Track | Claude Code Masterkurs</title>
        <meta name="description" content="Werde erfolgreicher AI-Freelancer mit Claude Code. 8 Business-Module zu Positionierung, Pricing, Kundenakquise und Projekt-Workflows." />
        <link rel="canonical" href="https://claude-code-masterkurs.de/freelancer" />
      </Helmet>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-apple-muted font-mono mb-6">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <ChevronRight size={14} className="text-apple-border" />
        <span className="text-apple-textSecondary">{t('freelancer.breadcrumb')}</span>
      </div>

      {/* Hero Section — Ethereal */}
      <header className="relative mb-12">
        <div className="apple-card overflow-hidden">
          <div className="eyebrow mb-5">
            <Rocket size={12} />
            <span>{t('freelancer.badge')}</span>
            {progress > 0 && (
              <span className="text-apple-accent">&middot; {progress}% {t('freelancer.complete')}</span>
            )}
          </div>

          <h1 className="text-[clamp(32px,4.4vw,54px)] font-semibold text-apple-text mb-4 tracking-[-0.032em] leading-[1.04]">
            <em className="italic-serif">{t('freelancer.heroTitle')}</em>
          </h1>
          <p className="text-apple-textSecondary text-lg leading-relaxed max-w-2xl mb-10">
            {t('freelancer.heroSubtitle')}
          </p>

          {/* Stats Grid — italic-serif */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col gap-2 px-4 py-4 rounded-2xl bg-white/[0.025] border border-apple-border"
                >
                  <Icon size={16} className="text-apple-accent" />
                  <p className="num-serif text-[clamp(24px,2.6vw,34px)] leading-none">{stat.value}</p>
                  <p className="text-[10px] text-apple-muted font-mono uppercase tracking-[0.06em]">
                    {t(stat.labelKey)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] text-apple-muted font-mono uppercase tracking-[0.06em] mb-2">
                <span>{t('freelancer.progress')}</span>
                <span>{completedModuleIds.length}/{freelancerModules.length}</span>
              </div>
              <div className="progress-bar h-1.5">
                <div className="progress-bar-fill h-1.5" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: TrendingUp, titleKey: 'freelancer.benefit1Title', descKey: 'freelancer.benefit1Desc' },
          { icon: Target, titleKey: 'freelancer.benefit2Title', descKey: 'freelancer.benefit2Desc' },
          { icon: Briefcase, titleKey: 'freelancer.benefit3Title', descKey: 'freelancer.benefit3Desc' },
        ].map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <div
              key={i}
              className="rounded-apple-lg bg-apple-surface/60 border border-apple-border/40 p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-apple-accent/10 flex items-center justify-center mb-3">
                <Icon size={20} className="text-apple-accent" />
              </div>
              <h3 className="text-sm font-bold text-apple-text mb-1">{t(benefit.titleKey)}</h3>
              <p className="text-xs text-apple-textSecondary leading-relaxed">{t(benefit.descKey)}</p>
            </div>
          );
        })}
      </div>

      {/* Module Timeline */}
      <section>
        <h2 className="text-xl font-bold text-apple-text mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-apple-accent/10 flex items-center justify-center">
            <Briefcase size={16} className="text-apple-accent" />
          </span>
          {t('freelancer.modulesTitle')}
        </h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-apple-border/40 hidden sm:block" />

          <div className="space-y-4">
            {freelancerModules.map((mod, index) => {
              const isCompleted = completedModuleIds.includes(mod.id);
              const isFree = isFreeTierModule(index);
              const canAccess = isFree || hasPremium || isCompleted;

              return (
                <div key={mod.id} className="relative flex gap-4 sm:gap-6">
                  {/* Timeline Node */}
                  <div className="hidden sm:flex flex-shrink-0 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold border ${
                        isCompleted
                          ? 'bg-apple-success/15 text-apple-success border-apple-success/30'
                          : canAccess
                            ? 'bg-apple-accent/10 text-apple-accent border-apple-accent/20'
                            : 'bg-apple-surface text-apple-muted border-apple-border/50'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={20} />
                      ) : canAccess ? (
                        String(index + 1).padStart(2, '0')
                      ) : (
                        <Lock size={16} />
                      )}
                    </div>
                  </div>

                  {/* Module Card */}
                  <div className="flex-1 min-w-0">
                    {canAccess ? (
                      <Link
                        to={`/freelancer/${mod.id}`}
                        className={`block rounded-apple-lg border p-5 transition-all duration-200 group ${
                          isCompleted
                            ? 'bg-apple-success/[0.04] border-apple-success/20 hover:border-apple-success/40'
                            : 'bg-apple-surface/60 border-apple-border/40 hover:border-apple-accent/40 hover:bg-apple-surface'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-apple-muted font-mono uppercase tracking-widest">
                                {t('freelancer.module')} {index + 1}
                              </span>
                              {isFree && !hasPremium && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-apple-success/15 text-apple-success uppercase tracking-wider">
                                  {t('freelancer.free')}
                                </span>
                              )}
                              {isCompleted && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-apple-success/15 text-apple-success uppercase tracking-wider">
                                  {t('lesson.completed')}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-apple-text mb-1 group-hover:text-apple-accent transition-colors">
                              {mod.title}
                            </h3>
                            <p className="text-sm text-apple-textSecondary line-clamp-2">
                              {mod.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="flex items-center gap-1.5 text-xs text-apple-muted">
                                <Clock size={12} />
                                {mod.duration}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-apple-muted">
                                <Target size={12} />
                                {mod.objectives.length} {t('lesson.objectives')}
                              </span>
                            </div>
                          </div>
                          <ArrowRight
                            size={18}
                            className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className="block rounded-apple-lg border border-apple-border/30 bg-apple-surface/30 p-5 opacity-60">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-apple-muted font-mono uppercase tracking-widest">
                                {t('freelancer.module')} {index + 1}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-apple-border/30 text-apple-muted uppercase tracking-wider flex items-center gap-1">
                                <Lock size={9} />
                                Premium
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-apple-text mb-1">{mod.title}</h3>
                            <p className="text-sm text-apple-textSecondary line-clamp-2">
                              {mod.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="flex items-center gap-1.5 text-xs text-apple-muted">
                                <Clock size={12} />
                                {mod.duration}
                              </span>
                            </div>
                          </div>
                          <Lock size={18} className="text-apple-muted flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA for non-authenticated or free users */}
      {!hasPremium && (
        <div className="mt-12 rounded-apple-lg bg-gradient-to-r from-apple-accent/10 via-apple-accent/5 to-transparent border border-apple-accent/20 p-8 text-center">
          <h3 className="text-xl font-bold text-apple-text mb-2">{t('freelancer.ctaTitle')}</h3>
          <p className="text-apple-textSecondary text-sm mb-5 max-w-md mx-auto">
            {t('freelancer.ctaDesc')}
          </p>
          {isAuthenticated ? (
            <Link to="/profile" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <Rocket size={16} />
              {t('freelancer.ctaUpgrade')}
            </Link>
          ) : (
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <Rocket size={16} />
              {t('freelancer.ctaRegister')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default FreelancerTrackView;
