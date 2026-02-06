import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Award, Download, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useUserProgress } from '../store/userProgress';
import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { projects } from '../data/projects';

const CertificateView = () => {
  const { t, i18n } = useTranslation();
  const {
    lessonsCompleted,
    quizzesCompleted,
    projectsCompleted,
    totalPoints,
    streak,
  } = useUserProgress();
  const totalLessons = lessons.length;
  const totalQuizzes = quizzes.length;
  const totalProjects = projects.length;

  const completedLessonsCount = lessonsCompleted.length;
  const completedQuizzesCount = quizzesCompleted.filter((q) => q.completed).length;
  const completedProjectsCount = projectsCompleted.filter((p) => p.completed).length;

  // Requirements for certification
  const lessonReq = Math.ceil(totalLessons * 0.8); // 80% of lessons
  const quizReq = Math.ceil(totalQuizzes * 0.8); // 80% of quizzes
  const projectReq = Math.ceil(totalProjects * 0.5); // 50% of projects

  const lessonsMet = completedLessonsCount >= lessonReq;
  const quizzesMet = completedQuizzesCount >= quizReq;
  const projectsMet = completedProjectsCount >= projectReq;
  const isUnlocked = lessonsMet && quizzesMet && projectsMet;

  const overallProgress = Math.round(
    ((lessonsMet ? 1 : completedLessonsCount / lessonReq) +
      (quizzesMet ? 1 : completedQuizzesCount / quizReq) +
      (projectsMet ? 1 : completedProjectsCount / projectReq)) /
      3 *
      100
  );

  const locale = i18n.language === 'en' ? 'en-US' : i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'es' ? 'es-ES' : 'de-DE';
  const currentDate = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownload = () => {
    // Use print dialog to save as PDF
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('certificate.breadcrumb')}</span>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-apple-accent font-mono text-sm tracking-widest uppercase mb-3">
          {t('certificate.certification')}
        </p>
        <h1 className="text-4xl font-bold text-apple-text tracking-tight mb-3">
          {t('certificate.courseName')}
        </h1>
        <p className="text-apple-textSecondary text-lg">
          {t('certificate.yourPath')}
        </p>
      </div>

      {/* Requirements */}
      <div className="apple-card mb-8">
        <h2 className="text-lg font-bold text-apple-text mb-5 flex items-center space-x-2">
          <Target className="text-apple-accent" size={18} />
          <span>{t('certificate.requirements')}</span>
        </h2>

        <div className="space-y-4">
          <RequirementRow
            label={t('certificate.lessonsCompleted')}
            current={completedLessonsCount}
            required={lessonReq}
            total={totalLessons}
            met={lessonsMet}
          />
          <RequirementRow
            label={t('certificate.quizzesPassed')}
            current={completedQuizzesCount}
            required={quizReq}
            total={totalQuizzes}
            met={quizzesMet}
          />
          <RequirementRow
            label={t('certificate.projectsCompleted')}
            current={completedProjectsCount}
            required={projectReq}
            total={totalProjects}
            met={projectsMet}
          />
        </div>

        <div className="mt-6 pt-5 border-t border-apple-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-apple-textSecondary text-sm">{t('certificate.totalProgress')}</span>
            <span className="text-xl font-bold text-apple-accent font-mono">{overallProgress}%</span>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-bar-fill h-3" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Certificate or Locked State */}
      {isUnlocked ? (
        <>
          {/* Certificate */}
          <div
            className="relative overflow-hidden rounded-apple-xl border-2 border-apple-accent/40 bg-gradient-to-br from-apple-surface via-apple-bg to-apple-surface p-12 mb-8 print:border-0 print:p-8"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-apple-accent/5 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-apple-accent/5 rounded-full translate-x-20 translate-y-20" />
            <div className="absolute top-4 right-4 w-2 h-2 bg-apple-accent rounded-full opacity-60" />
            <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-apple-accent rounded-full opacity-40" />
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-apple-accent rounded-full opacity-60" />

            <div className="relative text-center">
              {/* Badge */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-apple-accent/15 border-2 border-apple-accent/30 mb-6">
                <Award className="text-apple-accent" size={40} />
              </div>

              {/* Title */}
              <p className="text-apple-accent font-mono text-xs tracking-[0.3em] uppercase mb-2">
                {t('certificate.certificate')}
              </p>
              <h2 className="text-3xl font-bold text-apple-text tracking-tight mb-1">
                {t('certificate.courseName')}
              </h2>
              <p className="text-apple-muted text-sm font-mono mb-8">
                {t('certificate.officialCert')}
              </p>

              {/* Divider */}
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-apple-accent to-transparent mx-auto mb-8" />

              {/* Details */}
              <p className="text-apple-textSecondary text-sm leading-relaxed mb-6 max-w-md mx-auto">
                {t('certificate.certBody')}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8 max-w-lg mx-auto">
                <div className="text-center">
                  <p className="text-2xl font-bold text-apple-text font-mono">{completedLessonsCount}</p>
                  <p className="text-apple-muted text-xs font-mono uppercase tracking-wider">{t('certificate.lessons')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-apple-text font-mono">{completedQuizzesCount}</p>
                  <p className="text-apple-muted text-xs font-mono uppercase tracking-wider">{t('certificate.quizzes')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-apple-text font-mono">{totalPoints}</p>
                  <p className="text-apple-muted text-xs font-mono uppercase tracking-wider">{t('certificate.points')}</p>
                </div>
              </div>

              {/* Date & Signature */}
              <div className="flex items-center justify-between max-w-md mx-auto pt-6 border-t border-apple-border/50">
                <div className="text-left">
                  <p className="text-apple-muted text-xs font-mono uppercase tracking-wider">{t('certificate.date')}</p>
                  <p className="text-apple-text text-sm">{currentDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-apple-muted text-xs font-mono uppercase tracking-wider">{t('certificate.streak')}</p>
                  <p className="text-apple-text text-sm">{streak} {t('nav.days')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleDownload}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Download size={16} />
              <span>{t('certificate.download')}</span>
            </button>
          </div>
        </>
      ) : (
        /* Locked State */
        <div className="apple-card text-center py-12 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-apple-border/20 mb-6">
            <Lock className="text-apple-muted" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-apple-text mb-3 tracking-tight">
            {t('certificate.locked')}
          </h2>
          <p className="text-apple-textSecondary mb-8 max-w-md mx-auto leading-relaxed">
            {t('certificate.lockedDesc')}
          </p>

          {/* Suggestions */}
          <div className="space-y-3 max-w-md mx-auto text-left">
            {!lessonsMet && (
              <Link
                to="/lesson/0"
                className="flex items-center justify-between p-4 rounded-apple bg-apple-bg border border-apple-border hover:border-apple-accent/40 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="text-apple-accent" size={18} />
                  <span className="text-apple-text text-sm">{t('certificate.continueLessons')}</span>
                </div>
                <ArrowRight size={16} className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all" />
              </Link>
            )}
            {!projectsMet && (
              <Link
                to="/playground"
                className="flex items-center justify-between p-4 rounded-apple bg-apple-bg border border-apple-border hover:border-apple-accent/40 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="text-apple-accent" size={18} />
                  <span className="text-apple-text text-sm">{t('certificate.workOnProjects')}</span>
                </div>
                <ArrowRight size={16} className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* === Sub-Components === */

function Target({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function RequirementRow({
  label,
  current,
  required,
  total,
  met,
}: {
  label: string;
  current: number;
  required: number;
  total: number;
  met: boolean;
}) {
  const { t } = useTranslation();
  const progress = Math.min(100, Math.round((current / required) * 100));

  return (
    <div className="flex items-center space-x-4">
      <div className="shrink-0">
        {met ? (
          <CheckCircle2 size={20} className="text-apple-success" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-apple-border" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-apple-text text-sm font-medium">{label}</span>
          <span className="text-xs font-mono text-apple-muted">
            <span className={met ? 'text-apple-success' : 'text-apple-accent'}>{current}</span>
            /{required}
            <span className="text-apple-border ml-1">({t('certificate.of')} {total})</span>
          </span>
        </div>
        <div className="progress-bar h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-700 ${
              met ? 'bg-apple-success' : 'bg-gradient-to-r from-apple-accentMuted to-apple-accent'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default CertificateView;
