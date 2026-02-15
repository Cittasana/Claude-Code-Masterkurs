import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Code2,
  Loader2,
  AlertCircle,
  Pencil,
  Filter,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminChallenge } from '../../lib/api';

const sourceTabs = [
  { value: 'all', label: 'Alle' },
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'live-coding', label: 'Live Coding' },
];

const difficulties = ['Anfänger', 'Fortgeschritten', 'Expert'];

export function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<AdminChallenge | null>(null);

  const loadChallenges = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getChallenges({
        source: selectedSource === 'all' ? undefined : selectedSource,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
      });
      setChallenges(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [selectedSource, selectedCategory]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const handleDelete = async (id: string) => {
    if (!confirm('Challenge wirklich löschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteChallenge(id);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const categories = [...new Set(challenges.map((c) => c.category))].sort();

  const sourceCounts = sourceTabs.map((s) => ({
    ...s,
    count: s.value === 'all' ? challenges.length : challenges.filter((c) => c.source === s.value).length,
  }));

  const filteredChallenges = challenges.filter((c) => {
    if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(query) ||
        c.challengeId.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte alle Coding-Challenges</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neue Challenge
        </button>
      </div>

      {/* Source Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sourceCounts.map((source) => (
          <button
            key={source.value}
            onClick={() => setSelectedSource(source.value)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedSource === source.value
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {source.label}
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              selectedSource === source.value ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {source.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Alle Kategorien</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Alle Schwierigkeiten</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
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
        <CreateChallengeForm
          onCreated={(challenge) => {
            setChallenges((prev) => [...prev, challenge]);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Challenges Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <Code2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Challenges</h3>
          <p className="text-sm text-gray-600">Erstelle deine erste Challenge.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute right-4 top-4 flex gap-1">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  challenge.difficulty === 'Anfänger' ? 'bg-green-50 text-green-700' :
                  challenge.difficulty === 'Fortgeschritten' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {challenge.difficulty}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  challenge.status === 'published'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {challenge.status}
                </span>
              </div>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Code2 className="h-6 w-6 text-white" />
              </div>

              <div className="mb-4">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{challenge.title}</h3>
                <p className="line-clamp-2 text-sm text-gray-600">{challenge.description}</p>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-gray-100 px-2 py-1">{challenge.challengeId}</span>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">{challenge.source}</span>
                {challenge.category && (
                  <span className="rounded-full bg-purple-50 px-2 py-1 text-purple-700">{challenge.category}</span>
                )}
                <span className="rounded-full bg-gray-100 px-2 py-1">{challenge.points} Pkt</span>
                {challenge.timeLimit > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-1">{Math.floor(challenge.timeLimit / 60)} Min</span>
                )}
              </div>

              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setEditingChallenge(challenge)}
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(challenge.id)}
                  disabled={deleting === challenge.id}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting === challenge.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredChallenges.length} Challenges</span> insgesamt</p>
      </div>

      {editingChallenge && (
        <EditChallengeModal
          challenge={editingChallenge}
          onSaved={(updated) => {
            setChallenges((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            setEditingChallenge(null);
          }}
          onCancel={() => setEditingChallenge(null)}
        />
      )}
    </div>
  );
}

function CreateChallengeForm({ onCreated, onCancel }: { onCreated: (challenge: AdminChallenge) => void; onCancel: () => void }) {
  const [challengeId, setChallengeId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('claude-code');
  const [difficulty, setDifficulty] = useState('Anfänger');
  const [timeLimit, setTimeLimit] = useState(300);
  const [points, setPoints] = useState(10);
  const [instruction, setInstruction] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [hintsJson, setHintsJson] = useState('[]');
  const [validationsJson, setValidationsJson] = useState('[]');
  const [solution, setSolution] = useState('');
  const [relatedLessonsJson, setRelatedLessonsJson] = useState('[]');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let hints: string[];
      let validations: unknown[];
      let relatedLessons: number[];
      try {
        hints = JSON.parse(hintsJson);
        validations = JSON.parse(validationsJson);
        relatedLessons = JSON.parse(relatedLessonsJson);
      } catch {
        setError('Ungültiges JSON in einem der JSON-Felder');
        setSaving(false);
        return;
      }
      const res = await adminApi.createChallenge({
        challengeId,
        title,
        description,
        category,
        source,
        difficulty,
        timeLimit,
        points,
        instruction,
        starterCode,
        language,
        hints,
        validations,
        solution,
        relatedLessons,
        sortOrder,
        status,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neue Challenge erstellen</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Challenge ID</label>
          <input type="text" value={challengeId} onChange={(e) => setChallengeId(e.target.value)} required placeholder="ch-01"
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Kategorie</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="claude-code">Claude Code</option>
            <option value="live-coding">Live Coding</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Schwierigkeit</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            {difficulties.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sprache</label>
          <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Zeitlimit (Sekunden)</label>
          <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Punkte</label>
          <input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Aufgabenstellung</label>
          <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Starter Code</label>
          <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)} rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Lösung</label>
          <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Hints (JSON Array)</label>
          <textarea value={hintsJson} onChange={(e) => setHintsJson(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Validations (JSON Array)</label>
          <textarea value={validationsJson} onChange={(e) => setValidationsJson(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Related Lessons (JSON Array)</label>
          <textarea value={relatedLessonsJson} onChange={(e) => setRelatedLessonsJson(e.target.value)} rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving || !challengeId || !title}
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

function EditChallengeModal({ challenge, onSaved, onCancel }: { challenge: AdminChallenge; onSaved: (challenge: AdminChallenge) => void; onCancel: () => void }) {
  const [challengeId, setChallengeId] = useState(challenge.challengeId);
  const [title, setTitle] = useState(challenge.title);
  const [description, setDescription] = useState(challenge.description || '');
  const [category, setCategory] = useState(challenge.category || '');
  const [source, setSource] = useState(challenge.source);
  const [difficulty, setDifficulty] = useState(challenge.difficulty);
  const [timeLimit, setTimeLimit] = useState(challenge.timeLimit);
  const [points, setPoints] = useState(challenge.points);
  const [instruction, setInstruction] = useState(challenge.instruction || '');
  const [starterCode, setStarterCode] = useState(challenge.starterCode || '');
  const [language, setLanguage] = useState(challenge.language || '');
  const [hintsJson, setHintsJson] = useState(JSON.stringify(challenge.hints || [], null, 2));
  const [validationsJson, setValidationsJson] = useState(JSON.stringify(challenge.validations || [], null, 2));
  const [solution, setSolution] = useState(challenge.solution || '');
  const [relatedLessonsJson, setRelatedLessonsJson] = useState(JSON.stringify(challenge.relatedLessons || [], null, 2));
  const [sortOrder, setSortOrder] = useState(challenge.sortOrder);
  const [status, setStatus] = useState(challenge.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let hints: string[];
      let validations: unknown[];
      let relatedLessons: number[];
      try {
        hints = JSON.parse(hintsJson);
        validations = JSON.parse(validationsJson);
        relatedLessons = JSON.parse(relatedLessonsJson);
      } catch {
        setError('Ungültiges JSON in einem der JSON-Felder');
        setSaving(false);
        return;
      }
      const res = await adminApi.updateChallenge(challenge.id, {
        challengeId,
        title,
        description,
        category,
        source,
        difficulty,
        timeLimit,
        points,
        instruction,
        starterCode,
        language,
        hints,
        validations,
        solution,
        relatedLessons,
        sortOrder,
        status,
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
        <h2 className="mb-4 text-lg font-bold text-gray-900">Challenge bearbeiten</h2>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Challenge ID</label>
            <input type="text" value={challengeId} onChange={(e) => setChallengeId(e.target.value)} required
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Kategorie</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="claude-code">Claude Code</option>
              <option value="live-coding">Live Coding</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Schwierigkeit</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sprache</label>
            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Zeitlimit (Sekunden)</label>
            <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Punkte</label>
            <input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Aufgabenstellung</label>
            <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Starter Code</label>
            <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)} rows={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Lösung</label>
            <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Hints (JSON Array)</label>
            <textarea value={hintsJson} onChange={(e) => setHintsJson(e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Validations (JSON Array)</label>
            <textarea value={validationsJson} onChange={(e) => setValidationsJson(e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Related Lessons (JSON Array)</label>
            <textarea value={relatedLessonsJson} onChange={(e) => setRelatedLessonsJson(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving || !challengeId || !title}
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
