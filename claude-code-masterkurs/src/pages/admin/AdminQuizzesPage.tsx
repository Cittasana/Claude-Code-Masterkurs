import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  HelpCircle,
  Loader2,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminQuiz } from '../../lib/api';

const quizTypes = [
  'multiple-choice',
  'checklist',
  'code-selection',
  'fill-in',
  'ordering',
];

export function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterLessonId, setFilterLessonId] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<AdminQuiz | null>(null);

  const loadQuizzes = useCallback(async () => {
    try {
      setError(null);
      const res = await adminApi.getQuizzes({
        lessonId: filterLessonId,
      });
      setQuizzes(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [filterLessonId]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const handleDelete = async (id: string) => {
    if (!confirm('Quiz wirklich löschen?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    } finally {
      setDeleting(null);
    }
  };

  const lessonIds = [...new Set(quizzes.map((q) => q.lessonId))].sort((a, b) => a - b);

  const filteredQuizzes = quizzes.filter((q) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(query) ||
        q.quizId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte alle Quiz-Konfigurationen</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neues Quiz
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select
          value={filterLessonId ?? ''}
          onChange={(e) => setFilterLessonId(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Alle Lektionen</option>
          {lessonIds.map((id) => (
            <option key={id} value={id}>Lektion {id}</option>
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
        <CreateQuizForm
          onCreated={(quiz) => {
            setQuizzes((prev) => [...prev, quiz]);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Quizzes Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <HelpCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Quizzes</h3>
          <p className="text-sm text-gray-600">Erstelle dein erstes Quiz.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-700">Quiz ID</th>
                <th className="px-4 py-3 font-medium text-gray-700">Titel</th>
                <th className="px-4 py-3 font-medium text-gray-700">Lektion</th>
                <th className="px-4 py-3 font-medium text-gray-700">Typ</th>
                <th className="px-4 py-3 font-medium text-gray-700">Punkte</th>
                <th className="px-4 py-3 font-medium text-gray-700">Fragen</th>
                <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 font-medium text-gray-700">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{quiz.quizId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{quiz.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      L{quiz.lessonId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{quiz.type}</td>
                  <td className="px-4 py-3 text-gray-600">{quiz.points}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
                      {Array.isArray(quiz.questions) ? quiz.questions.length : 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      quiz.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {quiz.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingQuiz(quiz)}
                        className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        disabled={deleting === quiz.id}
                        className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === quiz.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
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
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredQuizzes.length} Quizzes</span> insgesamt</p>
      </div>

      {editingQuiz && (
        <EditQuizModal
          quiz={editingQuiz}
          onSaved={(updated) => {
            setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
            setEditingQuiz(null);
          }}
          onCancel={() => setEditingQuiz(null)}
        />
      )}
    </div>
  );
}

function CreateQuizForm({ onCreated, onCancel }: { onCreated: (quiz: AdminQuiz) => void; onCancel: () => void }) {
  const [quizId, setQuizId] = useState('');
  const [lessonId, setLessonId] = useState(0);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('multiple-choice');
  const [points, setPoints] = useState(10);
  const [passingScore, setPassingScore] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [questionsJson, setQuestionsJson] = useState('[]');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let questions: unknown[];
      try {
        questions = JSON.parse(questionsJson);
      } catch {
        setError('Ungültiges JSON im Fragen-Feld');
        setSaving(false);
        return;
      }
      const res = await adminApi.createQuiz({
        quizId,
        lessonId,
        title,
        type,
        points,
        passingScore,
        maxAttempts,
        questions,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neues Quiz erstellen</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Quiz ID</label>
          <input type="text" value={quizId} onChange={(e) => setQuizId(e.target.value)} required placeholder="l0-quiz-1"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Lektion ID</label>
          <input type="number" value={lessonId} onChange={(e) => setLessonId(parseInt(e.target.value) || 0)} required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Typ</label>
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            {quizTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Punkte</label>
          <input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Passing Score (%)</label>
          <input type="number" value={passingScore} onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Max. Versuche</label>
          <input type="number" value={maxAttempts} onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 0)}
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Fragen (JSON)</label>
          <textarea value={questionsJson} onChange={(e) => setQuestionsJson(e.target.value)} rows={6}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving || !quizId || !title}
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

function EditQuizModal({ quiz, onSaved, onCancel }: { quiz: AdminQuiz; onSaved: (quiz: AdminQuiz) => void; onCancel: () => void }) {
  const [quizId, setQuizId] = useState(quiz.quizId);
  const [lessonId, setLessonId] = useState(quiz.lessonId);
  const [title, setTitle] = useState(quiz.title);
  const [type, setType] = useState(quiz.type);
  const [points, setPoints] = useState(quiz.points);
  const [passingScore, setPassingScore] = useState(quiz.passingScore);
  const [maxAttempts, setMaxAttempts] = useState(quiz.maxAttempts);
  const [questionsJson, setQuestionsJson] = useState(JSON.stringify(quiz.questions, null, 2));
  const [sortOrder, setSortOrder] = useState(quiz.sortOrder);
  const [status, setStatus] = useState(quiz.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let questions: unknown[];
      try {
        questions = JSON.parse(questionsJson);
      } catch {
        setError('Ungültiges JSON im Fragen-Feld');
        setSaving(false);
        return;
      }
      const res = await adminApi.updateQuiz(quiz.id, {
        quizId,
        lessonId,
        title,
        type,
        points,
        passingScore,
        maxAttempts,
        questions,
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quiz bearbeiten</h2>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Quiz ID</label>
            <input type="text" value={quizId} onChange={(e) => setQuizId(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Lektion ID</label>
            <input type="number" value={lessonId} onChange={(e) => setLessonId(parseInt(e.target.value) || 0)} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Typ</label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              {quizTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Punkte</label>
            <input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Passing Score (%)</label>
            <input type="number" value={passingScore} onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Max. Versuche</label>
            <input type="number" value={maxAttempts} onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 0)}
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Fragen (JSON)</label>
            <textarea value={questionsJson} onChange={(e) => setQuestionsJson(e.target.value)} rows={10}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving || !quizId || !title}
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
