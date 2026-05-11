import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FolderGit2,
  Clock,
  Copy,
  Check,
  ChevronRight,
  Star,
  ExternalLink,
  Code2,
  FileText,
  ListOrdered,
  LayoutGrid,
  Rocket,
} from 'lucide-react';
import { contentApi } from '../lib/api';
import type { AdminProjectTemplate } from '../lib/api';
import { useTranslation } from 'react-i18next';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

type TabId = 'overview' | 'claude-md' | 'structure' | 'steps';

const DIFFICULTY_COLORS: Record<number, string> = {
  1: 'bg-apple-success/10 border-apple-success/25 text-apple-success',
  2: 'bg-apple-warning/10 border-apple-warning/25 text-apple-warning',
  3: 'bg-apple-accent/10 border-apple-accent/25 text-apple-accent',
};

const TemplateDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [template, setTemplate] = useState<AdminProjectTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [copiedClaudeMd, setCopiedClaudeMd] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);

  useEffect(() => {
    contentApi.getProjectTemplates()
      .then(res => {
        const found = res.data.find(t => t.templateId === id);
        setTemplate(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab, template]);

  const copyToClipboard = useCallback(async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      // fallback
    }
  }, []);

  const copyPrompt = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(index);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch {
      // fallback
    }
  }, []);

  const getDifficultyLabel = (d: number) => {
    switch (d) {
      case 1: return t('templates.difficultyBeginner');
      case 2: return t('templates.difficultyAdvanced');
      case 3: return t('templates.difficultyExpert');
      default: return '';
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-apple-accent border-t-transparent" /></div>;

  if (!template) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in-up text-center py-20">
        <FolderGit2 size={48} className="text-apple-muted mx-auto mb-4" />
        <h2 className="text-xl font-bold text-apple-text mb-2">{t('templates.notFound')}</h2>
        <Link to="/templates" className="btn-primary inline-block mt-4">
          {t('templates.backToTemplates')}
        </Link>
      </div>
    );
  }

  const tabs: { id: TabId; labelKey: string; icon: typeof LayoutGrid }[] = [
    { id: 'overview', labelKey: 'templates.tabOverview', icon: LayoutGrid },
    { id: 'claude-md', labelKey: 'templates.tabClaudeMd', icon: FileText },
    { id: 'structure', labelKey: 'templates.tabStructure', icon: Code2 },
    { id: 'steps', labelKey: 'templates.tabSteps', icon: ListOrdered },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <Link to="/templates" className="hover:text-apple-accent transition-colors">
          {t('templates.breadcrumb')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">
          {t(`templates.data.${template.templateId}.title`, { defaultValue: template.title })}
        </span>
      </div>

      {/* Header */}
      <div className="apple-card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${DIFFICULTY_COLORS[template.difficulty]}`}>
                {getDifficultyLabel(template.difficulty)}
              </span>
              <span className="flex items-center space-x-1 text-xs text-apple-muted font-mono">
                <Clock size={12} />
                <span>~{template.estimatedHours}h</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-apple-text mb-2">
              {t(`templates.data.${template.templateId}.title`, { defaultValue: template.title })}
            </h1>
            <p className="text-apple-textSecondary max-w-2xl">
              {t(`templates.data.${template.templateId}.description`, { defaultValue: template.description })}
            </p>
          </div>
          {template.githubUrl && (
            <a
              href={template.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-textSecondary bg-apple-elevated border border-apple-border rounded-apple hover:border-apple-accent/40 hover:text-apple-accent transition-all shrink-0"
            >
              <ExternalLink size={14} />
              GitHub
            </a>
          )}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-apple-border">
          {template.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-mono bg-apple-elevated/80 text-apple-textSecondary border border-apple-border/50 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-apple transition-all duration-200 whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-apple-accent/15 text-apple-accent border border-apple-accent/30'
                  : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover border border-transparent'
              }`}
            >
              <Icon size={15} />
              <span>{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Features */}
            <div className="apple-card">
              <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center space-x-2">
                <Star size={18} className="text-apple-accent" />
                <span>{t('templates.features')}</span>
              </h3>
              <ul className="space-y-2.5">
                {template.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <ChevronRight size={14} className="text-apple-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-apple-textSecondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Start */}
            <div className="apple-card border-apple-accent/30">
              <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center space-x-2">
                <Rocket size={18} className="text-apple-accent" />
                <span>{t('templates.quickStart')}</span>
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-apple-bg rounded-apple border border-apple-border">
                  <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
                    {t('templates.step')} 1
                  </p>
                  <p className="text-sm text-apple-text font-medium mb-2">
                    {t('templates.copyClaudeMd')}
                  </p>
                  <p className="text-xs text-apple-textSecondary">
                    {t('templates.copyClaudeMdDesc')}
                  </p>
                </div>
                <div className="p-4 bg-apple-bg rounded-apple border border-apple-border">
                  <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
                    {t('templates.step')} 2
                  </p>
                  <p className="text-sm text-apple-text font-medium mb-2">
                    {t('templates.followSteps')}
                  </p>
                  <p className="text-xs text-apple-textSecondary">
                    {t('templates.followStepsDesc')}
                  </p>
                </div>
                <div className="p-4 bg-apple-bg rounded-apple border border-apple-border">
                  <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
                    {t('templates.step')} 3
                  </p>
                  <p className="text-sm text-apple-text font-medium mb-2">
                    {t('templates.copyPrompts')}
                  </p>
                  <p className="text-xs text-apple-textSecondary">
                    {t('templates.copyPromptsDesc')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('steps')}
                className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
              >
                <Rocket size={16} />
                {t('templates.startTemplate')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'claude-md' && (
          <div className="apple-card !p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-apple-border bg-apple-elevated/50">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-error/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-warning/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-success/70" />
                </div>
                <span className="text-xs text-apple-muted font-mono ml-2">CLAUDE.md</span>
              </div>
              <button
                onClick={() => copyToClipboard(template.claudeMd, setCopiedClaudeMd)}
                className="flex items-center space-x-1 text-xs text-apple-muted hover:text-apple-accent transition-colors"
              >
                {copiedClaudeMd ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedClaudeMd ? t('common.copied') : t('common.copy')}</span>
              </button>
            </div>
            {/* Code */}
            <div className="p-4 overflow-x-auto bg-[#1a1a1a]">
              <pre className="text-sm font-mono leading-relaxed">
                <code
                  className="language-markdown"
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      template.claudeMd,
                      Prism.languages.markdown,
                      'markdown'
                    ),
                  }}
                />
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="apple-card !p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-apple-border bg-apple-elevated/50">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-error/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-warning/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-apple-success/70" />
                </div>
                <span className="text-xs text-apple-muted font-mono ml-2">
                  {t('templates.projectStructure')}
                </span>
              </div>
            </div>
            {/* ASCII Tree */}
            <div className="p-4 overflow-x-auto bg-[#1a1a1a]">
              <pre className="text-sm font-mono text-apple-text leading-relaxed whitespace-pre">
                {template.fileStructure}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-4">
            {(template.steps as { title: string; description: string; claudePrompt: string }[]).map((step, i) => (
              <div key={i} className="apple-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-apple-accent/15 text-apple-accent text-sm font-bold font-mono shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-apple-text">
                        {step.title}
                      </h3>
                      <p className="text-sm text-apple-textSecondary mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Claude Prompt */}
                <div className="mt-3 rounded-apple overflow-hidden border border-apple-border">
                  <div className="flex items-center justify-between px-3 py-2 bg-apple-elevated/50 border-b border-apple-border">
                    <span className="text-[10px] text-apple-accent font-mono font-bold uppercase tracking-widest">
                      {t('templates.claudePrompt')}
                    </span>
                    <button
                      onClick={() => copyPrompt(step.claudePrompt, i)}
                      className="flex items-center space-x-1 text-xs text-apple-muted hover:text-apple-accent transition-colors"
                    >
                      {copiedPrompt === i ? <Check size={12} /> : <Copy size={12} />}
                      <span>
                        {copiedPrompt === i ? t('common.copied') : t('common.copy')}
                      </span>
                    </button>
                  </div>
                  <div className="p-3 bg-apple-bg">
                    <p className="text-sm font-mono text-apple-text leading-relaxed whitespace-pre-wrap">
                      {step.claudePrompt}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Final CTA */}
            <div className="apple-card border-apple-accent/30 text-center py-8">
              <Rocket size={32} className="text-apple-accent mx-auto mb-3" />
              <h3 className="text-lg font-bold text-apple-text mb-2">
                {t('templates.readyToStart')}
              </h3>
              <p className="text-sm text-apple-textSecondary max-w-md mx-auto mb-4">
                {t('templates.readyToStartDesc')}
              </p>
              <button
                onClick={() => setActiveTab('claude-md')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <FileText size={16} />
                {t('templates.copyClaudeMdCta')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateDetailView;
