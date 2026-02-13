import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Wrench,
  Clock,
  Target,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Terminal,
  Server,
  ArrowRight,
  Rocket,
} from 'lucide-react';
import { allTools, toolCategories, FREE_TOOLS_LIMIT } from '../data/tools';
import { useUserProgress } from '../store/userProgress';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess';

const ICON_MAP = { Sparkles, Wrench, Terminal, Server } as const;

const ToolsOverviewView = () => {
  const { t } = useTranslation();
  const { lessonsCompleted } = useUserProgress();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasPremium = useSubscriptionAccess();
  const [expandedCat, setExpandedCat] = useState<string | null>('anfaenger');

  const completedToolIds = useMemo(
    () => allTools.filter((t) => lessonsCompleted.includes(t.id)).map((t) => t.id),
    [lessonsCompleted],
  );

  const totalCompleted = completedToolIds.length;
  const totalTools = allTools.length;
  const progress = totalTools > 0 ? Math.round((totalCompleted / totalTools) * 100) : 0;

  // Compute the global index for each tool to determine free vs premium
  const toolIndexMap = useMemo(() => {
    const map = new Map<number, number>();
    allTools.forEach((tool, idx) => map.set(tool.id, idx));
    return map;
  }, []);

  const stats = [
    { icon: Wrench, value: String(totalTools), labelKey: 'tools.statsTools' },
    { icon: Sparkles, value: '4', labelKey: 'tools.statsCategories' },
    { icon: Clock, value: '~12h', labelKey: 'tools.statsDuration' },
    { icon: Terminal, value: String(FREE_TOOLS_LIMIT), labelKey: 'tools.statsFree' },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <Helmet>
        <title>Tools & Extensions | Claude Code Masterkurs</title>
        <meta name="description" content="43 CLI-Tools und MCP Server im Überblick. Lerne grep, jq, ripgrep, fzf, MCP-Server und mehr für produktive Entwicklung mit Claude Code." />
        <link rel="canonical" href="https://claude-code-masterkurs.de/tools" />
      </Helmet>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-apple-muted font-mono mb-6">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <ChevronRight size={14} className="text-apple-border" />
        <span className="text-apple-textSecondary">{t('tools.title')}</span>
      </div>

      {/* Hero Section */}
      <header className="relative mb-12">
        <div className="apple-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-apple-accent/8 via-transparent to-apple-success/5 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-mono bg-apple-accent/15 text-apple-accent border border-apple-accent/20">
                <Wrench size={13} />
                {t('tools.badge')}
              </span>
              {progress > 0 && (
                <span className="text-xs text-apple-muted font-mono">
                  {progress}% {t('freelancer.complete')}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-apple-text mb-3 tracking-tight leading-tight">
              {t('tools.title')}
            </h1>
            <p className="text-apple-textSecondary text-lg leading-relaxed max-w-2xl mb-8">
              {t('tools.subtitle')}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-apple bg-apple-surface/50 border border-apple-border/30"
                  >
                    <Icon size={18} className="text-apple-accent flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-apple-text">{stat.value}</p>
                      <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">
                        {t(stat.labelKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            {progress > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-apple-muted font-mono mb-2">
                  <span>{t('tools.progress')}</span>
                  <span>{totalCompleted}/{totalTools}</span>
                </div>
                <div className="w-full h-2 bg-apple-border/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-apple-accent to-apple-success rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Categories */}
      <section>
        <h2 className="text-xl font-bold text-apple-text mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-apple-accent/10 flex items-center justify-center">
            <Wrench size={16} className="text-apple-accent" />
          </span>
          {t('tools.categoriesTitle')}
        </h2>

        <div className="space-y-4">
          {toolCategories.map((cat) => {
            const CatIcon = ICON_MAP[cat.icon];
            const catCompleted = cat.tools.filter((t) => completedToolIds.includes(t.id)).length;
            const catProgress = cat.tools.length > 0 ? Math.round((catCompleted / cat.tools.length) * 100) : 0;
            const isExpanded = expandedCat === cat.id;

            return (
              <div key={cat.id} className="rounded-apple-lg border border-apple-border/40 bg-apple-surface/60 overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-apple-hover/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-apple-accent/10 flex items-center justify-center">
                      <CatIcon size={20} className="text-apple-accent" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-bold text-apple-text">{t(cat.labelKey)}</h3>
                      <p className="text-xs text-apple-muted">
                        {t(cat.descKey)} &middot; {cat.tools.length} Tools
                        {catCompleted > 0 && ` · ${catCompleted} ${t('freelancer.complete')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {catProgress > 0 && (
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-apple-border/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-apple-accent rounded-full"
                            style={{ width: `${catProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-apple-muted font-mono">{catProgress}%</span>
                      </div>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-apple-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Tool List */}
                {isExpanded && (
                  <div className="border-t border-apple-border/30 animate-fade-in-up">
                    <div className="p-3 space-y-1">
                      {cat.tools.map((tool) => {
                        const globalIndex = toolIndexMap.get(tool.id) ?? 999;
                        const isFree = globalIndex < FREE_TOOLS_LIMIT;
                        const isCompleted = completedToolIds.includes(tool.id);
                        const canAccess = isFree || hasPremium || isCompleted;

                        return canAccess ? (
                          <Link
                            key={tool.id}
                            to={`/tools/${tool.id}`}
                            className={`flex items-center justify-between px-4 py-3 rounded-apple transition-all duration-200 group ${
                              isCompleted
                                ? 'bg-apple-success/[0.04] hover:bg-apple-success/[0.08]'
                                : 'hover:bg-apple-hover/50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 ${
                                  isCompleted
                                    ? 'bg-apple-success/15 text-apple-success'
                                    : 'bg-apple-accent/10 text-apple-accent'
                                }`}
                              >
                                {isCompleted ? <CheckCircle2 size={16} /> : String(globalIndex + 1).padStart(2, '0')}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-apple-text group-hover:text-apple-accent transition-colors truncate">
                                    {tool.title}
                                  </p>
                                  {isFree && !hasPremium && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-apple-success/15 text-apple-success uppercase tracking-wider flex-shrink-0">
                                      {t('freelancer.free')}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="flex items-center gap-1 text-[11px] text-apple-muted">
                                    <Clock size={10} />
                                    {tool.duration}
                                  </span>
                                  <span className="flex items-center gap-1 text-[11px] text-apple-muted">
                                    <Target size={10} />
                                    {tool.objectives.length} {t('lesson.objectives')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight size={16} className="text-apple-muted group-hover:text-apple-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </Link>
                        ) : (
                          <div
                            key={tool.id}
                            className="flex items-center justify-between px-4 py-3 rounded-apple opacity-50"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-apple-surface text-apple-muted flex-shrink-0">
                                <Lock size={14} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-apple-text truncate">{tool.title}</p>
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-apple-border/30 text-apple-muted uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
                                    <Lock size={8} />
                                    Premium
                                  </span>
                                </div>
                                <span className="flex items-center gap-1 text-[11px] text-apple-muted mt-0.5">
                                  <Clock size={10} />
                                  {tool.duration}
                                </span>
                              </div>
                            </div>
                            <Lock size={16} className="text-apple-muted flex-shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA for non-premium users */}
      {!hasPremium && (
        <div className="mt-12 rounded-apple-lg bg-gradient-to-r from-apple-accent/10 via-apple-accent/5 to-transparent border border-apple-accent/20 p-8 text-center">
          <h3 className="text-xl font-bold text-apple-text mb-2">{t('tools.ctaTitle')}</h3>
          <p className="text-apple-textSecondary text-sm mb-5 max-w-md mx-auto">
            {t('tools.ctaDesc')}
          </p>
          {isAuthenticated ? (
            <Link to="/profile" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <Rocket size={16} />
              {t('freelancer.ctaUpgrade')}
            </Link>
          ) : (
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <Rocket size={16} />
              {t('freelancer.ctaRegister')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsOverviewView;
