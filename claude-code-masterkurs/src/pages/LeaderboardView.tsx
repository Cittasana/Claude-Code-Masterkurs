import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Medal, Crown, Flame, BookOpen, CheckCircle2, ChevronUp, ChevronDown, Minus, Settings } from 'lucide-react';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { useUserProgress } from '../store/userProgress';
import type { LeaderboardTimeframe, LeaderboardSortBy, LeaderboardEntry } from '../types';

const AVATAR_OPTIONS = ['🧑‍💻', '🚀', '💜', '⚡', '🌟', '🔧', '✨', '💻', '🤖', '🎯', '🔮', '🌊', '🎨', '⚙️', '🌱', '👋', '🦊', '🐱', '🐶', '🦄', '🎮', '🎵', '🏆', '💡', '🔥'];

const LeaderboardView = () => {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('all');
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>('points');
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const init = useLeaderboardStore((s) => s.init);
  const syncCurrentUser = useLeaderboardStore((s) => s.syncCurrentUser);
  const getSorted = useLeaderboardStore((s) => s.getSorted);
  const getCurrentUserRank = useLeaderboardStore((s) => s.getCurrentUserRank);
  const updateProfile = useLeaderboardStore((s) => s.updateProfile);
  const currentUserProfile = useLeaderboardStore((s) => s.currentUserProfile);

  const {
    totalPoints,
    lessonsCompleted,
    quizzesCompleted,
    projectsCompleted,
    streak,
  } = useUserProgress();

  // Initialise leaderboard on mount
  useEffect(() => {
    init();
  }, [init]);

  // Sync current user progress
  useEffect(() => {
    syncCurrentUser({
      totalPoints,
      lessonsCompleted: lessonsCompleted.length,
      quizzesCompleted: quizzesCompleted.filter(q => q.completed).length,
      projectsCompleted: projectsCompleted.length,
      streak,
    });
  }, [totalPoints, lessonsCompleted, quizzesCompleted, projectsCompleted, streak, syncCurrentUser]);

  const sorted = useMemo(() => getSorted(timeframe, sortBy), [getSorted, timeframe, sortBy]);
  const currentRank = useMemo(() => getCurrentUserRank(timeframe, sortBy), [getCurrentUserRank, timeframe, sortBy]);

  // Profile editor state
  useEffect(() => {
    setNameInput(currentUserProfile.displayName);
    setSelectedEmoji(currentUserProfile.avatarEmoji);
  }, [currentUserProfile]);

  const handleSaveProfile = () => {
    if (nameInput.trim()) {
      updateProfile(nameInput.trim(), selectedEmoji);
    }
    setShowProfileEditor(false);
  };

  const timeframes: { key: LeaderboardTimeframe; label: string }[] = [
    { key: 'all', label: t('leaderboard.allTime') },
    { key: 'week', label: t('leaderboard.thisWeek') },
    { key: 'month', label: t('leaderboard.thisMonth') },
  ];

  const sortOptions: { key: LeaderboardSortBy; label: string; icon: React.ReactNode }[] = [
    { key: 'points', label: t('leaderboard.points'), icon: <Trophy size={14} /> },
    { key: 'lessons', label: t('leaderboard.lessons'), icon: <BookOpen size={14} /> },
    { key: 'quizzes', label: t('leaderboard.quizzes'), icon: <CheckCircle2 size={14} /> },
    { key: 'streak', label: t('leaderboard.streak'), icon: <Flame size={14} /> },
  ];

  const getPointsValue = (entry: LeaderboardEntry): number => {
    if (timeframe === 'week') return entry.weeklyPoints;
    if (timeframe === 'month') return entry.monthlyPoints;
    switch (sortBy) {
      case 'lessons': return entry.lessonsCompleted;
      case 'quizzes': return entry.quizzesCompleted;
      case 'streak': return entry.streak;
      default: return entry.totalPoints;
    }
  };

  const getPointsLabel = (): string => {
    if (timeframe === 'week') return t('leaderboard.weeklyPoints');
    if (timeframe === 'month') return t('leaderboard.monthlyPoints');
    switch (sortBy) {
      case 'lessons': return t('leaderboard.lessons');
      case 'quizzes': return t('leaderboard.quizzes');
      case 'streak': return t('leaderboard.days');
      default: return t('leaderboard.points');
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('leaderboard.title')}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-apple-accent font-mono text-sm tracking-widest uppercase mb-2">
            {t('nav.community')}
          </p>
          <h1 className="text-4xl font-bold text-apple-text tracking-tight">
            {t('leaderboard.title')}
          </h1>
          <p className="text-apple-textSecondary mt-2">
            {t('leaderboard.subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowProfileEditor(!showProfileEditor)}
          className="btn-secondary inline-flex items-center gap-2 shrink-0"
        >
          <Settings size={18} />
          Profil bearbeiten
        </button>
      </div>

      {/* Profile Editor */}
      {showProfileEditor && (
        <div className="apple-card mb-8">
          <h2 className="text-sm font-mono uppercase tracking-wider text-apple-muted mb-4">
            Dein Profil
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="lb-name" className="block text-sm font-medium text-apple-textSecondary mb-1">
                Anzeigename
              </label>
              <input
                id="lb-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                placeholder="Dein Name"
                className="w-full max-w-sm bg-apple-bg border border-apple-border rounded-apple px-4 py-2.5 text-apple-text text-sm placeholder-apple-muted/50 focus:border-apple-accent/50 focus:outline-none focus:ring-1 focus:ring-apple-accent/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-textSecondary mb-2">
                Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-apple text-xl flex items-center justify-center transition-all duration-200 ${
                      selectedEmoji === emoji
                        ? 'bg-apple-accent/20 border-2 border-apple-accent scale-110'
                        : 'bg-apple-elevated border border-apple-border hover:border-apple-borderLight hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleSaveProfile} className="btn-primary">
                Speichern
              </button>
              <button
                type="button"
                onClick={() => setShowProfileEditor(false)}
                className="btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Your Position Card */}
      <div className="apple-card accent-glow mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-apple-accent/15 border-2 border-apple-accent flex items-center justify-center text-2xl">
              {currentUserProfile.avatarEmoji}
            </div>
            <div>
              <p className="text-xs text-apple-muted font-mono uppercase tracking-wider">Dein Rang</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-apple-accent font-mono">#{currentRank}</span>
                <span className="text-apple-textSecondary">von {sorted.length}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MiniStat label={t('leaderboard.points')} value={totalPoints} />
            <MiniStat label={t('leaderboard.lessons')} value={lessonsCompleted.length} />
            <MiniStat label={t('leaderboard.quizzes')} value={quizzesCompleted.filter(q => q.completed).length} />
            <MiniStat label={t('leaderboard.streak')} value={`${streak}d`} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Timeframe */}
        <div className="flex gap-1 p-1 bg-apple-surface border border-apple-border rounded-apple">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className={`px-4 py-2 rounded-apple text-sm font-medium transition-all duration-200 ${
                timeframe === tf.key
                  ? 'bg-apple-accent text-white'
                  : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Sort By (only for "all" timeframe) */}
        {timeframe === 'all' && (
          <div className="flex gap-1 p-1 bg-apple-surface border border-apple-border rounded-apple">
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-apple text-sm font-medium transition-all duration-200 ${
                  sortBy === opt.key
                    ? 'bg-apple-accent text-white'
                    : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Podium (Top 3) */}
      {sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <PodiumCard entry={sorted[1]} rank={2} pointsValue={getPointsValue(sorted[1])} pointsLabel={getPointsLabel()} />
          {/* 1st Place */}
          <PodiumCard entry={sorted[0]} rank={1} pointsValue={getPointsValue(sorted[0])} pointsLabel={getPointsLabel()} />
          {/* 3rd Place */}
          <PodiumCard entry={sorted[2]} rank={3} pointsValue={getPointsValue(sorted[2])} pointsLabel={getPointsLabel()} />
        </div>
      )}

      {/* Full Ranking Table */}
      <div className="apple-card">
        <h2 className="text-sm font-mono uppercase tracking-wider text-apple-muted mb-4">
          Vollständiges Ranking
        </h2>

        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-2 text-xs text-apple-muted font-mono uppercase tracking-wider border-b border-apple-border mb-1">
          <span className="w-8 text-center">#</span>
          <span>Spieler</span>
          <span className="text-right hidden sm:block">Level</span>
          <span className="text-right hidden sm:block">Badges</span>
          <span className="text-right">Trend</span>
          <span className="text-right w-20">{getPointsLabel()}</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-apple-border/50">
          {sorted.map((entry, index) => (
            <RankingRow
              key={entry.id}
              entry={entry}
              rank={index + 1}
              pointsValue={getPointsValue(entry)}
              pointsLabel={getPointsLabel()}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-apple-muted text-sm mt-6">
        Das Leaderboard wird lokal gespeichert. Community-Daten sind simuliert.
      </p>
    </div>
  );
};

/* === Sub-Components === */

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-xs text-apple-muted font-mono uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-apple-text font-mono">{value}</p>
    </div>
  );
}

function PodiumCard({
  entry,
  rank,
  pointsValue,
  pointsLabel,
}: {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
  pointsValue: number;
  pointsLabel: string;
}) {
  const rankConfig = {
    1: {
      icon: <Crown size={28} className="text-apple-warning" />,
      border: 'border-apple-warning/40',
      bg: 'from-apple-warning/10 to-apple-warning/0',
      height: 'pt-2',
      medal: '🥇',
    },
    2: {
      icon: <Medal size={24} className="text-apple-textSecondary" />,
      border: 'border-apple-borderLight/30',
      bg: 'from-apple-borderLight/10 to-apple-borderLight/0',
      height: 'pt-8',
      medal: '🥈',
    },
    3: {
      icon: <Medal size={24} className="text-apple-accentMuted" />,
      border: 'border-apple-accentMuted/30',
      bg: 'from-apple-accentMuted/10 to-apple-accentMuted/0',
      height: 'pt-12',
      medal: '🥉',
    },
  }[rank];

  return (
    <div className={`${rankConfig.height}`}>
      <div
        className={`apple-card ${rankConfig.border} relative overflow-hidden text-center ${
          entry.isCurrentUser ? 'ring-2 ring-apple-accent/50' : ''
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${rankConfig.bg} pointer-events-none`} />
        <div className="relative">
          <div className="flex justify-center mb-2">{rankConfig.icon}</div>
          <div className="w-12 h-12 mx-auto rounded-full bg-apple-elevated border border-apple-border flex items-center justify-center text-xl mb-2">
            {entry.avatarEmoji}
          </div>
          <p className={`font-semibold text-sm ${entry.isCurrentUser ? 'text-apple-accent' : 'text-apple-text'} truncate`}>
            {entry.displayName}
            {entry.isCurrentUser && <span className="text-xs ml-1">(Du)</span>}
          </p>
          <p className="text-xs text-apple-muted font-mono mt-1">
            Level {entry.level}
          </p>
          <p className="text-lg font-bold text-apple-accent font-mono mt-2">
            {pointsValue.toLocaleString('de-DE')}
          </p>
          <p className="text-[10px] text-apple-muted font-mono uppercase">
            {pointsLabel}
          </p>
          {entry.badges.length > 0 && (
            <div className="flex justify-center gap-0.5 mt-2 flex-wrap">
              {entry.badges.slice(0, 4).map((b) => (
                <span key={b.id} className="text-sm" title={b.name}>
                  {b.icon}
                </span>
              ))}
              {entry.badges.length > 4 && (
                <span className="text-[10px] text-apple-muted font-mono">+{entry.badges.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RankingRow({
  entry,
  rank,
  pointsValue,
}: {
  entry: LeaderboardEntry;
  rank: number;
  pointsValue: number;
  pointsLabel: string;
}) {
  const { t } = useTranslation();
  const getRankIcon = () => {
    if (rank === 1) return <span className="text-lg">🥇</span>;
    if (rank === 2) return <span className="text-lg">🥈</span>;
    if (rank === 3) return <span className="text-lg">🥉</span>;
    return <span className="text-sm font-mono text-apple-muted">{rank}</span>;
  };

  const getTrend = () => {
    // Simulated trend based on weeklyPoints vs. average
    const ratio = entry.weeklyPoints / Math.max(entry.totalPoints * 0.1, 1);
    if (ratio > 1.2) return { icon: <ChevronUp size={16} className="text-apple-success" />, label: t('leaderboard.trendRising') };
    if (ratio < 0.8) return { icon: <ChevronDown size={16} className="text-apple-error" />, label: t('leaderboard.trendFalling') };
    return { icon: <Minus size={16} className="text-apple-muted" />, label: t('leaderboard.stable') };
  };

  const trend = getTrend();

  const levelColors: Record<number, string> = {
    1: 'text-apple-success bg-apple-success/10 border-apple-success/30',
    2: 'text-apple-accent bg-apple-accent/10 border-apple-accent/30',
    3: 'text-apple-info bg-apple-info/10 border-apple-info/30',
  };

  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-apple transition-colors duration-200 ${
        entry.isCurrentUser
          ? 'bg-apple-accent/8 border border-apple-accent/20'
          : 'hover:bg-apple-hover/50'
      }`}
    >
      {/* Rank */}
      <div className="w-8 flex justify-center">{getRankIcon()}</div>

      {/* Player */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-apple-elevated border border-apple-border flex items-center justify-center text-base shrink-0">
          {entry.avatarEmoji}
        </div>
        <div className="min-w-0">
          <p className={`font-medium text-sm truncate ${entry.isCurrentUser ? 'text-apple-accent' : 'text-apple-text'}`}>
            {entry.displayName}
            {entry.isCurrentUser && (
              <span className="text-xs text-apple-accent/70 ml-1">(Du)</span>
            )}
          </p>
          <p className="text-[11px] text-apple-muted font-mono truncate">
            {entry.lessonsCompleted} {t('leaderboard.lessons')} · {entry.projectsCompleted} {t('dashboard.projects')}
          </p>
        </div>
      </div>

      {/* Level */}
      <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${levelColors[entry.level]}`}>
        Lv.{entry.level}
      </span>

      {/* Badges */}
      <div className="hidden sm:flex gap-0.5">
        {entry.badges.slice(0, 3).map((b) => (
          <span key={b.id} className="text-sm" title={`${b.name}: ${b.description}`}>
            {b.icon}
          </span>
        ))}
        {entry.badges.length > 3 && (
          <span className="text-[10px] text-apple-muted font-mono self-end">+{entry.badges.length - 3}</span>
        )}
      </div>

      {/* Trend */}
      <div className="flex items-center" title={trend.label}>
        {trend.icon}
      </div>

      {/* Points */}
      <div className="w-20 text-right">
        <span className="font-bold text-sm text-apple-text font-mono">
          {pointsValue.toLocaleString('de-DE')}
        </span>
      </div>
    </div>
  );
}

export default LeaderboardView;
