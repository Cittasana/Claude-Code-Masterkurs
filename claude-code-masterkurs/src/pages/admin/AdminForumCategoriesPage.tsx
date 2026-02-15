import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Pencil,
  MessageSquare,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminForumCategory } from '../../lib/api';

export function AdminForumCategoriesPage() {
  const [categories, setCategories] = useState<AdminForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminForumCategory | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getForumCategories();
      setCategories(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDelete = async (id: string) => {
    if (!confirm('Kategorie wirklich löschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteForumCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forum-Kategorien</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte die Kategorien des Community-Forums</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neue Kategorie
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showCreateForm && (
        <CreateCategoryForm
          onCreated={(category) => {
            setCategories((prev) => [...prev, category]);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Kategorien</h3>
          <p className="text-sm text-gray-600">Erstelle deine erste Forum-Kategorie.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-600">
                <th className="px-6 py-3">Icon</th>
                <th className="px-6 py-3">Category ID</th>
                <th className="px-6 py-3">Titel</th>
                <th className="px-6 py-3">Beschreibung</th>
                <th className="px-6 py-3">Reihenfolge</th>
                <th className="px-6 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700">{cat.categoryId}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{cat.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cat.description}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">#{String(cat.sortOrder).padStart(2, '0')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deleting === cat.id}
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting === cat.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
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
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{categories.length} Kategorien</span> insgesamt</p>
      </div>

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onSaved={(updated) => {
            setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            setEditingCategory(null);
          }}
          onCancel={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}

function CreateCategoryForm({ onCreated, onCancel }: { onCreated: (category: AdminForumCategory) => void; onCancel: () => void }) {
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.createForumCategory({
        categoryId,
        title,
        description,
        icon,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neue Kategorie erstellen</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category ID</label>
          <input type="text" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required placeholder="z.B. allgemein"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Icon (Emoji)</label>
          <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} required placeholder="z.B. 💬"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving || !categoryId || !title}
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

function EditCategoryModal({ category, onSaved, onCancel }: { category: AdminForumCategory; onSaved: (category: AdminForumCategory) => void; onCancel: () => void }) {
  const [categoryId, setCategoryId] = useState(category.categoryId);
  const [title, setTitle] = useState(category.title);
  const [description, setDescription] = useState(category.description);
  const [icon, setIcon] = useState(category.icon);
  const [sortOrder, setSortOrder] = useState(category.sortOrder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.updateForumCategory(category.id, {
        categoryId,
        title,
        description,
        icon,
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
        <h2 className="mb-4 text-lg font-bold text-gray-900">Kategorie bearbeiten</h2>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category ID</label>
            <input type="text" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Icon (Emoji)</label>
            <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving || !categoryId || !title}
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
