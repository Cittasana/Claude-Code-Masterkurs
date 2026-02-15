import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Repeat,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useSRSStore } from '../store/srsStore';
import { contentApi } from '../lib/api';
import type { AdminLessonConfig } from '../lib/api';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

/** Minimal lesson shape needed for SRS view */
interface LessonItem {
  id: number;
  title: string;
  objectives: string[];
}

function toSRSLesson(l: AdminLessonConfig): LessonItem {
  return {
    id: l.lessonId,
    title: l.title,
    objectives: l.objectives,
  };
}

function getEndOfTodayISO(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

const SpacedRepetitionView = () => {
  const { t } = useTranslation();
  const items = useSRSStore((s) => s.items);
  const getItem = useSRSStore((s) => s.getItem);
  const recordReview = useSRSStore((s) => s.recordReview);

  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.getLessons({ track: 'main' }).then((res) => {
      setLessons(res.data.map(toSRSLesson));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const dueIds = useMemo(() => {
    const endOfToday = getEndOfTodayISO();
    return Object.values(items)
      .filter((item) => item.nextReviewAt <= endOfToday)
      .map((item) => item.lessonId)
      .sort((a, b) => a - b);
  }, [items]);

  const [reviewingLessonId, setReviewingLessonId] = useState<number | null>(null);

  const dueLessons = useMemo(
    () => dueIds.map((id) => lessons.find((l) => l.id === id)).filter(Boolean) as LessonItem[],
    [dueIds, lessons]
  );

  const reviewingLesson = reviewingLessonId != null ? lessons.find((l) => l.id === reviewingLessonId) : null;

  const handleRemembered = () => {
    if (reviewingLessonId == null) return;
    recordReview(reviewingLessonId, true);
    setReviewingLessonId(null);
  };

  const handleForgot = () => {
    if (reviewingLessonId == null) return;
    recordReview(reviewingLessonId, false);
    setReviewingLessonId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-apple-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center py-6 sm:py-8">
        <p className="text-apple-accent font-mono text-sm tracking-widest uppercase mb-4">
          {t('review.title')}
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Repeat className="text-apple-accent" size={32} />
          <ClaudeCodeLogo size="md" showSubtitle={false} />
        </div>
        <p className="text-apple-textSecondary text-lg max-w-lg mx-auto">
          {t('review.subtitle')}
        </p>
      </div>

      {/* Due today */}
      <div className="apple-card accent-glow">
        <h2 className="text-xl font-bold text-apple-text mb-2 flex items-center gap-2">
          <Calendar className="text-apple-accent" size={22} />
          {t('review.dueToday')}
        </h2>
        <p className="text-apple-textSecondary text-sm mb-6">
          {dueLessons.length === 0
            ? t('review.noDue')
            : t('review.dueCount_other', { count: dueLessons.length })}
        </p>

        {dueLessons.length === 0 ? (
          <div className="rounded-apple-lg bg-apple-bg/60 border border-apple-border/50 p-8 text-center">
            <Sparkles className="text-apple-accent/60 mx-auto mb-3" size={40} />
            <p className="text-apple-text font-medium">{t('review.allDone')}</p>
            <p className="text-apple-textSecondary text-sm mt-1">
              {t('review.allDoneDesc')}
            </p>
            <Link
              to="/lesson/0"
              className="btn-primary mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-apple text-sm"
            >
              <BookOpen size={18} />
              {t('review.toLessons')}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {dueLessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-apple-lg bg-apple-bg/60 border border-apple-border/50 hover:border-apple-accent/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-apple-text font-medium truncate">
                    {t('review.lessonX', { id: lesson.id + 1 })}: {lesson.title}
                  </p>
                  <p className="text-apple-muted text-xs font-mono mt-0.5">
                    {getItem(lesson.id)?.timesReviewed != null && getItem(lesson.id)!.timesReviewed > 0
                      ? t('review.repeated', { count: getItem(lesson.id)!.timesReviewed })
                      : t('review.firstReview')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewingLessonId(lesson.id)}
                  className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-apple text-sm shrink-0"
                >
                  {t('review.reviewNow')}
                  <ChevronRight size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Info card */}
      <div className="apple-card border-apple-border/50">
        <h3 className="text-sm font-bold text-apple-text mb-2 flex items-center gap-2">
          <Repeat size={18} className="text-apple-muted" />
          {t('review.howItWorks')}
        </h3>
        <ul className="text-apple-textSecondary text-sm space-y-2 list-disc list-inside">
          <li>{t('review.howItWorks1')}</li>
          <li>{t('review.howItWorks2')}</li>
          <li>{t('review.howItWorks3')}</li>
        </ul>
      </div>

      {/* Review modal */}
      {reviewingLesson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div className="apple-card max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-apple-hover border-apple-accent/20">
            <h2 id="review-modal-title" className="text-lg font-bold text-apple-text mb-2">
              {t('review.lessonX', { id: reviewingLesson.id + 1 })}: {reviewingLesson.title}
            </h2>
            <p className="text-apple-textSecondary text-sm mb-4">
              {t('review.rememberObjectives')}
            </p>
            <ul className="space-y-2 mb-6 pl-4 border-l-2 border-apple-accent/30">
              {reviewingLesson.objectives.map((obj, i) => (
                <li key={i} className="text-apple-text text-sm">
                  {obj}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleRemembered}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-apple bg-apple-success/20 text-apple-success border border-apple-success/40 hover:bg-apple-success/30 transition-colors font-medium"
              >
                <CheckCircle2 size={20} />
                {t('review.remembered')}
              </button>
              <Link
                to={`/lesson/${reviewingLesson.id}`}
                onClick={handleForgot}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-apple bg-apple-bg border border-apple-border hover:border-apple-accent/50 text-apple-text transition-colors font-medium"
              >
                <RotateCcw size={20} />
                {t('review.readAgain')}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setReviewingLessonId(null)}
              className="mt-4 w-full py-2 text-apple-muted hover:text-apple-text text-sm transition-colors"
            >
              {t('review.closeLater')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SpacedRepetitionView;
