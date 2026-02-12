import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  GraduationCap,
  BookMarked,
} from 'lucide-react';
import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { useUserProgress } from '../store/userProgress';
import { useAuthStore } from '../store/authStore';
import { useSRSStore } from '../store/srsStore';
import LessonContent from '../components/Lessons/LessonContent';
import QuizComponent from '../components/Quiz/QuizComponent';
import PaywallOverlay from '../components/Paywall/PaywallOverlay';
import { isFreeTierLesson } from '../lib/lessons-config';
import { lessonAccessApi } from '../lib/api';
import { useLearningTimer } from '../hooks/useLearningTimer';

const LessonView = () => {
  useLearningTimer({ context: 'lesson' });

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lessonsCompleted, completeLesson, setCurrentLesson } = useUserProgress();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addLessonToSRS = useSRSStore((s) => s.addLessonToSRS);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const lessonId = parseInt(id || '0');
  const lesson = lessons.find((l) => l.id === lessonId);
  const quiz = quizzes.find((q) => q.lessonId === lessonId);

  // ── Free Tier / Paywall Access Check ────────────────────────
  useEffect(() => {
    // Client-side quick check: free lessons always accessible
    if (isFreeTierLesson(lessonId)) {
      setHasAccess(true); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: sync free-tier check
      return;
    }

    // For premium lessons, check with the server
    let cancelled = false;
    lessonAccessApi
      .canAccess(lessonId)
      .then((result) => {
        if (!cancelled) setHasAccess(result.canAccess);
      })
      .catch(() => {
        // On error (e.g. offline), allow access optimistically for free lessons
        // but block premium lessons for guests
        if (!cancelled) setHasAccess(isFreeTierLesson(lessonId));
      });

    return () => { cancelled = true; };
  }, [lessonId, isAuthenticated]);

  // Extract headings from lesson content for table of contents
  const headings = useMemo(() => {
    if (!lesson) return [];
    return lesson.content
      .filter((block) => block.type === 'heading')
      .map((block, index) => ({
        id: `section-${index}`,
        title: block.content.replace(/^[^\w\s]*\s*/, ''), // Remove emoji prefix
        emoji: block.content.match(/^([^\w\s]*)\s*/)?.[1] || '',
        index: index + 1,
      }));
  }, [lesson]);

  // Abgeschlossene Lektionen für Schnellnavigation (zum Nachschlagen)
  // Must be called before any early returns to satisfy rules-of-hooks
  const completedLessonsList = useMemo(
    () =>
      lessons
        .filter((l) => lessonsCompleted.includes(l.id))
        .sort((a, b) => a.id - b.id),
    [lessonsCompleted]
  );

  // Scroll tracking for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
      setReadingProgress(progress);

      // Determine active section
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
    /* Reset reading state when navigating between lessons */
    /* eslint-disable react-hooks/set-state-in-effect -- intentional: reset on route change */
    setReadingProgress(0);
    setActiveSection(null);
    setTocOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [id]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTocOpen(false);
  }, []);

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-apple-text text-xl">{t('lesson.notFound')}</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-block">
          {t('common.backToDashboard')}
        </Link>
      </div>
    );
  }

  // Show paywall for premium lessons when access is denied
  if (hasAccess === false) {
    return (
      <div className="py-10 sm:py-16 animate-fade-in-up">
        <PaywallOverlay lessonId={lessonId} lessonTitle={lesson.title} />
      </div>
    );
  }

  // While checking access, show a minimal loading state (only for premium lessons)
  if (hasAccess === null && !isFreeTierLesson(lessonId)) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-apple-accent/30 border-t-apple-accent rounded-full animate-spin" />
      </div>
    );
  }

  const isCompleted = lessonsCompleted.includes(lessonId);
  const prevLesson = lessons.find((l) => l.id === lessonId - 1);
  const nextLesson = lessons.find((l) => l.id === lessonId + 1);
  const totalLessons = lessons.length;
  const lessonProgress = Math.round(((lessonId + 1) / totalLessons) * 100);
  const showCompletedJump = completedLessonsList.length > 1;

  const handleCompleteLesson = () => {
    completeLesson(lessonId);
    addLessonToSRS(lessonId);
    if (nextLesson) {
      setCurrentLesson(nextLesson.id);
      navigate(`/lesson/${nextLesson.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const levelConfig = {
    1: { label: t('lesson.levelBasics'), color: 'bg-apple-success/15 text-apple-success border-apple-success/20', dot: 'bg-apple-success' },
    2: { label: t('lesson.levelAdvanced'), color: 'bg-apple-accent/15 text-apple-accent border-apple-accent/20', dot: 'bg-apple-accent' },
    3: { label: t('lesson.levelExpert'), color: 'bg-apple-info/15 text-apple-info border-apple-info/20', dot: 'bg-apple-info' },
  };

  const currentLevel = levelConfig[lesson.level];

  return (
    <>
      {/* Reading Progress Bar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-apple-bg/50">
        <div
          className="h-full bg-gradient-to-r from-apple-accent via-apple-accentHover to-apple-accent transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto animate-fade-in-up">
        {/* Breadcrumb + Kurs-Fortschritt */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-apple-muted font-mono min-w-0">
            <Link to="/dashboard" className="hover:text-apple-accent transition-colors shrink-0">
              {t('common.dashboard')}
            </Link>
            <ChevronRight size={14} className="text-apple-border shrink-0" />
            <span className="text-apple-textSecondary truncate">
              {t('lesson.lessonXOfY', { current: lessonId + 1, total: totalLessons })}
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <span className="text-xs text-apple-muted font-mono">{t('lesson.courseProgress')}</span>
            <div className="w-24 h-1.5 bg-apple-border rounded-full overflow-hidden">
              <div
                className="h-full bg-apple-accent rounded-full transition-all duration-500"
                style={{ width: `${lessonProgress}%` }}
              />
            </div>
            <span className="text-xs text-apple-muted font-mono">{lessonProgress}%</span>
          </div>
        </div>

        {/* Schnell zu abgeschlossener Lektion (zum Nachschlagen) */}
        {showCompletedJump && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-apple-lg bg-apple-surface/50 border border-apple-border/50 px-4 py-3">
            <span className="text-xs font-medium text-apple-muted font-mono uppercase tracking-wider flex items-center gap-2 flex-shrink-0">
              <BookMarked size={14} className="text-apple-accent" />
              {t('lesson.jumpToLesson')}
            </span>
            <select
              value={lessonId}
              onChange={(e) => navigate(`/lesson/${e.target.value}`)}
              className="flex-1 min-w-0 max-w-md bg-apple-bg border border-apple-border rounded-apple text-sm text-apple-text px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-apple-accent/50 focus:border-apple-accent"
              aria-label={t('lesson.jumpToLessonAria')}
            >
              {completedLessonsList.map((l) => (
                <option key={l.id} value={l.id}>
                  {t('review.lessonX', { id: l.id + 1 })}: {l.title}
                </option>
              ))}
            </select>
          </div>
        )}

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

                  {/* Mini-Fortschritt im Sidebar */}
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

            {/* Lesson Header */}
            <header className="relative mb-10">
              <div className="apple-card overflow-hidden">
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-apple-accent/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative">
                  {/* Level + Status row */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-mono border ${currentLevel.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${currentLevel.dot}`} />
                        <span>Level {lesson.level} · {currentLevel.label}</span>
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-apple-success/10 text-apple-success border border-apple-success/20">
                          <CheckCircle2 size={13} />
                          <span>{t('lesson.completed')}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-apple-muted font-mono text-xs hidden sm:block">
                      #{String(lessonId).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-apple-text mb-3 tracking-tight leading-tight">
                    {lesson.title}
                  </h1>

                  {/* Description */}
                  <p className="text-apple-textSecondary text-lg leading-relaxed max-w-2xl">
                    {lesson.description}
                  </p>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-5 mt-6 pt-5 border-t border-apple-border/40">
                    <div className="flex items-center space-x-2 text-apple-muted">
                      <Clock size={15} />
                      <span className="text-sm font-mono">{lesson.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-apple-muted">
                      <Target size={15} />
                      <span className="text-sm">{lesson.objectives.length} {t('lesson.objectives')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-apple-muted">
                      <BookOpen size={15} />
                      <span className="text-sm">{headings.length} {t('lesson.sections')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Learning Objectives - Redesigned as a compact checklist */}
            <div className="mb-10">
              <div className="rounded-apple-lg bg-gradient-to-br from-apple-accent/[0.06] to-transparent border border-apple-accent/15 p-6">
                <h2 className="text-base font-bold text-apple-text mb-4 flex items-center space-x-2.5">
                  <GraduationCap className="text-apple-accent" size={18} />
                  <span>{t('lesson.whatYouLearn')}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.objectives.map((objective, index) => (
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

            {/* Lesson Content */}
            <div ref={contentRef} className="lesson-content-area mb-10">
              <LessonContent content={lesson.content} lessonId={lesson.id} />
            </div>

            {/* Quiz Section */}
            {quiz && (
              <div className="mb-10">
                <QuizComponent key={quiz.id} quiz={quiz} />
              </div>
            )}

            {/* Lesson Complete CTA */}
            {!isCompleted && (
              <div className="mb-10">
                <div className="rounded-apple-lg bg-gradient-to-r from-apple-accent/10 via-apple-accent/5 to-transparent border border-apple-accent/20 p-8 text-center">
                  <GraduationCap className="mx-auto text-apple-accent mb-3" size={32} />
                  <h3 className="text-xl font-bold text-apple-text mb-2">{t('lesson.completeLesson')}</h3>
                  <p className="text-apple-textSecondary text-sm mb-5 max-w-md mx-auto">
                    {t('lesson.completeLessonDesc')}
                  </p>
                  <button onClick={handleCompleteLesson} className="btn-primary text-base px-8 py-3">
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
                {prevLesson ? (
                  <Link
                    to={`/lesson/${prevLesson.id}`}
                    className="inline-flex items-center space-x-3 text-apple-textSecondary hover:text-apple-text transition-colors group px-4 py-3 rounded-apple hover:bg-apple-surface/50 w-full sm:w-auto min-h-[44px]"
                  >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
                        {t('lesson.previousLesson')}
                      </p>
                      <p className="text-sm font-semibold truncate">{prevLesson.title}</p>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              <div className="flex-1 flex justify-end min-w-0">
                {nextLesson ? (
                  <Link
                    to={`/lesson/${nextLesson.id}`}
                    className="inline-flex items-center space-x-3 text-apple-textSecondary hover:text-apple-text transition-colors group px-4 py-3 rounded-apple hover:bg-apple-surface/50 w-full sm:w-auto justify-end min-h-[44px]"
                  >
                    <div className="text-right min-w-0">
                      <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
                        {t('lesson.nextLesson')}
                      </p>
                      <p className="text-sm font-semibold truncate">{nextLesson.title}</p>
                    </div>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center space-x-2 text-apple-accent hover:text-apple-accentHover transition-colors group px-4 py-3 rounded-apple hover:bg-apple-accent/5 min-h-[44px]"
                  >
                    <span className="text-sm font-semibold">{t('lesson.toDashboard')}</span>
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

export default LessonView;
