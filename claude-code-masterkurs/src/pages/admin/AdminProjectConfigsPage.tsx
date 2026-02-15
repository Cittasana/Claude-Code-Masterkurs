import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  FolderKanban,
  Loader2,
  AlertCircle,
  Pencil,
  X,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface ProjectConfig {
  id: string;
  projectId: string;
  level: 1 | 2 | 3;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  requirements: string[];
  starterCode?: string;
  hints: string[];
  solution?: string;
  resources: string[];
  validationMeta: Record<string, unknown>;
  sortOrder: number;
  status: string;
}

const levelFilters = [
  { value: 0, label: 'Alle Level' },
  { value: 1, label: 'Level 1' },
  { value: 2, label: 'Level 2' },
  { value: 3, label: 'Level 3' },
];

export function AdminProjectConfigsPage() {
  const [projects, setProjects] = useState<ProjectConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectConfig | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getProjectConfigs({
        level: selectedLevel || undefined,
        search: searchQuery || undefined,
      });
      setProjects(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [selectedLevel, searchQuery]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm('Projekt wirklich loeschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteProjectConfig(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Loeschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedLevel && p.level !== selectedLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Configs</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte Projekt-Konfigurationen</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neues Projekt
        </button>
      </div>

      {/* Level Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {levelFilters.map((lf) => (
          <button
            key={lf.value}
            onClick={() => setSelectedLevel(lf.value)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedLevel === lf.value
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {lf.label}
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              selectedLevel === lf.value ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {lf.value === 0 ? projects.length : projects.filter((p) => p.level === lf.value).length}
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
            placeholder="Suche Projekte..."
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

      {/* Create Form */}
      {showCreateForm && (
        <CreateProjectForm
          onCreated={(project) => {
            setProjects((prev) => [...prev, project]);
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
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <FolderKanban className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Projekte</h3>
          <p className="text-sm text-gray-600">Erstelle dein erstes Projekt.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute right-4 top-4 flex gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  project.level === 1 ? 'bg-green-100 text-green-700' :
                  project.level === 2 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Level {project.level}
                </span>
              </div>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <FolderKanban className="h-6 w-6 text-white" />
              </div>

              <div className="mb-4">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-gray-100 px-2 py-1">#{String(project.sortOrder).padStart(2, '0')}</span>
                <span>{project.projectId}</span>
                {project.difficulty && <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700">{project.difficulty}</span>}
                {project.duration && <span>{project.duration}</span>}
              </div>

              <div className="mb-2 text-xs text-gray-500">
                {project.requirements?.length || 0} Requirements | {project.hints?.length || 0} Hints | {project.resources?.length || 0} Resources
              </div>

              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setEditingProject(project)}
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deleting === project.id}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting === project.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Loeschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredProjects.length} Projekte</span> insgesamt</p>
      </div>

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onSaved={(updated) => {
            setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingProject(null);
          }}
          onCancel={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}

function CreateProjectForm({ onCreated, onCancel }: { onCreated: (project: ProjectConfig) => void; onCancel: () => void }) {
  const [projectId, setProjectId] = useState('');
  const [level, setLevel] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [duration, setDuration] = useState('');
  const [requirements, setRequirements] = useState('[]');
  const [starterCode, setStarterCode] = useState('');
  const [hints, setHints] = useState('[]');
  const [solution, setSolution] = useState('');
  const [resources, setResources] = useState('[]');
  const [validationMeta, setValidationMeta] = useState('{}');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState('active');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let parsedReqs: string[], parsedHints: string[], parsedResources: string[], parsedValidation: Record<string, unknown>;
      try { parsedReqs = JSON.parse(requirements); } catch { setError('Requirements: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedHints = JSON.parse(hints); } catch { setError('Hints: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedResources = JSON.parse(resources); } catch { setError('Resources: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedValidation = JSON.parse(validationMeta); } catch { setError('ValidationMeta: Ungueltiges JSON'); setSaving(false); return; }
      const res = await adminApi.createProjectConfig({
        projectId, level, title, description, difficulty, duration,
        requirements: parsedReqs, starterCode: starterCode || undefined,
        hints: parsedHints, solution: solution || undefined,
        resources: parsedResources, validationMeta: parsedValidation,
        sortOrder, status,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neues Projekt erstellen</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Project ID</label>
          <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} required
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Level</label>
          <select value={level} onChange={(e) => setLevel(parseInt(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Schwierigkeit</label>
          <input type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Dauer</label>
          <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)}
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Requirements (JSON string[])</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Starter Code</label>
          <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)} rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Hints (JSON string[])</label>
          <textarea value={hints} onChange={(e) => setHints(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Solution</label>
          <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Resources (JSON string[])</label>
          <textarea value={resources} onChange={(e) => setResources(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Validation Meta (JSON)</label>
          <textarea value={validationMeta} onChange={(e) => setValidationMeta(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving || !title}
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

function EditProjectModal({ project, onSaved, onCancel }: { project: ProjectConfig; onSaved: (project: ProjectConfig) => void; onCancel: () => void }) {
  const [projectId, setProjectId] = useState(project.projectId);
  const [level, setLevel] = useState(project.level);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || '');
  const [difficulty, setDifficulty] = useState(project.difficulty || '');
  const [duration, setDuration] = useState(project.duration || '');
  const [requirements, setRequirements] = useState(JSON.stringify(project.requirements || [], null, 2));
  const [starterCode, setStarterCode] = useState(project.starterCode || '');
  const [hints, setHints] = useState(JSON.stringify(project.hints || [], null, 2));
  const [solution, setSolution] = useState(project.solution || '');
  const [resources, setResources] = useState(JSON.stringify(project.resources || [], null, 2));
  const [validationMeta, setValidationMeta] = useState(JSON.stringify(project.validationMeta || {}, null, 2));
  const [sortOrder, setSortOrder] = useState(project.sortOrder);
  const [status, setStatus] = useState(project.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let parsedReqs: string[], parsedHints: string[], parsedResources: string[], parsedValidation: Record<string, unknown>;
      try { parsedReqs = JSON.parse(requirements); } catch { setError('Requirements: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedHints = JSON.parse(hints); } catch { setError('Hints: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedResources = JSON.parse(resources); } catch { setError('Resources: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedValidation = JSON.parse(validationMeta); } catch { setError('ValidationMeta: Ungueltiges JSON'); setSaving(false); return; }
      const res = await adminApi.updateProjectConfig(project.id, {
        projectId, level, title, description, difficulty, duration,
        requirements: parsedReqs, starterCode: starterCode || undefined,
        hints: parsedHints, solution: solution || undefined,
        resources: parsedResources, validationMeta: parsedValidation,
        sortOrder, status,
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Projekt bearbeiten</h2>
          <button onClick={onCancel} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Project ID</label>
            <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} required
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Level</label>
            <select value={level} onChange={(e) => setLevel(parseInt(e.target.value) as 1 | 2 | 3)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value={1}>Level 1</option>
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Schwierigkeit</label>
            <input type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dauer</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)}
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
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Requirements (JSON string[])</label>
            <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Starter Code</label>
            <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)} rows={5}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Hints (JSON string[])</label>
            <textarea value={hints} onChange={(e) => setHints(e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Solution</label>
            <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={5}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Resources (JSON string[])</label>
            <textarea value={resources} onChange={(e) => setResources(e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Validation Meta (JSON)</label>
            <textarea value={validationMeta} onChange={(e) => setValidationMeta(e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving || !title}
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
