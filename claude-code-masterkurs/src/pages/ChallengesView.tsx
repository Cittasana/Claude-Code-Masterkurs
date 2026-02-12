import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Clock,
  Trophy,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
  Copy,
  Check,
  Filter,
  Play,
  Star,
} from 'lucide-react';
import { challenges, challengeCategories, challengeDifficulties } from '../data/challenges';
import {
  liveCodingChallenges,
  liveCodingCategories,
  liveCodingDifficulties,
} from '../data/liveCodingChallenges';
import { useTranslation } from 'react-i18next';
import { useChallengeStore } from '../store/challengeStore';
import { getCategoryI18nKey } from '../utils/challengeI18n';
import type { CodingChallenge, ChallengeResult } from '../types';
import { useLearningTimer } from '../hooks/useLearningTimer';

/** Alle Challenges: Claude Code (Kurs) + Live Coding (Algorithmen), separat von Projekten */
const allChallenges: CodingChallenge[] = [
  ...challenges,
  ...liveCodingChallenges,
];
const allCategories = [...new Set([...challengeCategories, ...liveCodingCategories])];
const allDifficulties = [...new Set([...challengeDifficulties, ...liveCodingDifficulties])];

/* ================================================================
   ChallengesView – Live Coding Challenges
   ================================================================ */

type SourceFilter = 'all' | 'claude-code' | 'live-coding';

const DIFFICULTY_KEYS: Record<string, string> = {
  Anfänger: 'challenges.difficultyBeginner',
  Fortgeschritten: 'challenges.difficultyAdvanced',
  Expert: 'challenges.difficultyExpert',
};

const ChallengesView = () => {
  useLearningTimer({ context: 'challenge' });
  const { t } = useTranslation();
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('Alle');
  const [filterCategory, setFilterCategory] = useState<string>('Alle');
  const [filterSource, setFilterSource] = useState<SourceFilter>('all');
  const { results, isCompleted } = useChallengeStore();

  const getDifficultyLabel = (d: string) =>
    d === 'Alle' ? t('challenges.all') : (DIFFICULTY_KEYS[d] ? t(DIFFICULTY_KEYS[d]) : d);
  const getCategoryLabel = (c: string) =>
    c === 'Alle' ? t('challenges.all') : t(`challenges.categories.${getCategoryI18nKey(c)}`, { defaultValue: c });
  const getChallengeTitle = (ch: CodingChallenge) =>
    t(`challenges.data.${ch.id}.title`, { defaultValue: ch.title });
  const getChallengeDescription = (ch: CodingChallenge) =>
    t(`challenges.data.${ch.id}.description`, { defaultValue: ch.description });

  const completedCount = Object.values(results).filter((r) => r.completed).length;
  const totalPoints = Object.values(results).reduce((s, r) => s + r.score, 0);

  const filtered = useMemo(() => {
    return allChallenges.filter((ch) => {
      if (filterSource !== 'all') {
        const source = ch.source ?? 'claude-code';
        if (source !== filterSource) return false;
      }
      if (filterDifficulty !== 'Alle' && ch.difficulty !== filterDifficulty) return false;
      if (filterCategory !== 'Alle' && ch.category !== filterCategory) return false;
      return true;
    });
  }, [filterDifficulty, filterCategory, filterSource]);

  if (selectedChallenge) {
    return (
      <ChallengeWorkspace
        challenge={selectedChallenge}
        onBack={() => setSelectedChallenge(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('challenges.breadcrumbChallenges')}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="text-apple-accent" size={28} />
            <h1 className="text-3xl font-bold text-apple-text tracking-tight">
              {t('challenges.title')}
            </h1>
          </div>
          <p className="text-apple-textSecondary max-w-2xl">
            {t('challenges.subtitle')}
          </p>
        </div>
        {/* Stats */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-apple bg-apple-surface border border-apple-border">
            <Trophy size={16} className="text-apple-accent" />
            <div>
              <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
                {t('challenges.completed')}
              </p>
              <p className="text-sm font-semibold text-apple-text">
                {completedCount}/{allChallenges.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-apple bg-apple-surface border border-apple-border">
            <Star size={16} className="text-apple-warning" />
            <div>
              <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
                {t('challenges.points')}
              </p>
              <p className="text-sm font-semibold text-apple-text">{totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="apple-card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={14} className="text-apple-accent" />
          <span className="text-xs text-apple-muted font-mono uppercase tracking-widest">
            {t('challenges.filter')}
          </span>
        </div>
        <div className="space-y-4">
          {/* Bereich */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-apple-textSecondary shrink-0 w-20">{t('challenges.area')}</span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all' as const, labelKey: 'challenges.all' },
                { value: 'claude-code' as const, labelKey: 'challenges.claudeCode' },
                { value: 'live-coding' as const, labelKey: 'challenges.liveCoding' },
              ].map(({ value, labelKey }) => (
                <button
                  key={value}
                  onClick={() => setFilterSource(value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                    filterSource === value
                      ? 'bg-apple-accent/20 text-apple-accent border border-apple-accent/40 shadow-sm'
                      : 'bg-apple-elevated/90 text-apple-textSecondary border border-apple-border hover:bg-apple-hover hover:border-apple-borderLight hover:text-apple-text'
                  }`}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>
          </div>
          {/* Schwierigkeit */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-apple-textSecondary shrink-0 w-20">{t('challenges.difficulty')}</span>
            <div className="flex flex-wrap gap-2">
              {['Alle', ...allDifficulties].map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDifficulty(d)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                    filterDifficulty === d
                      ? 'bg-apple-accent/20 text-apple-accent border border-apple-accent/40 shadow-sm'
                      : 'bg-apple-elevated/90 text-apple-textSecondary border border-apple-border hover:bg-apple-hover hover:border-apple-borderLight hover:text-apple-text'
                  }`}
                >
                  {getDifficultyLabel(d)}
                </button>
              ))}
            </div>
          </div>
          {/* Kategorie */}
          <div className="flex flex-wrap items-start gap-2 pt-1 border-t border-apple-border/80">
            <span className="text-xs font-medium text-apple-textSecondary shrink-0 w-20 pt-1.5">{t('challenges.category')}</span>
            <div className="flex flex-wrap gap-2 min-w-0 flex-1 pt-0.5">
              {['Alle', ...allCategories].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                    filterCategory === c
                      ? 'bg-apple-accent/20 text-apple-accent border border-apple-accent/40 shadow-sm'
                      : 'bg-apple-elevated/90 text-apple-textSecondary border border-apple-border hover:bg-apple-hover hover:border-apple-borderLight hover:text-apple-text'
                  }`}
                >
                  {getCategoryLabel(c)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ch) => {
          const done = isCompleted(ch.id);
          const result = results[ch.id];
          return (
            <button
              key={ch.id}
              onClick={() => setSelectedChallenge(ch)}
              className="apple-card-hover text-left group relative"
            >
              {done && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 size={18} className="text-apple-success" />
                </div>
              )}
              {/* Difficulty badge + source */}
              <div className="flex items-center space-x-2 mb-3 flex-wrap gap-1">
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${
                    ch.difficulty === 'Anfänger'
                      ? 'bg-apple-success/10 border-apple-success/25 text-apple-success'
                      : ch.difficulty === 'Fortgeschritten'
                      ? 'bg-apple-warning/10 border-apple-warning/25 text-apple-warning'
                      : 'bg-apple-accent/10 border-apple-accent/25 text-apple-accent'
                  }`}
                >
                  {getDifficultyLabel(ch.difficulty)}
                </span>
                <span className="text-[10px] text-apple-muted font-mono">
                  {getCategoryLabel(ch.category)}
                </span>
                {ch.source === 'live-coding' && (
                  <span className="text-[10px] font-mono rounded-full border bg-apple-info/10 border-apple-info/25 text-apple-info px-2 py-0.5">
                    {t('challenges.labelLive')}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-apple-text mb-1.5 group-hover:text-apple-accent transition-colors">
                {getChallengeTitle(ch)}
              </h3>
              <p className="text-sm text-apple-textSecondary line-clamp-2 mb-3">
                {getChallengeDescription(ch)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {ch.timeLimit > 0 && (
                    <span className="flex items-center space-x-1 text-xs text-apple-muted">
                      <Clock size={12} />
                      <span>{Math.floor(ch.timeLimit / 60)} {t('challenges.min')}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1 text-xs text-apple-accent font-mono">
                    <Star size={12} />
                    <span>{ch.points} {t('challenges.pts')}</span>
                  </span>
                </div>
                {result && (
                  <span className="text-[10px] text-apple-muted font-mono">
                    {result.score}/{result.maxScore}
                  </span>
                )}
                <ChevronRight
                  size={16}
                  className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all duration-200"
                />
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="apple-card text-center py-16">
          <Zap size={40} className="text-apple-muted mx-auto mb-3" />
          <p className="text-apple-textSecondary">
            {t('challenges.noChallenges')}
          </p>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   ChallengeWorkspace – The active challenge editor
   ================================================================ */

function ChallengeWorkspace({
  challenge,
  onBack,
}: {
  challenge: CodingChallenge;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const { results, saveResult } = useChallengeStore();
  const existingResult = results[challenge.id];
  const getDifficultyLabel = (d: string) =>
    d === 'Alle' ? t('challenges.all') : (DIFFICULTY_KEYS[d] ? t(DIFFICULTY_KEYS[d]) : d);
  const getCategoryLabel = (c: string) =>
    t(`challenges.categories.${getCategoryI18nKey(c)}`, { defaultValue: c });
  const challengeTitle = t(`challenges.data.${challenge.id}.title`, { defaultValue: challenge.title });

  const [code, setCode] = useState(challenge.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [validationResults, setValidationResults] = useState<
    { id: string; name: string; passed: boolean; error?: string; points: number }[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Timer
  const hasTimeLimit = challenge.timeLimit > 0;
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [timerActive, setTimerActive] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Start timer on first keystroke
  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      if (hasTimeLimit && !timerStarted) {
        setTimerActive(true);
        setTimerStarted(true);
      }
    },
    [hasTimeLimit, timerStarted]
  );

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Validate code
  const handleSubmit = useCallback(() => {
    const results = challenge.validations.map((v) => {
      let passed = false;
      if (v.isRegex) {
        try {
          const re = new RegExp(v.pattern, 'i');
          passed = re.test(code);
        } catch {
          passed = code.includes(v.pattern);
        }
      } else {
        passed = code.includes(v.pattern);
      }
      return {
        id: v.id,
        name: v.name,
        passed,
        error: passed ? undefined : v.errorMessage,
        points: passed ? v.points : 0,
      };
    });
    setValidationResults(results);
    setSubmitted(true);

    // Stop timer
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    const score = results.reduce((s, r) => s + r.points, 0);
    const maxScore = challenge.validations.reduce((s, v) => s + v.points, 0);
    const allPassed = results.every((r) => r.passed);
    const timeUsed = challenge.timeLimit - timeLeft;

    const challengeResult: ChallengeResult = {
      challengeId: challenge.id,
      completed: allPassed,
      score,
      maxScore,
      timeUsed,
      attempts: (existingResult?.attempts ?? 0) + 1,
      completedAt: allPassed ? new Date().toISOString() : undefined,
    };
    saveResult(challengeResult);
  }, [code, challenge, timeLeft, existingResult, saveResult]);

  // Reset
  const handleReset = () => {
    setCode(challenge.starterCode);
    setValidationResults([]);
    setSubmitted(false);
    setShowSolution(false);
    setHintsRevealed(0);
    setTimeLeft(challenge.timeLimit);
    setTimerActive(false);
    setTimerStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Copy solution
  const handleCopySolution = async () => {
    await navigator.clipboard.writeText(challenge.solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const score = validationResults.reduce((s, r) => s + r.points, 0);
  const maxScore = challenge.validations.reduce((s, v) => s + v.points, 0);
  const allPassed = submitted && validationResults.every((r) => r.passed);
  const timeExpired = hasTimeLimit && timeLeft === 0;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <button onClick={onBack} className="hover:text-apple-accent transition-colors">
          {t('challenges.breadcrumbChallenges')}
        </button>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary line-clamp-1">{challengeTitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Instructions */}
        <div className="lg:col-span-4 space-y-4">
          {/* Challenge Info */}
          <div className="apple-card">
            <div className="flex items-center space-x-2 mb-1">
              <span
                className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${
                  challenge.difficulty === 'Anfänger'
                    ? 'bg-apple-success/10 border-apple-success/25 text-apple-success'
                    : challenge.difficulty === 'Fortgeschritten'
                    ? 'bg-apple-warning/10 border-apple-warning/25 text-apple-warning'
                    : 'bg-apple-accent/10 border-apple-accent/25 text-apple-accent'
                }`}
              >
                {getDifficultyLabel(challenge.difficulty)}
              </span>
              <span className="text-[10px] text-apple-muted font-mono">
                {getCategoryLabel(challenge.category)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-apple-text mb-2">{challengeTitle}</h2>
            <p className="text-sm text-apple-textSecondary leading-relaxed whitespace-pre-line">
              {challenge.instruction}
            </p>
            <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-apple-border">
              <span className="flex items-center space-x-1 text-xs text-apple-accent font-mono">
                <Star size={12} />
                <span>{challenge.points} {t('challenges.points')}</span>
              </span>
              {hasTimeLimit && (
                <span className="flex items-center space-x-1 text-xs text-apple-muted font-mono">
                  <Clock size={12} />
                  <span>{Math.floor(challenge.timeLimit / 60)} {t('challenges.minLimit')}</span>
                </span>
              )}
            </div>
          </div>

          {/* Hints */}
          {challenge.hints.length > 0 && (
            <div className="apple-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb size={14} className="text-apple-warning" />
                  <span className="text-sm font-bold text-apple-text">{t('challenges.hints')}</span>
                </div>
                <span className="text-[10px] text-apple-muted font-mono">
                  {hintsRevealed}/{challenge.hints.length}
                </span>
              </div>
              <div className="space-y-2">
                {challenge.hints.map((hint, idx) => (
                  <div key={idx}>
                    {idx < hintsRevealed ? (
                      <div className="p-2.5 bg-apple-warning/5 border border-apple-warning/15 rounded-apple text-sm text-apple-text">
                        {hint}
                      </div>
                    ) : idx === hintsRevealed ? (
                      <button
                        onClick={() => setHintsRevealed((h) => h + 1)}
                        className="w-full p-2.5 border border-dashed border-apple-border rounded-apple text-sm text-apple-muted hover:text-apple-warning hover:border-apple-warning/30 transition-colors"
                      >
                        {t('challenges.revealHint', { n: idx + 1 })}
                      </button>
                    ) : (
                      <div className="p-2.5 border border-dashed border-apple-border/30 rounded-apple text-sm text-apple-muted/40">
                        {t('challenges.hintLocked', { n: idx + 1 })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Results */}
          {submitted && (
            <div className="apple-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-apple-text">{t('challenges.result')}</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    allPassed ? 'text-apple-success' : 'text-apple-warning'
                  }`}
                >
                  {score}/{maxScore} {t('challenges.points')}
                </span>
              </div>
              <div className="space-y-2">
                {validationResults.map((vr) => (
                  <div
                    key={vr.id}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-apple border ${
                      vr.passed
                        ? 'bg-apple-success/5 border-apple-success/15'
                        : 'bg-apple-error/5 border-apple-error/15'
                    }`}
                  >
                    {vr.passed ? (
                      <CheckCircle2 size={15} className="text-apple-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={15} className="text-apple-error shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          vr.passed ? 'text-apple-success' : 'text-apple-error'
                        }`}
                      >
                        {vr.name}{' '}
                        <span className="text-[10px] font-mono opacity-60">
                          (+{vr.points})
                        </span>
                      </p>
                      {vr.error && (
                        <p className="text-xs text-apple-error/80 mt-0.5">{vr.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {allPassed && (
                <div className="mt-4 p-3 bg-apple-success/10 border border-apple-success/30 rounded-apple text-center">
                  <p className="text-apple-success font-bold text-sm">
                    {t('challenges.allChecksPassed')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Editor */}
        <div className="lg:col-span-8 space-y-4">
          {/* Timer + Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {hasTimeLimit && (
                <div
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-apple border font-mono text-sm ${
                    timeExpired
                      ? 'bg-apple-error/10 border-apple-error/30 text-apple-error'
                      : timeLeft < 60
                      ? 'bg-apple-warning/10 border-apple-warning/30 text-apple-warning'
                      : 'bg-apple-surface border-apple-border text-apple-text'
                  }`}
                >
                  <Clock size={14} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
              {!timerStarted && hasTimeLimit && (
                <span className="text-xs text-apple-muted">
                  {t('challenges.timerStarts')}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-apple-muted hover:text-apple-text bg-apple-bg border border-apple-border rounded-apple hover:border-apple-borderLight transition-colors"
              >
                <RotateCcw size={12} />
                <span>{t('challenges.reset')}</span>
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-apple-muted hover:text-apple-text bg-apple-bg border border-apple-border rounded-apple hover:border-apple-borderLight transition-colors"
              >
                {showSolution ? <EyeOff size={12} /> : <Eye size={12} />}
                <span>{showSolution ? t('challenges.hideSolution') : t('challenges.showSolution')}</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={timeExpired}
                className={`flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold rounded-apple transition-all duration-200 ${
                  timeExpired
                    ? 'bg-apple-border text-apple-muted cursor-not-allowed'
                    : 'bg-apple-accent text-white hover:bg-apple-accentHover shadow-sm hover:shadow-apple-glow'
                }`}
              >
                <Play size={12} />
                <span>{t('challenges.check')}</span>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="apple-card !p-0 overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-apple-border bg-apple-elevated/50">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-error/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-warning/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-success/70" />
                </div>
                <span className="text-xs text-apple-muted font-mono ml-2">
                  challenge.{challenge.language}
                </span>
              </div>
              <span className="text-[10px] text-apple-muted font-mono">
                {code.split('\n').length} Zeilen
              </span>
            </div>
            {/* Textarea Editor */}
            <div className="relative">
              <LineNumbers code={code} />
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
                className="w-full min-h-[400px] bg-apple-bg text-apple-text font-mono text-sm p-4 pl-14 resize-y outline-none focus:ring-1 focus:ring-apple-accent/30 border-none leading-relaxed"
                style={{ tabSize: 2 }}
                disabled={timeExpired}
                placeholder="Schreibe deinen Code hier..."
              />
            </div>
          </div>

          {/* Solution (collapsible) */}
          {showSolution && (
            <div className="apple-card !p-0 overflow-hidden border-apple-accent/30">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-apple-accent/20 bg-apple-accent/5">
                <div className="flex items-center space-x-2">
                  <Eye size={14} className="text-apple-accent" />
                  <span className="text-xs text-apple-accent font-mono font-bold uppercase tracking-widest">
                    {t('challenges.solution')}
                  </span>
                </div>
                <button
                  onClick={handleCopySolution}
                  className="flex items-center space-x-1 text-xs text-apple-muted hover:text-apple-accent transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? t('common.copied') : t('common.copy')}</span>
                </button>
              </div>
              <div className="relative">
                <LineNumbers code={challenge.solution} />
                <pre className="p-4 pl-14 text-sm font-mono text-apple-text leading-relaxed overflow-x-auto bg-apple-bg">
                  {challenge.solution}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Line Numbers Component
   ================================================================ */

function LineNumbers({ code }: { code: string }) {
  const lines = code.split('\n').length;
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-12 bg-apple-elevated/30 border-r border-apple-border/50 select-none pointer-events-none"
      aria-hidden
    >
      <div className="py-4 text-right pr-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="text-[11px] leading-relaxed text-apple-muted/50 font-mono"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChallengesView;
