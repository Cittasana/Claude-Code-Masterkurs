import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  BookOpen,
  Loader2,
  AlertCircle,
  Pencil,
  X,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface LessonConfig {
  id: string;
  lessonId: number;
  level: 1 | 2 | 3;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  content: Record<string, unknown>[];
  track: 'main' | 'freelancer';
  sortOrder: number;
  status: string;
}

const trackTabs = [
  { value: 'all', label: 'Alle' },
  { value: 'main', label: 'Main' },
  { value: 'freelancer', label: 'Freelancer' },
];

const levelFilters = [
  { value: 0, label: 'Alle Level' },
  { value: 1, label: 'Level 1' },
  { value: 2, label: 'Level 2' },
  { value: 3, label: 'Level 3' },
];

export function AdminLessonConfigsPage() {
  const [lessons, setLessons] = useState<LessonConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonConfig | null>(null);

  const loadLessons = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getLessonConfigs({
        track: selectedTrack !== 'all' ? selectedTrack : undefined,
        level: selectedLevel || undefined,
        search: searchQuery || undefined,
      });
      setLessons(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [selectedTrack, selectedLevel, searchQuery]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const handleDelete = async (id: string) => {
    if (!confirm('Lektion wirklich loeschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteLessonConfig(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Loeschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const trackCounts = trackTabs.map((t) => ({
    ...t,
    count: t.value === 'all' ? lessons.length : lessons.filter((l) => l.track === t.value).length,
  }));

  const filteredLessons = lessons.filter((l) => {
    if (selectedTrack !== 'all' && l.track !== selectedTrack) return false;
    if (selectedLevel && l.level !== selectedLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lesson Configs</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte Lektionen (Main + Freelancer Track)</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neue Lektion
        </button>
      </div>

      {/* Track Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {trackCounts.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedTrack(tab.value)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedTrack === tab.value
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              selectedTrack === tab.value ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Level Filter */}
      <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
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
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {levelFilters.map((lf) => (
            <option key={lf.value} value={lf.value}>{lf.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <CreateLessonForm
          onCreated={(lesson) => {
            setLessons((prev) => [...prev, lesson]);
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
      ) : filteredLessons.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Lektionen</h3>
          <p className="text-sm text-gray-600">Erstelle deine erste Lektion.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Titel</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3">Dauer</th>
                <th className="px-4 py-3">Bloecke</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{lesson.lessonId}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{lesson.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{lesson.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      lesson.level === 1 ? 'bg-green-100 text-green-700' :
                      lesson.level === 2 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Level {lesson.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      lesson.track === 'main' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {lesson.track}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lesson.duration}</td>
                  <td className="px-4 py-3 text-gray-600">{Array.isArray(lesson.content) ? lesson.content.length : 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      lesson.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {lesson.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingLesson(lesson)}
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        disabled={deleting === lesson.id}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === lesson.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
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
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredLessons.length} Lektionen</span> insgesamt</p>
      </div>

      {editingLesson && (
        <EditLessonModal
          lesson={editingLesson}
          onSaved={(updated) => {
            setLessons((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
            setEditingLesson(null);
          }}
          onCancel={() => setEditingLesson(null)}
        />
      )}
    </div>
  );
}

function CreateLessonForm({ onCreated, onCancel }: { onCreated: (lesson: LessonConfig) => void; onCancel: () => void }) {
  const [lessonId, setLessonId] = useState(0);
  const [level, setLevel] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [objectives, setObjectives] = useState('[]');
  const [content, setContent] = useState('[]');
  const [track, setTrack] = useState('main');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState('active');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let parsedObjectives: string[];
      let parsedContent: Record<string, unknown>[];
      try { parsedObjectives = JSON.parse(objectives); } catch { setError('Objectives: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedContent = JSON.parse(content); } catch { setError('Content: Ungueltiges JSON'); setSaving(false); return; }
      const res = await adminApi.createLessonConfig({
        lessonId, level, title, description, duration,
        objectives: parsedObjectives, content: parsedContent,
        track, sortOrder, status,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neue Lektion erstellen</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Lesson ID</label>
          <input type="number" value={lessonId} onChange={(e) => setLessonId(parseInt(e.target.value) || 0)} required
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Track</label>
          <select value={track} onChange={(e) => setTrack(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="main">Main</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Dauer</label>
          <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="z.B. 30min"
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Objectives (JSON string[])</label>
          <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Content (JSON LessonContent[])</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5}
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

function EditLessonModal({ lesson, onSaved, onCancel }: { lesson: LessonConfig; onSaved: (lesson: LessonConfig) => void; onCancel: () => void }) {
  const [lessonId, setLessonId] = useState(lesson.lessonId);
  const [level, setLevel] = useState(lesson.level);
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description || '');
  const [duration, setDuration] = useState(lesson.duration || '');
  const [objectives, setObjectives] = useState(JSON.stringify(lesson.objectives || [], null, 2));
  const [content, setContent] = useState(JSON.stringify(lesson.content || [], null, 2));
  const [track, setTrack] = useState(lesson.track);
  const [sortOrder, setSortOrder] = useState(lesson.sortOrder);
  const [status, setStatus] = useState(lesson.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let parsedObjectives: string[];
      let parsedContent: Record<string, unknown>[];
      try { parsedObjectives = JSON.parse(objectives); } catch { setError('Objectives: Ungueltiges JSON'); setSaving(false); return; }
      try { parsedContent = JSON.parse(content); } catch { setError('Content: Ungueltiges JSON'); setSaving(false); return; }
      const res = await adminApi.updateLessonConfig(lesson.id, {
        lessonId, level, title, description, duration,
        objectives: parsedObjectives, content: parsedContent,
        track, sortOrder, status,
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
          <h2 className="text-lg font-bold text-gray-900">Lektion bearbeiten</h2>
          <button onClick={onCancel} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Lesson ID</label>
            <input type="number" value={lessonId} onChange={(e) => setLessonId(parseInt(e.target.value) || 0)} required
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Track</label>
            <select value={track} onChange={(e) => setTrack(e.target.value as 'main' | 'freelancer')}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="main">Main</option>
              <option value="freelancer">Freelancer</option>
            </select>
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Objectives (JSON string[])</label>
            <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Content (JSON LessonContent[])</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8}
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
