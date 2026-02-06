import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Line,
  Bar,
  Doughnut,
  Radar,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Lightbulb,
  Flame,
  ChevronLeft,
  Activity,
  Zap,
  Award,
  Brain,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useUserProgress } from '../store/userProgress';
import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { projects } from '../data/projects';

// ── Register Chart.js components ───────────────────────────────────
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

// ── Chart defaults ─────────────────────────────────────────────────
const CHART_COLORS = {
  accent: '#ff9500',
  accentMuted: 'rgba(255, 149, 0, 0.3)',
  success: '#30d158',
  successMuted: 'rgba(48, 209, 88, 0.3)',
  info: '#0a84ff',
  infoMuted: 'rgba(10, 132, 255, 0.3)',
  purple: '#bf5af2',
  purpleMuted: 'rgba(191, 90, 242, 0.3)',
  warning: '#ffd60a',
  warningMuted: 'rgba(255, 214, 10, 0.3)',
  error: '#ff453a',
  errorMuted: 'rgba(255, 69, 58, 0.3)',
  grid: 'rgba(255, 255, 255, 0.06)',
  text: '#a1a1a6',
  textBright: '#f5f5f7',
};

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: CHART_COLORS.text, font: { family: "'JetBrains Mono', monospace", size: 11 } },
    },
    tooltip: {
      backgroundColor: '#2d2d2d',
      titleColor: CHART_COLORS.textBright,
      bodyColor: CHART_COLORS.text,
      borderColor: '#3a3a3a',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      titleFont: { family: "'JetBrains Mono', monospace" },
      bodyFont: { family: "'Plus Jakarta Sans', sans-serif" },
    },
  },
  scales: {
    x: {
      ticks: { color: CHART_COLORS.text, font: { family: "'JetBrains Mono', monospace", size: 10 } },
      grid: { color: CHART_COLORS.grid },
    },
    y: {
      ticks: { color: CHART_COLORS.text, font: { family: "'JetBrains Mono', monospace", size: 10 } },
      grid: { color: CHART_COLORS.grid },
    },
  },
} as const;

// ── Heatmap helpers ────────────────────────────────────────────────

function generateHeatmapWeeks(activityMap: Record<string, number>, weeks: number) {
  const result: { date: string; count: number; dayOfWeek: number }[][] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from `weeks` weeks ago, Monday
  const start = new Date(today);
  const dayOfWeek = start.getDay();
  const toMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  start.setDate(start.getDate() - toMonday - (weeks - 1) * 7);

  for (let w = 0; w < weeks; w++) {
    const week: typeof result[0] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = date.toISOString().slice(0, 10);
      week.push({
        date: key,
        count: activityMap[key] || 0,
        dayOfWeek: d,
      });
    }
    result.push(week);
  }
  return result;
}

function heatmapColor(count: number): string {
  if (count === 0) return 'bg-apple-elevated';
  if (count === 1) return 'bg-orange-900/50';
  if (count === 2) return 'bg-orange-700/60';
  if (count <= 4) return 'bg-orange-500/70';
  return 'bg-orange-400';
}

// ── Main Component ─────────────────────────────────────────────────

const LearningAnalyticsView = () => {
  const { t } = useTranslation();
  const weekdays = [
    t('analytics.weekdayMo'),
    t('analytics.weekdayTu'),
    t('analytics.weekdayWe'),
    t('analytics.weekdayTh'),
    t('analytics.weekdayFr'),
    t('analytics.weekdaySa'),
    t('analytics.weekdaySu'),
  ];
  const {
    getActivityMap,
    getQuizScoresOverTime,
    getLearningVelocity,
    getHourlyDistribution,
    getDayOfWeekDistribution,
    getStreakHistory,
    getInsights,
    getWeeklyActivity,
    events,
    weeklyGoal,
    setWeeklyGoal,
  } = useAnalyticsStore();

  const {
    lessonsCompleted,
    quizzesCompleted,
    projectsCompleted,
    skillProgress,
    timeInvested,
    streak,
  } = useUserProgress();

  const [velocityWeeks, setVelocityWeeks] = useState(8);

  // ── Memoized data ──────────────────────────────────────────────

  const activityMap = useMemo(() => getActivityMap(), [events]);
  const heatmapWeeks = useMemo(() => generateHeatmapWeeks(activityMap, 12), [activityMap]);
  const quizScores = useMemo(() => getQuizScoresOverTime(), [events]);
  const learningVelocity = useMemo(() => getLearningVelocity(velocityWeeks), [events, velocityWeeks]);
  const hourlyDist = useMemo(() => getHourlyDistribution(), [events]);
  const dowDist = useMemo(() => getDayOfWeekDistribution(), [events]);
  const streakHistory = useMemo(() => getStreakHistory(), [events]);
  const insights = useMemo(() => getInsights(), [events]);
  const weeklyActivity = useMemo(() => getWeeklyActivity(8), [events]);

  // ── Current week progress toward goal ──────────────────────────
  const currentWeekEvents = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const toMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - toMonday);
    monday.setHours(0, 0, 0, 0);
    return events.filter((e) => new Date(e.timestamp) >= monday);
  }, [events]);

  const weekLessons = currentWeekEvents.filter((e) => e.type === 'lesson_complete').length;
  const weekQuizzes = currentWeekEvents.filter((e) => e.type === 'quiz_complete').length;

  // ── Chart Data ─────────────────────────────────────────────────

  // Quiz Scores Over Time
  const quizScoreData = {
    labels: quizScores.map((q) => q.label),
    datasets: [
      {
        label: 'Score (%)',
        data: quizScores.map((q) => q.score),
        borderColor: CHART_COLORS.accent,
        backgroundColor: CHART_COLORS.accentMuted,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: CHART_COLORS.accent,
        pointBorderColor: '#242424',
        pointBorderWidth: 2,
      },
    ],
  };

  // Learning Velocity
  const velocityData = {
    labels: learningVelocity.map((v) => v.weekLabel),
    datasets: [
      {
        label: t('analytics.lessonsLabel'),
        data: learningVelocity.map((v) => v.lessons),
        backgroundColor: CHART_COLORS.accentMuted,
        borderColor: CHART_COLORS.accent,
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: t('analytics.quizzesLabel'),
        data: learningVelocity.map((v) => v.quizzes),
        backgroundColor: CHART_COLORS.infoMuted,
        borderColor: CHART_COLORS.info,
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  // Hourly Distribution
  const hourlyData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [
      {
        label: 'Aktivitäten',
        data: hourlyDist,
        backgroundColor: hourlyDist.map((_, i) =>
          i >= 6 && i < 12
            ? CHART_COLORS.warningMuted
            : i >= 12 && i < 18
            ? CHART_COLORS.accentMuted
            : i >= 18 && i < 22
            ? CHART_COLORS.purpleMuted
            : CHART_COLORS.infoMuted
        ),
        borderColor: hourlyDist.map((_, i) =>
          i >= 6 && i < 12
            ? CHART_COLORS.warning
            : i >= 12 && i < 18
            ? CHART_COLORS.accent
            : i >= 18 && i < 22
            ? CHART_COLORS.purple
            : CHART_COLORS.info
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Day of Week
  const dowData = {
    labels: weekdays,
    datasets: [
      {
        label: 'Aktivitäten',
        data: dowDist,
        backgroundColor: CHART_COLORS.accentMuted,
        borderColor: CHART_COLORS.accent,
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  // Skill Radar
  const skillLabels = Object.keys(skillProgress).map(
    (k) => k.replace(/([A-Z])/g, ' $1').trim()
  );
  const skillValues = Object.values(skillProgress);

  const radarData = {
    labels: skillLabels,
    datasets: [
      {
        label: 'Skill Level',
        data: skillValues,
        backgroundColor: CHART_COLORS.accentMuted,
        borderColor: CHART_COLORS.accent,
        borderWidth: 2,
        pointBackgroundColor: CHART_COLORS.accent,
        pointBorderColor: '#242424',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  // Completion Breakdown Doughnut
  const totalLessons = lessons.length;
  const totalQuizzes = quizzes.length;
  const completionData = {
    labels: [
      t('analytics.doughnutLessonsDone'),
      t('analytics.doughnutLessonsOpen'),
      t('analytics.doughnutQuizzesDone'),
      t('analytics.doughnutQuizzesOpen'),
      t('analytics.doughnutProjectsDone'),
      t('analytics.doughnutProjectsOpen'),
    ],
    datasets: [
      {
        data: [
          lessonsCompleted.length,
          totalLessons - lessonsCompleted.length,
          quizzesCompleted.filter((q) => q.completed).length,
          totalQuizzes - quizzesCompleted.filter((q) => q.completed).length,
          projectsCompleted.length,
          9 - projectsCompleted.length,
        ],
        backgroundColor: [
          CHART_COLORS.accent,
          'rgba(255, 149, 0, 0.12)',
          CHART_COLORS.info,
          'rgba(10, 132, 255, 0.12)',
          CHART_COLORS.success,
          'rgba(48, 209, 88, 0.12)',
        ],
        borderColor: '#242424',
        borderWidth: 2,
      },
    ],
  };

  // Weekly Activity Trend (Line)
  const weeklyTrendData = {
    labels: weeklyActivity.map((w) => w.weekLabel),
    datasets: [
      {
        label: 'Aktivitäten / Woche',
        data: weeklyActivity.map((w) => w.count),
        borderColor: CHART_COLORS.success,
        backgroundColor: CHART_COLORS.successMuted,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: CHART_COLORS.success,
        pointBorderColor: '#242424',
        pointBorderWidth: 2,
      },
    ],
  };

  // ── Averages ───────────────────────────────────────────────────
  const avgQuizScore = useMemo(() => {
    if (quizzesCompleted.length === 0) return 0;
    return Math.round(
      quizzesCompleted.reduce((a, q) => a + q.score, 0) / quizzesCompleted.length
    );
  }, [quizzesCompleted]);

  const hours = Math.floor(timeInvested / 60);
  const minutes = timeInvested % 60;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center text-apple-muted hover:text-apple-text text-sm mb-4 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          {t('common.dashboard')}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-apple-accent font-mono text-sm tracking-widest uppercase mb-2">
              {t('analytics.title')}
            </p>
            <h1 className="text-3xl font-bold text-apple-text">
              {t('analytics.titleDetail')}
            </h1>
            <p className="text-apple-textSecondary mt-1">
              {t('analytics.subtitle')}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-apple-surface border border-apple-border rounded-apple px-4 py-2">
            <Activity size={18} className="text-apple-accent" />
            <span className="text-apple-text font-mono text-sm">
              {events.length} {t('analytics.events')}
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          icon={<Flame className="text-orange-400" size={20} />}
          label={t('analytics.currentStreak')}
          value={`${streak}`}
          suffix={t('analytics.daysSuffix')}
          highlight={streak >= 7}
        />
        <KPICard
          icon={<Award className="text-apple-accent" size={20} />}
          label={t('analytics.longestStreak')}
          value={`${streakHistory.longest}`}
          suffix={t('analytics.daysSuffix')}
        />
        <KPICard
          icon={<Target className="text-apple-info" size={20} />}
          label={t('analytics.activeDays')}
          value={`${streakHistory.activeDays}`}
          suffix={t('analytics.totalSuffix')}
        />
        <KPICard
          icon={<Clock className="text-purple-400" size={20} />}
          label={t('analytics.learningTime')}
          value={hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          suffix={t('analytics.investedSuffix')}
        />
      </div>

      {/* ── Weekly Goals ──────────────────────────────────────── */}
      <div className="apple-card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-apple-text flex items-center space-x-2">
            <Target className="text-apple-accent" size={20} />
            <span>{t('analytics.weeklyGoals')}</span>
          </h2>
          <div className="flex items-center space-x-3 text-xs font-mono text-apple-muted">
            <label className="flex items-center space-x-1.5">
              <span>{t('analytics.lessonsPerWeekLabel')}</span>
              <select
                value={weeklyGoal.lessonsPerWeek}
                onChange={(e) => setWeeklyGoal({ lessonsPerWeek: Number(e.target.value) })}
                className="bg-apple-elevated border border-apple-border rounded px-2 py-1 text-apple-text focus:outline-none focus:border-apple-accent"
              >
                {[1, 2, 3, 4, 5, 7].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center space-x-1.5">
              <span>{t('analytics.quizzesPerWeekLabel')}</span>
              <select
                value={weeklyGoal.quizzesPerWeek}
                onChange={(e) => setWeeklyGoal({ quizzesPerWeek: Number(e.target.value) })}
                className="bg-apple-elevated border border-apple-border rounded px-2 py-1 text-apple-text focus:outline-none focus:border-apple-accent"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalProgress
            label={t('analytics.lessonsThisWeek')}
            current={weekLessons}
            target={weeklyGoal.lessonsPerWeek}
            color="bg-apple-accent"
          />
          <GoalProgress
            label={t('analytics.quizzesThisWeek')}
            current={weekQuizzes}
            target={weeklyGoal.quizzesPerWeek}
            color="bg-apple-info"
          />
        </div>
      </div>

      {/* ── Activity Heatmap ──────────────────────────────────── */}
      <div className="apple-card">
        <h2 className="text-lg font-bold text-apple-text mb-1 flex items-center space-x-2">
          <Calendar className="text-apple-accent" size={20} />
          <span>{t('analytics.activityHeatmap')}</span>
        </h2>
        <p className="text-apple-muted text-xs mb-4 font-mono">{t('analytics.last12Weeks')}</p>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[600px]">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1 pt-0">
              {weekdays.map((d) => (
                <div
                  key={d}
                  className="h-[14px] w-6 flex items-center justify-end text-[9px] text-apple-muted font-mono"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Weeks */}
            {heatmapWeeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`h-[14px] w-[14px] rounded-[3px] ${heatmapColor(day.count)} transition-colors cursor-default`}
                    title={t('analytics.activityTooltip', {
                      date: new Date(day.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
                      count: day.count,
                    })}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-apple-muted font-mono">
          <span>{t('analytics.less')}</span>
          <div className="h-[10px] w-[10px] rounded-[2px] bg-apple-elevated" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-orange-900/50" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-orange-700/60" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-orange-500/70" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-orange-400" />
          <span>{t('analytics.more')}</span>
        </div>
      </div>

      {/* ── Charts Row 1: Quiz Scores + Learning Velocity ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quiz Performance */}
        <div className="apple-card">
          <h3 className="text-base font-bold text-apple-text mb-1 flex items-center space-x-2">
            <TrendingUp className="text-apple-accent" size={18} />
            <span>{t('analytics.quizPerformance')}</span>
          </h3>
          <p className="text-apple-muted text-xs mb-4 font-mono">
            {t('analytics.scoreTrend', { avg: avgQuizScore })}
          </p>
          <div className="h-[220px]">
            {quizScores.length > 0 ? (
              <Line
                data={quizScoreData}
                options={{
                  ...baseChartOptions,
                  plugins: {
                    ...baseChartOptions.plugins,
                    legend: { display: false },
                  },
                  scales: {
                    ...baseChartOptions.scales,
                    y: { ...baseChartOptions.scales.y, min: 0, max: 100 },
                  },
                }}
              />
            ) : (
              <EmptyChart message={t('analytics.closeQuizzesToSeeScore')} />
            )}
          </div>
        </div>

        {/* Learning Velocity */}
        <div className="apple-card">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-apple-text flex items-center space-x-2">
              <Zap className="text-apple-accent" size={18} />
              <span>{t('analytics.learningVelocity')}</span>
            </h3>
            <select
              value={velocityWeeks}
              onChange={(e) => setVelocityWeeks(Number(e.target.value))}
              className="bg-apple-elevated border border-apple-border rounded px-2 py-1 text-apple-text text-xs font-mono focus:outline-none focus:border-apple-accent"
            >
              <option value={4}>{t('analytics.week4')}</option>
              <option value={8}>{t('analytics.week8')}</option>
              <option value={12}>{t('analytics.week12')}</option>
            </select>
          </div>
          <p className="text-apple-muted text-xs mb-4 font-mono">
            {t('analytics.completionsPerWeek')}
          </p>
          <div className="h-[220px]">
            {events.length > 0 ? (
              <Bar
                data={velocityData}
                options={{
                  ...baseChartOptions,
                  plugins: {
                    ...baseChartOptions.plugins,
                    legend: {
                      ...baseChartOptions.plugins.legend,
                      position: 'top' as const,
                    },
                  },
                }}
              />
            ) : (
              <EmptyChart message={t('analytics.closeLessonsToSeeVelocity')} />
            )}
          </div>
        </div>
      </div>

      {/* ── Charts Row 2: Weekly Trend + Completion Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Activity Trend */}
        <div className="apple-card">
          <h3 className="text-base font-bold text-apple-text mb-1 flex items-center space-x-2">
            <BarChart3 className="text-apple-success" size={18} />
            <span>{t('analytics.weeklyTrend')}</span>
          </h3>
          <p className="text-apple-muted text-xs mb-4 font-mono">
            {t('analytics.activitiesPerWeek')}
          </p>
          <div className="h-[220px]">
            {events.length > 0 ? (
              <Line
                data={weeklyTrendData}
                options={{
                  ...baseChartOptions,
                  plugins: {
                    ...baseChartOptions.plugins,
                    legend: { display: false },
                  },
                }}
              />
            ) : (
              <EmptyChart message={t('analytics.startLearningForTrend')} />
            )}
          </div>
        </div>

        {/* Completion Breakdown */}
        <div className="apple-card">
          <h3 className="text-base font-bold text-apple-text mb-1 flex items-center space-x-2">
            <Activity className="text-purple-400" size={18} />
            <span>{t('analytics.completionOverview')}</span>
          </h3>
          <p className="text-apple-muted text-xs mb-4 font-mono">
            {t('analytics.lessonsQuizzesProjectsCaption')}
          </p>
          <div className="h-[220px] flex items-center justify-center">
            <Doughnut
              data={completionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    labels: {
                      color: CHART_COLORS.text,
                      font: { family: "'JetBrains Mono', monospace", size: 10 },
                      padding: 8,
                      boxWidth: 12,
                    },
                  },
                  tooltip: baseChartOptions.plugins.tooltip,
                },
                cutout: '55%',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Charts Row 3: Time Distribution + Skill Radar ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hourly Distribution */}
        <div className="apple-card">
          <h3 className="text-base font-bold text-apple-text mb-1 flex items-center space-x-2">
            <Clock className="text-apple-info" size={18} />
            <span>{t('analytics.timeDistribution')}</span>
          </h3>
          <p className="text-apple-muted text-xs mb-4 font-mono">
            {t('analytics.whenMostActive')}
          </p>
          <div className="h-[200px]">
            {events.length > 0 ? (
              <Bar
                data={hourlyData}
                options={{
                  ...baseChartOptions,
                  plugins: {
                    ...baseChartOptions.plugins,
                    legend: { display: false },
                  },
                }}
              />
            ) : (
              <EmptyChart message={t('analytics.dataCollectedWhenActive')} />
            )}
          </div>
        </div>

        {/* Skill Radar */}
        <div className="apple-card">
          <h3 className="text-base font-bold text-apple-text mb-1 flex items-center space-x-2">
            <Brain className="text-apple-accent" size={18} />
            <span>{t('analytics.skillProfile')}</span>
          </h3>
          <p className="text-apple-muted text-xs mb-4 font-mono">
            {t('analytics.yourStrengths')}
          </p>
          <div className="h-[220px]">
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    ticks: {
                      stepSize: 20,
                      color: CHART_COLORS.text,
                      backdropColor: 'transparent',
                      font: { size: 9 },
                    },
                    grid: { color: CHART_COLORS.grid },
                    angleLines: { color: CHART_COLORS.grid },
                    pointLabels: {
                      color: CHART_COLORS.text,
                      font: { family: "'JetBrains Mono', monospace", size: 10 },
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: baseChartOptions.plugins.tooltip,
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Day of Week Chart ─────────────────────────────────── */}
      <div className="apple-card">
        <h3 className="text-base font-bold text-apple-text mb-1 flex items-center space-x-2">
          <Calendar className="text-apple-warning" size={18} />
          <span>{t('analytics.weekdayActivity')}</span>
        </h3>
        <p className="text-apple-muted text-xs mb-4 font-mono">
          {t('analytics.whichDaysYouLearn')}
        </p>
        <div className="h-[180px]">
          {events.length > 0 ? (
            <Bar
              data={dowData}
              options={{
                ...baseChartOptions,
                plugins: {
                  ...baseChartOptions.plugins,
                  legend: { display: false },
                },
              }}
            />
          ) : (
            <EmptyChart message={t('analytics.learnDifferentDays')} />
          )}
        </div>
      </div>

      {/* ── Learning Insights ─────────────────────────────────── */}
      <div className="apple-card border-apple-accent/20 accent-glow">
        <h2 className="text-lg font-bold text-apple-text mb-5 flex items-center space-x-2">
          <Lightbulb className="text-apple-accent" size={20} />
          <span>{t('analytics.learningInsights')}</span>
        </h2>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start space-x-3 p-3 bg-apple-bg rounded-apple border border-apple-border"
            >
              <span className="text-apple-accent font-mono text-sm mt-0.5 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-apple-textSecondary text-sm leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Summary Stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat label={t('analytics.lessonsLabel')} value={`${lessonsCompleted.length}/${totalLessons}`} />
        <MiniStat label={t('analytics.quizzesLabel')} value={`${quizzesCompleted.filter((q) => q.completed).length}/${totalQuizzes}`} />
        <MiniStat label={t('analytics.projectsLabel')} value={`${projectsCompleted.length}/${projects.length}`} />
        <MiniStat label={t('analytics.avgQuizScoreLabel')} value={`${avgQuizScore}%`} />
      </div>
    </div>
  );
};

// ── Sub-Components ─────────────────────────────────────────────────

function KPICard({
  icon,
  label,
  value,
  suffix,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`apple-card ${highlight ? 'border-apple-accent/30 accent-glow' : ''}`}>
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <span className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-apple-text font-mono">{value}</span>
        {suffix && (
          <span className="text-xs text-apple-muted">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function GoalProgress({
  label,
  current,
  target,
  color,
}: {
  label: string;
  current: number;
  target: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const isComplete = current >= target;
  return (
    <div className="bg-apple-bg rounded-apple p-4 border border-apple-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-apple-textSecondary text-sm">{label}</span>
        <span className={`font-mono text-sm font-semibold ${isComplete ? 'text-apple-success' : 'text-apple-text'}`}>
          {current}/{target} {isComplete && '✓'}
        </span>
      </div>
      <div className="w-full bg-apple-border rounded-full h-2 overflow-hidden">
        <div
          className={`${isComplete ? 'bg-apple-success' : color} h-full transition-all duration-500 rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-apple-surface border border-apple-border rounded-apple p-4 text-center">
      <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-xl font-bold text-apple-text font-mono">{value}</p>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <BarChart3 className="text-apple-border mb-3" size={32} />
      <p className="text-apple-muted text-sm">{message}</p>
    </div>
  );
}

export default LearningAnalyticsView;
