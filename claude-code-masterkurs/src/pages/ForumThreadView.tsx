import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Pin, Send, ArrowLeft } from 'lucide-react';
import { contentApi } from '../lib/api';
import type { AdminForumCategory } from '../lib/api';
import { useForumStore } from '../store/forumStore';

const ForumThreadView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getThread = useForumStore((s) => s.getThread);
  const getReplies = useForumStore((s) => s.getReplies);
  const addReply = useForumStore((s) => s.addReply);

  const [forumCategories, setForumCategories] = useState<AdminForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    contentApi.getForumCategories().then(res => setForumCategories(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const thread = id ? getThread(id) : undefined;
  const replies = thread ? getReplies(thread.id) : [];
  const category = thread ? forumCategories.find((c) => c.categoryId === thread.categoryId) : undefined;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !replyText.trim() || submitting) return;
    setSubmitting(true);
    addReply(thread.id, replyText.trim());
    setReplyText('');
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /></div>;

  if (!id || !thread) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
          <Link to="/dashboard" className="hover:text-apple-accent transition-colors">Dashboard</Link>
          <span className="text-apple-border">/</span>
          <Link to="/forum" className="hover:text-apple-accent transition-colors">Forum</Link>
          <span className="text-apple-border">/</span>
          <span className="text-apple-textSecondary">Thema</span>
        </div>
        <div className="apple-card text-center py-16">
          <MessageCircle size={48} className="mx-auto text-apple-muted mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-apple-text mb-2">Thema nicht gefunden</h2>
          <p className="text-apple-textSecondary mb-6">Das angeforderte Thema existiert nicht oder wurde entfernt.</p>
          <Link to="/forum" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Zurück zum Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
        <Link to="/dashboard" className="hover:text-apple-accent transition-colors">Dashboard</Link>
        <span className="text-apple-border">/</span>
        <Link to="/forum" className="hover:text-apple-accent transition-colors">Forum</Link>
        <span className="text-apple-border">/</span>
        <span className="text-apple-textSecondary truncate max-w-[180px]" title={thread.title}>
          {thread.title}
        </span>
      </div>

      {/* Thread */}
      <article className="apple-card mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0" aria-hidden>{category?.icon ?? '💬'}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {thread.pinned && (
                <Pin size={14} className="text-apple-accent shrink-0" aria-label="Angepinnt" />
              )}
              {category && (
                <Link
                  to="/forum"
                  className="text-xs px-2 py-0.5 rounded-full bg-apple-elevated text-apple-muted border border-apple-border hover:border-apple-accent/50 hover:text-apple-accent transition-colors"
                >
                  {category.title}
                </Link>
              )}
            </div>
            <h1 className="text-[clamp(26px,3.2vw,40px)] font-semibold text-apple-text tracking-[-0.032em] leading-[1.06] mt-3 mb-4">
              {thread.title}
            </h1>
            <div className="prose prose-invert prose-sm max-w-none text-apple-textSecondary whitespace-pre-wrap">
              {thread.body}
            </div>
            <div className="flex items-center gap-3 mt-4 text-xs text-apple-muted font-mono">
              <span>{thread.author}</span>
              <span>{formatDate(thread.createdAt)}</span>
              <span>{thread.replyCount} Antworten</span>
            </div>
          </div>
        </div>
      </article>

      {/* Replies */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-apple-muted">
          Antworten ({replies.length})
        </h2>
        {replies.length === 0 ? (
          <div className="apple-card py-8 text-center text-apple-muted">
            <p className="text-apple-textSecondary">Noch keine Antworten. Sei die/der Erste!</p>
          </div>
        ) : (
          replies.map((reply) => (
            <article
              key={reply.id}
              className="apple-card py-4 pl-4 border-l-2 border-apple-accent/30"
            >
              <p className="text-apple-textSecondary whitespace-pre-wrap text-sm">
                {reply.body}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-apple-muted font-mono">
                <span>{reply.author}</span>
                <span>{formatDate(reply.createdAt)}</span>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Reply form */}
      <form onSubmit={handleSubmitReply} className="apple-card mt-8">
        <h3 className="text-sm font-mono uppercase tracking-wider text-apple-muted mb-3">
          Antwort schreiben
        </h3>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Deine Antwort..."
          rows={4}
          className="w-full bg-apple-bg border border-apple-border rounded-apple px-4 py-3 text-apple-text text-sm placeholder-apple-muted/50 focus:border-apple-accent/50 focus:outline-none focus:ring-1 focus:ring-apple-accent/30 transition-all resize-y min-h-[100px]"
          required
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!replyText.trim() || submitting}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            Antwort senden
          </button>
        </div>
      </form>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate('/forum')}
          className="text-apple-muted hover:text-apple-accent transition-colors text-sm font-mono inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Zurück zum Forum
        </button>
      </div>
    </div>
  );
};

export default ForumThreadView;
