import { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Pencil,
} from 'lucide-react';
import { adminApi } from '../../lib/api';

interface AdminPromoCode {
  id: string;
  code: string;
  description: string | null;
  durationMonths: number;
  maxUses: number | null;
  timesUsed: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  _count?: { subscriptions: number };
}

export function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<AdminPromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    adminApi.getPromoCodes()
      .then((res) => setCodes(res.data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const res = await adminApi.updatePromoCode(id, { active: !active });
      setCodes((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Fehler');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Promo Code wirklich löschen?')) return;
    try {
      await adminApi.deletePromoCode(id);
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Codes</h1>
          <p className="mt-1 text-sm text-gray-600">Erstelle und verwalte Gutschein-Codes</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />Neuer Code
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showCreate && (
        <CreatePromoCodeForm
          onCreated={(code) => { setCodes((prev) => [code, ...prev]); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : codes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <Ticket className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Keine Promo Codes</h3>
          <p className="text-sm text-gray-600">Erstelle deinen ersten Promo Code.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {codes.map((code) => (
            <div key={code.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-lg bg-purple-100 px-3 py-1.5 font-mono text-sm font-bold text-purple-700">
                  {code.code}
                </span>
                <button
                  onClick={() => handleToggleActive(code.id, code.active)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {code.active ? (
                    <ToggleRight className="h-6 w-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
              {code.description && (
                <p className="mb-3 text-sm text-gray-600">{code.description}</p>
              )}
              <div className="mb-4 space-y-1.5 text-xs text-gray-500">
                <p>Dauer: <span className="font-medium text-gray-700">{code.durationMonths} Monate</span></p>
                <p>Nutzungen: <span className="font-medium text-gray-700">{code.timesUsed}{code.maxUses ? ` / ${code.maxUses}` : ' (unbegrenzt)'}</span></p>
                {code.expiresAt && (
                  <p>Ablauf: <span className="font-medium text-gray-700">{new Date(code.expiresAt).toLocaleDateString('de-DE')}</span></p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${code.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {code.active ? 'Aktiv' : 'Inaktiv'}
                </span>
                <div className="flex-1" />
                <button
                  onClick={() => handleDelete(code.id)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreatePromoCodeForm({ onCreated, onCancel }: { onCreated: (code: AdminPromoCode) => void; onCancel: () => void }) {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [durationMonths, setDurationMonths] = useState(6);
  const [maxUses, setMaxUses] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.createPromoCode({
        code: code.toUpperCase(),
        description: description || undefined,
        durationMonths,
        maxUses: maxUses ? parseInt(maxUses) : null,
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
      <h2 className="mb-4 text-lg font-bold text-gray-900">Neuer Promo Code</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="z.B. WELCOME2026"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Dauer (Monate)</label>
          <input type="number" value={durationMonths} onChange={(e) => setDurationMonths(parseInt(e.target.value) || 1)} min={1}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Beschreibung</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Max. Nutzungen</label>
          <input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Leer = unbegrenzt" min={1}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" disabled={saving || !code}
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
