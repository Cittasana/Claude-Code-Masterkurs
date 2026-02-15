import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Play,
  Loader2,
  AlertCircle,
  Pencil,
  X,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface PlaygroundTask {
  id: string;
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  instruction: string;
  requirements: string[];
  mode: string;
  language: string;
  starterCode: string;
  hints: string[];
  validationMeta: unknown[];
  scenarioMeta: unknown | null;
  sortOrder: number;
  status: string;
}

export function AdminPlaygroundTasksPage() {
  const [tasks, setTasks] = useState<PlaygroundTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<PlaygroundTask | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getPlaygroundTasks({
        projectId: projectFilter || undefined,
      });
      setTasks(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [projectFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDelete = async (id: string) => {
    if (!confirm('Playground Task wirklich loeschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deletePlaygroundTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Loeschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const projectIds = [...new Set(tasks.map((t) => t.projectId))].sort();

  const filteredTasks = tasks.filter((t) => {
    if (modeFilter && t.mode !== modeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.taskId.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Playground Tasks</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte interaktive Playground-Aufgaben</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neuer Task
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Alle Projekte</option>
          {projectIds.map((pid) => (
            <option key={pid} value={pid}>{pid}</option>
          ))}
        </select>
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Alle Modi</option>
          <option value="editor">Editor</option>
          <option value="terminal">Terminal</option>
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showCreateForm && (
        <CreateTaskForm
          onCreated={(task) => {
            setTasks((prev) => [...prev, task]);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <Play className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Tasks</h3>
          <p className="text-sm text-gray-600">Erstelle deinen ersten Playground-Task.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Task ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Titel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Projekt</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mode</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Sprache</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{task.taskId}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.projectId}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      task.mode === 'editor' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {task.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.language}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      task.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        disabled={deleting === task.id}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        {deleting === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredTasks.length} Tasks</span> insgesamt</p>
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSaved={(updated) => {
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            setEditingTask(null);
          }}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

function CreateTaskForm({ onCreated, onCancel }: { onCreated: (task: PlaygroundTask) => void; onCancel: () => void }) {
  const [taskId, setTaskId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
  const [requirements, setRequirements] = useState('[]');
  const [mode, setMode] = useState('editor');
  const [language, setLanguage] = useState('typescript');
  const [starterCode, setStarterCode] = useState('');
  const [hints, setHints] = useState('[]');
  const [validationMeta, setValidationMeta] = useState('[]');
  const [scenarioMeta, setScenarioMeta] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState('published');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let parsedReqs: string[], parsedHints: string[], parsedValidation: unknown[], parsedScenario: unknown | null = null;
      try { parsedReqs = JSON.parse(requirements); } catch { setError('Requirements: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedHints = JSON.parse(hints); } catch { setError('Hints: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedValidation = JSON.parse(validationMeta); } catch { setError('Validations: Ungueltiges JSON'); setSaving(false); return; }
      if (scenarioMeta.trim()) {
        try { parsedScenario = JSON.parse(scenarioMeta); } catch { setError('Scenario: Ungueltiges JSON'); setSaving(false); return; }
      }
      const res = await adminApi.createPlaygroundTask({
        taskId, projectId, title, description, instruction,
        requirements: parsedReqs, mode, language, starterCode,
        hints: parsedHints, validationMeta: parsedValidation,
        scenarioMeta: parsedScenario, sortOrder, status,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neuer Playground Task</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Task ID</label>
          <input type="text" value={taskId} onChange={(e) => setTaskId(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Projekt ID</label>
          <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="editor">Editor</option>
            <option value="terminal">Terminal</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sprache</label>
          <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)}
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Instruction</label>
          <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Starter Code</label>
          <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)} rows={5}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Requirements (JSON string[])</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Hints (JSON string[])</label>
          <textarea value={hints} onChange={(e) => setHints(e.target.value)} rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Validations (JSON)</label>
          <textarea value={validationMeta} onChange={(e) => setValidationMeta(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Scenario (JSON, optional - nur fuer Terminal-Mode)</label>
          <textarea value={scenarioMeta} onChange={(e) => setScenarioMeta(e.target.value)} rows={3} placeholder="{}"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving || !title || !taskId}
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

function EditTaskModal({ task, onSaved, onCancel }: { task: PlaygroundTask; onSaved: (t: PlaygroundTask) => void; onCancel: () => void }) {
  const [taskId, setTaskId] = useState(task.taskId);
  const [projectId, setProjectId] = useState(task.projectId);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [instruction, setInstruction] = useState(task.instruction || '');
  const [requirements, setRequirements] = useState(JSON.stringify(task.requirements || [], null, 2));
  const [mode, setMode] = useState(task.mode);
  const [language, setLanguage] = useState(task.language);
  const [starterCode, setStarterCode] = useState(task.starterCode || '');
  const [hints, setHints] = useState(JSON.stringify(task.hints || [], null, 2));
  const [validationMeta, setValidationMeta] = useState(JSON.stringify(task.validationMeta || [], null, 2));
  const [scenarioMeta, setScenarioMeta] = useState(task.scenarioMeta ? JSON.stringify(task.scenarioMeta, null, 2) : '');
  const [sortOrder, setSortOrder] = useState(task.sortOrder);
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let parsedReqs: string[], parsedHints: string[], parsedValidation: unknown[], parsedScenario: unknown | null = null;
      try { parsedReqs = JSON.parse(requirements); } catch { setError('Requirements: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedHints = JSON.parse(hints); } catch { setError('Hints: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedValidation = JSON.parse(validationMeta); } catch { setError('Validations: Ungueltiges JSON'); setSaving(false); return; }
      if (scenarioMeta.trim()) {
        try { parsedScenario = JSON.parse(scenarioMeta); } catch { setError('Scenario: Ungueltiges JSON'); setSaving(false); return; }
      }
      const res = await adminApi.updatePlaygroundTask(task.id, {
        taskId, projectId, title, description, instruction,
        requirements: parsedReqs, mode, language, starterCode,
        hints: parsedHints, validationMeta: parsedValidation,
        scenarioMeta: parsedScenario, sortOrder, status,
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
          <h2 className="text-lg font-bold text-gray-900">Task bearbeiten</h2>
          <button onClick={onCancel} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Task ID</label>
            <input type="text" value={taskId} onChange={(e) => setTaskId(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Projekt ID</label>
            <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="editor">Editor</option>
              <option value="terminal">Terminal</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sprache</label>
            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)}
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Instruction</label>
            <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Starter Code</label>
            <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)} rows={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Requirements (JSON string[])</label>
            <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Hints (JSON string[])</label>
            <textarea value={hints} onChange={(e) => setHints(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Validations (JSON)</label>
            <textarea value={validationMeta} onChange={(e) => setValidationMeta(e.target.value)} rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Scenario (JSON, optional)</label>
            <textarea value={scenarioMeta} onChange={(e) => setScenarioMeta(e.target.value)} rows={4} placeholder="{}"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving || !title || !taskId}
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
