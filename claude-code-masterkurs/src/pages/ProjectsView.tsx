import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Clock,
  ChevronRight,
  CheckCircle2,
  Filter,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  capstoneProjects,
  getCapstoneProjectDifficultyKey,
} from '../data/capstoneProjects';
import type { CapstoneProject } from '../data/capstoneProjects';
import { useProjectHubStore } from '../store/projectHubStore';

/* ================================================================
   ProjectsView – Capstone project overview + detail view
   ================================================================ */

const ProjectsView = () => {
  const { id } = useParams<{ id: string }>();

  if (id) {
    const project = capstoneProjects.find((p) => p.id === id);
    if (!project) return <ProjectNotFound />;
    return <ProjectDetail project={project} />;
  }

  return <ProjectOverview />;
};

/* ================================================================
   ProjectOverview – Grid with filter
   ================================================================ */

function ProjectOverview() {
  const { t } = useTranslation();
  const [filterDifficulty, setFilterDifficulty] = useState<number | null>(null);
  const { completedSteps } = useProjectHubStore();

  const filtered = useMemo(() => {
    if (filterDifficulty === null) return capstoneProjects;
    return capstoneProjects.filter((p) => p.difficulty === filterDifficulty);
  }, [filterDifficulty]);

  const getDifficultyLabel = (d: 1 | 2 | 3) => t(getCapstoneProjectDifficultyKey(d));

  const isProjectCompleted = (projectId: string) => {
    const project = capstoneProjects.find((p) => p.id === projectId);
    if (!project) return false;
    return project.steps.every((s) => completedSteps[s.id]);
  };

  const getProjectProgress = (projectId: string) => {
    const project = capstoneProjects.find((p) => p.id === projectId);
    if (!project) return 0;
    const done = project.steps.filter((s) => completedSteps[s.id]).length;
    return Math.round((done / project.steps.length) * 100);
  };

  const getProjectTitle = (p: CapstoneProject) =>
    t(`projects.data.${p.id}.title`, { defaultValue: p.title });
  const getProjectDescription = (p: CapstoneProject) =>
    t(`projects.data.${p.id}.description`, { defaultValue: p.description });

  const completedCount = capstoneProjects.filter((p) => isProjectCompleted(p.id)).length;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('projects.breadcrumb')}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <FolderOpen className="text-apple-accent" size={28} />
            <h1 className="text-3xl font-bold text-apple-text tracking-tight">
              {t('projects.title')}
            </h1>
          </div>
          <p className="text-apple-textSecondary max-w-2xl">
            {t('projects.subtitle')}
          </p>
        </div>
        {/* Stats */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-apple bg-apple-surface border border-apple-border">
            <CheckCircle2 size={16} className="text-apple-success" />
            <div>
              <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
                {t('projects.completed')}
              </p>
              <p className="text-sm font-semibold text-apple-text">
                {completedCount}/{capstoneProjects.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="apple-card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={14} className="text-apple-accent" />
          <span className="text-xs text-apple-muted font-mono uppercase tracking-widest">
            {t('projects.filter')}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-apple-textSecondary shrink-0 w-20">
            {t('projects.difficulty')}
          </span>
          <div className="flex flex-wrap gap-2">
            {[null, 1, 2, 3].map((d) => (
              <button
                key={d ?? 'all'}
                onClick={() => setFilterDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                  filterDifficulty === d
                    ? 'bg-apple-accent/20 text-apple-accent border border-apple-accent/40 shadow-sm'
                    : 'bg-apple-elevated/90 text-apple-textSecondary border border-apple-border hover:bg-apple-hover hover:border-apple-borderLight hover:text-apple-text'
                }`}
              >
                {d === null
                  ? t('projects.all')
                  : getDifficultyLabel(d as 1 | 2 | 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => {
          const done = isProjectCompleted(p.id);
          const progress = getProjectProgress(p.id);
          return (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="apple-card-hover text-left group relative"
            >
              {done && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 size={18} className="text-apple-success" />
                </div>
              )}
              {/* Emoji + difficulty */}
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">{p.thumbnailEmoji}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${
                    p.difficulty === 1
                      ? 'bg-apple-success/10 border-apple-success/25 text-apple-success'
                      : p.difficulty === 2
                      ? 'bg-apple-warning/10 border-apple-warning/25 text-apple-warning'
                      : 'bg-apple-accent/10 border-apple-accent/25 text-apple-accent'
                  }`}
                >
                  {getDifficultyLabel(p.difficulty)}
                </span>
              </div>
              <h3 className="text-base font-bold text-apple-text mb-1.5 group-hover:text-apple-accent transition-colors">
                {getProjectTitle(p)}
              </h3>
              <p className="text-sm text-apple-textSecondary line-clamp-2 mb-3">
                {getProjectDescription(p)}
              </p>
              {/* Tech stack */}
              <div className="flex flex-wrap gap-1 mb-3">
                {p.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-1.5 py-0.5 text-[10px] font-mono bg-apple-elevated border border-apple-border rounded text-apple-muted"
                  >
                    {tech}
                  </span>
                ))}
                {p.techStack.length > 4 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono text-apple-muted">
                    +{p.techStack.length - 4}
                  </span>
                )}
              </div>
              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1 text-xs text-apple-muted">
                    <Clock size={12} />
                    <span>
                      ~{p.estimatedHours} {t('projects.hours')}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1 text-xs text-apple-muted">
                    <Layers size={12} />
                    <span>
                      {p.steps.length} {t('projects.steps')}
                    </span>
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all duration-200"
                />
              </div>
              {/* Progress bar */}
              {progress > 0 && (
                <div className="mt-3 pt-3 border-t border-apple-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-apple-muted font-mono">
                      {t('projects.progress')}
                    </span>
                    <span className="text-[10px] text-apple-accent font-mono font-bold">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-apple-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-apple-accent rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="apple-card text-center py-16">
          <FolderOpen size={40} className="text-apple-muted mx-auto mb-3" />
          <p className="text-apple-textSecondary">
            {t('projects.noProjects')}
          </p>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   ProjectDetail – Step-by-step guide with progress
   ================================================================ */

function ProjectDetail({ project }: { project: CapstoneProject }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { completedSteps, toggleStep, markProjectCompleted, completedProjects } =
    useProjectHubStore();

  const getDifficultyLabel = (d: 1 | 2 | 3) => t(getCapstoneProjectDifficultyKey(d));

  const getProjectTitle = (p: CapstoneProject) =>
    t(`projects.data.${p.id}.title`, { defaultValue: p.title });
  const getProjectDescription = (p: CapstoneProject) =>
    t(`projects.data.${p.id}.description`, { defaultValue: p.description });
  const getStepTitle = (p: CapstoneProject, stepId: string, fallback: string) =>
    t(`projects.data.${p.id}.steps.${stepId}.title`, { defaultValue: fallback });
  const getStepDescription = (p: CapstoneProject, stepId: string, fallback: string) =>
    t(`projects.data.${p.id}.steps.${stepId}.description`, { defaultValue: fallback });

  const doneCount = project.steps.filter((s) => completedSteps[s.id]).length;
  const allDone = doneCount === project.steps.length;
  const isCompleted = completedProjects[project.id];
  const progress = Math.round((doneCount / project.steps.length) * 100);

  const handleMarkCompleted = () => {
    markProjectCompleted(project.id);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <Link to="/projects" className="hover:text-apple-accent transition-colors">
          {t('projects.breadcrumb')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary line-clamp-1">
          {getProjectTitle(project)}
        </span>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center space-x-1.5 text-sm text-apple-muted hover:text-apple-accent transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        <span>{t('projects.backToProjects')}</span>
      </button>

      {/* Project header */}
      <div className="apple-card mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-5xl">{project.thumbnailEmoji}</span>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span
                className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${
                  project.difficulty === 1
                    ? 'bg-apple-success/10 border-apple-success/25 text-apple-success'
                    : project.difficulty === 2
                    ? 'bg-apple-warning/10 border-apple-warning/25 text-apple-warning'
                    : 'bg-apple-accent/10 border-apple-accent/25 text-apple-accent'
                }`}
              >
                {getDifficultyLabel(project.difficulty)}
              </span>
              <span className="text-xs text-apple-muted font-mono">
                ~{project.estimatedHours} {t('projects.hours')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-apple-text">
              {getProjectTitle(project)}
            </h1>
          </div>
        </div>
        <p className="text-sm text-apple-textSecondary mb-4">
          {getProjectDescription(project)}
        </p>

        {/* Tech stack */}
        <div className="mb-4">
          <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
            {t('projects.techStackLabel')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-mono bg-apple-elevated border border-apple-border rounded-apple text-apple-textSecondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-4">
          <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
            {t('projects.requirementsLabel')}
          </p>
          <ul className="space-y-1">
            {project.requirements.map((req, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-2 text-sm text-apple-textSecondary"
              >
                <span className="text-apple-accent mt-0.5">-</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progress bar */}
        <div className="pt-4 border-t border-apple-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-apple-muted font-mono">
              {t('projects.progress')}
            </span>
            <span className="text-xs text-apple-accent font-mono font-bold">
              {doneCount}/{project.steps.length} ({progress}%)
            </span>
          </div>
          <div className="w-full h-2 bg-apple-border rounded-full overflow-hidden">
            <div
              className="h-full bg-apple-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        <h2 className="text-lg font-bold text-apple-text flex items-center space-x-2">
          <Layers size={18} className="text-apple-accent" />
          <span>{t('projects.stepsTitle')}</span>
        </h2>
        {project.steps.map((step, idx) => {
          const isDone = completedSteps[step.id];
          return (
            <div
              key={step.id}
              className={`apple-card flex items-start space-x-4 transition-all ${
                isDone ? 'border-apple-success/30 bg-apple-success/5' : ''
              }`}
            >
              {/* Step number / check */}
              <button
                onClick={() => toggleStep(step.id)}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isDone
                    ? 'bg-apple-success text-white'
                    : 'bg-apple-elevated border border-apple-border text-apple-muted hover:border-apple-accent hover:text-apple-accent'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </button>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-bold mb-1 ${
                    isDone ? 'text-apple-success' : 'text-apple-text'
                  }`}
                >
                  {getStepTitle(project, step.id, step.title)}
                </h3>
                <p className="text-sm text-apple-textSecondary">
                  {getStepDescription(project, step.id, step.description)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mark project completed */}
      <div className="apple-card text-center">
        {isCompleted ? (
          <div className="p-4 bg-apple-success/10 border border-apple-success/30 rounded-apple">
            <CheckCircle2 size={32} className="text-apple-success mx-auto mb-2" />
            <p className="text-apple-success font-bold text-sm">
              {t('projects.projectCompleted')}
            </p>
          </div>
        ) : allDone ? (
          <div>
            <p className="text-sm text-apple-textSecondary mb-3">
              {t('projects.allStepsDone')}
            </p>
            <button
              onClick={handleMarkCompleted}
              className="px-6 py-2.5 text-sm font-bold rounded-apple bg-apple-accent text-white hover:bg-apple-accentHover shadow-sm hover:shadow-apple-glow transition-all duration-200"
            >
              {t('projects.markCompleted')}
            </button>
          </div>
        ) : (
          <p className="text-sm text-apple-muted">
            {t('projects.completeAllSteps')}
          </p>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   ProjectNotFound
   ================================================================ */

function ProjectNotFound() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-20">
      <FolderOpen size={48} className="text-apple-muted mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-apple-text mb-2">
        {t('projects.notFound')}
      </h1>
      <Link to="/projects" className="btn-primary inline-block mt-4">
        {t('projects.backToProjects')}
      </Link>
    </div>
  );
}

export default ProjectsView;
