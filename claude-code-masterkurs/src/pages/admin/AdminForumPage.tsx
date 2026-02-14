import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Pin,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface AdminForumThread {
  id: string;
  categoryId: string;
  title: string;
  authorId: string;
  createdAt: string;
  lastActivityAt: string;
  pinned: boolean;
  author: { id: string; displayName: string; email: string };
  _count: { replies: number };
}

const categoryLabels: Record<string, string> = {
  allgemein: 'Allgemein',
  lektionen: 'Lektionen',
  projekte: 'Projekte',
  tipps: 'Tipps',
  feedback: 'Feedback',
};

export function AdminForumPage() {
  const [threads, setThreads] = useState<AdminForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getForumThreads()
      .then((res) => setThreads(res.data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, []);

  const handleTogglePin = async (id: string) => {
    try {
      const res = await adminApi.toggleThreadPin(id);
      setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, pinned: res.data.pinned } : t)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Fehler');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Thread und alle Antworten wirklich löschen?')) return;
    try {
      await adminApi.deleteForumThread(id);
      setThreads((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Forum Moderation</h1>
        <p className="mt-1 text-sm text-gray-600">Threads verwalten, pinnen und moderieren</p>
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
        ) : threads.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Threads</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Titel</th>
                  <th className="px-6 py-3">Kategorie</th>
                  <th className="px-6 py-3">Autor</th>
                  <th className="px-6 py-3">Antworten</th>
                  <th className="px-6 py-3">Pinned</th>
                  <th className="px-6 py-3">Letzte Aktivität</th>
                  <th className="px-6 py-3">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {threads.map((thread) => (
                  <tr key={thread.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{thread.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {categoryLabels[thread.categoryId] || thread.categoryId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{thread.author.displayName}</p>
                      <p className="text-xs text-gray-500">{thread.author.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{thread._count.replies}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePin(thread.id)}
                        className={`rounded-lg p-1.5 transition-colors ${thread.pinned ? 'bg-yellow-100 text-yellow-700' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(thread.lastActivityAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(thread.id)}
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
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{threads.length} Threads</span> insgesamt</p>
      </div>
    </div>
  );
}
