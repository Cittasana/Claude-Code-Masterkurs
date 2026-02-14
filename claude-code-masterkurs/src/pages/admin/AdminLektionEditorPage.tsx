import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TiptapEditor } from '../../components/editor/TiptapEditor';
import {
  Save,
  Eye,
  Sparkles,
  ArrowLeft,
  Globe,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

export function AdminLektionEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';

  const [titel, setTitel] = useState('');
  const [slug, setSlug] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [kategorie, setKategorie] = useState('basics');
  const [reihenfolge, setReihenfolge] = useState(0);
  const [content, setContent] = useState('<p>Starte hier mit dem Content...</p>');
  const [showResearchPanel, setShowResearchPanel] = useState(false);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Load existing lektion
  useEffect(() => {
    if (isNew || !id) return;
    adminApi.getLektion(id)
      .then((res) => {
        const l = res.data;
        setTitel(l.titel);
        setSlug(l.slug);
        setBeschreibung(l.beschreibung || '');
        setKategorie(l.kategorie);
        setReihenfolge(l.reihenfolge);
        setContent(l.content);
      })
      .catch((err) => setError(err.message || 'Lektion nicht gefunden'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  // Auto-generate slug from title for new lektionen
  useEffect(() => {
    if (!isNew) return;
    setSlug(
      titel
        .toLowerCase()
        .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    );
  }, [titel, isNew]);

  const handleSave = async (status?: string) => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const payload = {
        titel,
        slug,
        beschreibung: beschreibung || undefined,
        content,
        kategorie,
        reihenfolge,
        ...(status && { status }),
      };

      if (isNew) {
        const res = await adminApi.createLektion({ ...payload, status: status || 'draft' });
        setSaved(true);
        setTimeout(() => navigate(`/admin/lektionen/${res.data.id}`), 500);
      } else {
        await adminApi.updateLektion(id!, payload);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6">
      {/* Main Editor */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/lektionen')}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isNew ? 'Neue Lektion' : 'Lektion bearbeiten'}
              </h1>
              {!isNew && <p className="text-sm text-gray-600">ID: {id}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {error && (
              <span className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />{error}
              </span>
            )}
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="h-4 w-4" />Gespeichert
              </span>
            )}
            <button
              onClick={() => setShowResearchPanel(!showResearchPanel)}
              className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
            >
              <Sparkles className="h-4 w-4" />
              Research Agent
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <Eye className="h-4 w-4" />
              Vorschau
            </button>
            <button
              onClick={() => handleSave()}
              disabled={saving || !titel || !content}
              className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Speichern
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving || !titel || !content}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              <Globe className="h-4 w-4" />
              Veröffentlichen
            </button>
          </div>
        </div>

        {/* Meta Fields */}
        <div className="grid gap-4 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Titel</label>
            <input
              type="text"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              placeholder="z.B. 01 - Einführung in Claude Code"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
            <textarea
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kategorie</label>
            <select
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="basics">Basics</option>
              <option value="fortgeschritten">Fortgeschritten</option>
              <option value="experten">Experten</option>
              <option value="tools">Tools & Extensions</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Reihenfolge</label>
            <input
              type="number"
              value={reihenfolge}
              onChange={(e) => setReihenfolge(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="flex-1 overflow-hidden">
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Research Agent Panel */}
      {showResearchPanel && (
        <div className="w-96 space-y-4 overflow-y-auto">
          <ResearchPanel />
        </div>
      )}
    </div>
  );
}

function ResearchPanel() {
  const [topic, setTopic] = useState('');
  const [quelle, setQuelle] = useState('web');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Array<{ title: string; url: string; excerpt: string; relevance: number }>>([]);

  const handleSearch = async () => {
    if (!topic) return;
    setSearching(true);
    try {
      const res = await adminApi.triggerResearch(topic, quelle);
      setResults(res.data.results);
    } catch {
      // silently handle
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Research Agent</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Topic</label>
            <input
              type="text"
              placeholder="z.B. 'Python async/await patterns'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Quelle</label>
            <select
              value={quelle}
              onChange={(e) => setQuelle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="web">Web Search</option>
              <option value="github">GitHub</option>
              <option value="stackoverflow">Stack Overflow</option>
              <option value="docs">Official Docs</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            disabled={!topic || searching}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {searching ? 'Suche...' : 'Research starten'}
          </button>
        </div>
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Ergebnisse</h3>
        {results.length === 0 ? (
          <p className="text-sm text-gray-500">Starte eine Recherche, um Ergebnisse zu sehen...</p>
        ) : (
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="rounded-lg border p-3">
                <p className="text-sm font-medium text-gray-900">{r.title}</p>
                <p className="mt-1 text-xs text-gray-600">{r.excerpt}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">{r.relevance}%</span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Quelle</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
