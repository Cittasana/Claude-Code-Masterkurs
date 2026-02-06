import type { ForumCategory } from '../types';

export const forumCategories: ForumCategory[] = [
  {
    id: 'allgemein',
    title: 'Allgemein',
    description: 'Offene Diskussionen rund um Claude Code',
    icon: '💬',
  },
  {
    id: 'lektionen',
    title: 'Lektionen',
    description: 'Fragen und Austausch zu den Kurs-Lektionen',
    icon: '📚',
  },
  {
    id: 'projekte',
    title: 'Projekte',
    description: 'Hilfe zu den Praxis-Projekten und Lösungsansätzen',
    icon: '🛠️',
  },
  {
    id: 'tipps',
    title: 'Tipps & Tricks',
    description: 'Best Practices, Workflows und Empfehlungen',
    icon: '💡',
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Verbesserungsvorschläge und Kurs-Feedback',
    icon: '📣',
  },
];
