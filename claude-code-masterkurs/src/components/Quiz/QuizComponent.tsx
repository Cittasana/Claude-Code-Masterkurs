import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, Lightbulb, Trophy, GripVertical } from 'lucide-react';
import type { Quiz, Question } from '../../types';
import { useUserProgress } from '../../store/userProgress';
import { useSRSStore } from '../../store/srsStore';

interface Props {
  quiz: Quiz;
}

const normalizeCode = (str: string): string =>
  str.replace(/\s+/g, ' ').trim().toLowerCase();

const isAnswerCorrect = (question: Question, answers: Record<string, unknown>): boolean => {
  const userAnswer = answers[question.id];

  switch (question.type) {
    case 'radio': {
      const correctOption = question.options?.find((o) => o.isCorrect);
      return userAnswer === correctOption?.id;
    }
    case 'checkbox':
      return userAnswer === true;
    case 'text': {
      if (!question.correctAnswer || typeof userAnswer !== 'string') return false;
      const correct = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [String(question.correctAnswer)];
      return correct.some(
        (ans) => normalizeCode(String(ans)) === normalizeCode(userAnswer)
      );
    }
    case 'code': {
      if (!question.correctAnswer || typeof userAnswer !== 'string') return false;
      const correct = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [String(question.correctAnswer)];
      return correct.some(
        (ans) => normalizeCode(String(ans)) === normalizeCode(userAnswer)
      );
    }
    case 'matching': {
      if (!question.matchingPairs || typeof userAnswer !== 'object' || !userAnswer)
        return false;
      const pairs = userAnswer as Record<string, string>;
      return question.matchingPairs.every(
        (pair) => pairs[pair.left] === pair.right
      );
    }
    default:
      return false;
  }
};

const QuizComponent = ({ quiz }: Props) => {
  const { t } = useTranslation();
  const { getQuizResult, completeQuiz } = useUserProgress();
  const addLessonToSRS = useSRSStore((s) => s.addLessonToSRS);
  const existingResult = getQuizResult(quiz.id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(existingResult?.attempts || 0);
  const [hintsUsed, setHintsUsed] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(existingResult?.completed || false);
  const [finalScore, setFinalScore] = useState(existingResult?.score || 0);

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  const handleAnswer = useCallback((value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  }, [question.id]);

  const handleNext = () => {
    const isCorrect = isAnswerCorrect(question, answers);
    setFeedbackIsCorrect(isCorrect);
    setShowFeedback(true);

    if (!isCorrect && attempts < quiz.maxAttempts - 1) {
      setAttempts((prev) => prev + 1);
      return;
    }

    if (isLastQuestion) {
      const finalAnswers = { ...answers };
      const correctAnswers = quiz.questions.filter((q) =>
        isAnswerCorrect(q, finalAnswers)
      ).length;

      const score = Math.round((correctAnswers / quiz.questions.length) * 100);
      setFinalScore(score);
      setQuizCompleted(true);

      completeQuiz({
        quizId: quiz.id,
        lessonId: quiz.lessonId,
        score,
        attempts: attempts + 1,
        completed: score >= quiz.passingScore,
        timestamp: new Date().toISOString(),
      });
      addLessonToSRS(quiz.lessonId);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setShowFeedback(false);
    }
  };

  const showHint = () => {
    const currentHintCount = hintsUsed[question.id] || 0;
    if (question.hints && currentHintCount < question.hints.length) {
      setHintsUsed((prev) => ({
        ...prev,
        [question.id]: currentHintCount + 1,
      }));
    }
  };

  if (quizCompleted) {
    const passed = finalScore >= quiz.passingScore;
    return (
      <div className="apple-card accent-glow">
        <div className="text-center py-8">
          <div className="mb-5">
            {passed ? (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-apple-accent/15">
                <Trophy className="text-apple-accent" size={40} />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-apple-error/15">
                <XCircle className="text-apple-error" size={40} />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-apple-text mb-2 tracking-tight">
            {passed ? t('quiz.passed') : t('quiz.tryAgain')}
          </h3>
          <p className="text-apple-textSecondary mb-5">
            {t('quiz.yourScore')}: <span className="text-apple-accent font-mono font-bold">{finalScore}%</span>
            {passed && ` (${t('quiz.passedLabel')})`}
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-apple-muted font-mono">
            <span>{t('quiz.attempts')}: {attempts + 1}</span>
            <span className="text-apple-border">•</span>
            <span>
              {t('quiz.required')}: {quiz.passingScore}% {passed && '✓'}
            </span>
          </div>
          {!passed && (
            <button
              onClick={() => {
                setQuizCompleted(false);
                setCurrentQuestion(0);
                setAnswers({});
                setAttempts(0);
                setShowFeedback(false);
                setHintsUsed({});
              }}
              className="btn-primary mt-8"
            >
              {t('quiz.retry')}
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentHintCount = hintsUsed[question.id] || 0;

  return (
    <div className="apple-card">
      {/* Quiz Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-apple-text flex items-center space-x-2">
            <span className="text-apple-accent font-mono">⚡</span>
            <span>{quiz.title}</span>
          </h3>
          <span className="text-xs text-apple-muted font-mono">
            {currentQuestion + 1}/{quiz.questions.length}
          </span>
        </div>
        <div className="progress-bar h-1.5">
          <div
            className="progress-bar-fill h-1.5"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg text-apple-text mb-5 leading-relaxed">{question.text}</p>

        {question.type === 'radio' && question.options && (
          <div className="space-y-2.5">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-apple border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-apple-accent/50 bg-apple-accentSubtle'
                      : 'border-apple-border hover:border-apple-borderLight hover:bg-apple-hover/30'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-apple-accent' : 'border-apple-borderLight'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-apple-accent" />}
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-apple-text font-medium' : 'text-apple-text/80'}`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {question.type === 'checkbox' && (
          <label className={`flex items-center space-x-3 p-4 rounded-apple border cursor-pointer transition-all duration-200 ${
            answers[question.id] === true
              ? 'border-apple-accent/50 bg-apple-accentSubtle'
              : 'border-apple-border hover:border-apple-borderLight'
          }`}>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              answers[question.id] === true ? 'border-apple-accent bg-apple-accent' : 'border-apple-borderLight'
            }`}>
              {answers[question.id] === true && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={answers[question.id] === true}
              onChange={(e) => handleAnswer(e.target.checked)}
              className="sr-only"
            />
            <span className="text-apple-text text-sm">Ja, das habe ich gemacht</span>
          </label>
        )}

        {/* Free Text Input */}
        {question.type === 'text' && (
          <div>
            <input
              type="text"
              value={(answers[question.id] as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={question.placeholder || 'Deine Antwort eingeben...'}
              className="w-full bg-apple-bg border border-apple-border rounded-apple px-4 py-3 text-apple-text text-sm font-mono placeholder-apple-muted/50 focus:border-apple-accent/50 focus:outline-none focus:ring-1 focus:ring-apple-accent/30 transition-all"
            />
          </div>
        )}

        {/* Code Completion */}
        {question.type === 'code' && (
          <div>
            {question.codeTemplate && (
              <pre className="bg-apple-bg border border-apple-border rounded-t-apple p-4 font-mono text-sm text-apple-muted overflow-x-auto">
                <code>{question.codeTemplate}</code>
              </pre>
            )}
            <textarea
              value={(answers[question.id] as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={question.placeholder || 'Code hier eingeben...'}
              rows={4}
              spellCheck={false}
              className={`w-full bg-apple-bg border border-apple-border ${question.codeTemplate ? 'rounded-b-apple border-t-0' : 'rounded-apple'} px-4 py-3 text-apple-text text-sm font-mono placeholder-apple-muted/50 focus:border-apple-accent/50 focus:outline-none focus:ring-1 focus:ring-apple-accent/30 transition-all resize-none`}
            />
          </div>
        )}

        {/* Command Matching */}
        {question.type === 'matching' && question.matchingPairs && (
          <MatchingQuestion
            pairs={question.matchingPairs}
            value={(answers[question.id] as Record<string, string>) || {}}
            onChange={(val) => handleAnswer(val)}
          />
        )}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`p-4 rounded-apple mb-4 border ${
            feedbackIsCorrect
              ? 'bg-apple-success/8 border-apple-success/25'
              : 'bg-apple-error/8 border-apple-error/25'
          }`}
        >
          <div className="flex items-start space-x-3">
            {feedbackIsCorrect ? (
              <CheckCircle2 className="text-apple-success mt-0.5 shrink-0" size={18} />
            ) : (
              <XCircle className="text-apple-error mt-0.5 shrink-0" size={18} />
            )}
            <div>
              <p
                className={`font-semibold mb-1 text-sm ${
                  feedbackIsCorrect ? 'text-apple-success' : 'text-apple-error'
                }`}
              >
                {feedbackIsCorrect ? 'Richtig!' : 'Nicht ganz richtig'}
              </p>
              <p className="text-apple-text/80 text-sm leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hints */}
      {question.hints && currentHintCount > 0 && (
        <div className="p-4 rounded-apple mb-4 bg-apple-info/8 border border-apple-info/25">
          <div className="flex items-start space-x-3">
            <Lightbulb className="text-apple-info mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold text-apple-info mb-1 text-sm">{t('quiz.hint')}</p>
              <p className="text-apple-text/80 text-sm leading-relaxed">
                {question.hints[currentHintCount - 1]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {question.hints && currentHintCount < question.hints.length && (
            <button
              onClick={showHint}
              className="flex items-center space-x-2 text-apple-muted hover:text-apple-info transition-colors text-sm"
            >
              <Lightbulb size={15} />
              <span>{t('quiz.showHint')}</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-apple-muted font-mono">
            {t('quiz.attempt', { current: attempts + 1, total: quiz.maxAttempts })}
          </span>
          <button
            onClick={handleNext}
            disabled={
              answers[question.id] === undefined ||
              answers[question.id] === '' ||
              (question.type === 'matching' &&
                question.matchingPairs &&
                Object.keys((answers[question.id] as Record<string, string>) || {}).length < question.matchingPairs.length)
            }
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isLastQuestion ? t('quiz.finishQuiz') : t('quiz.nextQuestion')}
          </button>
        </div>
      </div>
    </div>
  );
};

/* === Matching Sub-Component === */

function MatchingQuestion({
  pairs,
  value,
  onChange,
}: {
  pairs: { left: string; right: string }[];
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}) {
  const [draggedRight, setDraggedRight] = useState<string | null>(null);

  const leftItems = pairs.map((p) => p.left);
  const rightItems = [...pairs.map((p) => p.right)].sort(() => Math.random() - 0.5);

  // Get unmatched right items
  const matchedRights = Object.values(value);
  const availableRights = rightItems.filter((r) => !matchedRights.includes(r));

  const handleDrop = (left: string) => {
    if (draggedRight) {
      onChange({ ...value, [left]: draggedRight });
      setDraggedRight(null);
    }
  };

  const handleSelect = (left: string, right: string) => {
    onChange({ ...value, [left]: right });
  };

  const removeMatch = (left: string) => {
    const newVal = { ...value };
    delete newVal[left];
    onChange(newVal);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
        Ordne die Befehle den richtigen Beschreibungen zu
      </p>
      <div className="grid grid-cols-1 gap-3">
        {leftItems.map((left) => {
          const matched = value[left];
          return (
            <div
              key={left}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(left)}
              className={`flex items-center gap-3 p-3 rounded-apple border transition-all duration-200 ${
                matched
                  ? 'border-apple-accent/40 bg-apple-accentSubtle'
                  : 'border-apple-border bg-apple-bg'
              }`}
            >
              <div className="flex-1 min-w-0">
                <code className="text-sm font-mono text-apple-text bg-apple-elevated px-2 py-1 rounded">
                  {left}
                </code>
              </div>
              <span className="text-apple-muted text-xs shrink-0">=</span>
              <div className="flex-1 min-w-0">
                {matched ? (
                  <button
                    onClick={() => removeMatch(left)}
                    className="text-sm text-apple-accent bg-apple-accent/10 px-3 py-1.5 rounded-apple hover:bg-apple-accent/20 transition-colors w-full text-left truncate"
                  >
                    {matched}
                  </button>
                ) : (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleSelect(left, e.target.value);
                    }}
                    className="w-full bg-apple-elevated border border-apple-border rounded-apple px-3 py-1.5 text-sm text-apple-muted focus:border-apple-accent/50 focus:outline-none cursor-pointer"
                  >
                    <option value="">Auswählen...</option>
                    {availableRights.map((right) => (
                      <option key={right} value={right}>
                        {right}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Draggable right items */}
      {availableRights.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-apple-muted font-mono mb-2">Verfügbare Antworten:</p>
          <div className="flex flex-wrap gap-2">
            {availableRights.map((right) => (
              <div
                key={right}
                draggable
                onDragStart={() => setDraggedRight(right)}
                onDragEnd={() => setDraggedRight(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-apple-elevated border border-apple-border rounded-apple text-sm text-apple-text cursor-grab hover:border-apple-accent/40 hover:bg-apple-hover transition-all active:cursor-grabbing"
              >
                <GripVertical size={12} className="text-apple-muted" />
                {right}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizComponent;
