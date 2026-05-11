"use client";

import { useState } from "react";
import {
  Sparkles,
  Search,
  Globe,
  Github,
  FileCode,
  Book,
  Clock,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

export default function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [quelle, setQuelle] = useState("web");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    // Mock search - In Produktion API Call
    setTimeout(() => {
      setResults([
        {
          id: "1",
          title: "Understanding Python async/await",
          source: "Python Official Docs",
          url: "https://docs.python.org/3/library/asyncio.html",
          excerpt:
            "Asyncio is a library to write concurrent code using the async/await syntax...",
          relevance: 95,
        },
        {
          id: "2",
          title: "Async Programming in Python - Real Python",
          source: "Real Python",
          url: "https://realpython.com/async-io-python/",
          excerpt:
            "Learn how to use Python's async/await syntax for concurrent programming...",
          relevance: 92,
        },
        {
          id: "3",
          title: "asyncio — Asynchronous I/O",
          source: "Python Documentation",
          url: "https://docs.python.org/3/library/asyncio.html",
          excerpt:
            "The asyncio package provides infrastructure for writing single-threaded concurrent code...",
          relevance: 90,
        },
      ]);
      setIsSearching(false);
    }, 2000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const quellen = [
    { value: "web", label: "Web Search", icon: Globe },
    { value: "github", label: "GitHub", icon: Github },
    { value: "stackoverflow", label: "Stack Overflow", icon: FileCode },
    { value: "docs", label: "Official Docs", icon: Book },
  ];

  const history = [
    {
      topic: "Python async/await patterns",
      quelle: "Web Search",
      zeit: "Vor 2 Stunden",
      resultCount: 5,
    },
    {
      topic: "TypeScript generics best practices",
      quelle: "Official Docs",
      zeit: "Gestern",
      resultCount: 8,
    },
    {
      topic: "React Server Components",
      quelle: "GitHub",
      zeit: "Vor 2 Tagen",
      resultCount: 12,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Agent</h1>
            <p className="text-sm text-gray-600">
              AI-gestützte Recherche für deinen Kurs-Content
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Research Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Form */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Neue Recherche starten
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Was möchtest du recherchieren?
                </label>
                <input
                  type="text"
                  placeholder="z.B. 'Python async/await patterns', 'React hooks best practices'..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSearching) {
                      handleSearch();
                    }
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Quelle auswählen
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {quellen.map((q) => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={q.value}
                        onClick={() => setQuelle(q.value)}
                        className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                          quelle === q.value
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
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
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
                <h2 className="text-lg font-bold text-gray-900">
                  Ergebnisse ({results.length})
                </h2>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                  Alle speichern
                </button>
              </div>

              {results.map((result) => (
                <div
                  key={result.id}
                  className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-gray-900">
                        {result.title}
                      </h3>
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="h-3.5 w-3.5" />
                        {result.source}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {result.relevance}% Match
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-700">{result.excerpt}</p>

                  <div className="flex items-center gap-2">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Quelle öffnen
                    </a>
                    <button
                      onClick={() => copyToClipboard(result.excerpt, result.id)}
                      className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
                    >
                      {copied === result.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Kopiert!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          In Lektion einfügen
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && !isSearching && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Keine Ergebnisse
              </h3>
              <p className="text-sm text-gray-600">
                Starte eine Recherche, um Ergebnisse zu sehen
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-purple-600">•</span>
                <span>Sei spezifisch in deinem Topic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-purple-600">•</span>
                <span>Nutze "Web Search" für allgemeine Infos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-purple-600">•</span>
                <span>Nutze "Official Docs" für technische Details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-purple-600">•</span>
                <span>GitHub für Code-Beispiele</span>
              </li>
            </ul>
          </div>

          {/* History */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Verlauf</h3>
              <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                Alle anzeigen
              </button>
            </div>
            <div className="space-y-3">
              {history.map((item, index) => (
                <button
                  key={index}
                  className="w-full rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
                >
                  <p className="mb-1 text-sm font-medium text-gray-900">
                    {item.topic}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {item.zeit}
                    <span>•</span>
                    <span>{item.resultCount} Ergebnisse</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
