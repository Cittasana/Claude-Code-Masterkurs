import { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Globe,
  Github,
  FileCode,
  Book,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { ResearchResult, ResearchHistoryEntry } from '../../lib/api';

export function AdminResearchPage() {
  const [topic, setTopic] = useState('');
  const [quelle, setQuelle] = useState('web');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [history, setHistory] = useState<ResearchHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    adminApi.getResearchHistory(10)
      .then((res) => setHistory(res.data))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  const handleSearch = async () => {
    if (!topic) return;
    setIsSearching(true);
    try {
      const res = await adminApi.triggerResearch(topic, quelle);
      setResults(res.data.results);
      // Refresh history
      adminApi.getResearchHistory(10).then((h) => setHistory(h.data)).catch(() => {});
    } catch {
      // silently handle
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const quellen = [
    { value: 'web', label: 'Web Search', icon: Globe },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'stackoverflow', label: 'Stack Overflow', icon: FileCode },
    { value: 'docs', label: 'Official Docs', icon: Book },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Agent</h1>
            <p className="text-sm text-gray-600">AI-gestützte Recherche für deinen Kurs-Content</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Search Form */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Neue Recherche starten</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Was möchtest du recherchieren?</label>
                <input
                  type="text"
                  placeholder="z.B. 'Python async/await patterns', 'React hooks best practices'..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !isSearching) handleSearch(); }}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Quelle auswählen</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {quellen.map((q) => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={q.value}
                        onClick={() => setQuelle(q.value)}
                        className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                          quelle === q.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {q.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={!topic || isSearching}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Suche läuft...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Research starten
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Ergebnisse ({results.length})</h2>
              </div>
              {results.map((result, index) => (
                <div key={index} className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-gray-900">{result.title}</h3>
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="h-3.5 w-3.5" />{result.source}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {result.relevance}% Match
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-gray-700">{result.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                      <ExternalLink className="h-3.5 w-3.5" />Quelle öffnen
                    </a>
                    <button
                      onClick={() => copyToClipboard(result.excerpt, String(index))}
                      className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
                    >
                      {copied === String(index) ? (
                        <><Check className="h-3.5 w-3.5" />Kopiert!</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" />In Lektion einfügen</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && !isSearching && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Ergebnisse</h3>
              <p className="text-sm text-gray-600">Starte eine Recherche, um Ergebnisse zu sehen</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-purple-600">-</span><span>Sei spezifisch in deinem Topic</span></li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-purple-600">-</span><span>Nutze "Web Search" für allgemeine Infos</span></li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-purple-600">-</span><span>Nutze "Official Docs" für technische Details</span></li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-purple-600">-</span><span>GitHub für Code-Beispiele</span></li>
            </ul>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Verlauf</h3>
            </div>
            {loadingHistory ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-500">Noch keine Recherchen</p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTopic(item.topic)}
                    className="w-full rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <p className="mb-1 text-sm font-medium text-gray-900">{item.topic}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />{item.quelle}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
