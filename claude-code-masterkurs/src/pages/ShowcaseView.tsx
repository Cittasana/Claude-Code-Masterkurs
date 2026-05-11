import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Image,
  ExternalLink,
  Github,
  Plus,
  X,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { showcaseApi } from '../lib/api';

/* ================================================================
   Types
   ================================================================ */

interface ShowcaseEntry {
  id: string;
  title: string;
  description: string;
  projectId: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  approved: boolean;
  createdAt: string;
  author: string;
  authorId: string;
}

/* ================================================================
   ShowcaseView – Gallery + Submit form
   ================================================================ */

const ShowcaseView = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [entries, setEntries] = useState<ShowcaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await showcaseApi.getAll();
      setEntries(data.entries as ShowcaseEntry[]);
    } catch {
      // Failed to load – show empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('showcase.breadcrumb')}</span>
      </div>

      {/* Header — Ethereal */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
        <div>
          <div className="eyebrow mb-4"><Image size={12} /><span>Community</span></div>
          <h1 className="text-[clamp(36px,5vw,60px)] font-semibold text-apple-text tracking-[-0.038em] leading-[1.04]">
            <em className="italic-serif">{t('showcase.title')}</em>
          </h1>
          <p className="text-apple-textSecondary max-w-2xl mt-3 leading-relaxed">
            {t('showcase.subtitle')}
          </p>
        </div>
        {isAuthenticated && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
            {showForm ? <X size={14} /> : <Plus size={14} />}
            <span>{showForm ? t('showcase.cancel') : t('showcase.submit')}</span>
          </button>
        )}
      </div>

      {/* Submit form */}
      {showForm && isAuthenticated && (
        <ShowcaseForm
          onSuccess={() => {
            setShowForm(false);
            loadEntries();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Not authenticated hint */}
      {!isAuthenticated && (
        <div className="apple-card mb-6 text-center">
          <p className="text-sm text-apple-textSecondary">
            {t('showcase.loginToSubmit')}{' '}
            <Link to="/login" className="text-apple-accent hover:underline">
              {t('showcase.loginLink')}
            </Link>
          </p>
        </div>
      )}

      {/* Gallery */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="apple-card animate-pulse h-48 bg-apple-elevated"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="apple-card text-center py-16">
          <Image size={40} className="text-apple-muted mx-auto mb-3" />
          <p className="text-apple-textSecondary">
            {t('showcase.noEntries')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {entries.map((entry) => (
            <ShowcaseCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ================================================================
   ShowcaseCard
   ================================================================ */

function ShowcaseCard({ entry }: { entry: ShowcaseEntry }) {
  const { t } = useTranslation();
  return (
    <div className="apple-card group">
      {/* Image */}
      {entry.imageUrl ? (
        <div className="w-full h-40 rounded-apple mb-3 overflow-hidden bg-apple-elevated">
          <img
            src={entry.imageUrl}
            alt={entry.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-40 rounded-apple mb-3 bg-apple-elevated flex items-center justify-center">
          <Image size={32} className="text-apple-muted" />
        </div>
      )}

      <h3 className="text-base font-bold text-apple-text mb-1">{entry.title}</h3>
      <p className="text-sm text-apple-textSecondary line-clamp-2 mb-3">
        {entry.description}
      </p>

      {/* Author + date */}
      <div className="flex items-center justify-between text-xs text-apple-muted mb-3">
        <span>{entry.author}</span>
        <span className="flex items-center space-x-1">
          <Clock size={11} />
          <span>
            {new Date(entry.createdAt).toLocaleDateString()}
          </span>
        </span>
      </div>

      {/* Links */}
      <div className="flex items-center space-x-2 pt-3 border-t border-apple-border">
        {entry.githubUrl && (
          <a
            href={entry.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-apple-textSecondary hover:text-apple-accent transition-colors"
          >
            <Github size={14} />
            <span>{t('showcase.github')}</span>
          </a>
        )}
        {entry.liveUrl && (
          <a
            href={entry.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-apple-textSecondary hover:text-apple-accent transition-colors"
          >
            <ExternalLink size={14} />
            <span>{t('showcase.liveDemo')}</span>
          </a>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   ShowcaseForm
   ================================================================ */

function ShowcaseForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await showcaseApi.create({
        title,
        description,
        githubUrl: githubUrl || undefined,
        liveUrl: liveUrl || undefined,
        imageUrl: imageUrl || undefined,
      });
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('showcase.submitError')
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="apple-card mb-6 text-center">
        <CheckCircle2 size={32} className="text-apple-success mx-auto mb-2" />
        <p className="text-apple-success font-bold text-sm">
          {t('showcase.submitSuccess')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="apple-card mb-6 space-y-4">
      <h2 className="text-lg font-bold text-apple-text mb-2">
        {t('showcase.formTitle')}
      </h2>

      {error && (
        <div className="p-3 bg-apple-error/10 border border-apple-error/30 rounded-apple text-sm text-apple-error">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-apple-textSecondary mb-1">
          {t('showcase.fieldTitle')} *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          maxLength={200}
          className="w-full px-3 py-2 text-sm bg-apple-bg border border-apple-border rounded-apple text-apple-text placeholder-apple-muted focus:outline-none focus:ring-1 focus:ring-apple-accent/30"
          placeholder={t('showcase.fieldTitlePlaceholder')}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-apple-textSecondary mb-1">
          {t('showcase.fieldDescription')} *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={3}
          className="w-full px-3 py-2 text-sm bg-apple-bg border border-apple-border rounded-apple text-apple-text placeholder-apple-muted focus:outline-none focus:ring-1 focus:ring-apple-accent/30 resize-y"
          placeholder={t('showcase.fieldDescriptionPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-apple-textSecondary mb-1">
            {t('showcase.fieldGithubUrl')}
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-apple-bg border border-apple-border rounded-apple text-apple-text placeholder-apple-muted focus:outline-none focus:ring-1 focus:ring-apple-accent/30"
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-apple-textSecondary mb-1">
            {t('showcase.fieldLiveUrl')}
          </label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-apple-bg border border-apple-border rounded-apple text-apple-text placeholder-apple-muted focus:outline-none focus:ring-1 focus:ring-apple-accent/30"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-apple-textSecondary mb-1">
          {t('showcase.fieldImageUrl')}
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-apple-bg border border-apple-border rounded-apple text-apple-text placeholder-apple-muted focus:outline-none focus:ring-1 focus:ring-apple-accent/30"
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-apple-muted hover:text-apple-text bg-apple-bg border border-apple-border rounded-apple hover:border-apple-borderLight transition-colors"
        >
          {t('showcase.cancel')}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-bold rounded-apple bg-apple-accent text-white hover:bg-apple-accentHover shadow-sm hover:shadow-apple-glow transition-all duration-200 disabled:opacity-50"
        >
          <Send size={14} />
          <span>
            {submitting ? t('showcase.submitting') : t('showcase.submitButton')}
          </span>
        </button>
      </div>

      <p className="text-[10px] text-apple-muted">
        {t('showcase.moderationNote')}
      </p>
    </form>
  );
}

export default ShowcaseView;
