import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  BookOpen,
  List,
  ChevronRight,
  Briefcase,
  Lock,
} from 'lucide-react';
import { contentApi } from '../lib/api';
import { useUserProgress } from '../store/userProgress';
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess';
import LessonContent from '../components/Lessons/LessonContent';
import { useLearningTimer } from '../hooks/useLearningTimer';
import type { Lesson, LessonContent as LessonContentType } from '../types';

/** First 2 modules (index 0, 1) are free */
const FREE_MODULE_LIMIT = 2;

const FreelancerModuleView = () => {
  useLearningTimer({ context: 'freelancer' });

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lessonsCompleted, completeLesson, setCurrentLesson } = useUserProgress();
  const hasPremium = useSubscriptionAccess();

  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── API Data Loading ──────────────────────────────────────
  const [freelancerModules, setFreelancerModules] = useState<Lesson[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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
        if (!cancelled) setDataLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const moduleId = parseInt(id || '100');
  const module = freelancerModules.find((m) => m.id === moduleId);
  const moduleIndex = freelancerModules.findIndex((m) => m.id === moduleId);
  const isFree = moduleIndex < FREE_MODULE_LIMIT;
  const canAccess = isFree || hasPremium || lessonsCompleted.includes(moduleId);

  // Extract headings for table of contents
  const headings = useMemo(() => {
    if (!module) return [];
    return module.content
      .filter((block) => block.type === 'heading')
      .map((block, index) => ({
        id: `section-${index}`,
        title: block.content.replace(/^[^\w\s]*\s*/, ''),
        emoji: block.content.match(/^([^\w\s]*)\s*/)?.[1] || '',
        index: index + 1,
      }));
  }, [module]);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
      setReadingProgress(progress);

      if (contentRef.current) {
        const sectionEls = contentRef.current.querySelectorAll('[data-section-id]');
        let current: string | null = null;
        sectionEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            current = el.getAttribute('data-section-id');
          }
        });
        if (current) setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setReadingProgress(0);
    setActiveSection(null);
    setTocOpen(false);
  }, [id]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTocOpen(false);
  }, []);

  if (dataLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-apple-accent/30 border-t-apple-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-20">
        <p className="text-apple-text text-xl">{t('freelancer.moduleNotFound')}</p>
        <Link to="/freelancer" className="btn-primary mt-4 inline-block">
          {t('freelancer.backToTrack')}
        </Link>
      </div>
    );
  }

  // Show paywall for premium modules when access is denied
  if (!canAccess) {
    return (
      <div className="max-w-2xl mx-auto py-10 sm:py-16 animate-fade-in-up text-center">
        <div className="apple-card">
          <Lock size={40} className="mx-auto text-apple-muted mb-4" />
          <h2 className="text-2xl font-bold text-apple-text mb-2">{t('freelancer.premiumTitle')}</h2>
          <p className="text-apple-textSecondary mb-6">{t('freelancer.premiumDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/freelancer" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              {t('freelancer.backToTrack')}
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-apple text-sm font-medium text-apple-accent border border-apple-accent/30 hover:bg-apple-accent/5 transition-colors"
            >
              {t('freelancer.ctaUpgrade')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = lessonsCompleted.includes(moduleId);
  const prevModule = moduleIndex > 0 ? freelancerModules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < freelancerModules.length - 1 ? freelancerModules[moduleIndex + 1] : null;
  const totalModules = freelancerModules.length;
  const moduleProgress = Math.round(((moduleIndex + 1) / totalModules) * 100);

  const handleCompleteModule = () => {
    completeLesson(moduleId);
    if (nextModule) {
      setCurrentLesson(nextModule.id);
      navigate(`/freelancer/${nextModule.id}`);
    } else {
      navigate('/freelancer');
    }
  };

  return (
    <>
      <Helmet>
        <title>{module.title} | Freelancer-Track | Claude Code Masterkurs</title>
        <meta name="description" content={module.description} />
        <link rel="canonical" href={`https://claude-code-masterkurs.de/freelancer/${moduleId}`} />
      </Helmet>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-apple-bg/50">
        <div
          className="h-full bg-gradient-to-r from-apple-accent via-apple-success to-apple-accent transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto animate-fade-in-up">
        {/* Breadcrumb + Track Progress */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-apple-muted font-mono min-w-0">
            <Link to="/dashboard" className="hover:text-apple-accent transition-colors shrink-0">
              {t('common.dashboard')}
            </Link>
            <ChevronRight size={14} className="text-apple-border shrink-0" />
            <Link to="/freelancer" className="hover:text-apple-accent transition-colors shrink-0">
              {t('freelancer.breadcrumb')}
            </Link>
            <ChevronRight size={14} className="text-apple-border shrink-0" />
            <span className="text-apple-textSecondary truncate">
              {t('freelancer.moduleXOfY', { current: moduleIndex + 1, total: totalModules })}
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <span className="text-xs text-apple-muted font-mono">{t('freelancer.trackProgress')}</span>
            <div className="w-24 h-1.5 bg-apple-border rounded-full overflow-hidden">
              <div
                className="h-full bg-apple-accent rounded-full transition-all duration-500"
                style={{ width: `${moduleProgress}%` }}
              />
            </div>
            <span className="text-xs text-apple-muted font-mono">{moduleProgress}%</span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Table of Contents - Desktop Sidebar */}
          {headings.length > 2 && (
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-16">
                <div className="rounded-apple-lg bg-apple-surface/60 border border-apple-border/50 backdrop-blur-sm p-5">
                  <h3 className="text-xs font-bold text-apple-muted uppercase tracking-widest font-mono mb-4 flex items-center space-x-2">
                    <List size={13} />
                    <span>{t('lesson.toc')}</span>
                  </h3>
                  <nav className="space-y-1">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToSection(heading.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 group flex items-start space-x-2.5 ${
                          activeSection === heading.id
                            ? 'bg-apple-accent/10 text-apple-accent'
                            : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover/50'
                        }`}
                      >
                        <span className={`font-mono text-[10px] mt-0.5 flex-shrink-0 w-4 text-right ${
                          activeSection === heading.id ? 'text-apple-accent' : 'text-apple-muted'
                        }`}>
                          {String(heading.index).padStart(2, '0')}
                        </span>
                        <span className="leading-snug">{heading.title}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Mini Progress */}
                  <div className="mt-5 pt-4 border-t border-apple-border/40">
                    <div className="flex items-center justify-between text-[10px] text-apple-muted font-mono uppercase tracking-wider mb-2">
                      <span>{t('lesson.read')}</span>
                      <span>{readingProgress}%</span>
                    </div>
                    <div className="w-full h-1 bg-apple-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-apple-accent/70 rounded-full transition-all duration-300"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-4xl">
            {/* Mobile TOC Toggle */}
            {headings.length > 2 && (
              <div className="xl:hidden mb-6">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-apple-surface/60 border border-apple-border/50 rounded-apple text-sm text-apple-textSecondary hover:text-apple-text transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <List size={15} />
                    <span>{t('lesson.tocSections', { count: headings.length })}</span>
                  </span>
                  <ChevronRight
                    size={15}
                    className={`transition-transform duration-200 ${tocOpen ? 'rotate-90' : ''}`}
                  />
                </button>
                {tocOpen && (
                  <div className="mt-2 bg-apple-surface border border-apple-border/50 rounded-apple p-3 animate-fade-in-up">
                    <nav className="space-y-0.5">
                      {headings.map((heading) => (
                        <button
                          key={heading.id}
                          onClick={() => scrollToSection(heading.id)}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover/50 transition-all flex items-center space-x-2.5"
                        >
                          <span className="font-mono text-[10px] text-apple-muted w-4 text-right">
                            {String(heading.index).padStart(2, '0')}
                          </span>
                          <span>{heading.title}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            )}

            {/* Module Header */}
            <header className="relative mb-10">
              <div className="apple-card overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-apple-accent/5 via-transparent to-apple-success/5 pointer-events-none" />
                <div className="relative">
                  {/* Badge + Status */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-mono border bg-apple-accent/15 text-apple-accent border-apple-accent/20">
                        <Briefcase size={13} />
                        <span>{t('freelancer.badge')}</span>
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-apple-success/10 text-apple-success border border-apple-success/20">
                          <CheckCircle2 size={13} />
                          <span>{t('lesson.completed')}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-apple-muted font-mono text-xs hidden sm:block">
                      #{String(moduleIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title — Ethereal */}
                  <h1 className="text-[clamp(28px,3.6vw,44px)] font-semibold text-apple-text mb-3 tracking-[-0.032em] leading-[1.04]">
                    {module.title}
                  </h1>

                  <p className="text-apple-textSecondary text-lg leading-relaxed max-w-2xl">
                    {module.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-5 mt-6 pt-5 border-t border-apple-border/40">
                    <div className="flex items-center space-x-2 text-apple-muted">
                      <Clock size={14} />
                      <span className="text-[12px] font-mono uppercase tracking-[0.06em]">{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-apple-muted">
                      <Target size={14} />
                      <span className="text-[12px] font-mono uppercase tracking-[0.06em]">{module.objectives.length} {t('lesson.objectives')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-apple-muted">
                      <BookOpen size={14} />
                      <span className="text-[12px] font-mono uppercase tracking-[0.06em]">{headings.length} {t('lesson.sections')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Learning Objectives */}
            <div className="mb-10">
              <div className="rounded-apple-lg bg-gradient-to-br from-apple-accent/[0.06] to-transparent border border-apple-accent/15 p-6">
                <h2 className="text-base font-bold text-apple-text mb-4 flex items-center space-x-2.5">
                  <Briefcase className="text-apple-accent" size={18} />
                  <span>{t('freelancer.whatYouLearn')}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {module.objectives.map((objective, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 bg-apple-surface/40 rounded-apple px-4 py-3 border border-apple-border/30"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-apple-accent/15 text-apple-accent flex items-center justify-center text-[11px] font-bold font-mono mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-apple-text/90 leading-relaxed">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module Content */}
            <div ref={contentRef} className="lesson-content-area mb-10">
              <LessonContent content={module.content} lessonId={module.id} />
            </div>

            {/* Complete Module CTA */}
            {!isCompleted && (
              <div className="mb-10">
                <div className="rounded-apple-lg bg-gradient-to-r from-apple-accent/10 via-apple-success/5 to-transparent border border-apple-accent/20 p-8 text-center">
                  <Briefcase className="mx-auto text-apple-accent mb-3" size={32} />
                  <h3 className="text-xl font-bold text-apple-text mb-2">{t('freelancer.completeModule')}</h3>
                  <p className="text-apple-textSecondary text-sm mb-5 max-w-md mx-auto">
                    {t('freelancer.completeModuleDesc')}
                  </p>
                  <button onClick={handleCompleteModule} className="btn-primary text-base px-8 py-3">
                    <span className="flex items-center space-x-2">
                      <CheckCircle2 size={18} />
                      <span>{t('lesson.markComplete')}</span>
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-0 py-6 sm:py-8 border-t border-apple-border/40">
              <div className="flex-1 min-w-0">
                {prevModule ? (
                  <Link
                    to={`/freelancer/${prevModule.id}`}
                    className="inline-flex items-center space-x-3 text-apple-textSecondary hover:text-apple-text transition-colors group px-4 py-3 rounded-apple hover:bg-apple-surface/50 w-full sm:w-auto min-h-[44px]"
                  >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
                        {t('freelancer.previousModule')}
                      </p>
                      <p className="text-sm font-semibold truncate">{prevModule.title}</p>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              <div className="flex-1 flex justify-end min-w-0">
                {nextModule ? (
                  <Link
                    to={`/freelancer/${nextModule.id}`}
                    className="inline-flex items-center space-x-3 text-apple-textSecondary hover:text-apple-text transition-colors group px-4 py-3 rounded-apple hover:bg-apple-surface/50 w-full sm:w-auto justify-end min-h-[44px]"
                  >
                    <div className="text-right min-w-0">
                      <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
                        {t('freelancer.nextModule')}
                      </p>
                      <p className="text-sm font-semibold truncate">{nextModule.title}</p>
                    </div>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </Link>
                ) : (
                  <Link
                    to="/freelancer"
                    className="inline-flex items-center space-x-2 text-apple-accent hover:text-apple-accentHover transition-colors group px-4 py-3 rounded-apple hover:bg-apple-accent/5 min-h-[44px]"
                  >
                    <span className="text-sm font-semibold">{t('freelancer.backToTrack')}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerModuleView;
