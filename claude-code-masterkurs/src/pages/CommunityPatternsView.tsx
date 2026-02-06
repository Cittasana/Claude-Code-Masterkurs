import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Layers,
  User,
  Tag,
} from 'lucide-react';
import { patterns, patternCategories } from '../data/patterns';

const CommunityPatternsView = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPatterns = useMemo(() => {
    return patterns.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.useCase && p.useCase.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const groupedPatterns = useMemo(() => {
    const groups: Record<string, typeof patterns> = {};
    for (const p of filteredPatterns) {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    }
    return groups;
  }, [filteredPatterns]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          Dashboard
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">Community Patterns</span>
      </div>

      {/* Header */}
      <div className="text-center py-4 mb-8">
        <p className="text-apple-accent font-mono text-sm tracking-widest uppercase mb-3">
          Phase 3 · Advanced
        </p>
        <h1 className="text-4xl font-bold text-apple-text tracking-tight mb-3">
          Community Patterns Library
        </h1>
        <p className="text-apple-textSecondary text-lg max-w-2xl mx-auto">
          Bewährte Prompts, CLAUDE.md-Snippets, Workflows und Skills – durchsuchbar, kopierbar, sofort nutzbar.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="apple-card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-muted"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Suche nach Titel, Tag, Use-Case oder Inhalt..."
              className="w-full bg-apple-bg border border-apple-border rounded-apple pl-10 pr-4 py-3 text-apple-text text-sm placeholder-apple-muted/50 focus:border-apple-accent/50 focus:outline-none focus:ring-1 focus:ring-apple-accent/30 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-2 rounded-apple text-xs font-medium transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-apple-accent text-white'
                  : 'bg-apple-elevated text-apple-textSecondary border border-apple-border hover:border-apple-borderLight'
              }`}
            >
              Alle ({patterns.length})
            </button>
            {patternCategories.map((cat) => {
              const count = patterns.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
                  className={`px-3 py-2 rounded-apple text-xs font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-apple-accent text-white'
                      : 'bg-apple-elevated text-apple-textSecondary border border-apple-border hover:border-apple-borderLight'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-apple-muted text-sm font-mono">
          {filteredPatterns.length} Pattern{filteredPatterns.length !== 1 ? 's' : ''} gefunden
        </p>
      </div>

      {/* Pattern Groups */}
      <div className="space-y-8">
        {Object.entries(groupedPatterns).map(([category, categoryPatterns]) => (
          <div key={category}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-apple bg-apple-accent/15 flex items-center justify-center">
                <Layers size={16} className="text-apple-accent" />
              </div>
              <h2 className="text-lg font-bold text-apple-text">{category}</h2>
              <span className="text-xs text-apple-muted font-mono">
                ({categoryPatterns.length})
              </span>
            </div>

            <div className="space-y-2">
              {categoryPatterns.map((pattern) => {
                const isExpanded = expandedId === pattern.id;
                return (
                  <div
                    key={pattern.id}
                    className={`apple-card !p-0 overflow-hidden transition-all duration-200 ${
                      isExpanded ? 'border-apple-accent/30' : ''
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : pattern.id)
                      }
                      className="w-full flex items-center justify-between p-4 hover:bg-apple-hover/30 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="shrink-0">
                          {isExpanded ? (
                            <ChevronDown size={16} className="text-apple-accent" />
                          ) : (
                            <ChevronRight size={16} className="text-apple-muted" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-apple-text">
                              {pattern.title}
                            </span>
                          </div>
                          <p className="text-apple-textSecondary text-xs mt-0.5 truncate">
                            {pattern.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 ml-4">
                        {pattern.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] font-mono bg-apple-bg border border-apple-border rounded-full text-apple-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-apple-border/50">
                        <div className="mt-4 space-y-4">
                          {pattern.useCase && (
                            <div>
                              <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
                                Use-Case
                              </p>
                              <p className="text-apple-text text-sm">
                                {pattern.useCase}
                              </p>
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-apple-muted font-mono uppercase tracking-wider">
                                Snippet
                              </p>
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center space-x-1 text-xs text-apple-muted">
                                  <User size={12} />
                                  {pattern.author}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(pattern.snippet, pattern.id);
                                  }}
                                  className="flex items-center space-x-1 text-xs text-apple-muted hover:text-apple-accent transition-colors"
                                >
                                  {copiedId === pattern.id ? (
                                    <>
                                      <Check size={12} />
                                      <span>Kopiert</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>Kopieren</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                            <pre className="bg-apple-bg border border-apple-border rounded-apple p-3 font-mono text-sm text-apple-text overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                              <code>{pattern.snippet}</code>
                            </pre>
                          </div>

                          <div className="flex items-center flex-wrap gap-y-2">
                            <Tag size={12} className="text-apple-muted shrink-0" />
                            {pattern.tags.map((tag) => (
                              <button
                                key={tag}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchTerm(tag);
                                  setExpandedId(null);
                                }}
                                className="px-2 py-0.5 text-[10px] font-mono bg-apple-bg border border-apple-border rounded-full text-apple-muted hover:text-apple-accent hover:border-apple-accent/40 transition-colors cursor-pointer"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-16">
          <Search size={40} className="text-apple-muted mx-auto mb-4" />
          <p className="text-apple-text text-lg font-medium mb-2">
            Keine Patterns gefunden
          </p>
          <p className="text-apple-textSecondary text-sm">
            {t('patterns.tryOtherSearch')}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
            }}
            className="btn-secondary mt-4"
          >
            {t('patterns.resetFilters')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityPatternsView;
