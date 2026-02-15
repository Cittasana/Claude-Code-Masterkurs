import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { BookOpen, CheckCircle2, Clock, Trophy, TrendingUp, BarChart3, Repeat, Activity, Zap, Layers, Search, ExternalLink, Users, FolderGit2, Briefcase, Wrench, ArrowRight, Sparkles } from 'lucide-react';
import { useUserProgress } from '../store/userProgress';
import { useSRSStore } from '../store/srsStore';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { contentApi } from '../lib/api';
import type { AdminLessonConfig, AdminQuiz, AdminProjectTemplate, AdminCapstoneConfig } from '../lib/api';
import { useChallengeStore } from '../store/challengeStore';
import DiscordWidget from '../components/DiscordWidget';
import { allTools } from '../data/tools';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

/** Minimal lesson shape for dashboard */
interface DashLessonItem {
  id: number;
  level: number;
  title: string;
}

/** Minimal capstone shape for dashboard */
interface DashCapstoneItem {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  estimatedHours: number;
  thumbnailEmoji: string;
}

/** Minimal template shape for dashboard */
interface DashTemplateItem {
  id: string;
  title: string;
  difficulty: number;
  estimatedHours: number;
  techStack: string[];
}

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

  // ── API data state ──────────────────────────────────────────
  const [lessons, setLessons] = useState<DashLessonItem[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [totalChallengesCount, setTotalChallengesCount] = useState(0);
  const [projectTemplates, setProjectTemplates] = useState<DashTemplateItem[]>([]);
  const [capstoneProjectsList, setCapstoneProjectsList] = useState<DashCapstoneItem[]>([]);
  const [freelancerModules, setFreelancerModules] = useState<DashLessonItem[]>([]);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contentApi.getLessons({ track: 'main' }),
      contentApi.getQuizzes(),
      contentApi.getChallenges(),
      contentApi.getProjectTemplates(),
      contentApi.getCapstones(),
      contentApi.getLessons({ track: 'freelancer' }),
    ]).then(([lessonsRes, quizzesRes, challengesRes, templatesRes, capstonesRes, freelancerRes]) => {
      setLessons(lessonsRes.data.map((l: AdminLessonConfig) => ({ id: l.lessonId, level: l.level, title: l.title })));
      setQuizzes(quizzesRes.data);
      setTotalChallengesCount(challengesRes.data.length);
      setProjectTemplates(templatesRes.data.map((t: AdminProjectTemplate) => ({
        id: t.templateId,
        title: t.title,
        difficulty: t.difficulty,
        estimatedHours: t.estimatedHours,
        techStack: t.techStack,
      })));
      setCapstoneProjectsList(capstonesRes.data.map((c: AdminCapstoneConfig) => ({
        id: c.capstoneId,
        title: c.title,
        description: c.description,
        difficulty: c.difficulty as 1 | 2 | 3,
        estimatedHours: c.estimatedHours,
        thumbnailEmoji: c.thumbnailEmoji ?? '',
      })));
      setFreelancerModules(freelancerRes.data.map((l: AdminLessonConfig) => ({ id: l.lessonId, level: l.level, title: l.title })));
      setContentLoading(false);
    }).catch(() => setContentLoading(false));
  }, []);

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
  const overallProgress = totalLessons > 0 ? Math.round((lessonsCompleted.length / totalLessons) * 100) : 0;

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
  const quizProgress = quizRequirement > 0 ? Math.min(100, Math.round((completedQuizzes / quizRequirement) * 100)) : 0;
  const projectProgress = Math.min(100, Math.round((projectsCompleted.length / projectRequirement) * 100));
  const certificationProgress = Math.min(100, Math.round((quizProgress + projectProgress) / 2));

  const hours = Math.floor(timeInvested / 60);
  const minutes = timeInvested % 60;

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-apple-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <Helmet>
        <title>Dashboard | Claude Code Masterkurs</title>
        <meta name="description" content="Dein persönliches Dashboard im Claude Code Masterkurs. Verfolge deinen Lernfortschritt, Quizzes, Challenges und Zertifizierung." />
        <link rel="canonical" href="https://claude-code-masterkurs.de/dashboard" />
      </Helmet>
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

      {/* Capstone Projects Widget */}
      <div className="apple-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-apple-text flex items-center space-x-2">
            <Layers className="text-apple-accent" size={20} />
            <span>{t('dashboard.capstoneTitle')}</span>
          </h3>
          <Link to="/projects" className="text-sm text-apple-accent hover:text-apple-accentHover font-medium transition-colors">
            {t('dashboard.showAll')}
          </Link>
        </div>
        <p className="text-sm text-apple-textSecondary mb-4">{t('dashboard.capstoneSubtitle')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {capstoneProjectsList.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="p-3 bg-apple-bg rounded-apple border border-apple-border hover:border-apple-accent/40 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">{p.thumbnailEmoji}</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded-full border ${
                  p.difficulty === 1
                    ? 'bg-apple-success/10 border-apple-success/25 text-apple-success'
                    : p.difficulty === 2
                    ? 'bg-apple-warning/10 border-apple-warning/25 text-apple-warning'
                    : 'bg-apple-accent/10 border-apple-accent/25 text-apple-accent'
                }`}>
                  {p.difficulty === 1 ? t('projects.difficultyBeginner') : p.difficulty === 2 ? t('projects.difficultyIntermediate') : t('projects.difficultyExpert')}
                </span>
              </div>
              <p className="text-sm font-medium text-apple-text group-hover:text-apple-accent transition-colors line-clamp-1">
                {t(`projects.data.${p.id}.title`, { defaultValue: p.title })}
              </p>
              <p className="text-xs text-apple-muted mt-1">~{p.estimatedHours} {t('projects.hours')}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Project Templates Widget */}
      <div className="apple-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-apple-text flex items-center space-x-2">
            <FolderGit2 className="text-apple-accent" size={20} />
            <span>{t('dashboard.templatesTitle')}</span>
          </h3>
          <Link to="/templates" className="text-sm text-apple-accent hover:text-apple-accentHover font-medium transition-colors">
            {t('dashboard.showAll')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projectTemplates.slice(0, 3).map((tpl) => (
            <Link
              key={tpl.id}
              to={`/templates/${tpl.id}`}
              className="p-3 bg-apple-bg rounded-apple border border-apple-border hover:border-apple-accent/40 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded-full border ${
                  tpl.difficulty === 1
                    ? 'bg-apple-success/10 border-apple-success/25 text-apple-success'
                    : tpl.difficulty === 2
                    ? 'bg-apple-warning/10 border-apple-warning/25 text-apple-warning'
                    : 'bg-apple-accent/10 border-apple-accent/25 text-apple-accent'
                }`}>
                  {tpl.difficulty === 1 ? t('templates.difficultyBeginner') : tpl.difficulty === 2 ? t('templates.difficultyAdvanced') : t('templates.difficultyExpert')}
                </span>
                <span className="text-[10px] text-apple-muted font-mono">~{tpl.estimatedHours}h</span>
              </div>
              <p className="text-sm font-semibold text-apple-text group-hover:text-apple-accent transition-colors">
                {t(`templates.data.${tpl.id}.title`, { defaultValue: tpl.title })}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {tpl.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="text-[9px] font-mono text-apple-muted">{tech}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Freelancer Track Widget */}
      {(() => {
        const freelancerCompleted = freelancerModules.filter((m) => lessonsCompleted.includes(m.id)).length;
        const freelancerTotal = freelancerModules.length;
        const freelancerProgress = freelancerTotal > 0 ? Math.round((freelancerCompleted / freelancerTotal) * 100) : 0;
        return (
          <Link to="/freelancer" className="block apple-card group hover:border-apple-accent/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-apple-accent/10 flex items-center justify-center">
                  <Briefcase size={20} className="text-apple-accent" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-apple-text group-hover:text-apple-accent transition-colors">
                    {t('freelancer.dashboardTitle')}
                  </h3>
                  <p className="text-xs text-apple-muted">{t('freelancer.dashboardDesc')}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex items-center justify-between text-xs text-apple-muted font-mono mb-2">
              <span>{t('freelancer.dashboardProgress', { completed: freelancerCompleted, total: freelancerTotal })}</span>
              <span>{freelancerProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-apple-border/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-apple-accent to-apple-success rounded-full transition-all duration-500"
                style={{ width: `${freelancerProgress}%` }}
              />
            </div>
          </Link>
        );
      })()}

      {/* Tools & Extensions Widget */}
      {(() => {
        const toolsCompleted = allTools.filter((m) => lessonsCompleted.includes(m.id)).length;
        const toolsTotal = allTools.length;
        const toolsProgress = toolsTotal > 0 ? Math.round((toolsCompleted / toolsTotal) * 100) : 0;
        return (
          <Link to="/tools" className="block apple-card group hover:border-apple-accent/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-apple-accent/10 flex items-center justify-center">
                  <Wrench size={20} className="text-apple-accent" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-apple-text group-hover:text-apple-accent transition-colors">
                    {t('tools.dashboardTitle')}
                  </h3>
                  <p className="text-xs text-apple-muted">{t('tools.dashboardDesc')}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex items-center justify-between text-xs text-apple-muted font-mono mb-2">
              <span>{t('tools.dashboardProgress', { completed: toolsCompleted, total: toolsTotal })}</span>
              <span>{toolsProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-apple-border/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-apple-accent to-apple-success rounded-full transition-all duration-500"
                style={{ width: `${toolsProgress}%` }}
              />
            </div>
          </Link>
        );
      })()}

      {/* Prompt Studio Promo Widget */}
      <Link to="/prompt-studio" className="block apple-card group hover:border-apple-accent/30 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Sparkles size={20} className="text-violet-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-apple-text group-hover:text-apple-accent transition-colors flex items-center gap-2">
                Prompt Studio
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-apple-accent/15 text-apple-accent border border-apple-accent/25">
                  NEU
                </span>
              </h3>
              <p className="text-xs text-apple-muted">Generiere & optimiere Prompts fuer Claude Code Projekte</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-500/5 rounded-apple px-3 py-2 border border-blue-500/15 text-center">
            <p className="text-xs font-semibold text-blue-400">Generator</p>
            <p className="text-[10px] text-apple-muted mt-0.5">7 Kategorien</p>
          </div>
          <div className="bg-emerald-500/5 rounded-apple px-3 py-2 border border-emerald-500/15 text-center">
            <p className="text-xs font-semibold text-emerald-400">Optimizer</p>
            <p className="text-[10px] text-apple-muted mt-0.5">Score & Tipps</p>
          </div>
          <div className="bg-violet-500/5 rounded-apple px-3 py-2 border border-violet-500/15 text-center">
            <p className="text-xs font-semibold text-violet-400">Planner</p>
            <p className="text-[10px] text-apple-muted mt-0.5">Projekt-Planung</p>
          </div>
        </div>
      </Link>

      {/* Discord Community Widget */}
      <DiscordWidget serverId={import.meta.env.VITE_DISCORD_SERVER_ID} compact />

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
