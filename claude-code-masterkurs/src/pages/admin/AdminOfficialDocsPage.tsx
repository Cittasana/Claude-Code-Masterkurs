import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Loader2,
  AlertCircle,
  Pencil,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminOfficialDoc } from '../../lib/api';

const kategorien = [
  { value: 'all', label: 'Alle' },
  { value: 'overview', label: 'Overview' },
  { value: 'core', label: 'Core' },
  { value: 'extend', label: 'Extend' },
  { value: 'outside-terminal', label: 'Outside Terminal' },
];

const languages = [
  { value: '', label: 'Keine Angabe' },
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'English' },
];

export function AdminOfficialDocsPage() {
  const [docs, setDocs] = useState<AdminOfficialDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AdminOfficialDoc | null>(null);

  const loadDocs = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getOfficialDocs();
      setDocs(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Dokumentation wirklich löschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteOfficialDoc(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const filteredDocs = docs.filter((d) => {
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.url.toLowerCase().includes(q) || (d.description?.toLowerCase().includes(q));
    }
    return true;
  });

  const catCounts = kategorien.map((k) => ({
    ...k,
    count: k.value === 'all' ? docs.length : docs.filter((d) => d.category === k.value).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offizielle Dokumentation</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte Links zur offiziellen Claude Code Dokumentation</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neuer Eintrag
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {catCounts.map((kat) => (
          <button
            key={kat.value}
            onClick={() => setSelectedCategory(kat.value)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedCategory === kat.value
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {kat.label}
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              selectedCategory === kat.value ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {kat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Dokumentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showCreateForm && (
        <CreateDocForm
          onCreated={(doc) => {
            setDocs((prev) => [...prev, doc]);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Dokumentation</h3>
          <p className="text-sm text-gray-600">Erstelle deinen ersten Dokumentations-Link.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-600">
                <th className="px-6 py-3">Titel</th>
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3">Kategorie</th>
                <th className="px-6 py-3">Sprache</th>
                <th className="px-6 py-3">Reihenfolge</th>
                <th className="px-6 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      {doc.description && <p className="mt-0.5 text-xs text-gray-500">{doc.description}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      <span className="max-w-[200px] truncate">{doc.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">{doc.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    {doc.lang ? (
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{doc.lang.toUpperCase()}</span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">#{String(doc.sortOrder).padStart(2, '0')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingDoc(doc)}
                        className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        disabled={deleting === doc.id}
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting === doc.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredDocs.length} Einträge</span> {selectedCategory !== 'all' || searchQuery ? `(von ${docs.length} insgesamt)` : 'insgesamt'}</p>
      </div>

      {editingDoc && (
        <EditDocModal
          doc={editingDoc}
          onSaved={(updated) => {
            setDocs((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
            setEditingDoc(null);
          }}
          onCancel={() => setEditingDoc(null)}
        />
      )}
    </div>
  );
}

function CreateDocForm({ onCreated, onCancel }: { onCreated: (doc: AdminOfficialDoc) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('overview');
  const [description, setDescription] = useState('');
  const [lang, setLang] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = url === '' || /^https?:\/\/.+/.test(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.createOfficialDoc({
        title,
        url,
        category,
        description: description || undefined,
        lang: lang || undefined,
        sortOrder,
      });
      onCreated(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erstellen fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neuen Eintrag erstellen</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">URL</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://..."
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              !isValidUrl ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
            }`} />
          {!isValidUrl && <p className="mt-1 text-xs text-red-600">Bitte eine gültige URL eingeben</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Kategorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="overview">Overview</option>
            <option value="core">Core</option>
            <option value="extend">Extend</option>
            <option value="outside-terminal">Outside Terminal</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sprache</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            {languages.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung (optional)</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving || !title || !url || !isValidUrl}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Erstellen
          </button>
          <button type="button" onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}

function EditDocModal({ doc, onSaved, onCancel }: { doc: AdminOfficialDoc; onSaved: (doc: AdminOfficialDoc) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(doc.title);
  const [url, setUrl] = useState(doc.url);
  const [category, setCategory] = useState(doc.category);
  const [description, setDescription] = useState(doc.description || '');
  const [lang, setLang] = useState(doc.lang || '');
  const [sortOrder, setSortOrder] = useState(doc.sortOrder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = url === '' || /^https?:\/\/.+/.test(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.updateOfficialDoc(doc.id, {
        title,
        url,
        category,
        description: description || undefined,
        lang: lang || undefined,
        sortOrder,
      });
      onSaved(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Dokumentation bearbeiten</h2>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                !isValidUrl ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
              }`} />
            {!isValidUrl && <p className="mt-1 text-xs text-red-600">Bitte eine gültige URL eingeben</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kategorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="overview">Overview</option>
              <option value="core">Core</option>
              <option value="extend">Extend</option>
              <option value="outside-terminal">Outside Terminal</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sprache</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              {languages.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung (optional)</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving || !title || !url || !isValidUrl}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
              Speichern
            </button>
            <button type="button" onClick={onCancel}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
