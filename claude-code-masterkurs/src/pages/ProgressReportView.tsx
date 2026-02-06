import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, Printer, Trophy, BookOpen, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { useUserProgress } from '../store/userProgress';
import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { projects } from '../data/projects';

const ProgressReportView = () => {
  const { t } = useTranslation();
  const reportRef = useRef<HTMLDivElement>(null);
  const {
    lessonsCompleted,
    quizzesCompleted,
    projectsCompleted,
    streak,
    timeInvested,
    totalPoints,
    skillProgress,
  } = useUserProgress();

  const totalLessons = lessons.length;
  const overallProgress = Math.round((lessonsCompleted.length / totalLessons) * 100);

  const level1Lessons = lessons.filter((l) => l.level === 1);
  const level2Lessons = lessons.filter((l) => l.level === 2);
  const level3Lessons = lessons.filter((l) => l.level === 3);

  const level1Completed = lessonsCompleted.filter((id) =>
    level1Lessons.find((l) => l.id === id)
  ).length;
  const level2Completed = lessonsCompleted.filter((id) =>
    level2Lessons.find((l) => l.id === id)
  ).length;
  const level3Completed = lessonsCompleted.filter((id) =>
    level3Lessons.find((l) => l.id === id)
  ).length;

  const completedQuizzes = quizzesCompleted.filter((q) => q.completed);
  const averageQuizScore =
    quizzesCompleted.length > 0
      ? Math.round(
          quizzesCompleted.reduce((acc, q) => acc + q.score, 0) / quizzesCompleted.length
        )
      : 0;

  const hours = Math.floor(timeInvested / 60);
  const minutes = timeInvested % 60;
  const date = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const content = generateMarkdownReport();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude-code-masterkurs-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdownReport = () => {
    const lines: string[] = [
      `# ${t('report.reportTitle')}`,
      '',
      `**${t('report.date')}:** ${date}`,
      `**${t('report.overallProgress')}:** ${overallProgress}%`,
      `**${t('report.points')}:** ${totalPoints}`,
      `**${t('report.streak')}:** ${streak} ${t('report.days')}`,
      `**${t('report.learningTime')}:** ${hours}h ${minutes}m`,
      '',
      '---',
      '',
      `## ${t('report.lessons')}`,
      '',
      `- **${t('report.completed')}:** ${lessonsCompleted.length}/${totalLessons}`,
      `- **${t('report.level1')}:** ${level1Completed}/${level1Lessons.length}`,
      `- **${t('report.level2')}:** ${level2Completed}/${level2Lessons.length}`,
      `- **${t('report.level3')}:** ${level3Completed}/${level3Lessons.length}`,
      '',
      `### ${t('report.completedLessons')}`,
      '',
    ];

    lessonsCompleted.forEach((id) => {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson) {
        lines.push(`- [x] Lektion ${id}: ${lesson.title}`);
      }
    });

    const uncompletedLessons = lessons.filter((l) => !lessonsCompleted.includes(l.id));
    if (uncompletedLessons.length > 0) {
      lines.push('', `### ${t('report.pendingLessons')}`, '');
      uncompletedLessons.forEach((l) => {
        lines.push(`- [ ] Lektion ${l.id}: ${l.title}`);
      });
    }

    lines.push(
      '',
      '---',
      '',
      `## ${t('report.quizResults')}`,
      '',
      `- **${t('report.completed')}:** ${completedQuizzes.length}/${quizzes.length}`,
      `- **${t('report.averageScore')}:** ${averageQuizScore}%`,
      '',
    );

    quizzesCompleted.forEach((qr) => {
      const quiz = quizzes.find((q) => q.id === qr.quizId);
      lines.push(
        `- ${qr.completed ? '[x]' : '[ ]'} ${quiz?.title || qr.quizId}: ${qr.score}% (${qr.attempts} Versuch${qr.attempts !== 1 ? 'e' : ''})`
      );
    });

    lines.push(
      '',
      '---',
      '',
      `## ${t('report.projects')}`,
      '',
      `- **${t('report.completed')}:** ${projectsCompleted.length}/${projects.length}`,
      '',
    );

    projectsCompleted.forEach((pr) => {
      lines.push(
        `- [x] ${pr.projectId}: ${pr.score} ${t('report.pointsSuffix')}`
      );
    });

    lines.push(
      '',
      '---',
      '',
      `## ${t('report.skillProgress')}`,
      '',
    );

    Object.entries(skillProgress).forEach(([skill, progress]) => {
      const barLength = 20;
      const filled = Math.round((progress / 100) * barLength);
      const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
      const name = skill.replace(/([A-Z])/g, ' $1').trim();
      lines.push(`- **${name}:** ${bar} ${progress}%`);
    });

    lines.push(
      '',
      '---',
      '',
      `*Generiert am ${date} mit dem Claude Code Masterkurs*`,
    );

    return lines.join('\n');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono print:hidden">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('report.breadcrumb')}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">
            {t('report.title')}
          </h1>
          <p className="text-apple-textSecondary mt-1">{date}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handlePrint} className="btn-secondary flex items-center space-x-2">
            <Printer size={16} />
            <span>{t('report.print')}</span>
          </button>
          <button onClick={handleExport} className="btn-primary flex items-center space-x-2">
            <Download size={16} />
            <span>{t('report.exportMarkdown')}</span>
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6">
        {/* Overview Card */}
        <div className="apple-card accent-glow">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-apple-text flex items-center space-x-2">
              <TrendingUp className="text-apple-accent" size={22} />
              <span>{t('report.overview')}</span>
            </h2>
            <span className="text-3xl font-bold text-apple-accent font-mono">
              {overallProgress}%
            </span>
          </div>
          <div className="progress-bar h-3 mb-6">
            <div
              className="progress-bar-fill h-3"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniStat
              icon={<BookOpen size={16} className="text-apple-accent" />}
              label={t('report.lessons')}
              value={`${lessonsCompleted.length}/${totalLessons}`}
            />
            <MiniStat
              icon={<CheckCircle2 size={16} className="text-apple-success" />}
              label="Quizzes"
              value={`${completedQuizzes.length}/${quizzes.length}`}
            />
            <MiniStat
              icon={<Trophy size={16} className="text-apple-warning" />}
              label={t('report.pointsLabel')}
              value={String(totalPoints)}
            />
            <MiniStat
              icon={<Clock size={16} className="text-apple-info" />}
              label={t('report.learningTime')}
              value={`${hours}h ${minutes}m`}
            />
          </div>
        </div>

        {/* Level Breakdown */}
        <div className="apple-card">
          <h3 className="text-lg font-bold text-apple-text mb-5">{t('report.levelProgress')}</h3>
          <div className="space-y-4">
            <LevelRow
              label={t('report.level1')}
              completed={level1Completed}
              total={level1Lessons.length}
              color="bg-apple-success"
            />
            <LevelRow
              label={t('report.level2')}
              completed={level2Completed}
              total={level2Lessons.length}
              color="bg-apple-warning"
            />
            <LevelRow
              label={t('report.level3')}
              completed={level3Completed}
              total={level3Lessons.length}
              color="bg-purple-400"
            />
          </div>
        </div>

        {/* Quiz Results */}
        <div className="apple-card">
          <h3 className="text-lg font-bold text-apple-text mb-5">{t('report.quizResults')}</h3>
          {quizzesCompleted.length > 0 ? (
            <div className="space-y-2">
              {quizzesCompleted.map((qr) => {
                const quiz = quizzes.find((q) => q.id === qr.quizId);
                return (
                  <div
                    key={qr.quizId}
                    className="flex items-center justify-between p-3 bg-apple-bg rounded-apple border border-apple-border"
                  >
                    <div className="flex items-center space-x-3">
                      {qr.completed ? (
                        <CheckCircle2 size={16} className="text-apple-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-apple-border" />
                      )}
                      <span className="text-apple-text text-sm">
                        {quiz?.title || qr.quizId}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-mono">
                      <span
                        className={
                          qr.score >= 80 ? 'text-apple-success' : 'text-apple-warning'
                        }
                      >
                        {qr.score}%
                      </span>
                      <span className="text-apple-muted">
                        {qr.attempts} {t('quiz.attempts').toLowerCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-apple-muted text-sm">{t('report.noQuizzesYet')}</p>
          )}
          {quizzesCompleted.length > 0 && (
            <div className="mt-4 pt-4 border-t border-apple-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-apple-textSecondary">{t('report.averageScore')}</span>
                <span className="text-apple-accent font-bold font-mono">{averageQuizScore}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Skill Progress */}
        <div className="apple-card">
          <h3 className="text-lg font-bold text-apple-text mb-5">{t('report.skillProgress')}</h3>
          <div className="space-y-4">
            {Object.entries(skillProgress).map(([skill, progress]) => (
              <div key={skill}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-apple-text text-sm font-medium capitalize">
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-apple-muted text-xs font-mono">{progress}%</span>
                </div>
                <div className="progress-bar h-2">
                  <div
                    className="progress-bar-fill h-2"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="apple-card">
          <h3 className="text-lg font-bold text-apple-text mb-5">{t('report.projects')}</h3>
          {projectsCompleted.length > 0 ? (
            <div className="space-y-2">
              {projectsCompleted.map((pr) => (
                <div
                  key={pr.projectId}
                  className="flex items-center justify-between p-3 bg-apple-bg rounded-apple border border-apple-border"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={16} className="text-apple-success" />
                    <span className="text-apple-text text-sm">{pr.projectId}</span>
                  </div>
                  <span className="text-apple-accent text-xs font-mono font-bold">
                    {pr.score} {t('report.pointsSuffix')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-apple-muted text-sm">{t('report.noProjectsYet')}</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-apple-muted text-xs font-mono">
          <p>{t('report.reportTitle')}</p>
          <p>{t('report.generatedOn')} {date}</p>
        </div>
      </div>
    </div>
  );
};

/* === Sub-Components === */

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-apple-bg rounded-apple p-3 border border-apple-border">
      <div className="flex items-center space-x-2 mb-1">
        {icon}
        <span className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-lg font-bold text-apple-text font-mono">{value}</p>
    </div>
  );
}

function LevelRow({
  label,
  completed,
  total,
  color,
}: {
  label: string;
  completed: number;
  total: number;
  color: string;
}) {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-apple-text text-sm font-medium">{label}</span>
        <span className="text-apple-muted text-xs font-mono">
          {completed}/{total} ({progress}%)
        </span>
      </div>
      <div className="w-full bg-apple-border rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-700 rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressReportView;
