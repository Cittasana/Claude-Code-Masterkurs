import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Wrench,
  MessageSquare,
  Trophy,
  Code2,
  Mail,
  Ticket,
  Users,
  CreditCard,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  FolderOpen,
  Zap,
  HelpCircle,
  Swords,
  FileText,
  Rocket,
  Puzzle,
  Play,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sidebarSections: NavSection[] = [
  {
    title: 'Übersicht',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: 'Lektionen (Config)', href: '/admin/lesson-configs', icon: BookOpen },
      { name: 'Tools & Extensions', href: '/admin/tools', icon: Wrench },
      { name: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
      { name: 'Challenges', href: '/admin/challenges', icon: Swords },
      { name: 'Feature Referenz', href: '/admin/features', icon: Zap },
    ],
  },
  {
    title: 'Projekte',
    items: [
      { name: 'Projekte', href: '/admin/project-configs', icon: FolderOpen },
      { name: 'Capstones', href: '/admin/capstone-configs', icon: Rocket },
      { name: 'Templates', href: '/admin/project-templates', icon: Puzzle },
      { name: 'Playground Tasks', href: '/admin/playground-tasks', icon: Play },
    ],
  },
  {
    title: 'Community',
    items: [
      { name: 'Forum', href: '/admin/forum', icon: MessageSquare },
      { name: 'Forum Kategorien', href: '/admin/forum-categories', icon: FileText },
      { name: 'Showcase', href: '/admin/showcase', icon: Trophy },
      { name: 'Patterns', href: '/admin/patterns', icon: Code2 },
    ],
  },
  {
    title: 'Referenzen',
    items: [
      { name: 'Offizielle Docs', href: '/admin/official-docs', icon: ExternalLink },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
      { name: 'Promo Codes', href: '/admin/promo-codes', icon: Ticket },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Agent Monitor', href: '/admin/agent', icon: Bot },
      { name: 'Einstellungen', href: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex h-full w-72 flex-col border-r border-apple-border bg-[rgba(10,10,12,0.55)] backdrop-blur-2xl relative z-10">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-apple-border px-6">
        <div className="flex items-center gap-3">
          <span className="nav-brand-dot" />
          <div>
            <h1 className="text-sm font-medium text-apple-text tracking-tight">Claude Code Masterkurs</h1>
            <p className="text-[10px] text-apple-muted font-mono uppercase tracking-[0.06em] mt-0.5">Admin CMS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.06em] text-apple-muted font-mono">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-apple-accent/10 text-apple-accent border border-apple-accent/20'
                        : 'text-apple-textSecondary border border-transparent hover:bg-white/[0.04] hover:text-apple-text'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-4.5 w-4.5 flex-shrink-0 transition-colors',
                        isActive ? 'text-apple-accent' : 'text-apple-muted group-hover:text-apple-textSecondary'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-apple-border p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-apple-border p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-apple-accent/15 border border-apple-accent/30 text-sm font-medium text-apple-accent">
            CO
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-apple-text tracking-tight">Cosmo</p>
            <p className="text-[10px] text-apple-muted font-mono uppercase tracking-[0.06em]">Admin</p>
          </div>
          <button
            onClick={logout}
            className="rounded-full p-2 text-apple-muted transition-colors hover:bg-white/[0.06] hover:text-apple-text"
            title="Abmelden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
