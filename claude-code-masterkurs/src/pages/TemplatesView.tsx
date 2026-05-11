import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FolderGit2,
  Clock,
  ChevronRight,
  Filter,
  Star,
} from 'lucide-react';
import { contentApi } from '../lib/api';
import type { AdminProjectTemplate } from '../lib/api';
import { useTranslation } from 'react-i18next';

const DIFFICULTY_COLORS: Record<number, string> = {
  1: 'bg-apple-success/10 border-apple-success/25 text-apple-success',
  2: 'bg-apple-warning/10 border-apple-warning/25 text-apple-warning',
  3: 'bg-apple-accent/10 border-apple-accent/25 text-apple-accent',
};

const TemplatesView = () => {
  const { t } = useTranslation();
  const [projectTemplates, setProjectTemplates] = useState<AdminProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<number | null>(null);

  useEffect(() => {
    contentApi.getProjectTemplates().then(res => setProjectTemplates(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filterDifficulty === null) return projectTemplates;
    return projectTemplates.filter((tpl) => tpl.difficulty === filterDifficulty);
  }, [projectTemplates, filterDifficulty]);

  const getDifficultyLabel = (d: number) => {
    switch (d) {
      case 1:
        return t('templates.difficultyBeginner');
      case 2:
        return t('templates.difficultyAdvanced');
      case 3:
        return t('templates.difficultyExpert');
      default:
        return '';
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /></div>;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <Helmet>
        <title>Templates | Claude Code Masterkurs</title>
        <meta name="description" content="Projekt-Templates für Claude Code. Starte mit vorkonfigurierten Setups für React, Node.js, Python und mehr." />
        <link rel="canonical" href="https://claude-code-masterkurs.de/templates" />
      </Helmet>
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('templates.breadcrumb')}</span>
      </div>

      {/* Header — Ethereal */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
        <div>
          <div className="eyebrow mb-4"><FolderGit2 size={12} /><span>Templates</span></div>
          <h1 className="text-[clamp(36px,5vw,60px)] font-semibold text-apple-text tracking-[-0.038em] leading-[1.04]">
            Projekt-<em className="italic-serif">Templates</em>
          </h1>
          <p className="text-apple-textSecondary max-w-2xl mt-3 leading-relaxed">
            {t('templates.subtitle')}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.025] border border-apple-border shrink-0">
          <FolderGit2 size={16} className="text-apple-accent" />
          <div>
            <p className="text-[10px] text-apple-muted font-mono uppercase tracking-[0.06em]">
              {t('templates.totalTemplates')}
            </p>
            <p className="num-serif text-[22px] leading-none mt-1">
              {projectTemplates.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="apple-card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={14} className="text-apple-accent" />
          <span className="text-xs text-apple-muted font-mono uppercase tracking-widest">
            {t('templates.filter')}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-apple-textSecondary shrink-0 w-20">
            {t('templates.difficulty')}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterDifficulty(null)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                filterDifficulty === null
                  ? 'bg-apple-accent/20 text-apple-accent border border-apple-accent/40 shadow-sm'
                  : 'bg-apple-elevated/90 text-apple-textSecondary border border-apple-border hover:bg-apple-hover hover:border-apple-borderLight hover:text-apple-text'
              }`}
            >
              {t('templates.all')}
            </button>
            {[1, 2, 3].map((d) => (
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
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tpl) => (
          <Link
            key={tpl.templateId}
            to={`/templates/${tpl.templateId}`}
            className="apple-card-hover text-left group relative"
          >
            {/* Difficulty badge */}
            <div className="flex items-center space-x-2 mb-3">
              <span
                className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${DIFFICULTY_COLORS[tpl.difficulty]}`}
              >
                {getDifficultyLabel(tpl.difficulty)}
              </span>
              <span className="flex items-center space-x-1 text-[10px] text-apple-muted font-mono">
                <Clock size={10} />
                <span>~{tpl.estimatedHours}h</span>
              </span>
            </div>

            <h3 className="text-base font-bold text-apple-text mb-1.5 group-hover:text-apple-accent transition-colors">
              {t(`templates.data.${tpl.templateId}.title`, { defaultValue: tpl.title })}
            </h3>
            <p className="text-sm text-apple-textSecondary line-clamp-2 mb-3">
              {t(`templates.data.${tpl.templateId}.description`, { defaultValue: tpl.description })}
            </p>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tpl.techStack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[10px] font-mono bg-apple-elevated/80 text-apple-textSecondary border border-apple-border/50 rounded-full"
                >
                  {tech}
                </span>
              ))}
              {tpl.techStack.length > 5 && (
                <span className="px-2 py-0.5 text-[10px] font-mono text-apple-muted">
                  +{tpl.techStack.length - 5}
                </span>
              )}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 text-xs text-apple-accent font-mono">
                <Star size={12} />
                <span>
                  {tpl.steps.length} {t('templates.steps')}
                </span>
              </span>
              <ChevronRight
                size={16}
                className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all duration-200"
              />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="apple-card text-center py-16">
          <FolderGit2 size={40} className="text-apple-muted mx-auto mb-3" />
          <p className="text-apple-textSecondary">
            {t('templates.noTemplates')}
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplatesView;
