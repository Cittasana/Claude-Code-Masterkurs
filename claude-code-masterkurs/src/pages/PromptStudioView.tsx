import { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { CATEGORIES } from '../components/PromptStudio/constants';
import Generator from '../components/PromptStudio/Generator';
import Optimizer from '../components/PromptStudio/Optimizer';
import Planner from '../components/PromptStudio/Planner';
import type { PromptCategoryId, StudioMode } from '../types/promptStudio';

// ─── Free tier: max 3 generations per day ───
const FREE_DAILY_LIMIT = 3;
const STORAGE_KEY = 'prompt-studio-usage';

function getDailyUsage(): { date: string; count: number } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.date === today) return parsed;
    }
  } catch { /* ignore */ }
  return { date: new Date().toISOString().slice(0, 10), count: 0 };
}

function incrementDailyUsage(): number {
  const usage = getDailyUsage();
  usage.count += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  return usage.count;
}

const MODE_CONFIG = [
  { id: 'generate' as StudioMode, label: 'Generieren', color: 'bg-blue-500' },
  { id: 'optimize' as StudioMode, label: 'Optimieren', color: 'bg-emerald-500' },
  { id: 'planner' as StudioMode, label: 'Projekt-Planer', color: 'bg-violet-500' },
];

const PromptStudioView = () => {
  const [mode, setMode] = useState<StudioMode>('generate');
  const [activeCategory, setActiveCategory] = useState<PromptCategoryId>('claude-md');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usageCount, setUsageCount] = useState(() => getDailyUsage().count);
  const [showPaywall, setShowPaywall] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logEvent = useAnalyticsStore((s) => s.logEvent);

  // Determine premium access: authenticated = premium for now
  // (adapt to actual subscription check when Stripe integration provides hasActiveSubscription)
  const isPremium = isAuthenticated && !!user;
  const isLimitReached = !isPremium && usageCount >= FREE_DAILY_LIMIT;

  // Track page open
  useEffect(() => {
    logEvent('session_start', { context: 'prompt-studio' });
  }, [logEvent]);

  const handleCategoryChange = useCallback((id: PromptCategoryId) => {
    setActiveCategory(id);
  }, []);

  const handleModeChange = useCallback((newMode: StudioMode) => {
    // Free tier: only generator mode
    if (!isPremium && newMode !== 'generate') {
      setShowPaywall(true);
      return;
    }
    setMode(newMode);
  }, [isPremium]);

  const handleGenerated = useCallback(() => {
    if (!isPremium) {
      const count = incrementDailyUsage();
      setUsageCount(count);
    }
    const category = CATEGORIES.find((c) => c.id === activeCategory);
    logEvent('lesson_complete', { context: `prompt-generated:${activeCategory}:${mode}` });
    void category; // used in logEvent context
  }, [isPremium, activeCategory, mode, logEvent]);

  const handleOptimized = useCallback((score: number) => {
    logEvent('lesson_complete', { context: `prompt-optimized:${score}` });
  }, [logEvent]);

  const handleProjectAnalyzed = useCallback((phases: number, features: number) => {
    logEvent('lesson_complete', { context: `project-analyzed:${phases}:${features}` });
  }, [logEvent]);

  const handleDownloaded = useCallback((filename: string) => {
    logEvent('lesson_complete', { context: `prompt-downloaded:${filename}` });
  }, [logEvent]);

  const category = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="animate-fade-in-up -mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-8">
      <Helmet>
        <title>Prompt Studio | Claude Code Masterkurs</title>
        <meta name="description" content="Generiere & optimiere Prompts fuer Claude Code Projekte. CLAUDE.md, Skills, Hooks, MCP Server und mehr." />
        <link rel="canonical" href="https://claude-code-masterkurs.de/prompt-studio" />
      </Helmet>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-[260px]' : 'w-14'
          } bg-apple-surface border-r border-apple-border transition-all duration-200 flex flex-col shrink-0 overflow-hidden hidden lg:flex`}
        >
          <div className={`${sidebarOpen ? 'px-4 py-5' : 'px-2 py-5'} border-b border-apple-border flex items-center justify-between gap-2`}>
            {sidebarOpen && (
              <div>
                <div className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                  <Sparkles size={14} className="text-apple-accent" />
                  Prompt Studio
                </div>
                <div className="text-[11px] text-apple-muted mt-0.5">Claude Code Masterkurs</div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-apple-muted hover:text-apple-text p-1 text-sm transition-colors"
              aria-label={sidebarOpen ? 'Sidebar schliessen' : 'Sidebar oeffnen'}
            >
              {sidebarOpen ? '\u25C0' : '\u25B6'}
            </button>
          </div>

          <nav className="flex-1 p-2 overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full flex items-center gap-2.5 ${sidebarOpen ? 'px-3 py-2.5' : 'px-2 py-2.5 justify-center'} mb-0.5 rounded-apple text-left text-sm transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                    : 'border border-transparent text-apple-muted hover:text-apple-textSecondary hover:bg-apple-hover'
                }`}
              >
                <span className="text-lg shrink-0">{cat.icon}</span>
                {sidebarOpen && (
                  <div className="min-w-0">
                    <div className={`text-sm ${activeCategory === cat.id ? 'font-semibold' : ''}`}>{cat.label}</div>
                    <div className="text-[11px] text-apple-muted truncate">{cat.desc}</div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {sidebarOpen && (
            <div className="px-4 py-3 border-t border-apple-border text-[11px] text-apple-muted">
              v1.0 &mdash; claude-code-masterkurs.de
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="px-4 sm:px-7 py-4 border-b border-apple-border bg-apple-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mode === 'planner' ? '\u{1F4D0}' : category.icon}</span>
              <div>
                <h1 className="text-lg font-bold text-apple-text tracking-tight">
                  {mode === 'planner' ? 'Projekt-Planer' : category.label}
                </h1>
                <p className="text-xs text-apple-muted">
                  {mode === 'planner'
                    ? 'Projekt beschreiben \u2192 Struktur analysieren \u2192 Prompts generieren'
                    : category.desc}
                </p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-apple-bg rounded-apple p-0.5 border border-apple-border shrink-0">
              {MODE_CONFIG.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  className={`px-3 py-2 rounded-apple text-xs font-medium transition-all ${
                    mode === m.id
                      ? `${m.color} text-white font-semibold`
                      : 'text-apple-muted hover:text-apple-textSecondary'
                  }`}
                >
                  {m.label}
                  {!isPremium && m.id !== 'generate' && (
                    <Lock size={10} className="inline ml-1 opacity-60" />
                  )}
                </button>
              ))}
            </div>
          </header>

          {/* Mobile Category Selector */}
          <div className="lg:hidden px-4 py-3 border-b border-apple-border bg-apple-surface/50 overflow-x-auto">
            <div className="flex gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-apple text-xs whitespace-nowrap shrink-0 transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold'
                      : 'border border-transparent text-apple-muted hover:bg-apple-hover'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto px-4 sm:px-7 py-6">
            <div className="max-w-[900px] mx-auto">
              {/* Free tier usage banner */}
              {!isPremium && mode === 'generate' && (
                <div className="mb-5 rounded-apple-lg border border-apple-accent/20 bg-apple-accent/5 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-apple-textSecondary">
                    Kostenlos: {FREE_DAILY_LIMIT - usageCount} von {FREE_DAILY_LIMIT} Generierungen heute verfuegbar
                  </span>
                  <Link
                    to="/register"
                    className="text-xs text-apple-accent hover:text-apple-accentHover font-medium transition-colors"
                  >
                    Upgrade &rarr;
                  </Link>
                </div>
              )}

              {/* Paywall gate for limit reached */}
              {isLimitReached && mode === 'generate' ? (
                <PaywallCard />
              ) : showPaywall ? (
                <PaywallCard onClose={() => setShowPaywall(false)} />
              ) : (
                <>
                  {mode === 'generate' && (
                    <Generator
                      activeCategory={activeCategory}
                      category={category}
                      onGenerated={handleGenerated}
                    />
                  )}
                  {mode === 'optimize' && (
                    <Optimizer
                      activeCategory={activeCategory}
                      category={category}
                      onOptimized={handleOptimized}
                    />
                  )}
                  {mode === 'planner' && (
                    <Planner
                      onAnalyzed={handleProjectAnalyzed}
                      onDownloaded={handleDownloaded}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// ─── Paywall Card ───────────────────────────────────────────────────────────

function PaywallCard({ onClose }: { onClose?: () => void }) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="apple-card text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-apple-accent/15 border border-apple-accent/20 flex items-center justify-center">
          <Lock size={24} className="text-apple-accent" />
        </div>
        <h2 className="text-xl font-bold text-apple-text mb-2">Premium-Feature</h2>
        <p className="text-sm text-apple-textSecondary mb-6 max-w-sm mx-auto">
          Schalte alle 3 Modi (Generator, Optimizer, Projekt-Planer) unbegrenzt frei mit einem Claude Code Masterkurs Abo.
        </p>
        <Link
          to="/register"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
        >
          Jetzt upgraden
          <ArrowRight size={16} />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="block mx-auto mt-3 text-xs text-apple-muted hover:text-apple-textSecondary transition-colors"
          >
            Zurueck zum Generator
          </button>
        )}
      </div>
    </div>
  );
}

export default PromptStudioView;
