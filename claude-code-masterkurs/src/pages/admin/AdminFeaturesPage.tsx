import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Loader2,
  AlertCircle,
  Pencil,
  Zap,
  X,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminFeature } from '../../lib/api';

const kategorien = [
  { value: 'all', label: 'Alle' },
  { value: 'Grundlagen', label: 'Grundlagen' },
  { value: 'Slash Commands', label: 'Slash Commands' },
  { value: 'Konfiguration', label: 'Konfiguration' },
  { value: 'Workflows', label: 'Workflows' },
  { value: 'MCP', label: 'MCP' },
  { value: 'Erweitert', label: 'Erweitert' },
];

export function AdminFeaturesPage() {
  const [features, setFeatures] = useState<AdminFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<AdminFeature | null>(null);

  const loadFeatures = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getFeatures();
      setFeatures(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const handleDelete = async (id: string) => {
    if (!confirm('Feature wirklich löschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteFeature(id);
      setFeatures((prev) => prev.filter((f) => f.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const filteredFeatures = features.filter((f) => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.featureId.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const catCounts = kategorien.map((k) => ({
    ...k,
    count: k.value === 'all' ? features.length : features.filter((f) => f.category === k.value).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Features & Referenz</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte alle Claude Code Feature-Referenzen</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neues Feature
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
            placeholder="Suche Features..."
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
        <CreateFeatureForm
          onCreated={(feature) => {
            setFeatures((prev) => [...prev, feature]);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Features Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredFeatures.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <Zap className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Features</h3>
          <p className="text-sm text-gray-600">Erstelle dein erstes Feature.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => (
            <div key={feature.id} className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {feature.category}
                </span>
              </div>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>

              <div className="mb-4">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{feature.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{feature.description}</p>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-1">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-mono text-gray-500">{feature.featureId}</span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">#{String(feature.sortOrder).padStart(2, '0')}</span>
              </div>

              {feature.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
                  {feature.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{tag}</span>
                  ))}
                  {feature.tags.length > 3 && (
                    <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">+{feature.tags.length - 3}</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setEditingFeature(feature)}
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(feature.id)}
                  disabled={deleting === feature.id}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting === feature.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredFeatures.length} Features</span> {selectedCategory !== 'all' || searchQuery ? `(von ${features.length} insgesamt)` : 'insgesamt'}</p>
      </div>

      {editingFeature && (
        <EditFeatureModal
          feature={editingFeature}
          onSaved={(updated) => {
            setFeatures((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
            setEditingFeature(null);
          }}
          onCancel={() => setEditingFeature(null)}
        />
      )}
    </div>
  );
}

function JsonArrayEditor({ label, value, onChange, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('');

  const addItem = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput('');
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button type="button" onClick={addItem}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {value.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
              {item}
              <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateFeatureForm({ onCreated, onCancel }: { onCreated: (feature: AdminFeature) => void; onCancel: () => void }) {
  const [featureId, setFeatureId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Grundlagen');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [tips, setTips] = useState<string[]>([]);
  const [example, setExample] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.createFeature({
        featureId,
        name,
        category,
        description,
        details: details || undefined,
        tips,
        example,
        documentation,
        tags,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neues Feature erstellen</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Feature ID</label>
          <input type="text" value={featureId} onChange={(e) => setFeatureId(e.target.value)} required placeholder="z.B. f-cli-start"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Kategorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            {kategorien.filter((k) => k.value !== 'all').map((k) => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Details (optional)</label>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Beispiel</label>
          <input type="text" value={example} onChange={(e) => setExample(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Dokumentation (URL)</label>
          <input type="url" value={documentation} onChange={(e) => setDocumentation(e.target.value)} required placeholder="https://..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <JsonArrayEditor label="Tipps" value={tips} onChange={setTips} placeholder="Tipp eingeben + Enter" />
        </div>
        <div className="md:col-span-2">
          <JsonArrayEditor label="Tags" value={tags} onChange={setTags} placeholder="Tag eingeben + Enter" />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving || !featureId || !name || !description}
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

function EditFeatureModal({ feature, onSaved, onCancel }: { feature: AdminFeature; onSaved: (feature: AdminFeature) => void; onCancel: () => void }) {
  const [featureId, setFeatureId] = useState(feature.featureId);
  const [name, setName] = useState(feature.name);
  const [category, setCategory] = useState(feature.category);
  const [description, setDescription] = useState(feature.description);
  const [details, setDetails] = useState(feature.details || '');
  const [tips, setTips] = useState<string[]>(feature.tips);
  const [example, setExample] = useState(feature.example);
  const [documentation, setDocumentation] = useState(feature.documentation);
  const [tags, setTags] = useState<string[]>(feature.tags);
  const [sortOrder, setSortOrder] = useState(feature.sortOrder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.updateFeature(feature.id, {
        featureId,
        name,
        category,
        description,
        details: details || undefined,
        tips,
        example,
        documentation,
        tags,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onClick={onCancel}>
      <div className="w-full max-w-2xl rounded-xl border bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Feature bearbeiten</h2>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid max-h-[70vh] gap-4 overflow-y-auto pr-2 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Feature ID</label>
            <input type="text" value={featureId} onChange={(e) => setFeatureId(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kategorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              {kategorien.filter((k) => k.value !== 'all').map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Details (optional)</label>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Beispiel</label>
            <input type="text" value={example} onChange={(e) => setExample(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dokumentation (URL)</label>
            <input type="url" value={documentation} onChange={(e) => setDocumentation(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <JsonArrayEditor label="Tipps" value={tips} onChange={setTips} placeholder="Tipp eingeben + Enter" />
          </div>
          <div className="md:col-span-2">
            <JsonArrayEditor label="Tags" value={tags} onChange={setTags} placeholder="Tag eingeben + Enter" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving || !featureId || !name || !description}
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
