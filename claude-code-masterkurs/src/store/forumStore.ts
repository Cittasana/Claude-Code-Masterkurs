import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ForumThread, ForumReply, ForumCategoryId } from '../types';

const DEMO_AUTHOR = 'Demo-User';
const DEMO_AUTHOR_ID = 'demo';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const seedThreads: ForumThread[] = [
  {
    id: 'seed-1',
    categoryId: 'allgemein',
    title: 'Willkommen im Community Forum!',
    body: 'Hier könnt ihr euch austauschen, Fragen stellen und Tipps teilen. Viel Spaß beim Lernen!',
    author: 'CCM Team',
    authorId: 'system',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    replyCount: 2,
    lastActivityAt: new Date(Date.now() - 86400000).toISOString(),
    pinned: true,
  },
  {
    id: 'seed-2',
    categoryId: 'lektionen',
    title: 'Lektion 6 – MCP Server: Wo finde ich gute Beispiele?',
    body: 'Hat jemand Empfehlungen für MCP-Server zum Ausprobieren neben den offiziellen?',
    author: DEMO_AUTHOR,
    authorId: DEMO_AUTHOR_ID,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    replyCount: 1,
    lastActivityAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'seed-3',
    categoryId: 'projekte',
    title: 'Projekt 1.2 CLAUDE.md Generator – Validierung',
    body: 'Bei der Validierung hakt es bei „Überschriften prüfen“. Welches Format erwartet der Check?',
    author: DEMO_AUTHOR,
    authorId: DEMO_AUTHOR_ID,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    replyCount: 0,
    lastActivityAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'seed-4',
    categoryId: 'tipps',
    title: 'CLAUDE.md: Kurze Abschnitte = bessere Antworten',
    body: 'Ich habe gemerkt: Viele kleine, klare Abschnitte in CLAUDE.md führen zu präziseren Antworten als ein langer Fließtext.',
    author: DEMO_AUTHOR,
    authorId: DEMO_AUTHOR_ID,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    replyCount: 3,
    lastActivityAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

const seedReplies: ForumReply[] = [
  {
    id: 'reply-1',
    threadId: 'seed-1',
    body: 'Danke, freue mich auf den Austausch!',
    author: DEMO_AUTHOR,
    authorId: DEMO_AUTHOR_ID,
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    id: 'reply-2',
    threadId: 'seed-1',
    body: 'Super Idee mit dem Forum. 👍',
    author: 'Lerner*in',
    authorId: 'demo2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'reply-3',
    threadId: 'seed-2',
    body: 'Schau mal in die Cursor-Docs unter MCP – da gibt es eine Liste. Oder im Kurs unter Lektion 6 die verlinkten Ressourcen.',
    author: 'CCM Team',
    authorId: 'system',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'reply-4',
    threadId: 'seed-4',
    body: 'Kann ich so bestätigen. Außerdem: @-Erwähnungen für Kontext nutzen.',
    author: DEMO_AUTHOR,
    authorId: DEMO_AUTHOR_ID,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'reply-5',
    threadId: 'seed-4',
    body: 'Guter Tipp, danke!',
    author: 'Lerner*in',
    authorId: 'demo2',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

interface ForumState {
  threads: ForumThread[];
  replies: ForumReply[];
  addThread: (categoryId: ForumCategoryId, title: string, body: string) => ForumThread;
  addReply: (threadId: string, body: string) => ForumReply | null;
  getThread: (id: string) => ForumThread | undefined;
  getReplies: (threadId: string) => ForumReply[];
  getThreadsByCategory: (categoryId: ForumCategoryId | null) => ForumThread[];
}

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      threads: seedThreads,
      replies: seedReplies,

      addThread: (categoryId, title, body) => {
        const now = new Date().toISOString();
        const thread: ForumThread = {
          id: generateId(),
          categoryId,
          title,
          body,
          author: DEMO_AUTHOR,
          authorId: DEMO_AUTHOR_ID,
          createdAt: now,
          replyCount: 0,
          lastActivityAt: now,
        };
        set((state) => ({
          threads: [thread, ...state.threads],
        }));
        return thread;
      },

      addReply: (threadId, body) => {
        const thread = get().threads.find((t) => t.id === threadId);
        if (!thread) return null;
        const now = new Date().toISOString();
        const reply: ForumReply = {
          id: generateId(),
          threadId,
          body,
          author: DEMO_AUTHOR,
          authorId: DEMO_AUTHOR_ID,
          createdAt: now,
        };
        set((state) => ({
          replies: [...state.replies, reply],
          threads: state.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  replyCount: t.replyCount + 1,
                  lastActivityAt: now,
                }
              : t
          ),
        }));
        return reply;
      },

      getThread: (id) => get().threads.find((t) => t.id === id),

      getReplies: (threadId) =>
        get()
          .replies.filter((r) => r.threadId === threadId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),

      getThreadsByCategory: (categoryId) => {
        const threads = get().threads;
        if (!categoryId) return [...threads].sort(sortThreads);
        return threads
          .filter((t) => t.categoryId === categoryId)
          .sort(sortThreads);
      },
    }),
    { name: 'claude-code-masterkurs-forum' }
  )
);

function sortThreads(a: ForumThread, b: ForumThread): number {
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
}
