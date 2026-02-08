import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Pin, ChevronRight, Plus } from 'lucide-react';
import { forumCategories } from '../data/forumCategories';
import { useForumStore } from '../store/forumStore';
import type { ForumCategoryId } from '../types';

const ForumView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ForumCategoryId | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState<ForumCategoryId>('allgemein');
  const getThreadsByCategory = useForumStore((s) => s.getThreadsByCategory);
  const addThread = useForumStore((s) => s.addThread);
  const threads = getThreadsByCategory(selectedCategory);

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    const thread = addThread(newThreadCategory, newTitle.trim(), newBody.trim());
    setNewTitle('');
    setNewBody('');
    setShowNewThread(false);
    navigate(`/forum/thread/${thread.id}`);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">
          {t('common.dashboard')}
        </Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary">{t('forum.title')}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-apple-accent font-mono text-sm tracking-widest uppercase mb-2">
            Community
          </p>
          <h1 className="text-4xl font-bold text-apple-text tracking-tight">
            Forum
          </h1>
          <p className="text-apple-textSecondary mt-2">
            Austausch, Fragen und Tipps zum Claude Code Masterkurs
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewThread(!showNewThread)}
          className="btn-primary inline-flex items-center gap-2 shrink-0"
        >
          <Plus size={18} />
          Neues Thema
        </button>
      </div>

      {/* New thread form */}
      {showNewThread && (
        <form onSubmit={handleCreateThread} className="apple-card mb-8">
          <h2 className="text-sm font-mono uppercase tracking-wider text-apple-muted mb-4">
            {t('forum.createTopic')}
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="forum-thread-category" className="block text-sm font-medium text-apple-textSecondary mb-1">
                {t('forum.category')}
              </label>
              <select
                id="forum-thread-category"
                value={newThreadCategory}
                onChange={(e) => setNewThreadCategory(e.target.value as ForumCategoryId)}
                className="w-full bg-apple-bg border border-apple-border rounded-apple px-4 py-2.5 text-apple-text text-sm focus:border-apple-accent/50 focus:outline-none focus:ring-1 focus:ring-apple-accent/30"
              >
                {forumCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="forum-thread-title" className="block text-sm font-medium text-apple-textSecondary mb-1">
                Titel
              </label>
              <input
                id="forum-thread-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Betreff des Themas"
                className="w-full bg-apple-bg border border-apple-border rounded-apple px-4 py-2.5 text-apple-text text-sm placeholder-apple-muted/50 focus:border-apple-accent/50 focus:outline-none focus:ring-1 focus:ring-apple-accent/30"
                required
              />
            </div>
            <div>
              <label htmlFor="forum-thread-body" className="block text-sm font-medium text-apple-textSecondary mb-1">
                Nachricht
              </label>
              <textarea
                id="forum-thread-body"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Inhalt deines Beitrags..."
                rows={4}
                className="w-full bg-apple-bg border border-apple-border rounded-apple px-4 py-2.5 text-apple-text text-sm placeholder-apple-muted/50 focus:border-apple-accent/50 focus:outline-none focus:ring-1 focus:ring-apple-accent/30 resize-y min-h-[100px]"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                Thema erstellen
              </button>
              <button
                type="button"
                onClick={() => { setShowNewThread(false); setNewTitle(''); setNewBody(''); }}
                className="btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories */}
      <div className="apple-card mb-8">
        <h2 className="text-sm font-mono uppercase tracking-wider text-apple-muted mb-4">
          {t('forum.categories')}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-apple text-sm font-medium transition-all duration-200 ${
              !selectedCategory
                ? 'bg-apple-accent text-white'
                : 'bg-apple-elevated text-apple-textSecondary border border-apple-border hover:border-apple-borderLight'
            }`}
          >
            <MessageCircle size={16} />
            Alle
          </button>
          {forumCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-apple text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-apple-accent text-white'
                  : 'bg-apple-elevated text-apple-textSecondary border border-apple-border hover:border-apple-borderLight'
              }`}
            >
              <span aria-hidden>{cat.icon}</span>
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Thread list */}
      <div className="apple-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-apple-muted">
            {selectedCategory
              ? forumCategories.find((c) => c.id === selectedCategory)?.title ?? 'Themen'
              : 'Alle Themen'}
          </h2>
          <span className="text-apple-muted text-sm font-mono">
            {threads.length} Thema{threads.length !== 1 ? 's' : ''}
          </span>
        </div>

        {threads.length === 0 ? (
          <div className="py-12 text-center text-apple-muted">
            <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium text-apple-textSecondary">Noch keine Themen</p>
            <p className="text-sm mt-1">{t('forum.startFirstDiscussion')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-apple-border">
            {threads.map((thread) => {
              const category = forumCategories.find((c) => c.id === thread.categoryId);
              return (
                <li key={thread.id}>
                  <Link
                    to={`/forum/thread/${thread.id}`}
                    className="flex items-start gap-4 py-4 px-2 -mx-2 rounded-apple hover:bg-apple-hover/50 transition-colors group"
                  >
                    <span className="text-xl mt-0.5 shrink-0" aria-hidden>
                      {category?.icon ?? '💬'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {thread.pinned && (
                          <Pin size={14} className="text-apple-accent shrink-0" aria-label="Angepinnt" />
                        )}
                        <h3 className="font-semibold text-apple-text group-hover:text-apple-accent transition-colors truncate">
                          {thread.title}
                        </h3>
                        {category && !selectedCategory && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-apple-elevated text-apple-muted border border-apple-border">
                            {category.title}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-apple-textSecondary mt-1 line-clamp-2">
                        {thread.body}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-apple-muted font-mono">
                        <span>{thread.author}</span>
                        <span>{thread.replyCount} Antworten</span>
                        <span>{formatDate(thread.lastActivityAt)}</span>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-apple-muted shrink-0 mt-1 group-hover:text-apple-accent group-hover:translate-x-0.5 transition-all"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-center text-apple-muted text-sm mt-6">
        Alle Beiträge werden lokal gespeichert und sind nur in dieser App sichtbar.
      </p>
    </div>
  );
};

export default ForumView;
