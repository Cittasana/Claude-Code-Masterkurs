import { useState, useEffect } from 'react';
import {
  Trophy,
  Check,
  X,
  Trash2,
  Loader2,
  AlertCircle,
  ExternalLink,
  Github,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface AdminShowcaseEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  approved: boolean;
  createdAt: string;
  user: { id: string; displayName: string; email: string };
}

export function AdminShowcasePage() {
  const [entries, setEntries] = useState<AdminShowcaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    adminApi.getShowcaseEntries()
      .then((res) => setEntries(res.data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleApproval = async (id: string) => {
    try {
      const res = await adminApi.toggleShowcaseApproval(id);
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, approved: res.data.approved } : e)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Fehler');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Showcase Entry wirklich löschen?')) return;
    try {
      await adminApi.deleteShowcaseEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    }
  };

  const filtered = entries.filter((e) => tab === 'pending' ? !e.approved : e.approved);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Showcase Moderation</h1>
        <p className="mt-1 text-sm text-gray-600">Projekt-Einreichungen prüfen und genehmigen</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('pending')}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'pending' ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Ausstehend ({entries.filter(e => !e.approved).length})
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'approved' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Genehmigt ({entries.filter(e => e.approved).length})
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {tab === 'pending' ? 'Keine ausstehenden Entries' : 'Keine genehmigten Entries'}
          </h3>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <div key={entry.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-lg font-bold text-gray-900">{entry.title}</h3>
              <p className="mb-3 text-sm text-gray-600">{entry.description}</p>
              <div className="mb-3 text-xs text-gray-500">
                <p>von <span className="font-medium text-gray-700">{entry.user.displayName}</span></p>
                <p>{new Date(entry.createdAt).toLocaleDateString('de-DE')}</p>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {entry.githubUrl && (
                  <a href={entry.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200">
                    <Github className="h-3 w-3" />GitHub
                  </a>
                )}
                {entry.liveUrl && (
                  <a href={entry.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200">
                    <ExternalLink className="h-3 w-3" />Live
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleApproval(entry.id)}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    entry.approved
                      ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {entry.approved ? <><X className="h-3 w-3" />Zurückziehen</> : <><Check className="h-3 w-3" />Genehmigen</>}
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
