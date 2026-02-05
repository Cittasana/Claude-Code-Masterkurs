import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Clock, Trophy, TrendingUp } from 'lucide-react';
import { useUserProgress } from '../store/userProgress';
import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';

const DashboardView = () => {
  const {
    lessonsCompleted,
    quizzesCompleted,
    projectsCompleted,
    streak,
    timeInvested,
    skillProgress,
  } = useUserProgress();

  // Calculate progress
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

  const level1Progress = Math.round((level1Completed / level1Lessons) * 100);
  const level2Progress = Math.round((level2Completed / level2Lessons) * 100);
  const level3Progress = Math.round((level3Completed / level3Lessons) * 100);

  // Quiz stats
  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzesCompleted.filter((q) => q.completed).length;
  const averageQuizScore =
    quizzesCompleted.length > 0
      ? Math.round(
          quizzesCompleted.reduce((acc, q) => acc + q.score, 0) / quizzesCompleted.length
        )
      : 0;

  // Certification progress
  const quizRequirement = Math.round(totalQuizzes * 0.8);
  const projectRequirement = 6;
  const quizProgress = Math.round((completedQuizzes / quizRequirement) * 100);
  const projectProgress = Math.round((projectsCompleted.length / projectRequirement) * 100);
  const certificationProgress = Math.round((quizProgress + projectProgress) / 2);

  // Format time
  const hours = Math.floor(timeInvested / 60);
  const minutes = timeInvested % 60;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-github-text mb-2">
          🎓 Claude Code Masterkurs Dashboard
        </h1>
        <p className="text-github-muted">
          Dein Fortschritt auf dem Weg zum Claude Code Profi
        </p>
      </div>

      {/* Overall Progress */}
      <div className="lesson-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-github-text">Gesamtfortschritt</h2>
          <span className="text-3xl font-bold text-github-emphasis">{overallProgress}%</span>
        </div>
        <div className="w-full bg-github-border rounded-full h-4 overflow-hidden">
          <div
            className="bg-github-emphasis h-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-github-muted mt-2 text-sm">
          {lessonsCompleted.length} von {totalLessons} Lektionen abgeschlossen
        </p>
      </div>

      {/* Level Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="lesson-card">
          <div className="flex items-center space-x-3 mb-3">
            <BookOpen className="text-green-400" size={24} />
            <h3 className="text-lg font-semibold text-github-text">Level 1: Grundlagen</h3>
          </div>
          <div className="w-full bg-github-border rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-400 h-full transition-all duration-500"
              style={{ width: `${level1Progress}%` }}
            />
          </div>
          <p className="text-github-muted mt-2 text-sm">
            {level1Completed}/{level1Lessons} Lektionen ({level1Progress}%)
          </p>
        </div>

        <div className="lesson-card">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="text-yellow-400" size={24} />
            <h3 className="text-lg font-semibold text-github-text">Level 2: Fortgeschritten</h3>
          </div>
          <div className="w-full bg-github-border rounded-full h-3 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all duration-500"
              style={{ width: `${level2Progress}%` }}
            />
          </div>
          <p className="text-github-muted mt-2 text-sm">
            {level2Completed}/{level2Lessons} Lektionen ({level2Progress}%)
          </p>
        </div>

        <div className="lesson-card">
          <div className="flex items-center space-x-3 mb-3">
            <Trophy className="text-purple-400" size={24} />
            <h3 className="text-lg font-semibold text-github-text">Level 3: Expert</h3>
          </div>
          <div className="w-full bg-github-border rounded-full h-3 overflow-hidden">
            <div
              className="bg-purple-400 h-full transition-all duration-500"
              style={{ width: `${level3Progress}%` }}
            />
          </div>
          <p className="text-github-muted mt-2 text-sm">
            {level3Completed}/{level3Lessons} Lektionen ({level3Progress}%)
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lesson-card">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle2 className="text-github-emphasis" size={20} />
            <h4 className="text-sm font-semibold text-github-muted">Quiz Performance</h4>
          </div>
          <p className="text-2xl font-bold text-github-text">
            {completedQuizzes}/{totalQuizzes}
          </p>
          <p className="text-sm text-github-muted">
            Durchschnitt: {averageQuizScore}% {averageQuizScore >= 80 && '🎉'}
          </p>
        </div>

        <div className="lesson-card">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="text-yellow-400" size={20} />
            <h4 className="text-sm font-semibold text-github-muted">Projekte</h4>
          </div>
          <p className="text-2xl font-bold text-github-text">{projectsCompleted.length}/6</p>
          <p className="text-sm text-github-muted">Abgeschlossen</p>
        </div>

        <div className="lesson-card">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="text-blue-400" size={20} />
            <h4 className="text-sm font-semibold text-github-muted">Lernzeit</h4>
          </div>
          <p className="text-2xl font-bold text-github-text">
            {hours}h {minutes}m
          </p>
          <p className="text-sm text-github-muted">Insgesamt investiert</p>
        </div>

        <div className="lesson-card">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">🔥</span>
            <h4 className="text-sm font-semibold text-github-muted">Streak</h4>
          </div>
          <p className="text-2xl font-bold text-github-text">{streak} Tage</p>
          <p className="text-sm text-github-muted">
            {streak >= 7 ? 'Fantastisch!' : 'Weiter so!'}
          </p>
        </div>
      </div>

      {/* Skill Progress */}
      <div className="lesson-card">
        <h3 className="text-xl font-bold text-github-text mb-4">🎯 Skill Progress</h3>
        <div className="space-y-4">
          {Object.entries(skillProgress).map(([skill, progress]) => (
            <div key={skill}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-github-text capitalize">
                  {skill.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-github-muted text-sm">{progress}%</span>
              </div>
              <div className="w-full bg-github-border rounded-full h-2 overflow-hidden">
                <div
                  className="bg-github-emphasis h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Progress */}
      <div className="lesson-card bg-gradient-to-r from-github-canvas to-github-bg border-2 border-github-emphasis">
        <h3 className="text-xl font-bold text-github-text mb-4">🏆 Zertifizierungs-Fortschritt</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-github-text">Gesamt-Fortschritt</span>
              <span className="text-2xl font-bold text-github-emphasis">
                {certificationProgress}%
              </span>
            </div>
            <div className="w-full bg-github-border rounded-full h-4 overflow-hidden">
              <div
                className="bg-github-emphasis h-full transition-all duration-500"
                style={{ width: `${certificationProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-github-muted mb-1">Quiz Anforderung</p>
              <p className="text-github-text">
                {completedQuizzes}/{quizRequirement} Quizzes (80%+)
              </p>
            </div>
            <div>
              <p className="text-sm text-github-muted mb-1">Projekt Anforderung</p>
              <p className="text-github-text">
                {projectsCompleted.length}/{projectRequirement} Projekte
              </p>
            </div>
          </div>

          {certificationProgress >= 80 ? (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-400 rounded-md">
              <p className="text-green-400 font-semibold">
                🎉 Herzlichen Glückwunsch! Du hast das Zertifikat freigeschaltet!
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-github-bg border border-github-border rounded-md">
              <p className="text-github-muted text-sm">
                Noch {80 - certificationProgress}% bis zum Zertifikat. Du schaffst das! 💪
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="lesson-card">
        <h3 className="text-xl font-bold text-github-text mb-4">🚀 Nächste Schritte</h3>
        <div className="space-y-3">
          {lessonsCompleted.length < totalLessons && (
            <Link
              to={`/lesson/${lessonsCompleted.length}`}
              className="flex items-center justify-between p-4 bg-github-bg rounded-md hover:border-github-emphasis border border-github-border transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="text-github-emphasis" size={20} />
                <span className="text-github-text">
                  Nächste Lektion: {lessons[lessonsCompleted.length]?.title}
                </span>
              </div>
              <span className="text-github-emphasis">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
