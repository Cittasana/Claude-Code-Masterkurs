import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminLektion } from '../../lib/api';

export function AdminLektionenPage() {
  const [lektionen, setLektionen] = useState<AdminLektion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategorie, setSelectedKategorie] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadLektionen = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getLektionen({
        kategorie: selectedKategorie,
        search: searchQuery || undefined,
      });
      setLektionen(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [selectedKategorie, searchQuery]);

  useEffect(() => {
    loadLektionen();
  }, [loadLektionen]);

  const handleDelete = async (id: string) => {
    if (!confirm('Lektion wirklich löschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteLektion(id);
      setLektionen((prev) => prev.filter((l) => l.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const publishedCount = lektionen.filter((l) => l.status === 'published').length;
  const draftCount = lektionen.filter((l) => l.status === 'draft').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lektionen</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte alle Kurs-Inhalte</p>
        </div>
        <Link
          to="/admin/lektionen/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Neue Lektion
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Lektionen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select
          value={selectedKategorie}
          onChange={(e) => setSelectedKategorie(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Alle Kategorien</option>
          <option value="basics">Basics</option>
          <option value="fortgeschritten">Fortgeschritten</option>
          <option value="experten">Experten</option>
          <option value="tools">Tools & Extensions</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Gesamt</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{lektionen.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Veröffentlicht</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{publishedCount}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Entwürfe</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">{draftCount}</p>
        </div>
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
      ) : lektionen.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Lektionen</h3>
          <p className="mb-4 text-sm text-gray-600">Erstelle deine erste Lektion.</p>
          <Link
            to="/admin/lektionen/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />Neue Lektion
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Lektion</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Kategorie</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Reihenfolge</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lektionen.map((lektion) => (
                  <tr key={lektion.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lektion.titel}</p>
                          <p className="text-sm text-gray-500">{lektion.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{lektion.kategorie}</span>
                    </td>
                    <td className="px-6 py-4">
                      {lektion.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 className="h-3 w-3" />Veröffentlicht
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                          <Clock className="h-3 w-3" />Entwurf
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">#{lektion.reihenfolge}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/lektionen/${lektion.id}`} className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100" title="Bearbeiten">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(lektion.id)}
                          disabled={deleting === lektion.id}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          title="Löschen"
                        >
                          {deleting === lektion.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
