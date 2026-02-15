import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Puzzle,
  Loader2,
  AlertCircle,
  Pencil,
  X,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface ProjectTemplate {
  id: string;
  templateId: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedHours: number;
  techStack: string[];
  features: string[];
  claudeMd: string;
  fileStructure: string | null;
  steps: { title: string; description: string }[];
  githubUrl: string | null;
  sortOrder: number;
  status: string;
}

export function AdminProjectTemplatesPage() {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProjectTemplate | null>(null);

  const loadTemplates = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getProjectTemplates();
      setTemplates(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleDelete = async (id: string) => {
    if (!confirm('Template wirklich loeschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteProjectTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Loeschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const filteredTemplates = templates.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.templateId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Templates</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte Projekt-Templates mit CLAUDE.md</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neues Template
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Templates..."
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
        <CreateTemplateForm
          onCreated={(template) => {
            setTemplates((prev) => [...prev, template]);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <Puzzle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Templates</h3>
          <p className="text-sm text-gray-600">Erstelle dein erstes Projekt-Template.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute right-4 top-4 flex gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  template.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {template.status}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  template.difficulty === 1 ? 'bg-green-100 text-green-700' :
                  template.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Stufe {template.difficulty}
                </span>
              </div>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Puzzle className="h-6 w-6 text-white" />
              </div>

              <div className="mb-4">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{template.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-gray-100 px-2 py-1">{template.templateId}</span>
                <span>{template.estimatedHours}h</span>
                <span>{template.steps?.length || 0} Steps</span>
              </div>

              <div className="mb-2 flex flex-wrap gap-1">
                {template.techStack?.slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{tech}</span>
                ))}
                {(template.techStack?.length || 0) > 3 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">+{template.techStack.length - 3}</span>
                )}
              </div>

              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  disabled={deleting === template.id}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting === template.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Loeschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredTemplates.length} Templates</span> insgesamt</p>
      </div>

      {editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          onSaved={(updated) => {
            setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            setEditingTemplate(null);
          }}
          onCancel={() => setEditingTemplate(null)}
        />
      )}
    </div>
  );
}

function CreateTemplateForm({ onCreated, onCancel }: { onCreated: (template: ProjectTemplate) => void; onCancel: () => void }) {
  const [templateId, setTemplateId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [techStack, setTechStack] = useState('[]');
  const [features, setFeatures] = useState('[]');
  const [claudeMd, setClaudeMd] = useState('');
  const [fileStructure, setFileStructure] = useState('');
  const [steps, setSteps] = useState('[]');
  const [githubUrl, setGithubUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState('published');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let parsedTech: string[], parsedFeatures: string[], parsedSteps: unknown[];
      try { parsedTech = JSON.parse(techStack); } catch { setError('TechStack: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedFeatures = JSON.parse(features); } catch { setError('Features: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedSteps = JSON.parse(steps); } catch { setError('Steps: Ungueltiges JSON'); setSaving(false); return; }
      const res = await adminApi.createProjectTemplate({
        templateId, title, description, difficulty, estimatedHours,
        techStack: parsedTech, features: parsedFeatures, claudeMd,
        fileStructure: fileStructure || null, steps: parsedSteps,
        githubUrl: githubUrl || null, sortOrder, status,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neues Template erstellen</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Template ID</label>
          <input type="text" value={templateId} onChange={(e) => setTemplateId(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Schwierigkeit</label>
          <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value={1}>Stufe 1</option>
            <option value={2}>Stufe 2</option>
            <option value={3}>Stufe 3</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Geschaetzte Stunden</label>
          <input type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">GitHub URL (optional)</label>
          <input type="text" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sortierung</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">CLAUDE.md</label>
          <textarea value={claudeMd} onChange={(e) => setClaudeMd(e.target.value)} rows={8}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">File Structure (optional)</label>
          <textarea value={fileStructure} onChange={(e) => setFileStructure(e.target.value)} rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Tech Stack (JSON string[])</label>
          <textarea value={techStack} onChange={(e) => setTechStack(e.target.value)} rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Features (JSON string[])</label>
          <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Steps (JSON)</label>
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} rows={5}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving || !title || !claudeMd}
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

function EditTemplateModal({ template, onSaved, onCancel }: { template: ProjectTemplate; onSaved: (t: ProjectTemplate) => void; onCancel: () => void }) {
  const [templateId, setTemplateId] = useState(template.templateId);
  const [title, setTitle] = useState(template.title);
  const [description, setDescription] = useState(template.description || '');
  const [difficulty, setDifficulty] = useState(template.difficulty);
  const [estimatedHours, setEstimatedHours] = useState(template.estimatedHours);
  const [techStack, setTechStack] = useState(JSON.stringify(template.techStack || [], null, 2));
  const [features, setFeatures] = useState(JSON.stringify(template.features || [], null, 2));
  const [claudeMd, setClaudeMd] = useState(template.claudeMd || '');
  const [fileStructure, setFileStructure] = useState(template.fileStructure || '');
  const [steps, setSteps] = useState(JSON.stringify(template.steps || [], null, 2));
  const [githubUrl, setGithubUrl] = useState(template.githubUrl || '');
  const [sortOrder, setSortOrder] = useState(template.sortOrder);
  const [status, setStatus] = useState(template.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let parsedTech: string[], parsedFeatures: string[], parsedSteps: unknown[];
      try { parsedTech = JSON.parse(techStack); } catch { setError('TechStack: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedFeatures = JSON.parse(features); } catch { setError('Features: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedSteps = JSON.parse(steps); } catch { setError('Steps: Ungueltiges JSON'); setSaving(false); return; }
      const res = await adminApi.updateProjectTemplate(template.id, {
        templateId, title, description, difficulty, estimatedHours,
        techStack: parsedTech, features: parsedFeatures, claudeMd,
        fileStructure: fileStructure || null, steps: parsedSteps,
        githubUrl: githubUrl || null, sortOrder, status,
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
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Template bearbeiten</h2>
          <button onClick={onCancel} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Template ID</label>
            <input type="text" value={templateId} onChange={(e) => setTemplateId(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Schwierigkeit</label>
            <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value={1}>Stufe 1</option>
              <option value={2}>Stufe 2</option>
              <option value={3}>Stufe 3</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Geschaetzte Stunden</label>
            <input type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">GitHub URL (optional)</label>
            <input type="text" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sortierung</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">CLAUDE.md</label>
            <textarea value={claudeMd} onChange={(e) => setClaudeMd(e.target.value)} rows={10}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">File Structure (optional)</label>
            <textarea value={fileStructure} onChange={(e) => setFileStructure(e.target.value)} rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Tech Stack (JSON string[])</label>
            <textarea value={techStack} onChange={(e) => setTechStack(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Features (JSON string[])</label>
            <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Steps (JSON)</label>
            <textarea value={steps} onChange={(e) => setSteps(e.target.value)} rows={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving || !title || !claudeMd}
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
