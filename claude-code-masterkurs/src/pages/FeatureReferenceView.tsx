import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, BookOpen, Terminal, Copy, Check, ChevronDown, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import { features, featureCategories } from '../data/features';

const FeatureReferenceView = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFeatures = useMemo(() => {
    return features.filter((f) => {
      const matchesSearch =
        !searchTerm ||
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        f.example.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || f.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const groupedFeatures = useMemo(() => {
    const groups: Record<string, typeof features> = {};
    for (const f of filteredFeatures) {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    }
    return groups;
  }, [filteredFeatures]);

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
        <span className="text-apple-textSecondary">Feature Reference</span>
      </div>

      {/* Header */}
      <div className="text-center py-4 mb-8">
        <p className="text-apple-accent font-mono text-sm tracking-widest uppercase mb-3">
          Reference
        </p>
        <h1 className="text-4xl font-bold text-apple-text tracking-tight mb-3">
          Feature Reference
        </h1>
        <p className="text-apple-textSecondary text-lg">
          {features.length}+ Features, Commands & Funktionen im Überblick
        </p>
        <div className="mt-6 mx-auto max-w-2xl rounded-apple-lg border border-apple-accent/25 bg-apple-accent/5 px-4 py-3 text-left">
          <p className="text-sm text-apple-textSecondary flex items-center gap-2 flex-wrap">
            <Zap size={16} className="text-apple-accent shrink-0" />
            <span>
              <strong className="text-apple-text">Neueste Updates:</strong> Fast Mode (<code className="text-apple-accent/90">/fast</code>), Agent Teams, Checkpointing, <code className="text-apple-accent/90">--add-dir</code>, <code className="text-apple-accent/90">--mcp-config</code>. Offizielle Referenz:{' '}
              <a href="https://code.claude.com/docs/de/overview" target="_blank" rel="noopener noreferrer" className="text-apple-accent hover:underline inline-flex items-center gap-1">
                code.claude.com <ExternalLink size={12} />
              </a>
            </span>
          </p>
        </div>
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
              placeholder="Suche nach Feature, Befehl oder Stichwort..."
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
              Alle ({features.length})
            </button>
            {featureCategories.map((cat) => {
              const count = features.filter((f) => f.category === cat).length;
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

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-apple-muted text-sm font-mono">
          {filteredFeatures.length} Feature{filteredFeatures.length !== 1 ? 's' : ''} gefunden
        </p>
      </div>

      {/* Feature Groups */}
      <div className="space-y-8">
        {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
          <div key={category}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-apple bg-apple-accent/15 flex items-center justify-center">
                <BookOpen size={16} className="text-apple-accent" />
              </div>
              <h2 className="text-lg font-bold text-apple-text">{category}</h2>
              <span className="text-xs text-apple-muted font-mono">
                ({categoryFeatures.length})
              </span>
            </div>

            <div className="space-y-2">
              {categoryFeatures.map((feature) => {
                const isExpanded = expandedFeature === feature.id;
                return (
                  <div
                    key={feature.id}
                    className={`apple-card !p-0 overflow-hidden transition-all duration-200 ${
                      isExpanded ? 'border-apple-accent/30' : ''
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedFeature(isExpanded ? null : feature.id)
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
                            <code className="text-sm font-mono text-apple-accent font-semibold">
                              {feature.name}
                            </code>
                          </div>
                          <p className="text-apple-textSecondary text-xs mt-0.5 truncate">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 ml-4">
                        {feature.tags.slice(0, 2).map((tag) => (
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
                          {/* Ausführliche Beschreibung */}
                          <div>
                            <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
                              Beschreibung
                            </p>
                            {feature.details ? (
                              <div className="text-apple-text text-sm leading-relaxed space-y-2">
                                {feature.details.split('\n').map((paragraph, i) => (
                                  <p key={i}>{paragraph}</p>
                                ))}
                              </div>
                            ) : (
                              <p className="text-apple-text text-sm leading-relaxed">
                                {feature.description}
                              </p>
                            )}
                          </div>

                          {/* Praxis-Tipps */}
                          {feature.tips && feature.tips.length > 0 && (
                            <div>
                              <p className="text-xs text-apple-muted font-mono uppercase tracking-wider mb-2">
                                Praxis-Tipps
                              </p>
                              <ul className="space-y-1.5">
                                {feature.tips.map((tip, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start space-x-2 text-sm text-apple-textSecondary"
                                  >
                                    <span className="text-apple-accent mt-0.5 shrink-0">›</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Beispiel */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-apple-muted font-mono uppercase tracking-wider">
                                Beispiel
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(feature.example, feature.id);
                                }}
                                className="flex items-center space-x-1 text-xs text-apple-muted hover:text-apple-accent transition-colors"
                              >
                                {copiedId === feature.id ? (
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
                            <pre className="bg-apple-bg border border-apple-border rounded-apple p-3 font-mono text-sm text-apple-text overflow-x-auto whitespace-pre-wrap">
                              <code>{feature.example}</code>
                            </pre>
                          </div>

                          {/* Doku-Link & Tags */}
                          <div className="flex items-center justify-between flex-wrap gap-y-2">
                            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                              <Terminal size={12} className="text-apple-muted" />
                              {feature.tags.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchTerm(tag);
                                    setExpandedFeature(null);
                                  }}
                                  className="px-2 py-0.5 text-[10px] font-mono bg-apple-bg border border-apple-border rounded-full text-apple-muted hover:text-apple-accent hover:border-apple-accent/40 transition-colors cursor-pointer"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                            <a
                              href={feature.documentation}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] font-mono text-apple-accent/70 hover:text-apple-accent transition-colors"
                            >
                              Dokumentation →
                            </a>
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

      {filteredFeatures.length === 0 && (
        <div className="text-center py-16">
          <Search size={40} className="text-apple-muted mx-auto mb-4" />
          <p className="text-apple-text text-lg font-medium mb-2">
            Keine Features gefunden
          </p>
          <p className="text-apple-textSecondary text-sm">
            {t('features.tryOtherSearch')}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
            }}
            className="btn-secondary mt-4"
          >
            {t('features.resetFilters')}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeatureReferenceView;
