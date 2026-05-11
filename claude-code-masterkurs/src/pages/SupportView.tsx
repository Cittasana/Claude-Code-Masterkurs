import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { LifeBuoy, Plus, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ticketsApi, type SupportTicket } from '../lib/api';

// ── Status Badge ──────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    in_progress: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    resolved: 'bg-green-500/15 text-green-400 border-green-500/30',
    closed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };

  const labels: Record<string, string> = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    resolved: 'Geloest',
    closed: 'Geschlossen',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.open}`}>
      {labels[status] || status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: 'text-gray-400',
    normal: 'text-blue-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  };

  const labels: Record<string, string> = {
    low: 'Niedrig',
    normal: 'Normal',
    high: 'Hoch',
    urgent: 'Dringend',
  };

  return (
    <span className={`text-xs ${styles[priority] || styles.normal}`}>
      {labels[priority] || priority}
    </span>
  );
}

// ── Main Component ──────────────────────────────────────────

const SupportView = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await ticketsApi.getAll();
      setTickets(data.tickets);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await ticketsApi.create({ subject: subject.trim(), priority });
      setSubject('');
      setPriority('normal');
      setShowForm(false);
      await fetchTickets();
    } catch {
      setError('Ticket konnte nicht erstellt werden. Bitte versuche es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-32">
        <Helmet>
          <title>Support - Claude Code Masterkurs</title>
        </Helmet>
        <div className="eyebrow center mb-6"><LifeBuoy size={12} /><span>Support</span></div>
        <h1 className="text-[clamp(32px,4.4vw,52px)] font-semibold text-apple-text mb-4 tracking-[-0.038em] leading-[1.04]">
          <em className="italic-serif">Support</em>
        </h1>
        <p className="text-apple-textSecondary mb-6 max-w-md mx-auto">
          Bitte melde dich an, um ein Support-Ticket zu erstellen.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Helmet>
        <title>Support - Claude Code Masterkurs</title>
      </Helmet>

      {/* Header — Ethereal */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
        <div>
          <div className="eyebrow mb-4"><LifeBuoy size={12} /><span>Support-Center</span></div>
          <h1 className="text-[clamp(32px,4.4vw,52px)] font-semibold text-apple-text tracking-[-0.038em] leading-[1.04]">
            <em className="italic-serif">{t('support.title', 'Support')}</em>
          </h1>
          <p className="text-apple-textSecondary mt-3 leading-relaxed">
            {t('support.subtitle', 'Erstelle ein Ticket und wir helfen dir weiter.')}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Abbrechen' : 'Neues Ticket'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-apple bg-apple-error/10 border border-apple-error/20 text-sm text-apple-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="apple-card mb-6">
          <h2 className="text-lg font-semibold text-apple-text mb-4">Neues Support-Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                Betreff
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Beschreibe dein Problem kurz..."
                required
                minLength={3}
                maxLength={200}
                className="w-full px-4 py-3 rounded-apple bg-apple-bg border border-apple-border text-apple-text placeholder:text-apple-muted/50 focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/30 transition-colors text-sm"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
                Prioritaet
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 rounded-apple bg-apple-bg border border-apple-border text-apple-text focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/30 transition-colors text-sm"
              >
                <option value="low">Niedrig</option>
                <option value="normal">Normal</option>
                <option value="high">Hoch</option>
                <option value="urgent">Dringend</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting || !subject.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={16} />
                  Ticket erstellen
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Ticket List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-apple-accent/30 border-t-apple-accent rounded-full animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 apple-card">
          <CheckCircle2 size={40} className="mx-auto text-apple-muted mb-3" />
          <p className="text-apple-muted">
            Keine Tickets vorhanden. Alles bestens!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="apple-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-apple-text truncate">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-apple-muted">
                    <Clock size={12} />
                    {new Date(ticket.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportView;
