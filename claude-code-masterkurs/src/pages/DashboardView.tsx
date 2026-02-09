import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, CheckCircle2, Clock, Trophy, TrendingUp, BarChart3, Repeat, Activity, Zap, Layers, Search, ExternalLink, Users } from 'lucide-react';
import { useUserProgress } from '../store/userProgress';
import { useSRSStore } from '../store/srsStore';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { challenges } from '../data/challenges';
import { liveCodingChallenges } from '../data/liveCodingChallenges';
import { useChallengeStore } from '../store/challengeStore';

const totalChallengesCount = challenges.length + liveCodingChallenges.length;
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

const DashboardView = () => {
  const { t } = useTranslation();
  const {
    lessonsCompleted,
    quizzesCompleted,
    projectsCompleted,
    streak,
    timeInvested,
    skillProgress,
  } = useUserProgress();
  const challengeResults = useChallengeStore((s) => s.results);
  const challengesCompleted = Object.values(challengeResults).filter((r) => r.completed).length;
  const challengePoints = Object.values(challengeResults).reduce((s, r) => s + r.score, 0);
  const srsItems = useSRSStore((s) => s.items);
  const srsDueCount = useMemo(() => {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const iso = endOfToday.toISOString();
    return Object.values(srsItems).filter((item) => item.nextReviewAt <= iso).length;
  }, [srsItems]);

  // Leaderboard integration
  const lbInit = useLeaderboardStore((s) => s.init);
  const lbSync = useLeaderboardStore((s) => s.syncCurrentUser);
  const lbGetSorted = useLeaderboardStore((s) => s.getSorted);
  const lbGetRank = useLeaderboardStore((s) => s.getCurrentUserRank);
  useEffect(() => { lbInit(); }, [lbInit]);
  useEffect(() => {
    lbSync({
      totalPoints: useUserProgress.getState().totalPoints,
      lessonsCompleted: lessonsCompleted.length,
      quizzesCompleted: quizzesCompleted.filter(q => q.completed).length,
      projectsCompleted: projectsCompleted.length,
      streak,
    });
  }, [lessonsCompleted, quizzesCompleted, projectsCompleted, streak, lbSync]);
  const lbTop5 = useMemo(() => lbGetSorted('all', 'points').slice(0, 5), [lbGetSorted]);
  const lbRank = useMemo(() => lbGetRank('all', 'points'), [lbGetRank]);

  const totalLessons = lessons.length;
  const overallProgress = Math.round((lessonsCompleted.length / totalLessons) * 100);

  const level1Lessons = lessons.filter((l) => l.level === 1).length;
  const level2Lessons = lessons.filter((l) => l.level === 2).length;
  const level3Lessons = lessons.filter((l) => l.level === 3).length;

  const level1Completed = lessonsCompleted.filter((id) =>
    lessons.find((l) => l.id === id && l.level === 1)
  ).length;
  const level2Completed = lessonsCompleted.filter((id) =>
    lessons.find((l) => l.id === id && l.level === 2)
  ).length;
  const level3Completed = lessonsCompleted.filter((id) =>
    lessons.find((l) => l.id === id && l.level === 3)
  ).length;

  const level1Progress = level1Lessons > 0 ? Math.round((level1Completed / level1Lessons) * 100) : 0;
  const level2Progress = level2Lessons > 0 ? Math.round((level2Completed / level2Lessons) * 100) : 0;
  const level3Progress = level3Lessons > 0 ? Math.round((level3Completed / level3Lessons) * 100) : 0;

  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzesCompleted.filter((q) => q.completed).length;
  const averageQuizScore =
    quizzesCompleted.length > 0
      ? Math.round(
          quizzesCompleted.reduce((acc, q) => acc + q.score, 0) / quizzesCompleted.length
        )
      : 0;

  const quizRequirement = Math.round(totalQuizzes * 0.8);
  const projectRequirement = 6;
  const quizProgress = Math.min(100, Math.round((completedQuizzes / quizRequirement) * 100));
  const projectProgress = Math.min(100, Math.round((projectsCompleted.length / projectRequirement) * 100));
  const certificationProgress = Math.min(100, Math.round((quizProgress + projectProgress) / 2));

  const hours = Math.floor(timeInvested / 60);
  const minutes = timeInvested % 60;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header with pixel-style logo */}
      <div className="text-center py-6 sm:py-8">
        <p className="text-apple-accent font-mono text-sm tracking-widest uppercase mb-4">
          {t('dashboard.title')}
        </p>
        <ClaudeCodeLogo size="lg" showSubtitle className="mb-4" />
        <p className="text-apple-textSecondary text-lg max-w-md mx-auto">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Overall Progress */}
      <div className="apple-card accent-glow">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-apple-text">{t('dashboard.overallProgress')}</h2>
          <span className="text-3xl font-bold text-apple-accent font-mono">{overallProgress}%</span>
        </div>
        <div className="progress-bar h-3">
          <div
            className="progress-bar-fill h-3"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-apple-textSecondary mt-3 text-sm">
          {t('dashboard.lessonsCompleted', { count: lessonsCompleted.length, total: totalLessons })}
        </p>
      </div>

      {/* Level Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <LevelCard
          icon={<BookOpen className="text-apple-accent" size={22} />}
          title={t('dashboard.level1')}
          completed={level1Completed}
          total={level1Lessons}
          progress={level1Progress}
          color="from-apple-accent/20 to-apple-accent/5"
          barColor="bg-gradient-to-r from-apple-accentMuted to-apple-accent"
        />
        <LevelCard
          icon={<TrendingUp className="text-apple-accent" size={22} />}
          title={t('dashboard.level2')}
          completed={level2Completed}
          total={level2Lessons}
          progress={level2Progress}
          color="from-apple-accent/20 to-apple-accent/5"
          barColor="bg-gradient-to-r from-apple-accentMuted to-apple-accent"
        />
        <LevelCard
          icon={<Trophy className="text-apple-accent" size={22} />}
          title={t('dashboard.level3')}
          completed={level3Completed}
          total={level3Lessons}
          progress={level3Progress}
          color="from-apple-accent/20 to-apple-accent/5"
          barColor="bg-gradient-to-r from-apple-accentMuted to-apple-accent"
        />
      </div>

      {/* Neueste Updates – Kacheln */}
      <div className="apple-card">
        <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center space-x-2">
          <Zap className="text-apple-accent" size={20} />
          <span>Neueste Updates</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            to="/lesson/27"
            className="apple-card flex flex-col p-4 hover:border-apple-accent/40 transition-all duration-200 group"
          >
            <Zap size={22} className="text-apple-accent mb-2" />
            <span className="font-semibold text-apple-text text-sm group-hover:text-apple-accent transition-colors">Fast Mode & Opus 4.6</span>
            <span className="text-xs text-apple-muted mt-1">Schnellere Antworten</span>
          </Link>
          <Link
            to="/lesson/28"
            className="apple-card flex flex-col p-4 hover:border-apple-accent/40 transition-all duration-200 group"
          >
            <Users size={22} className="text-apple-accent mb-2" />
            <span className="font-semibold text-apple-text text-sm group-hover:text-apple-accent transition-colors">Agent Teams & Checkpointing</span>
            <span className="text-xs text-apple-muted mt-1">Multi-Agent, Rewind</span>
          </Link>
          <Link
            to="/lesson/29"
            className="apple-card flex flex-col p-4 hover:border-apple-accent/40 transition-all duration-200 group"
          >
            <ExternalLink size={22} className="text-apple-accent mb-2" />
            <span className="font-semibold text-apple-text text-sm group-hover:text-apple-accent transition-colors">Claude Code überall</span>
            <span className="text-xs text-apple-muted mt-1">Web, Desktop, IDE, Docs</span>
          </Link>
          <Link
            to="/features"
            className="apple-card flex flex-col p-4 hover:border-apple-accent/40 transition-all duration-200 group"
          >
            <Search size={22} className="text-apple-accent mb-2" />
            <span className="font-semibold text-apple-text text-sm group-hover:text-apple-accent transition-colors">Reference</span>
            <span className="text-xs text-apple-muted mt-1">Features & Befehle</span>
          </Link>
          <Link
            to="/patterns"
            className="apple-card flex flex-col p-4 hover:border-apple-accent/40 transition-all duration-200 group"
          >
            <Layers size={22} className="text-apple-accent mb-2" />
            <span className="font-semibold text-apple-text text-sm group-hover:text-apple-accent transition-colors">Patterns</span>
            <span className="text-xs text-apple-muted mt-1">Prompts & Workflows</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<CheckCircle2 className="text-apple-accent" size={20} />}
          label={t('dashboard.quizPerformance')}
          value={`${completedQuizzes}/${totalQuizzes}`}
          detail={`${t('dashboard.average')}: ${averageQuizScore}%${averageQuizScore >= 80 ? ' 🎉' : ''}`}
        />
        <StatCard
          icon={<Trophy className="text-apple-warning" size={20} />}
          label={t('dashboard.projects')}
          value={`${projectsCompleted.length}/6`}
          detail={t('dashboard.completed')}
        />
        <StatCard
          icon={<Clock className="text-apple-info" size={20} />}
          label={t('dashboard.learningTime')}
          value={`${hours}h ${minutes}m`}
          detail={t('dashboard.totalInvested')}
        />
        <StatCard
          icon={<span className="text-xl">🔥</span>}
          label={t('nav.streak')}
          value={t('dashboard.streakDays', { count: streak })}
          detail={streak >= 7 ? t('dashboard.streakGreat') : t('dashboard.streakKeep')}
        />
      </div>

      {/* Skill Progress */}
      <div className="apple-card">
        <h3 className="text-lg font-bold text-apple-text mb-5 flex items-center space-x-2">
          <span className="text-apple-accent font-mono text-sm">{'//>'}</span>
          <span>{t('dashboard.skillProgress')}</span>
        </h3>
        <div className="space-y-5">
          {Object.entries(skillProgress).map(([skill, progress]) => (
            <div key={skill}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-apple-text text-sm font-medium capitalize">
                  {skill.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-apple-muted text-xs font-mono">{progress}%</span>
              </div>
              <div className="progress-bar h-1.5">
                <div
                  className="progress-bar-fill h-1.5"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Progress */}
      <div className="apple-card border-apple-accent/30 accent-glow">
        <h3 className="text-lg font-bold text-apple-text mb-5 flex items-center space-x-2">
          <Trophy className="text-apple-accent" size={20} />
          <span>{t('dashboard.certificationProgress')}</span>
        </h3>
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-apple-textSecondary text-sm">{t('dashboard.totalProgress')}</span>
              <span className="text-2xl font-bold text-apple-accent font-mono">
                {certificationProgress}%
              </span>
            </div>
            <div className="progress-bar h-3">
              <div
                className="progress-bar-fill h-3"
                style={{ width: `${certificationProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-apple-bg rounded-apple p-4 border border-apple-border">
              <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-1">
                {t('dashboard.quizRequirement')}
              </p>
              <p className="text-apple-text font-medium">
                {t('dashboard.quizzesCount', { completed: completedQuizzes, required: quizRequirement })}
              </p>
            </div>
            <div className="bg-apple-bg rounded-apple p-4 border border-apple-border">
              <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-1">
                {t('dashboard.projectRequirement')}
              </p>
              <p className="text-apple-text font-medium">
                {t('dashboard.projectsCount', { completed: projectsCompleted.length, required: projectRequirement })}
              </p>
            </div>
          </div>

          {certificationProgress >= 80 ? (
            <div className="mt-4 p-4 bg-apple-success/10 border border-apple-success/30 rounded-apple">
              <p className="text-apple-success font-semibold text-sm">
                🎉 {t('dashboard.certUnlocked')}
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-apple-bg border border-apple-border rounded-apple">
              <p className="text-apple-textSecondary text-sm">
                {t('dashboard.certRemaining', { percent: 80 - certificationProgress })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Widget */}
      <div className="apple-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-apple-text flex items-center space-x-2">
            <Trophy className="text-apple-accent" size={20} />
            <span>{t('dashboard.leaderboard')}</span>
          </h3>
          <Link to="/leaderboard" className="text-sm text-apple-accent hover:text-apple-accentHover font-medium transition-colors">
            {t('dashboard.showAll')}
          </Link>
        </div>
        <div className="flex items-center justify-between mb-4 p-3 bg-apple-accent/8 rounded-apple border border-apple-accent/20">
          <span className="text-sm text-apple-textSecondary">{t('dashboard.yourRank')}</span>
          <span className="text-xl font-bold text-apple-accent font-mono">#{lbRank}</span>
        </div>
        <div className="space-y-2">
          {lbTop5.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-apple transition-colors ${
                entry.isCurrentUser ? 'bg-apple-accent/8 border border-apple-accent/20' : 'hover:bg-apple-hover/50'
              }`}
            >
              <span className="w-6 text-center font-mono text-sm font-bold text-apple-muted">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </span>
              <span className="text-base">{entry.avatarEmoji}</span>
              <span className={`flex-1 text-sm font-medium truncate ${entry.isCurrentUser ? 'text-apple-accent' : 'text-apple-text'}`}>
                {entry.displayName}
                {entry.isCurrentUser && <span className="text-xs text-apple-accent/70 ml-1">{t('dashboard.you')}</span>}
              </span>
              <span className="text-sm font-mono font-semibold text-apple-textSecondary">
                {entry.totalPoints.toLocaleString('de-DE')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges Widget */}
      <div className="apple-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-apple-text flex items-center space-x-2">
            <Zap className="text-apple-accent" size={20} />
            <span>{t('dashboard.challengesTitle')}</span>
          </h3>
          <Link to="/challenges" className="text-sm text-apple-accent hover:text-apple-accentHover font-medium transition-colors">
            {t('dashboard.showAll')}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-apple-bg rounded-apple p-3 border border-apple-border text-center">
            <p className="text-2xl font-bold text-apple-text font-mono">{challengesCompleted}/{totalChallengesCount}</p>
            <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider mt-1">{t('dashboard.completedLabel')}</p>
          </div>
          <div className="bg-apple-bg rounded-apple p-3 border border-apple-border text-center">
            <p className="text-2xl font-bold text-apple-accent font-mono">{challengePoints}</p>
            <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider mt-1">{t('dashboard.pointsLabel')}</p>
          </div>
          <div className="bg-apple-bg rounded-apple p-3 border border-apple-border text-center">
            <p className="text-2xl font-bold text-apple-text font-mono">{totalChallengesCount - challengesCompleted}</p>
            <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider mt-1">{t('dashboard.openLabel')}</p>
          </div>
        </div>
        {challengesCompleted < totalChallengesCount && (
          <Link
            to="/challenges"
            className="flex items-center justify-between p-3 bg-apple-accent/8 border border-apple-accent/20 rounded-apple hover:bg-apple-accent/12 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-2">
              <Zap size={16} className="text-apple-accent" />
              <span className="text-sm text-apple-text font-medium">
                {t('dashboard.nextChallenge')}
              </span>
            </div>
            <span className="text-apple-accent group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        )}
      </div>

      {/* Next Steps */}
      <div className="apple-card">
        <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center space-x-2">
          <span className="text-apple-accent">→</span>
          <span>{t('dashboard.nextSteps')}</span>
        </h3>
        <div className="space-y-3">
          {srsDueCount > 0 && (
            <Link
              to="/review"
              className="flex items-center justify-between p-4 bg-apple-accent/10 border border-apple-accent/30 rounded-apple hover:bg-apple-accent/15 hover:border-apple-accent/50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <Repeat className="text-apple-accent" size={20} />
                <span className="text-apple-text font-medium">
                  {t('dashboard.reviewDue_other', { count: srsDueCount })}
                </span>
              </div>
              <span className="text-apple-accent group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          )}
          {(() => {
            const nextLesson = lessons.find((l) => !lessonsCompleted.includes(l.id));
            return nextLesson ? (
              <Link
                to={`/lesson/${nextLesson.id}`}
                className="flex items-center justify-between p-4 bg-apple-bg rounded-apple hover:bg-apple-hover border border-apple-border hover:border-apple-accent/40 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-apple-accent" size={20} />
                  <span className="text-apple-text font-medium">
                    {t('dashboard.nextLesson')}: <span className="text-apple-textSecondary">{nextLesson.title}</span>
                  </span>
                </div>
                <span className="text-apple-accent group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            ) : null;
          })()}
          <Link
            to="/analytics"
            className="flex items-center justify-between p-4 bg-apple-bg rounded-apple hover:bg-apple-hover border border-apple-border hover:border-apple-accent/40 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <Activity className="text-apple-accent" size={20} />
              <span className="text-apple-text font-medium">
                {t('dashboard.analyticsLink')} <span className="text-apple-textSecondary">{t('dashboard.analyticsLinkDetail')}</span>
              </span>
            </div>
            <span className="text-apple-accent group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          <Link
            to="/report"
            className="flex items-center justify-between p-4 bg-apple-bg rounded-apple hover:bg-apple-hover border border-apple-border hover:border-apple-accent/40 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-apple-info" size={20} />
              <span className="text-apple-text font-medium">
                {t('report.title')} <span className="text-apple-textSecondary">{t('dashboard.exportReport')}</span>
              </span>
            </div>
            <span className="text-apple-accent group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

/* === Sub-Components === */

function LevelCard({
  icon,
  title,
  completed,
  total,
  progress,
  color,
  barColor,
}: {
  icon: React.ReactNode;
  title: string;
  completed: number;
  total: number;
  progress: number;
  color: string;
  barColor: string;
}) {
  return (
    <div className="apple-card relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-apple-lg opacity-50 pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center space-x-3 mb-4">
          {icon}
          <h3 className="text-sm font-semibold text-apple-text">{title}</h3>
        </div>
        <div className="w-full bg-apple-border rounded-full h-2 overflow-hidden">
          <div
            className={`${barColor} h-full transition-all duration-700 rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-apple-textSecondary mt-2.5 text-xs font-mono">
          {completed}/{total} Lektionen ({progress}%)
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="apple-card">
      <div className="flex items-center space-x-3 mb-3">
        {icon}
        <h4 className="text-xs font-medium text-apple-muted uppercase tracking-wider font-mono">
          {label}
        </h4>
      </div>
      <p className="text-2xl font-bold text-apple-text font-mono">{value}</p>
      <p className="text-sm text-apple-textSecondary mt-1">{detail}</p>
    </div>
  );
}

export default DashboardView;
