import { useState, useEffect } from 'react';
import {
  Code2,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface AdminPattern {
  id: string;
  title: string;
  description: string;
  category: string;
  snippet: string;
  language: string | null;
  tags: string[];
  useCase: string | null;
  createdAt: string;
  author: { id: string; displayName: string; email: string };
}

export function AdminPatternsPage() {
  const [patterns, setPatterns] = useState<AdminPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getPatterns()
      .then((res) => setPatterns(res.data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Pattern wirklich löschen?')) return;
    try {
      await adminApi.deletePattern(id);
      setPatterns((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patterns Moderation</h1>
        <p className="mt-1 text-sm text-gray-600">Community Patterns verwalten</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : patterns.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Code2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Patterns</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Titel</th>
                  <th className="px-6 py-3">Kategorie</th>
                  <th className="px-6 py-3">Autor</th>
                  <th className="px-6 py-3">Sprache</th>
                  <th className="px-6 py-3">Tags</th>
                  <th className="px-6 py-3">Erstellt</th>
                  <th className="px-6 py-3">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {patterns.map((pattern) => (
                  <tr key={pattern.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{pattern.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{pattern.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                        {pattern.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{pattern.author.displayName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pattern.language || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {pattern.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{tag}</span>
                        ))}
                        {pattern.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{pattern.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(pattern.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(pattern.id)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{patterns.length} Patterns</span> insgesamt</p>
      </div>
    </div>
  );
}
