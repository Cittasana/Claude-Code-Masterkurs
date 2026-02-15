import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Terminal,
  BookOpen,
  Lock,
  ListChecks,
} from 'lucide-react';
import { contentApi } from '../lib/api';
import type { AdminProjectConfig, AdminPlaygroundTask, AdminLessonConfig } from '../lib/api';
import { useUserProgress } from '../store/userProgress';
import SimulatedTerminal from '../components/Playground/SimulatedTerminal';
import type { PlaygroundTask } from '../types';
import { useLearningTimer } from '../hooks/useLearningTimer';

/** Minimal project shape used in this view */
interface ProjectItem {
  id: string;
  level: number;
  title: string;
  description: string;
}

/** Map API project config to local shape */
function toProjectItem(p: AdminProjectConfig): ProjectItem {
  return {
    id: p.projectId,
    level: p.level,
    title: p.title,
    description: p.description,
  };
}

/** Map API playground task to the local PlaygroundTask shape */
function toPlaygroundTask(t: AdminPlaygroundTask): PlaygroundTask {
  return {
    id: t.taskId,
    projectId: t.projectId,
    title: t.title,
    description: t.description,
    instruction: t.instruction,
    requirements: t.requirements,
    mode: t.mode as 'editor' | 'terminal',
    language: t.language,
    starterCode: t.starterCode,
    validations: [],
    hints: t.hints,
    scenario: t.scenarioMeta as PlaygroundTask['scenario'],
  };
}

/** Minimal lesson shape for unlock logic */
interface LessonItem {
  id: number;
  level: number;
}

const PlaygroundView = () => {
  useLearningTimer({ context: 'playground' });

  const { t } = useTranslation();
  const { lessonsCompleted } = useUserProgress();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<PlaygroundTask | null>(null);

  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [allTasks, setAllTasks] = useState<PlaygroundTask[]>([]);
  const [lessonItems, setLessonItems] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contentApi.getProjects(),
      contentApi.getPlaygroundTasks(),
      contentApi.getLessons({ track: 'main' }),
    ]).then(([projectsRes, tasksRes, lessonsRes]) => {
      setProjectsList(projectsRes.data.map(toProjectItem));
      setAllTasks(tasksRes.data.map(toPlaygroundTask));
      setLessonItems(lessonsRes.data.map((l: AdminLessonConfig) => ({ id: l.lessonId, level: l.level })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Grouped projects by level
  const level1 = projectsList.filter((p) => p.level === 1);
  const level2 = projectsList.filter((p) => p.level === 2);
  const level3 = projectsList.filter((p) => p.level === 3);

  // Helper: get tasks for a project ID from loaded data
  const getTasksForProject = useCallback(
    (projectId: string) => allTasks.filter((t) => t.projectId === projectId),
    [allTasks]
  );

  // Check if project is unlocked (same logic as ProjectView)
  const isProjectUnlocked = useCallback(
    (level: number) => {
      if (level === 1) return true;
      const requiredLessons = lessonItems.filter((l) => l.level < level);
      const completedRequired = requiredLessons.filter((l) =>
        lessonsCompleted.includes(l.id)
      ).length;
      return completedRequired >= Math.ceil(requiredLessons.length * 0.3);
    },
    [lessonsCompleted, lessonItems]
  );

  // Tasks for selected project
  const currentTasks = useMemo(
    () => (selectedProjectId ? getTasksForProject(selectedProjectId) : []),
    [selectedProjectId, getTasksForProject]
  );

  // Select a task
  const handleSelectTask = (task: PlaygroundTask) => {
    setSelectedTask(task);
  };

  // Select a project
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedTask(null);
    const tasks = getTasksForProject(projectId);
    if (tasks.length > 0) {
      handleSelectTask(tasks[0]);
    }
  };

  // Terminal completion handler
  const handleTerminalComplete = useCallback(
    (_terminalResults: { stepId: string; passed: boolean; points: number }[]) => {
      // Results are handled within the SimulatedTerminal itself
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-apple-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <Helmet>
        <title>Live Playground | Claude Code Masterkurs</title>
        <meta name="description" content="Interaktive CLI-Simulation zum Üben von Claude Code Befehlen. Wähle ein Projekt, löse Aufgaben und erhalte sofortiges Feedback." />
        <link rel="canonical" href="https://claude-code-masterkurs.de/playground" />
      </Helmet>
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('playground.breadcrumb')}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <Terminal className="text-apple-accent shrink-0" size={28} />
            <h1 className="text-2xl sm:text-3xl font-bold text-apple-text tracking-tight truncate">
              Projekt-Playground
            </h1>
          </div>
          <p className="text-apple-textSecondary max-w-2xl text-sm sm:text-base">
            Trainiere Claude Code Konzepte interaktiv in der CLI-Simulation. Wähle ein Projekt,
            löse die Aufgaben und erhalte sofortiges Feedback.
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Project & Task Selection */}
        <div className="lg:col-span-3">
          <div className="apple-card !p-0 overflow-hidden max-h-[70vh] lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="px-4 py-3 border-b border-apple-border bg-apple-elevated/50">
              <h3 className="text-sm font-bold text-apple-text flex items-center space-x-2">
                <BookOpen size={14} className="text-apple-accent" />
                <span>Projekte</span>
              </h3>
            </div>

            {/* Level 1 */}
            <ProjectGroup
              label="Level 1: Grundlagen"
              color="text-apple-success"
              projects={level1}
              selectedProjectId={selectedProjectId}
              isUnlocked={isProjectUnlocked(1)}
              onSelect={handleSelectProject}
              getTasksForProject={getTasksForProject}
            />

            {/* Level 2 */}
            <ProjectGroup
              label="Level 2: Fortgeschritten"
              color="text-apple-warning"
              projects={level2}
              selectedProjectId={selectedProjectId}
              isUnlocked={isProjectUnlocked(2)}
              onSelect={handleSelectProject}
              getTasksForProject={getTasksForProject}
            />

            {/* Level 3 */}
            <ProjectGroup
              label="Level 3: Expert"
              color="text-apple-info"
              projects={level3}
              selectedProjectId={selectedProjectId}
              isUnlocked={isProjectUnlocked(3)}
              onSelect={handleSelectProject}
              getTasksForProject={getTasksForProject}
            />

            {/* Task List (when project selected) */}
            {selectedProjectId && currentTasks.length > 0 && (
              <div className="border-t border-apple-border">
                <div className="px-4 py-2.5 bg-apple-accent/5">
                  <p className="text-[10px] text-apple-accent font-mono uppercase tracking-widest">
                    Aufgaben
                  </p>
                </div>
                {currentTasks.map((task, idx) => (
                  <button
                    key={task.id}
                    onClick={() => handleSelectTask(task)}
                    className={`w-full text-left px-4 py-3 border-b border-apple-border/30 transition-all duration-200 ${
                      selectedTask?.id === task.id
                        ? 'bg-apple-accent/10 border-l-2 border-l-apple-accent'
                        : 'hover:bg-apple-hover/40 border-l-2 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-apple-muted font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <Terminal size={12} className="text-apple-success shrink-0" />
                      <span
                        className={`text-sm font-medium ${
                          selectedTask?.id === task.id
                            ? 'text-apple-accent'
                            : 'text-apple-text'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <p className="text-xs text-apple-muted mt-0.5 pl-8 line-clamp-1">
                      {task.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {!selectedTask ? (
            /* Empty state */
            <div className="apple-card text-center py-20">
              <Terminal size={48} className="text-apple-muted mx-auto mb-4" />
              <h2 className="text-xl font-bold text-apple-text mb-2">
                Wähle ein Projekt
              </h2>
              <p className="text-apple-textSecondary max-w-md mx-auto">
                Wähle links ein Projekt aus und übe Claude Code Befehle
                in der interaktiven CLI-Simulation.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Task Header + Description */}
              <div className="apple-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-xs text-apple-accent font-mono uppercase tracking-widest">
                        Aufgabe
                      </p>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-mono bg-apple-success/10 border border-apple-success/25 rounded-full text-apple-success">
                        <Terminal size={10} />
                        <span>CLI Simulation</span>
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-apple-text">
                      {selectedTask.title}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-mono bg-apple-bg border border-apple-border rounded-full text-apple-muted">
                    {selectedTask.scenario?.steps.length ?? 0} Schritte
                  </span>
                </div>
                <p className="text-apple-textSecondary text-sm leading-relaxed">
                  {selectedTask.instruction}
                </p>
              </div>

              {/* Requirements */}
              {selectedTask.requirements && selectedTask.requirements.length > 0 && (
                <div className="apple-card">
                  <div className="flex items-center space-x-2 mb-4">
                    <ListChecks size={16} className="text-apple-accent" />
                    <h3 className="text-sm font-bold text-apple-text">
                      Anforderungen
                    </h3>
                  </div>
                  <ol className="space-y-2.5">
                    {selectedTask.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="flex items-center justify-center w-5 h-5 mt-0.5 shrink-0 rounded-full bg-apple-accent/10 border border-apple-accent/25">
                          <span className="text-[10px] font-bold text-apple-accent font-mono">
                            {idx + 1}
                          </span>
                        </span>
                        <span className="text-sm text-apple-text leading-relaxed">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* CLI Terminal */}
              {selectedTask.scenario && (
                <div className="apple-card !p-0 overflow-hidden">
                  <SimulatedTerminal
                    key={selectedTask.id}
                    scenario={selectedTask.scenario}
                    onComplete={handleTerminalComplete}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* === Sub-Components === */

function ProjectGroup({
  label,
  color,
  projects: groupProjects,
  selectedProjectId,
  isUnlocked,
  onSelect,
  getTasksForProject,
}: {
  label: string;
  color: string;
  projects: ProjectItem[];
  selectedProjectId: string | null;
  isUnlocked: boolean;
  onSelect: (id: string) => void;
  getTasksForProject: (id: string) => PlaygroundTask[];
}) {
  const tasksAvailable = (id: string) => getTasksForProject(id).length > 0;

  return (
    <div>
      <div className="px-4 py-2 bg-apple-elevated/30 border-b border-apple-border/50">
        <p className={`text-[10px] font-mono uppercase tracking-widest ${color}`}>
          {label}
        </p>
      </div>
      {groupProjects.map((project) => {
        const hasTasks = tasksAvailable(project.id);
        const taskCount = getTasksForProject(project.id).length;

        if (!isUnlocked) {
          return (
            <div
              key={project.id}
              className="px-4 py-3 border-b border-apple-border/30 opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center space-x-2">
                <Lock size={12} className="text-apple-muted" />
                <span className="text-xs text-apple-muted">{project.title}</span>
              </div>
            </div>
          );
        }

        return (
          <button
            key={project.id}
            onClick={() => hasTasks && onSelect(project.id)}
            disabled={!hasTasks}
            className={`w-full text-left px-4 py-3 border-b border-apple-border/30 transition-all duration-200 ${
              selectedProjectId === project.id
                ? 'bg-apple-accent/10 border-l-2 border-l-apple-accent'
                : hasTasks
                ? 'hover:bg-apple-hover/40 border-l-2 border-l-transparent'
                : 'opacity-40 cursor-not-allowed border-l-2 border-l-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  selectedProjectId === project.id
                    ? 'text-apple-accent'
                    : 'text-apple-text'
                }`}
              >
                {project.title}
              </span>
              {hasTasks && (
                <span className="text-[10px] text-apple-muted font-mono">
                  {taskCount} {taskCount === 1 ? 'Aufgabe' : 'Aufgaben'}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default PlaygroundView;
